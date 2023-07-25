import Headers from "../Components/Utils/headers"
import { Tabs } from "antd"
import Login from "./login"
import Signup from "./signup"

const Homepage = () => {
    const nameArr = ["Login","Sign Up"]
    const comp = [<Login />, <Signup />]
    
  return (
    <>
    <Headers />
    <div className="homeback">
        <div className="logintab bg-secondary">
            <Tabs
                defaultActiveKey="1"
                className="text-light"
                centered
                items={new Array(2).fill(null).map((_, i) => {
                  const id = String(i + 1);
                  return {
                    label: nameArr[i],
                    key: id,
                    children: comp[i],
                  };
                })}
              />
        </div>
    </div>
    </>
  )
}

export default Homepage
