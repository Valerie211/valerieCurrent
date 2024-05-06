import { MdOutlineEdit } from "react-icons/md";
import { BiTrashAlt } from "react-icons/bi";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { removeTaskApi, updateTaskApi, update_TaskApi } from "../../utils/tasks";
import { toast } from "react-toastify";
import { jwtDecode} from "jwt-decode"
import { GoCommentDiscussion } from "react-icons/go";
import CommentBox from "../Comments/Comments";
import { useNavigate } from "react-router-dom";

const TaskTable = ({openForm,tasks,setTasks,handleEdit,getTasks}) => {
  const [open,setOpen] = useState(false)
  const [status,setStatus]=useState("")
  const nav =useNavigate()
  const user =  jwtDecode(JSON.parse(localStorage.getItem("token")))?.user_id
  const handleDelete =async(id)=>{
    console.log("task_id",id)
    try {
      const result = await removeTaskApi(id,user)
    console.log("res-del",result)
    if(result.status ===200){
    const updatedTask = tasks.filter((task,i)=> task.id !== id)
    setTasks(updatedTask)
    getTasks()
    toast.success("task deleted successfully")
    }
    } catch (error) {
      toast.error(error)
    }
  }
  const handleToggle =()=>{
    setOpen(!open)
  }
  const handleViewComments = (task) => {
    console.log("task",task)
    setTimeout(()=>{
      nav(`/comment-section/${task.id}`, { state:task }); 
    },2000)
    console.log("task",task)
};
  const handleStatusChange = async (taskId,selectedProgress) => {
    try {
      const updatedTask = tasks.map((task,i)=>task.id ===taskId? {...task,progress_status:selectedProgress} :task)
      setTasks(updatedTask)
        const result = await updateTaskApi(taskId,selectedProgress);
        console.log(result);
        // Update task status in state
        getTasks()
        toast.success("Tasks status updated successfully")
        
      }
    catch (error) {
      console.error("Error updating task status:", error);
    }
  };
  const handleEditTask =(task)=>{
    handleEdit(task)
  }
  return (
    <div className="w-full rounded-sm bg-white h-auto relative overflow-x-auto">
      <div className="text-sm flex items-center justify-between px-4 py-4">
        <h3 className="font-bold">Task</h3>
        <CSVLink className="bg-[#BBE2EC] text-[#40A2E3] py-2 px-2 mr-4 rounded-sm" data={tasks}>Export Report</CSVLink>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full text-sm border-b">
           <thead>
           <tr className="bg-[#BBE2EC] py-4">
                {/* <th className="bg-[#BBE2EC] py-4 px-2"><input type="checkbox"/></th> */}
                <th className="bg-[#BBE2EC] py-4 px-2">Name</th>
                <th className="bg-[#BBE2EC] py-4 px-2">Status</th>
                <th className="bg-[#BBE2EC] py-4 px-2">Start Date</th>
                <th className="bg-[#BBE2EC] py-4 px-2">Deadline</th>
                <th className="bg-[#BBE2EC] py-4 px-2">Start Time</th>
                <th className="bg-[#BBE2EC] py-4 px-2">End Time</th>
                <th className="bg-[#BBE2EC] py-4 px-2">Assigned to</th>
                <th className="bg-[#BBE2EC] py-4 px-2">Priority</th>
                <th className="bg-[#BBE2EC] py-4 px-2">comment</th>
                <th className="bg-[#BBE2EC] py-4 px-2">Action</th>
                
            </tr>
           </thead>
           <tbody>
        {
          tasks.length > 0 && tasks.map((task,i)=>{
            return (
              <tr key={task.id}>
                {/* <td className="text-center py-4 px-2"><input type="checkbox"/></td> */}
             
                <td className="text-center py-4 px-2">
                <h3 className="text-xs">{task.title}</h3>
                </td>
                <td className="text-center py-4 px-2">
                <select  value={task.progress_status}
                     onChange={(e)=>
                     { setStatus(e.target.value);
                      handleStatusChange(task.id,e.target.value)
                  }}>
                       <option value="complete">complete</option>
                        <option value="progress">in progress</option>
                        <option value="not_assigned">not started</option>
                    </select>
                    {/* {
                      task.progress_status ==="not_assigned"? "Not Started": task?.progress_status  === 'progress'? "Progress":task?.progress_status ==="complete" && "Completed"
                    } */}
                </td>
                <td className="text-center py-4 px-2">{task.start_date}</td>
                <td className="text-center py-4 px-2">{task.due_date}</td>
                <td className="text-center py-4 px-2">{task.start_time}</td>
                <td className="text-center py-4 px-2">{task.due_time}</td>
                <td className="text-center py-4 px-2">
  <select>
    {task?.shared_with && task.shared_with?.map((item, i) => {
    
      return <option key={item.id}>{item?.first_name}{item?.last_name}</option>
    })}
  </select>
</td>
    
                <td className="text-center py-4 px-2">
                {
                  task.pri_status
                }
                </td>
                <td className="text-center  py-4 px-2 ">
                    <button onClick={()=>handleViewComments(task)} className="bg-blue-400 text-white flex justify-center items-center py-1 mx-auto rounded-sm px-2">
                    <GoCommentDiscussion /> 
                    </button>
                    
                </td>
                <td className="text-center py-4  flex whitespace-nowrap flex-nowrap gap-1">
                    <button onClick={()=>handleEditTask(task)} className="bg-blue-400 text-white py-1 rounded-sm px-1">
                      <MdOutlineEdit/>  
                    </button>
                    <button onClick={()=>handleDelete(task.id)} className="bg-red-400 text-white py-1 rounded-sm px-1">
                        <BiTrashAlt/>
                    </button>
                </td>

            </tr>
            )
          })
        }
           </tbody>
      </table>

      </div>      {
        open && <div className="absolute top-0"><CommentBox/></div>
      }
    </div>
  );
}

export default TaskTable;
