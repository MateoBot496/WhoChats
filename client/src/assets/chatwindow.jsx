import { useEffect, useRef, useState } from "react"

export default function Chatwindow({users, chat, socket, nick, showUsers}){

    //TODO: LIMPIEZA
    const [msg, setMsg] = useState("");
    const botref = useRef(null);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 800);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 800);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        botref.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    const sendMsg = () => {


        if (msg.trim() == ""){return}

        const now = new Date();
        const time = now.toLocaleTimeString();
        socket.emit("send-msg", [time, nick + ":" , msg])
        setMsg("")
    }
    
    return(
        <>  
        <div className="chatwindow absolute top-15 h-[85vh]">
            <div className="chat h-full ">
                <div className="chatlog flex flex-col gap-1 border-2 overflow-y-auto scrollbar-custom scrollbar-hover">
                    {
                    chat.map((msg, index) => (
                        <div
                        className={`flex gap-2 mb-2 p-2 rounded-lg shadow-sm w-md border-2
                            ${msg[1] === nick ? "self-end bg-blue-100 border-blue-800" : "bg-gray-100 border-gray-300"}`}
                        key={index}
                        ref={botref}
                        >
                            <span className=" text-gray-400">{msg[0]}</span> {/* Hora */}
                            <span className=" font-semibold text-blue-600">{msg[1]}</span> {/* Usuario */}
                            <p className=" text-gray-800 break-words overflow-hidden">{msg[2]}</p> {/* Mensaje */}
                            
                        </div>
                    ))
                    }
                </div>
                <div className="flex justify-center items-center w-full">
                    <input type="text" className="chatinput" value={msg} placeholder="Escribe tu mensaje..." onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => {if (e.key === "Enter") {e.preventDefault(); sendMsg();}}}/>
                    <button onClick={sendMsg}>Enviar</button>
                </div>

            </div>


            <div className={` rounded-xl p-2 absolute border-2 w-full h-[85vh] bg-white ${showUsers || isDesktop ? "visible" : "hidden"} md:w-[20vw] md:relative`} id="USUARIOS">
                <h1 className="font-bold text-green-600">Usuarios conectados:</h1>
                <ul>
                    {users.map(user => (
                        <li key={user.id} className="font-bold"> {user.nickname} </li>
                    ))}
                </ul>
            </div>
        </div>
        </>
    )
}