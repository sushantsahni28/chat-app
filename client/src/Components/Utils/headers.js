import { useContext } from "react"
import ChatContext from "../Context/ChatContext"
import { notification } from "antd"
import { useNavigate } from "react-router-dom"
import { SmileOutlined } from "@ant-design/icons"

const Headers = () => {
  const { user,logout } = useContext(ChatContext)
  const [api, contextHolder] = notification.useNotification()

  const navigate = useNavigate()
  const handleLogout = async() => {
    const result = await logout()
    if(result === 1){
      api.open({
        message: "Logout Successful",
        description:
          'Redirecting to Homepage.....',
        icon: <SmileOutlined style={{ color: '#0000ff' }} />
      });
      setTimeout(() => {
        navigate("/")
      },[1000])
    }
  }
  return (
    <div className="d-flex bg-light justify-content-between p-2">
      {contextHolder}
      <h3 className="p-1">Let's Chat</h3>
      <div className="p-1">
        {user == null ? <></> :
          <button 
            className="btn btn-danger"
            onClick={handleLogout}
          >Logout</button>}
      </div>
    </div>
  )
}

export default Headers
