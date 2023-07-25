import { useContext, useEffect, useState } from "react"
import ChatHeaders from "../Utils/chatHeaders"
import ChatContext from "../Context/ChatContext"
import { FrownOutlined, PlusCircleOutlined, SendOutlined } from "@ant-design/icons"
import { Input, notification } from "antd"
import ScrollableFeed from 'react-scrollable-feed'
import axios from "axios"

const Chatspace = () => {
  const { selectedChat, user } = useContext(ChatContext)

  const [api, contextHolder] = notification.useNotification()
  const [chat, setChat] = useState([])
  const [message, setMessage] = useState()

  useEffect(() => {
    if(selectedChat){
      loadMessages()
    }
  },[selectedChat])

  const sendMessage = () =>{
    if(!message){
      alert("No message")
    }
    console.log(message)
  }

  const handleInput = (e) => {
    if(e.code == 'Enter'){
      console.log("enter")
      sendMessage()
      return
    }
  }

  const loadMessages = async() => {
    try {
      const { data } = await axios.get(`/api/message/${selectedChat.id}`)
      setChat(data)
    } catch (error) {
      api.open({
        message: error.response?.data,
        description:
          'Loading chat failed.',
        icon: <FrownOutlined style={{ color: '#ff0000' }} />
      });
    }
  }
  //name sender content
  return (
    <div 
      className="col-md-8 bg-light"
    >
      {contextHolder}
        {selectedChat ? 
          <>
            <ChatHeaders />
            <div className="chatFeed">
              <div style={{height:"520px"}}>
                <ScrollableFeed>
                  {chat.map((item, i) => 
                  <div 
                    key={i}
                    className={item.sender == user.username ? 
                      "mydiv": "senderdiv" }
                    >
                      {selectedChat.isgroupChat === 1 ? item.sender == user.username ? <></> : (<p className="text-info">{item.name}</p>) : <></>}
                      {item.content}</div>
                  )}
                </ScrollableFeed>
              </div>
            <Input 
              size="large"
              value={message}
              onKeyUp={(e) => handleInput(e)}
              
              suffix={
                <SendOutlined 
                  onClick={sendMessage}
                />
              }
            />
            </div>
          </>
          :
          <div className="d-flex centerText">
            <PlusCircleOutlined style={{fontSize: "30px"}} />
            <h3 className="m-1">Select user to start chat with user</h3>
          </div>
        }
    </div>
  )
}

export default Chatspace
