import { Link, useNavigate,useLocation } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { toast } from "react-toastify";
import logo from '../../assets/taskify-logo.png'

const Sidebar = ({ items }) => {
  const location = useLocation()
  const nav = useNavigate()
  const logout =()=>{
    localStorage.removeItem('token');
    toast.success("user logged out successfully");
      nav('/')
  }
  return (
    <div className="fixed border-r-2 rounded-md mr-36  text-white min-h-screen w-64 overflow-y-auto">
      <div className="relative h-full min-h-screen">
        <div onClick={()=>nav("/")} className="px-4 cursor-pointer py-2 mt-4 mb-10 flex justify-center items-center">

      <img src={logo} alt="log" className="w-[90px]"/>
      
        </div>
        <nav className="w-full">
          <ul className='w-full'>
            {items.map((item, index) => (
              <li key={index} className={location.pathname === item.url?'hover:bg-[#a748f6] bg-[#a748f6]  p-3 rounded mb-2 w-full  text-white':"hover:bg-[#a748f6] p-3 rounded mb-2 w-full  text-white"}>
                <Link to={item.url} className={location.pathname === item.url ?'flex  items-center text-white gap-2  text-sm font-semibold w-full pl-4':'flex text-[#a748f6] hover:text-white items-center text- gap-2  text-sm font-semibold w-full pl-4'}>
                   <p className="">{item.icon}</p>
                  {item.label }
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div onClick={logout} className="w-full absolute hover:text-white rounded-md text-[#a748f6] hover:bg-[#a748f6] flex gap-2 cursor-pointer mb-10 py-3  mx-auto px-10 bottom-10">
          
          <TbLogout2 size={24} className=" "/>
          <h4 className=" "> logout</h4>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
