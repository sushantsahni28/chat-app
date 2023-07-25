import Chatspace from "../Components/Tabs/chatspace"
import Sidebar from "../Components/Tabs/sidebar"
import Headers from "../Components/Utils/headers"

const Chats = () => {
  return (
    <>
      <Headers />
      <div className="chatback">
        <div className="row chattab g-0">
          <Sidebar />
          <Chatspace />
        </div>
      </div>
    </>
  )
}

export default Chats
