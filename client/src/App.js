import { Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Homepage from './pages/homepage';
import { ExternalRoute, ProtectedRoute } from './Components/Utils/protectedRoute';
import Chats from './pages/chats';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <ExternalRoute>
          <Homepage />
        </ExternalRoute>
      }/>
      <Route path="/chats" element={
        <ProtectedRoute>
          <Chats />
        </ProtectedRoute>
      }/>
    </Routes>
  );
}

export default App;
