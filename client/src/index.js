import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom"
import { ChatContextProvider } from './Components/Context/ChatContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <ChatContextProvider>
        <App />
      </ChatContextProvider>
    </BrowserRouter>
);
