import { LeftCircleOutlined, MoreOutlined } from "@ant-design/icons"
import { useContext, useEffect, useState } from "react"
import ChatContext from "../Context/ChatContext"
import { Modal } from "antd"
import axios from "axios"

const ChatHeaders = () => {
    const {selectedChat,setSelectedChat} = useContext(ChatContext)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [members, setMembers] = useState([])

    useEffect(() => {
        if(selectedChat.isgroupChat === 1){
            loadMembers()
        }
    },[selectedChat])

    const loadMembers = async() => {
        try {
            const { data } = await axios.get(`/api/chat/find/${selectedChat.id}`)
            setMembers(data)
        } catch (error) {
            alert(error.response?.data)
        }
    }

    const showModal = () => {
      setIsModalOpen(true);
    };

    const handleOk = () => {
      setIsModalOpen(false);
    };

    const handleCancel = () => {
      setIsModalOpen(false);
    };
  return (
    <div 
      className="d-flex justify-content-between p-2"
      >
      <LeftCircleOutlined
        onClick={() => setSelectedChat()}
        style={{fontSize: "30px", cursor:"pointer"}} />
      <h3>{selectedChat?.isgroupChat === 1 ? 
        selectedChat?.chatName.toUpperCase():
        selectedChat?.name.toUpperCase()}</h3>
      <MoreOutlined
        onClick={showModal} 
        style={{fontSize: "30px", cursor:"pointer"}} />

      <Modal 
        title="Profile" 
        className="text-center"
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}>
        <h5>{selectedChat?.isgroupChat === 1 ? selectedChat?.chatName : selectedChat?.name}</h5>
        {selectedChat?.isgroupChat === 1 ? 
        <>
            <p>admin: {selectedChat?.chatAdmin}</p>
            <h6>{members.length} Participants</h6>
            {members.map((item,index) => (
                <p key={index}>{item}</p>
            ))}
        </>
            :
            <p>user: {selectedChat?.username}</p> 
            }
      </Modal>
    </div>
  )
}

export default ChatHeaders
