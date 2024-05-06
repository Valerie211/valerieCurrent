
import { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard/Dashboard';
import LatestProject from '../components/ProjectOverview/LatestProject';
import ProjectOverview from '../components/ProjectOverview/ProjectOveriew';
import { getSingleProjectDataApi } from '../utils/projects';
import { jwtDecode } from "jwt-decode"


const DashboardForUsersScreen = ({}) => {
    const user = jwtDecode(JSON.parse(localStorage.getItem("token")))
    console.log("userloggrgin",user)
    const [barChartData, setBarData] = useState();
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [stat,setStat] =useState([])
    const [assignedProjects,setAssignedProjects] = useState(null)
    const [assignedTaskCount,setAssignedTaskCount] = useState(null)
    const [completedProjectCount,setCompletedProjectCounts] = useState(null)

    const [open,setOpen] =useState(false)
    const getProject = async () => {
        setLoading(true)
        const project = await getSingleProjectDataApi()
        console.log("project",project)
        if (project.status === 200) {
            setCompletedProjectCounts(project.data.total_projects_completed)
            setAssignedProjects(project.data.total_projects_assigned)
            setAssignedTaskCount(project.data.total_tasks_assigned)
            setBarData(project.data)
             setData(project.data.projects_assigned_to_shared_with)
            setLoading(false)
        } else {
            alert("Error Occurred")
        }
    }
    const handleClick = ()=>{
        setOpen(!open)
    }
    useEffect(() => {
        getProject()
    }, [])
   
  return (
    <div className='p-4  mt-5'>
      <Dashboard projectCount={assignedProjects} tasksCount={assignedTaskCount} completedProjectCount={completedProjectCount}/>
     <div className='flex gap-4 mt-4'>
     <ProjectOverview projectData={barChartData}/>
      <LatestProject latestProject={data}/>
     </div>
    </div>
  );
}

export default DashboardForUsersScreen;
