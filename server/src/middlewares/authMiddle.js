const jwt = require('jsonwebtoken')

const protect = (req,res,next) =>{
    const token = req.cookies.accesstoken
    if(!token){
      return res.status(401).send("Not logged in")
    }
    
    jwt.verify(token, "secretman", (err,user) => {
      if(err){
        return res.status(403).send("Token not valid")
      }
      req.user = user.username
      next()
    })
}

module.exports = protect