
import { MdSearch } from "react-icons/md";
import { CiBellOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import profilePix from "../../assets/user.png"
import { jwtDecode } from "jwt-decode"

const Nav = () => {
    const user = jwtDecode(JSON.parse(localStorage.getItem("token")))
  console.log("user--->",user)
//   const nav = useNavigate()
//   const toggleNotification = ()=>{
//         nav("/notification")
//       }
  return (
    <div className=''>
      <div className='w-full px-10 flex justify-end  bg-white  py-3'>
      <div className="ml-auto mr-4 flex justify-end gap-4">
            <img className="h-5 w-5" src={profilePix} alt=""/>
                 <h2>{`${user?.first_name} ${user?.last_name} `}</h2>
            </div>
        <div className='w-1/5  flex items-center'>
           <h4>{user?.fullName}</h4>
        </div>
      </div>
    </div>
  );
}

export default Nav;
