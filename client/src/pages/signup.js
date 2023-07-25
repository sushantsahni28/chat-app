import { FrownOutlined, SmileOutlined } from "@ant-design/icons"
import { Input, notification } from "antd"
import { useContext, useState } from "react"
import ChatContext from "../Components/Context/ChatContext"
import { useNavigate } from "react-router-dom"

const Signup = () => {
  const [name, setName] = useState()
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const [api, contextHolder] = notification.useNotification()
  const { signup } = useContext(ChatContext)

  const navigate = useNavigate()
  const handleSignUp = async() =>{
    if(!name || !username || !password){
      api.open({
        message: 'Form Incomplete',
        description:
          'Please fill complete form before submission',
        icon: <FrownOutlined style={{ color: '#ff0000' }} />
      });
      return
    }
    const inputs = {
      name, username, password
    }
    const results = await signup(inputs)
    if(results === 1){
      api.open({
        message: 'Signup Successful',
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
      <label>Name</label>
      <Input
        placeholder="Enter you name"
        size="large"
        value={name}
        onInput={(e) => setName(e.target.value)}
        required
      />
      <label>Username</label>
      <Input
        placeholder="Enter you email"
        size="large"
        className="mt-1"
        value={username}
        onInput={(e) => setUsername(e.target.value)}
        required
      />
      <label>Password</label>
      <Input
        placeholder="Enter you password"
        size="large"
        type="password"
        className="mt-1"
        value={password}
        onInput={(e) => setPassword(e.target.value)}
        required
      />
      <button 
        onClick={handleSignUp}
        className="btn btn-danger mt-3">
          Sign Up</button>
    </div>
  )
}

export default Signup
