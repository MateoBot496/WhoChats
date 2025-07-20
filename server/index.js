const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const matchOrWait = require("./logic/matchOrWait");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin : ['http://localhost:5173', 'https://whochatss.netlify.app/'],
        methods: ["GET" , "POST"],
    }
});

const users = new Map(); // ID [] -> id: socket.id,  nickname: "",  mode: ""
   
const chatlog = [];
const MAX_MESSAGES = 20;

//LOGICA DE PAREJAS DE RANDOM MODE
const waitingUsers = [];
const parejas = new Map();
const pvchatlogs = new Map();
const pairsids = new Map();

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // CHAT --------------------------------------------------------

    function updateChatGeneral(){
      io.emit("update-chat", chatlog);
    }
    
    updateChatGeneral();



    function updatepvchat(pvchat){
          socket.emit("update-pv-chat", pvchat);
          const parejaId = parejas.get(socket.id);
          socket.to(parejaId).emit("update-pv-chat", pvchat);
    }

    
    // FUNCIONES DE MANDAR MENSAJES, NORMALES Y PRIVADOS

    socket.on("send-msg", (data) => {
      chatlog.push(data);

      // Limita el array a los últimos 20 elementos
      if (chatlog.length > MAX_MESSAGES) {
        chatlog.shift(); // Elimina el mensaje más antiguo (al inicio del array)
      }

      updateChatGeneral();
    });

    

    socket.on("send-pv-msg", data => {

      const pairid = pairsids.get(socket.id);

      const curchat = pvchatlogs.get(pairid);
      curchat.push(data);



      if (curchat.length > MAX_MESSAGES) {
        curchat.shift(); // Elimina el mensaje más antiguo (al inicio del array)
      }

      updatepvchat(curchat);
    });
        


  //AÑADE USUARIO A ARRAY
  users.set(socket.id, {
    
    socket: socket,
    id: socket.id, 
    nickname: "",
    mode: "",
  });

  function updateUsers(){
    const usersArray = Array.from(users.values()).map(u => ({ nickname: u.nickname, mode: u.mode }));
    io.emit("update-users", usersArray);
  }

  //ACTUALIZA NICK DE USUARIO
  socket.on("update-nick", (nickname) => {
    users.set(socket.id, {socket: socket, id: socket.id, nickname: nickname });

    updateUsers();
  });

  //ACTUALIZA EL MODO DEL USUARIO
  socket.on("update-mode", (mode) => {
    const user = users.get(socket.id);
    users.set(socket.id, {...user, mode: mode});

    updateUsers();

    //AQUI HACEMOS LO DE METERLO EN EL ARRAY WAITING USERS
    if (mode == "random") {
      matchOrWait(socket, waitingUsers, parejas, pvchatlogs, pairsids, updatepvchat, users);
    } 

  });

  socket.on("skip", () => {
    skip();
  });

  socket.on("search", () => {
    matchOrWait(socket, waitingUsers, parejas, pvchatlogs, pairsids, updatepvchat, users);
  });

  socket.on("cancel", () => {
      //TODO :: QUITAR AL USUARIO DE WAITING USERS Y DEVOLVERLO A WAITING
      for(let i = 0; i < waitingUsers.length; i++){
        if(waitingUsers[i].id == socket.id){
          waitingUsers.splice(i,1);
          break;
        }
      }
      socket.emit("rejected");
  });


  //AL DESCONECTARSE

  function cleanPair(){
      if(parejas.get(socket.id) != null){
      const parejaId = parejas.get(socket.id);

      parejas.delete(socket.id);
      parejas.delete(parejaId);

      pvchatlogs.delete(pairsids.get(socket.id));

      pairsids.delete(parejaId);
      pairsids.delete(socket.id);

      socket.to(parejaId).emit("rejected");

    }
  }

  function skip(){
    cleanPair();
    socket.emit("rejected");
  }

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
    

    //BUSCAMOS SI EL USUARIO ESTA EN CHAT RANDOM -- WAITING USERS
    for(let i = 0; i < waitingUsers.length; i++){
      if(waitingUsers[i].id == socket.id){
        waitingUsers.splice(i,1);
        break;
      }
    }

    //BUSCAMOS SI ESTABA EMPAREJADO Y LO ELIMINAMOS DE PAIRS Y BORRAMOS EL CHAT PRIVADO
    
    if(users.get(socket.id)?.mode === "random"){
      cleanPair();
    }

    users.delete(socket.id);

    const usersArray = Array.from(users.values()).map(u => ({ nickname: u.nickname, mode: u.mode }));
    io.emit("update-users", usersArray);

  });

});

server.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});