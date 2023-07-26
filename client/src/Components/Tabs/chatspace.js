import { useContext, useEffect, useState } from "react"
import ChatHeaders from "../Utils/chatHeaders"
import ChatContext from "../Context/ChatContext"
import { FrownOutlined, PlusCircleOutlined, SendOutlined } from "@ant-design/icons"
import { Input, notification } from "antd"
import ScrollableFeed from 'react-scrollable-feed'
import axios from "axios"
import Lottie from 'react-lottie';
import animationData from "../Animations/typing.json";
import { io } from "socket.io-client"

var socket, selectedChatCompare
const Chatspace = () => {
  const { selectedChat, user } = useContext(ChatContext)

  const [api, contextHolder] = notification.useNotification()
  const [chat, setChat] = useState([])
  const [message, setMessage] = useState()
  const [typing, setTyping] = useState(false)

  const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings:{
        preserveAspectRatio: 'xMidYMid slice'
      }
    }

  useEffect(() => {
      socket = io()
      socket.on("typing",room => {
        if(selectedChatCompare && selectedChatCompare.id == room){
          setTyping(true)
        }
      })
      socket.on("stop typing",room => {
        if(selectedChatCompare && selectedChatCompare.id == room){
          setTyping(false)
        }
      })
  },[])

  useEffect(() => {
    if(selectedChat){
      loadMessages()
      socket.emit("join room",selectedChat.id)
    }
    selectedChatCompare = selectedChat
  },[selectedChat])

  useEffect(() => {
    socket.on("message received",(message, room)=>{
      if(selectedChatCompare && selectedChatCompare.id == room){
        setChat([...chat, message])
      }
    })
  })

  const sendMessage = async() =>{
    socket.emit("stop typing",selectedChat.id)
    if(!message){
      api.open({
        message: "No message",
        description:
          'Cannot send an empty string',
        icon: <FrownOutlined style={{ color: '#ff0000' }} />
      });
      return
    }
    try{
      const { data } = await axios.post("/api/message",{
        chatId: selectedChat.id,
        content: message
      })
      if(data.ok === true){
        const newmessage = {
          name: user.name,
          sender: user.username,
          content:message
        }
        setChat([...chat,newmessage])
        socket.emit("new message",newmessage,selectedChat.id)
      }
    }catch (error) {
      api.open({
        message: error.response?.data,
        description:
          'Sending message failed',
        icon: <FrownOutlined style={{ color: '#ff0000' }} />
      });
    }
    setMessage()
  }

  const handleInput = (e) => {
    socket.emit("typing",selectedChat.id)
    if(!message){
      socket.emit("stop typing",selectedChat.id)
    }
    if(e.key == 'Enter'){
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
  const notTyping = () => {
    socket.emit("stop typing",selectedChat.id)
  }
  return (
    <div className="col-md-8 bg-light chatParent">
      {contextHolder}
        {selectedChat ? 
          <div className="d-flex flex-column">
            <ChatHeaders />
            <div className="chatSpace">
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
            <div className="inputSpace">
              {typing ? 
                <Lottie 
                  options={defaultOptions}
                  width={100}
                  style={{ marginLeft:0}}/> 
                  : <h1></h1>}
              <Input 
                size="large"
                value={message}
                onInput={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => handleInput(e)}
                onBlur={() => notTyping()}
                suffix={
                <SendOutlined 
                  style={{fontSize: "25px"}}
                  onClick={sendMessage}
                />
                }
              />
            </div>
          </div>
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
