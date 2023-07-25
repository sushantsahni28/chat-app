import { notification } from "antd"
import { createContext, useEffect, useState } from "react"
import axios from "axios"
import { FrownOutlined } from "@ant-design/icons"

export const ChatContext = createContext()

export const ChatContextProvider = ({children}) => {
    const [api, contextHolder] = notification.useNotification()
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("chatUser")) || null
    )
    const [allChats, setAllChats] = useState([])
    const [selectedChat, setSelectedChat] = useState()

    useEffect(() => {
        localStorage.setItem("chatUser",JSON.stringify(user))
    },[user])

    const login = async(inputs) => {
        try {
            const { data } = await axios.post("/api/user/login",
                inputs)
            setUser(data)
            return 1
        } catch (error) {
            api.open({
              message: error.response?.data,
              description:
                'Check your email and password',
              icon: <FrownOutlined style={{ color: '#ff0000' }} />
            });
            return 0
        }
    }

    const logout = async() => {
        try {
           await axios.get("/api/user/logout")
            setUser(null)
            return 1 
        } catch (error) {
            api.open({
              message: error.response?.data,
              description:
                'Logout Unsuccessful',
              icon: <FrownOutlined style={{ color: '#ff0000' }} />
            });
            return 0
        }   
    }

    const signup = async(inputs) => {
        try {
            const { data } = await axios.post("/api/user/signup",
                inputs)
            setUser(data)
            return 1
        } catch (error) {
            api.open({
              message: error.response?.data,
              description:
                'Check your email and password',
              icon: <FrownOutlined style={{ color: '#ff0000' }} />
            });
            return 0
        }
    }

  return (
    <ChatContext.Provider value={{
      login,signup,logout,user,selectedChat,setSelectedChat,
      allChats, setAllChats
      }}>
            {contextHolder}
            {children}
    </ChatContext.Provider>
  )
}

export default ChatContext
