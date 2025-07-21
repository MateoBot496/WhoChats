import { useState } from 'react';
import logo from './whochatslogo.png'; 
export default function Navbar({setShowUsers, setConnected}){
    const [menu, setMenu] = useState(false)
    return(
        <>
            <div className="border-2 w-full h-15 absolute top-0 flex items-center p-2 bg-gray-300">
                <img src={logo} alt="Logo" onClick={() => {setConnected(false)}} className="h-14 w-32 object-cover fixed left-0 cursor-pointer" />
                <div className="flex ml-auto" id='campanita'>
                    <a href="#" className="border-r-1 mr-5 pr-5"> {/*CAMPANITA*/}
                        <svg className="" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">

                            <title/>

                            <g id="Complete">

                            <g id="bell">

                            <g>

                            <path d="M18.9,11.2s0-8.7-6.9-8.7-6.9,8.7-6.9,8.7v3.9L2.5,17.5h19l-2.6-2.4Z" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>

                            <path d="M14.5,20.5s-.5,1-2.5,1-2.5-1-2.5-1" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>

                            </g>

                            </g>

                            </g>

                        </svg>
                    </a>
                    <div className="border-r-1 mr-5 pr-5 md:hidden" onClick={() => setShowUsers((prev) => !prev)}>  {/*USUARIOS*/}
                        <svg className="" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">

                            <path d="M1.5 6.5C1.5 3.46243 3.96243 1 7 1C10.0376 1 12.5 3.46243 12.5 6.5C12.5 9.53757 10.0376 12 7 12C3.96243 12 1.5 9.53757 1.5 6.5Z" fill="#000000"/>
                            <path d="M14.4999 6.5C14.4999 8.00034 14.0593 9.39779 13.3005 10.57C14.2774 11.4585 15.5754 12 16.9999 12C20.0375 12 22.4999 9.53757 22.4999 6.5C22.4999 3.46243 20.0375 1 16.9999 1C15.5754 1 14.2774 1.54153 13.3005 2.42996C14.0593 3.60221 14.4999 4.99966 14.4999 6.5Z" fill="#000000"/>
                            <path d="M0 18C0 15.7909 1.79086 14 4 14H10C12.2091 14 14 15.7909 14 18V22C14 22.5523 13.5523 23 13 23H1C0.447716 23 0 22.5523 0 22V18Z" fill="#000000"/>
                            <path d="M16 18V23H23C23.5522 23 24 22.5523 24 22V18C24 15.7909 22.2091 14 20 14H14.4722C15.4222 15.0615 16 16.4633 16 18Z" fill="#000000"/>

                        </svg>
                    </div>
                </div>  
                <svg id='MENU' width="2em" height="2em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='cursor-pointer' onClick={() =>    setMenu((prev) => !prev)}> 

                    <title/>

                    <g id="Complete">

                    <g id="align-justify">

                    <g>

                    <polygon fill="#ffffff" points="20 18 4 18 4 18 20 18 20 18" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>

                    <polygon fill="#ffffff" points="20 14 4 14 4 14 20 14 20 14" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>

                    <polygon fill="#ffffff" points="20 10 4 10 4 10 20 10 20 10" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>

                    <polygon fill="#ffffff" points="20 6 4 6 4 6 20 6 20 6" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>

                    </g>

                    </g>

                    </g>

                </svg>
            </div>

            {/* Menú desplegable */}
                
                <div className={`absolute top-16 right-2 w-40 bg-white border-2 p-4 flex flex-col shadow-lg rounded-md lg:w-80 transform transition-all duration-300 origin-top ${
                menu
                ? 'opacity-100 scale-100 pointer-events-auto visible'
                : 'opacity-0 scale-95 pointer-events-none invisible'
                }`}>
                    <ul className="space-y-2">
                        <li>
                        <a
                            href="#"
                            className="block text-gray-800 hover:text-blue-500 font-semibold transition-colors duration-200"
                        >
                            Inicio
                        </a>
                        </li>
                        <li>
                        <a
                            href="#"
                            className="block text-gray-800 hover:text-blue-500 font-semibold transition-colors duration-200"
                        >
                            Sobre nosotros
                        </a>
                        </li>
                        <li>
                        <a
                            href="#"
                            className="block text-gray-800 hover:text-blue-500 font-semibold transition-colors duration-200"
                        >
                            Contacto
                        </a>
                        </li>
                    </ul>
                </div>
            

            
        </>
    )
}