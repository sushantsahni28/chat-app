import { Input, notification } from "antd"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FrownOutlined, SmileOutlined } from "@ant-design/icons"
import ChatContext from "../Components/Context/ChatContext"

const Login = () => {
  const { login } = useContext(ChatContext)

  const [api, contextHolder] = notification.useNotification()
  const [username, setUsername] = useState()
  const [passcode, setPasscode] = useState()

  const navigate = useNavigate()

  const handleSubmit = async() => {
    if(!username || !passcode){
      api.open({
        message: 'Form Incomplete',
        description:
          'Please fill complete form before submission',
        icon: <FrownOutlined style={{ color: '#ff0000' }} />
      });
      return
    }
    const inputs = {
      username, passcode
    }
    const results = await login(inputs)
    if(results === 1){
      api.open({
        message: 'Login Successful',
        description:
          'Redirecting to Chat page',
        icon: <SmileOutlined style={{ color: '#0000ff' }} />
      });
      setTimeout(() => {
        navigate("/chats")
      },[1500])
      return 
    }
  }
  return (
    <div className="d-flex flex-column p-5">
      {contextHolder}
      <label>Username</label>
      <Input
        placeholder="Enter you username"
        size="large"
        value={username}
        onInput={(e) => setUsername(e.target.value)}
        required
      />
      <label>Password</label>
      <Input
        placeholder="Enter you password"
        size="large"
        type="password"
        value={passcode}
        onInput={(e) => setPasscode(e.target.value)}
        className="mt-1"
        required
      />
      <button 
        onClick={handleSubmit}
        className="btn btn-primary mt-3"
        >Login</button>
    </div>
  )
}

export default Login
