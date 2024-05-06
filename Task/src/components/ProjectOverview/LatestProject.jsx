import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Latest from '../Cards/Latest';
import { getProjectApi, removeTProjectApi } from "../../utils/projects";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode"
const LatestProject = ({latestProject}) => {
  const nav = useNavigate()
  const user = jwtDecode(JSON.parse(localStorage.getItem("token")))
 const [data, setData] = useState(null)
  const [filteredData, setFilteredData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)


  const toggleEdit=()=>{
    setOpen(!open)
  }

  const getProject = async () => {
      setLoading(true)
      const project = await getProjectApi()
      console.log(project)
      if (project.status === 200) {
        //   setData(project?.data?.all_project?.slice(-3))
          const filteredProject = project?.data.all_project.filter((user_project, i) => user_project.creator === user.user_id )
        //   setData(filteredProject.slice(-3))
          getProjectApi()
          setLoading(false)
      } else {
          toast.error("Error Occurred")
      }
  }
  console.log("========>", data)
  const handleClick = () => {
      setOpen(!open)
  }
  const handleDelete = async (id,userId) => {
      try {
          const result = await removeTProjectApi(id,userId);
          console.log("user-id",result)
          if (result.status === 200) {
              
              const updatedProject = data.filter((task, i) => task.id !== id)
              setData(updatedProject)
              getProject()
              toast.success("project deleted successfully")
          }
      } catch (error) {

          toast.error(error)
      }
  }
  useEffect(() => {
      getProject()
  }, [])

  return (
    <div className='w-1/3 bg-white h-auto overflow-y-scroll'>
        <div className='flex justify-between text-sm mb-4 p-4'>
            <h2>Latest Project</h2>
            <button onClick={()=>nav("/projects")}>view all</button>
        </div>
        {
          latestProject?.map(item => <Latest 
          key={item.id} 
          title={item?.title} 
          progress_status={item.progress_status} 
          created_at={item.progress_status}
          handleDelete={() => handleDelete(item.id,user?.user_id)}
          handleEdit={toggleEdit}
          />)
        }
        {
            data?.length === 0 && <div className="text-center">No data available yet</div>
        }
        {
            loading&& <div className="text-center">Loading...</div>
        }
    </div>
  );
}

export default LatestProject;
