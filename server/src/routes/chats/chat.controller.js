const db = require('../../models/sql.models')

function addChat(req,res){
    const { username, chatName } = req.body

    if(!chatName){
        db.query("insert into chatinfo (isgroupchat) values(0)",(err,data) =>{
            if(err){
                return res.status(500).send("Something went wrong. Try again later")
            }
            const chatid = data.insertId
            db.query(`insert into chatusers(chatId, chatUser) values (${data.insertId},'${req.user}'),(${data.insertId},'${username}')`,(err,data)=>{
                if(err){
                    return res.status(500).send("Something went wrong. Try again later")
                }

                db.query(`select name from users where username='${username}'`,(err,data)=>{
                    if(err){
                        return res.status(500).send("Something went wrong. Try again later")
                    }
        
                    const result={
                        id: chatid,
                        chatName:'',
                        chatAdmin:'',
                        isGroupChat:0,
                        ...data[0],
                        username:username,
                    }
                    return res.status(200).json(result)
                })
            })
        })
    }
}

function findChat(req,res){
    db.query(`select i.id, i.chatName, i.isgroupChat, i.chatAdmin, u.name, u.username from chatinfo i join chatusers c on i.id = c.chatId join users u on u.username = c.chatUser where c.chatId in(select chatId from chatusers where chatUser='${req.user}') and chatUser !='${req.user}';`,(err,data) => {
        if(err){
            return res.status(500).send("Something went wrong. Try again later")
        }
        
        for(let i=0; i<data.length; i++){
            data[i] = {...data[i]}
        }
        const distinct = {}

        const result = []

        for(let i=0; i<data.length; i++){
            if(!distinct[data[i].id]){
                result.push(data[i])
                distinct[data[i].id] = true;
            }
        }
    
        res.status(200).json(result)
    })
}

async function createGroup(req,res){
    const {groupName, tags} = req.body
    let chatid
    try {
        chatid = await createGroupInSql(groupName,req.user)
    } catch (error) {
        console.log(error)
    }
     
    try {
        await addUserToSql(chatid, req.user) 
    } catch (error) {
        console.log(error)
    }

    for(let i=0; i<tags.length; i++){
        try {
            await addUserToSql(chatid, tags[i])         
        } catch (error) {
            return res.status(500).send("Something went wrong. Try again later")           
        }    
    }
    
    const result={
        id: chatid,
        chatName:groupName,
        isGroupChat:1,
        chatAdmin:req.user,
        name:'',
        username:req.user,
    }
    return res.status(200).json(result)
}

function groupMembers(req,res){
    const {id} = req.params
    db.query(`select name from users where username in (select chatUser from chatusers where chatId=${id});`,(err,data)=>{
        if(err){
            return res.status(500).send("Something went wrong. Try again later")
        }
        for(let i=0; i<data.length; i++){
            data[i] = {...data[i]}
            data[i] = data[i].name
        }
        res.status(200).json(data)
    })
}




function addUserToSql(id,user){
 return new Promise((resolve, reject) => {
    db.query(`insert into chatusers(chatId, chatUser) values (${id},'${user}')`,(err,data)=>{
        if(err){
            reject()
        }
        resolve()
        })
    })
}
function createGroupInSql(groupName, admin){
 return new Promise((resolve, reject) => {
    db.query(`insert into chatinfo (chatName,isgroupChat,chatAdmin) values ('${groupName}',1,'${admin}')`,(err,data)=>{
        if(err){
            reject()
        }
        if(data){
            resolve(data.insertId)
        }
        })
    })    
}

module.exports = {
    addChat,
    findChat,
    createGroup,
    groupMembers
}