
import { useEffect,useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { getReflectionApi, removeReflectionApi } from "../../utils/reflection";
import { toast } from "react-toastify";


const Reflection = ({tasks,created_at,openForm,handleDelete,title}) => {
  
    const handleClick = ()=>{
      openForm()
    }
  return (
    <div className='bg-[#fcfcfc]  py-2 flex flex-col items-center  justify-center rounded-md w-48 shadow-sm'>
      <h2 className='text-sm font-bold'>{title}</h2>
      <div className="flex  justify-center w-full ">
      <span className="text-sm font-bold">Mood:</span>
      <p className='text-sm'>{created_at}</p>
      </div>
      
      
     <div className='flex justify-center gap-2 mt-2'>
     <button className='bg-blue-500 text-white rounded-sm px-2 py-1 text-xs' onClick={handleClick}>View more</button>
     <button className='bg-red-500 text-white rounded-sm px-2 py-1 text-xs' onClick={handleDelete}><MdOutlineDelete /></button>
     </div>
    </div>
  );
}

export default Reflection;
