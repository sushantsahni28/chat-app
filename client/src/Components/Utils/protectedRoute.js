import { Navigate } from "react-router-dom"

export const ProtectedRoute = ({children}) => {
    let user = JSON.parse(localStorage.getItem("chatUser"))

    if(user == null){
        return <Navigate to="/" replace />
    }
    return children
}

export const ExternalRoute = ({children}) => {
    const user = JSON.parse(localStorage.getItem("chatUser"))
    if(user != null){
        return <Navigate to="/chats" replace />
    }
    return children
}