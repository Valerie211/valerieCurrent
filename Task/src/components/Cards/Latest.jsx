
import { FaCheck } from "react-icons/fa";
import { BiEditAlt } from "react-icons/bi";
import { LiaTrashSolid } from "react-icons/lia";
import { jwtDecode } from "jwt-decode"

const Latest = ({created_at,progress_status,title,handleDelete,handleEdit}) => {
    const user = jwtDecode(JSON.parse(localStorage.getItem("token")))
    return (
        <div className='border-b py-2 text-gray-300'>
            <div className="px-4 flex justify-between items-center">
                <h2 className="text-sm  flex items-center text-green-300 gap-3" > <span>{progress_status}</span></h2>
                <FaCheck className="text-green-300"/>
            </div>
            <div className="px-4 flex justify-between mt-2">
                <p className="text-sm  text-center">{title}</p>
                <div className="flex gap-3">
                  { user.project_manager && <button onClick={()=>handleDelete()} className="text-red-300"><LiaTrashSolid /></button>}
                </div>
            </div>
            <div className="px-4 flex  mt-2">
                <p className=" text-sm text-center">{created_at}</p>
            </div>
        </div>
    );
}

export default Latest;
