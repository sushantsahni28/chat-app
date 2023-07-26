import {Avatar, Input, List, Tooltip, notification} from "antd"
import { ArrowLeftOutlined, FrownOutlined, SearchOutlined, UsergroupAddOutlined } from "@ant-design/icons"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import ChatContext from "../Context/ChatContext"
import CreateGroup from "../Utils/createGroup"

const Sidebar = () => {
    const [api, contextHolder] = notification.useNotification()

    const [show, setShow] = useState(false)
    const [query, setQuery] = useState()
    const [searchResults, setSearchResults] = useState([])
    const [open, setOpen] = useState(false);
    
    const {allChats, setAllChats, setSelectedChat } = useContext(ChatContext)

    useEffect(()=>{
        loadChats()
    },[])

    const loadChats = async() => {
        try {
            const { data } = await axios.get("/api/chat")
            setAllChats(data)
        } catch (error) {
            api.open({
              message: error.response?.data,
              description:
                'Contact developer',
              icon: <FrownOutlined style={{ color: '#ff0000' }} />
            });
        }
    }

    const showModal = () => {
      setOpen(true);
    };

    const handleChat = (chat) => {
        setSelectedChat(chat)
    }

    const handleSearch = async() => {
        if(!query){
            api.open({
              message: 'No search query',
              description:
                'Please fill search box before searching',
              icon: <FrownOutlined style={{ color: '#ff0000' }} />
            });
            return 
        }
        setShow(true)
        try {
            const { data } = await axios.get(`/api/user/${query}`)
            setSearchResults(data)
        } catch (error) {
            api.open({
              message: error.response?.data,
              description:
                'Contact developer',
              icon: <FrownOutlined style={{ color: '#ff0000' }} />
            });
        }
    }
    const handleBack = () => {
      setShow(false)
      setQuery()
    }
    const handleNewChat = async(item) => {
      for(let i=0; i<allChats.length; i++){
        if(allChats[i].isgroupChat === 0){
          if(allChats[i].username == item.username){
            setSelectedChat(allChats[i])
            setShow(false)
            setQuery()
            return
          }
        } 
      }
      try {
        const { data } = await axios.post("/api/chat",{
          username: item.username
        })
        setAllChats([...allChats, data])
        setSelectedChat(data)
        setShow(false)
        setQuery()
      } catch (error) {
        api.open({
          message: error.response?.data,
          description:
            'Cannot create chat with this user',
          icon: <FrownOutlined style={{ color: '#ff0000' }} />
        }); 
      }
    }
  return (
    <div className="col-md-4 p-1 sideBar">
        {contextHolder}
      <div className="d-flex">
       <Input
          placeholder="Search users to chat...."
          size="large"
          value={query}
          onInput={(e) => setQuery(e.target.value)}
          suffix={
            <Tooltip title="Search">
              {show ? 
              <ArrowLeftOutlined 
                onClick={() => handleBack()}
                style={{ fontSize:'20px' }} />
                :<SearchOutlined 
                    onClick={handleSearch}
                    style={{ fontSize:'20px' }} />}
            </Tooltip>
          }
        />
        <UsergroupAddOutlined
          onClick={showModal} 
          style={{fontSize:"30px", marginTop:"3px", cursor:"pointer"}}
        />
      </div>
          <CreateGroup 
            open={open}
            setOpen={setOpen}
          />
        {show ? 
        <List
          itemLayout="horizontal"
          className="mt-1"
          dataSource={searchResults}
          renderItem={(item, index) => (
            <List.Item 
              key={index}
              onClick={() => handleNewChat(item)}
              >
              <List.Item.Meta
                avatar={<Avatar>{item?.name[0].toUpperCase()}</Avatar>}
                title={<p>{item?.name}</p>}
                description={<p>{item?.username}</p>}
              />
            </List.Item>
          )}
        /> : 
        <List
          itemLayout="horizontal"
          className="mt-1"
          dataSource={allChats}
          renderItem={(item, index) => (
            <List.Item 
                key={index}
                onClick={() => handleChat(item)}
                >
              <List.Item.Meta
                avatar={<Avatar>{item?.isgroupChat === 0 ? item?.name[0]?.toUpperCase() : item?.chatName[0]?.toUpperCase()}</Avatar>}
                title={item?.isgroupChat === 0 ? <h6>{item?.name}</h6> : <h6>{item?.chatName}</h6>}
                description={item?.isgroupChat === 0 ? <p>user: {item?.username}</p>: <p>admin: {item?.chatAdmin}</p>}
              />
            </List.Item>
          )}
        />
        }
    </div>
  )
}

export default Sidebar
