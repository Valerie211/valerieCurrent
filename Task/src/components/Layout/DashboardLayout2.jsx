// import Sidebar from "./Sidebar";
// import { CiHome } from "react-icons/ci";
// import { RxHamburgerMenu } from "react-icons/rx";
// import { CiBellOn } from "react-icons/ci";
// import { PiUserSquare } from "react-icons/pi";
// import { IoIosQrScanner } from "react-icons/io";
// import profilePix from "../../assets/user.png"

// import { MdOutlineDarkMode } from "react-icons/md";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import Notification from "../Notification/Notification";
// import { jwtDecode } from "jwt-decode"

// const DashboardLayout = ({ children,Page,Title }) => {
//   const [darkMode,setDarkMode] = useState(false)
//   const [isOpen,setIsOpen] = useState(false)
//   const [open,setOpen] = useState(false)
//   const nav = useNavigate()
//   const user = jwtDecode(JSON.parse(localStorage.getItem("token")))
 

//   const toggleDarkMode =()=>{
//     setDarkMode((prevMode)=>!prevMode)
//   }
//   const toggleModal =()=>{
//     setIsOpen(!isOpen)
//   }
//   const toggleNotification = ()=>{
//     nav("/notification")
//   }
//   useEffect(()=>{
//     const isDarkModeEnabled = localStorage.getItem("darkMode") === 'true'
//     setDarkMode(isDarkModeEnabled)
//   },[])

//   useEffect(()=>{
//       localStorage.setItem("darkMode",darkMode)

//       document.body.classList.toggle("dark",darkMode)
//   },[darkMode])

//   return (
//     <div className={darkMode ?'flex w-full min-h-screen dark:bg-black':"flex w-full min-h-screen"}>
//       <div className='w-1/5 '>
//         <Sidebar />
//       </div>
//       <main className='flex-1 bg-gray-200 min-h-screen overflow-x-hidden'>
//         <nav className="h-20 shadow-md relative  bg-white">
//           <div className="h-1/2 relative flex items-center">
//             {/* <RxHamburgerMenu className="ml-2" /> */}
//             <div className="ml-auto mr-4 flex gap-4">
//              <div className="relative">
//              <CiBellOn onClick={toggleNotification} className="hover:bg-blue-200 active:bg-blue-300 relative"/>
//             { open && <div onClick={toggleNotification} className="cursor-pointer w-[200px]  z-20  top-[50] absolute bg-white shadow-md"><Notification/></div>
//              }
//              </div>
//               {/* <IoIosQrScanner /> */}
//               {/* <PiUserSquare /> */}
//                 <img className="h-5 w-5" src={profilePix} alt=""/>
//                 <h2>{`${user?.first_name} ${user?.last_name} `}</h2>
              
//             </div>
//           </div>
//           <div className="h-1/2 flex gap-4 items-center border border-b">
//             <h2 className="ml-6">{Page}</h2>
//             <div className="flex gap-2 ">
//               {/* <span><CiHome size={20} className="text-gray-400" /></span> */}
//               <h3 className="text-sm">{Title}</h3>
//             </div>
//           </div>
//         </nav>
//         <div className="bg-gray-200 overflow-x-hidden  min-h-screen">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default DashboardLayout;
