import { useState, useEffect } from 'react'
import {io} from "socket.io-client"
import { connectToServer } from './logic/connectToServer'
import Chatwindow from './assets/chatwindow'
import Navbar from './assets/navbar'
import RandomChat from './assets/randomchat'

const socket = io("https://whochats.onrender.com/", {autoConnect : false})
//const socket = io("http://localhost:3000", {autoConnect : false})

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
      <Navbar setShowUsers={setShowUsers} setConnected={setConnected} setMode={setMode}/>
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
        <h1 className='text-5xl font-bold md:text-9xl'>WHOCHATS</h1>
        <p          style={{            width: "min(1000px, 100%)",            marginBottom: "10%",            textAlign: "center"          }}        >
          WhoChats is a simple, fast, and anonymous 1-on-1 chat where you can talk to strangers from anywhere in the world. No sign-up, no profiles — just click "Start" and get instantly connected. Whether you're looking for a deep conversation, a quick laugh, or just to pass the time, WhoChats makes meeting new people easy and fun.
        </p>
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