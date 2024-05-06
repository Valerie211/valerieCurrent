import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Nav from './Nav';
import { GoHome } from "react-icons/go";
import { LiaBookSolid } from "react-icons/lia";
import { HiUserGroup } from "react-icons/hi";
import { FaUserFriends } from "react-icons/fa";
import { CiHome } from "react-icons/ci";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { LuStickyNote } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import logo from '../../assets/taskify-logo.png';
import { jwtDecode } from 'jwt-decode';

const AdminDashboardLayout = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if token doesn't exist
      navigate('/login');
    }
  }, [navigate]);

  // Decode token if it exists
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  const memberSideBarItems = [
    {
      label: "Dashboard",
      icon: <CiHome size={20} className=" hover:text-white" />,
      url: "/dashboard-for-users"
    },
    {
      label: "Projects",
      icon: <HiUserGroup size={24} />,
      url: "/project"
    },
    {
      label: "Reflections",
      icon: <LiaBookSolid size={24} />,
      url: `/reflection/${user?.user_id}`
    },
  ];

  const adminSideBarItems = [
    {
      label: "Dashboard",
      icon: <GoHome size={24} />,
      url: "/dashboard"
    },
    {
      label: "Reflections",
      icon: <LiaBookSolid size={24} />,
      url: "/users-reflection"
    },
    {
      label: "Project",
      icon: <HiUserGroup size={24} />,
      url: "/projects"
    },
  ];

  const sideBarItems = user && user.project_manager ? adminSideBarItems : memberSideBarItems;

  return (
    <div className='fixed flex w-full z-50'>
      <div className='w-64 '>
        <Sidebar items={sideBarItems} />
      </div>
      <main className=' flex-1 h-screen  bg-gray-100 overflow-y-auto'>
        <div className='fixed w-full mb-10 z-50'>
          <Nav />
        </div>
        <div className=' p-8 mb-10  '>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
