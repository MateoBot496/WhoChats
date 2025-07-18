export function connectToServer (socket, nick, setConnected, setUsers, setChat, mode, setPvchat) {//ESTA FUNCION COMPRUEBA QUE EL NICK SEA VALIDO, Y CONECTA AL USUARIO
    //TO DO: VALIDAR NICK

    socket.connect();
    setConnected(true);
    
    socket.on("connect", () => {
      socket.emit("update-nick", nick); // Asegúrate de que coincida con el nombre del evento del servidor
      socket.emit("update-mode", mode)
    });

    socket.on("update-users", (users) => {
      setUsers(users)
    })

    socket.on("update-chat", chatlog => {
      setChat(chatlog)
    })

    socket.on("update-pv-chat", pvchat => {
      setPvchat(pvchat)
    })


    

}