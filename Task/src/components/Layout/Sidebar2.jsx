// import { Link, NavLink, useLocation ,useNavigate} from "react-router-dom";
// import { CiHome } from "react-icons/ci";
// import { MdOutlineKeyboardArrowRight } from "react-icons/md";
// import { FaRegEdit } from "react-icons/fa";
// import { FiUsers } from "react-icons/fi";
// import { LuStickyNote } from "react-icons/lu";
// import { jwtDecode } from 'jwt-decode';
// import logo from '../../assets/taskify-logo.png'
// import { MdLogout } from "react-icons/md";
// import { useState } from "react";
// import { toast } from "react-toastify";

// const Sidebar = () => {
//   const location = useLocation()
//   const nav = useNavigate()
//   const [authenticated, setAuthenticated] = useState(localStorage.getItem('token') !== null);
//   const user = {}
//   const token = JSON.parse(localStorage.getItem('token'));
//   console.log("user-token", token)
//   if (token && typeof token === 'string' && token.length > 0) {
//     const data = jwtDecode(token);
//     console.log(data)
//     user.data = data;
//     console.log(user)
//   }

//   const logout = () => {
//     localStorage.removeItem('token');
    
//     setAuthenticated(false);
//     toast.success("You have been logged out successfully!");
//     nav("/")
//   };
//   return (
//     <div className="relative flex  flex-col border h-[90%] w-full" >
//       <div className="text-2xl mb-8 py-4 flex justify-center">
//       <img src={logo} alt="log" className="w-[90px]"/>
//       </div>
    
//       <ul className="mt-4 pl-4 w-full flex flex-col  border-t">
//         <li className="mb-4 rounded-md hover:bg-[#a748f6] text-[#a748f6] hover:text-white py-2 flex gap-2 items-center pr-4">
//           <span></span>
//           <Link className=" hover:text-white" to={"/dashboard"} >Dashboard</Link>
          
//         </li>
//         <li className="mb-4 rounded-md hover:bg-[#a748f6] text-[#a748f6] hover:text-white py-2  flex gap-2 items-center ">
//           <span</span>
//           <Link className="" to={user?.data?.project_manager ? "/users-reflection" : `/reflection/${user?.user_id}`} >Reflection</Link>
//         </li>
//         <li className="mb-4 rounded-md hover:bg-[#a748f6] text-[#a748f6] hover:text-white py-2 flex gap-2 items-center pr-4 ">
//           <span><FaRegEdit size={20} className="" /></span>
//           <NavLink  className="" to={user?.data?.project_manager ? "/projects" : "/project"} >Projects</NavLink>
          
//         </li>
        
//       </ul>
//       <div className=" absolute bottom-20 text-[#a748f6] pl-4 flex items-center px-2 gap-2  cursor-pointer" onClick={logout}><MdLogout/> sign out</div>
//     </div>
//   );
// }

// export default Sidebar;
