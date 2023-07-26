import { ArrowLeftOutlined, FrownOutlined, SearchOutlined, SmileOutlined } from "@ant-design/icons"
import { Avatar, Button, Input, List, Modal, Tag, Tooltip, notification } from "antd"
import axios from "axios";
import { useContext, useState } from "react";
import ChatContext from "../Context/ChatContext";

const CreateGroup = ({
    open,
    setOpen
}) => {
    const [api, contextHolder] = notification.useNotification()

    const { allChats, setAllChats, setSelectedChat } = useContext(ChatContext)

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false)
    const [groupName, setGroupName] = useState()
    const [srcQuery, setSrcQuery] = useState()
    const [searchRes, setSearchRes] = useState([])
    const [tags, setTags] = useState([])
    
    const handleGroupBack = () => {
        setShow(false)
        setSrcQuery()
    }

    const handleGroupSearch = async() => {
        if(!srcQuery){
            api.open({
              message: "Search box empty",
              description:
                'Cannot search user',
              icon: <FrownOutlined style={{ color: '#ff0000' }} />
            });
            return
        }
        try {
            const { data } = await axios.get(`/api/user/${srcQuery}`)
            setSearchRes(data)
            setShow(true)
        } catch (error) {
            api.open({
              message: error.response?.data,
              description:
                'Contact developer',
              icon: <FrownOutlined style={{ color: '#ff0000' }} />
            });
        }
    }

    const handleClose = (tag) => {
        const newTags = tags.filter((item) => {
            return item !== tag
        })
        setTags([...newTags])
    }

    const handleAddGroup = (item) => {
        for(let i=0; i<tags.length; i++){
            if(tags[i].username == item.username){
                return
            }
        }
        setTags([...tags, item])
    }

    const handleOk = async() => {
      if(!groupName){
        api.open({
          message: "No Group name",
          description:
            'Group Name cannot be empty',
          icon: <FrownOutlined style={{ color: '#ff0000' }} />
        });
        return
      }
      if(tags.length < 2){
        api.open({
          message: "Group members criteria not matched",
          description:
            'Group members should be more than 2',
          icon: <FrownOutlined style={{ color: '#ff0000' }} />
        });
        return
      }
      try {
        setLoading(true)
        const emptyArr = []
        const {data} = await axios.post("/api/chat/create",{
            groupName,
            tags
        })

        setAllChats([...allChats,data])
        setSelectedChat(data)

        api.open({
          message: 'Group created',
          description:
            'You can now start chatting with the group',
          icon: <SmileOutlined style={{ color: '#0000ff' }} />
        });

        setSrcQuery()
        setTags([...emptyArr])
        setGroupName()
      } catch (error) {
        api.open({
          message: error.response?.data,
          description:
            'Contact Developer',
          icon: <FrownOutlined style={{ color: '#ff0000' }} />
        });
      }
      setLoading(false)
      setOpen(false)
    }

    const handleCancel = () => {
      setOpen(false);
    };

  return (
    <>
    {contextHolder}
      <Modal
        open={open}
        title="Create Group"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Create Group
          </Button>,
        ]}
      >
        <Input 
          size="large"
          placeholder="Enter Group name"
          value={groupName}
          onInput={(e) => setGroupName(e.target.value)}
        />
        <Input 
          size="large"
          placeholder="Search users...."
          className="mt-1"
          value={srcQuery}
          onInput={(e) =>setSrcQuery(e.target.value)}
          suffix={
            <Tooltip title="Search">
              {show ? 
              <ArrowLeftOutlined 
                onClick={() => handleGroupBack()}
                style={{ fontSize:'20px' }} />
                :<SearchOutlined 
                    onClick={handleGroupSearch}
                    style={{ fontSize:'20px' }} />}
            </Tooltip>
          }
        />
        {tags.map((tag,index) => (
            <Tag
              key={index}
              closable={true}
              onClose={() => handleClose(tag)}
            >{tag.name}</Tag>
        ))}
        {show ? <List
          itemLayout="horizontal"
          dataSource={searchRes}
          renderItem={(item, index) => (
            <List.Item 
                key={index}
                onClick={() => handleAddGroup(item)}
            >
              <List.Item.Meta
                avatar={<Avatar>{item?.name[0].toUpperCase()}</Avatar>}
                title={item?.name}
                description={item?.username}
              />
            </List.Item>
          )}
        /> : <></>}
      </Modal>
    </>
  )
}

export default CreateGroup
