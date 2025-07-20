import { useEffect, useRef, useState } from "react";

export default function RandomChat({pvchat, socket, nick}){

    const botref = useRef(null)
    const [msg, setMsg] = useState("")
    const [mode, setMode] = useState("waiting")
    
    useEffect(() => {
            botref.current?.scrollIntoView({ behavior: "smooth" });
    }, [pvchat]);

    const sendMsg = () => {


        if (msg.trim() == ""){return}

        const now = new Date();
        const time = now.toLocaleTimeString();

        //TODO: CAMBIAR MENSAJE A 1C1
        socket.emit("send-pv-msg", [time, nick , msg]) 
        setMsg("")

    }

    useEffect(() => {
        socket.on("waiting", () => setMode("waiting"));
        socket.on("matched", () => setMode("matched"));
        socket.on("rejected", () => setMode("rejected"));

        return () => {
            socket.off("waiting");
            socket.off("matched");
            socket.off("rejected");
        };
    }, [socket])

    function handleSkip(){
        socket.emit("skip")
    }

    function handleSearch(){
        socket.emit("search")
    }

    function handleCancel(){
        socket.emit("cancel")
    }

    return(
        <>  
            <div className="chatwindow absolute top-15 h-[85vh]">
                <div className="chat h-full">
                    <div className="chatlog flex flex-col gap-1 border-2 overflow-y-auto scrollbar-custom scrollbar-hover">
                        {mode === "matched" && 
                            pvchat.map((msg, index) => (
                                
                                <div
                                className={`flex gap-2 p-2 rounded-lg shadow-sm  border-2 w-[100%]
                                    ${msg[1] === nick ? "self-end bg-blue-100 border-blue-800 " : "bg-gray-100 border-gray-400"}`}
                                key={index}
                                ref={botref}
                                >
                                    <span className=" text-gray-400">{msg[0]}</span> {/* Hora */}
                                    <span className=" font-semibold text-blue-600">{msg[1]+ " :"}</span> {/* Usuario */}
                                    <p className=" text-gray-800 break-words overflow-hidden">{msg[2]}</p> {/* Mensaje */}
                                    
                                </div>
                            ))
                        }

                        {mode === "waiting" && (
                        <div className="flex items-center gap-2 text-gray-600 text-2xl h-full flex items-center justify-center">
                            <svg
                            className="animate-spin h-5 w-5 text-blue-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                            </svg>
                            <p>Looking for a partner...</p>
                        </div>
                        )}

                        {mode === "rejected" && (
                        <div className="flex items-center gap-2 text-red-600 text-2xl h-full flex items-center justify-center">
                            <svg
                            className="h-8 w-8 text-red-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                            </svg>
                            <p>Partner left — click to start a new chat</p>
                        </div>
                        )}

                        
                    </div>
                    <div className="flex justify-center items-center w-full flex-col gap-1 md:flex-row">
                        <input type="text" className="chatinput" value={msg} placeholder="Escribe tu mensaje..." onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => {if (e.key === "Enter") {e.preventDefault(); sendMsg();}}}/>
                        {mode === "matched" ? <button onClick={sendMsg}>Enviar</button> : <button disabled className="bg-gray-200">Enviar</button>}
                        {mode === "matched" && <button onClick={handleSkip}>SKIP</button>}
                        {mode === "waiting" && <button onClick={handleCancel}>CANCELAR BUSQUEDA</button>}
                        {mode === "rejected" && <button onClick={handleSearch}>BUSCAR NUEVO COMPA</button>}
                        
                    </div>

                </div>
            </div>

            
        </>
    )
}