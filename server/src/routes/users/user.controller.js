const db = require("../../models/sql.models.js")
const jwt = require("jsonwebtoken")

async function Signup(req, res){
    const { name, username, password} = req.body

    const insert = "insert into users(name,username,password) values(?)"
    const values = [
        name,
        username,
        password,
    ]

    db.query(insert, [values], (err,data)=>{
        if(err){
            if(err?.errno == 1062){
                return res.status(400).send("Email already exists")
            }
            return res.status(500).send("Something went wrong. Try Again later.")
        }
        res.status(201).send({name, username})
    })
}

async function Login(req,res){
    const { username, passcode } = req.body
   
    db.query(`select * from users where username='${username}'`,(err,data) => {
        if(err){
            return res.status(500).send("Something went wrong. Try Again later.")
        }
        if(data.length == 0){
            return res.status(404).send("User does not exist.")
        }

        if(passcode != data[0].password){
            return res.status(400).send("Password mismatch")
        }

        const token = jwt.sign({username: data[0].username}, "secretman")

        const {password, ...other} = data[0]

        res.cookie("accesstoken", token,{
            httpOnly:true
        })
        return res.status(200).json(other)
    })
}

async function Logout(req, res){
    res.clearCookie("accesstoken",{
        secure:true,
        sameSite:"none"
    }).status(200).send("Logged out.")
}

async function searchUsers(req,res){
    const { find } = req.params
    
    db.query(`select * from users where name like '%${find}%' and username != '${req.user}'`,(err,data) => {
        if(err){
            return res.status(500).send("Something went wrong. Try Again later.")
        }
        
        const results = []
        for(let i=0; i<data.length; i++){
            const {password ,...other} = data[i]
            results.push(other)
        }
        return res.send(results)
    })
}
module.exports = {
    Signup,
    Login,
    Logout,
    searchUsers
}