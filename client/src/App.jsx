import { useState, useEffect } from 'react'
import {io} from "socket.io-client"
import { connectToServer } from './logic/connectToServer'
import Chatwindow from './assets/chatwindow'
import Navbar from './assets/navbar'
import RandomChat from './assets/randomchat'

const socket = io("https://whochats.onrender.com/", {autoConnect : false})

function App() {
  const [connected, setConnected] = useState(false)
  const [users, setUsers] = useState([])
  const [nick, setNick] = useState("")
  const [mode, setMode] = useState("general")
  const [chat, setChat] = useState([])
  const [pvchat, setPvchat] = useState([])
  const [showUsers, setShowUsers] = useState(false)

  const handleConnect = () => {
    if(nick === "") return;
    connectToServer(socket, nick, setConnected, setUsers, setChat, mode, setPvchat);
  }

  useEffect(() => { //ESTA FUNCION HACE QUE SE DESCONECTE AL CERRAR LA VENTANA
    return () => {
      if (socket){
        socket.disconnect();
      } 
    };
  }, []);

  return (
    <>
      <Navbar setShowUsers={setShowUsers}/>
      {connected ? (mode === "general" ? (
        <>
        <Chatwindow users={users} chat={chat} socket={socket} nick={nick} showUsers={showUsers}/>
        </> 
      ) : (
        <>
        <RandomChat pvchat={pvchat} socket={socket} nick={nick} />
        </> 
      ))
      
      :

      <>
        <input type="text" name="" value={nick} onChange={(e) => setNick(e.target.value)} placeholder='Nickname...'/>
        <select onChange={(e) => setMode(e.target.value)}>
          <option value="random" > Random </option>
          <option value="general" selected> General </option>
        </select>
        <button onClick={handleConnect}>Conectar</button>
      </>}
      
    </>
  )

}

export default App