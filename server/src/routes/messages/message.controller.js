const db = require('../../models/sql.models')
function postMessage(req,res){
    const { chatId, content} = req.body
    
    db.query(`insert into message(sender,content,chatId) values('${req.user}','${content}','${chatId}')`,(err,data)=>{
        if(err){
            return res.status(500).send("Something went wrong. Try again later.")
        }
        if(data.affectedRows == 1){
            return res.status(200).send({ok : true})
        }
        return res.status(400).send("Bad Request")
    })
}

function getMessage(req,res){
    const { id } = req.params

    db.query(`select u.name, m.sender, m.content from message m join users u on m.sender = u.username where chatId=${id} order by sentTime
;`,(err,data) => {
        if(err){
            return res.status(500).send("Something went wrong. Try again later.")
        }
        const result = []
        for(let i=0; i<data.length; i++){
            result.push({...data[i]})
        }
        return res.status(200).json(result)
    })
}

module.exports = {
    postMessage,
    getMessage
}