
import { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard/Dashboard';
import LatestProject from '../components/ProjectOverview/LatestProject';
import ProjectOverview from '../components/ProjectOverview/ProjectOveriew';
import { getProjectApi } from '../utils/projects';
import { jwtDecode } from "jwt-decode"
import { toast } from 'react-toastify';

const DashboardScreen = ({}) => {
  const user = jwtDecode(JSON.parse(localStorage.getItem("token")))
  const [data, setData] = useState(null)
  const [filteredData, setFilteredData] = useState(null)
  const [barChartData, setBarData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [assignedProjects,setAssignedProjects] = useState(null)
    const [assignedTaskCount,setAssignedTaskCount] = useState(null)
    const [completedProjectCount,setCompletedProjectCounts] = useState(null)

  const getProject = async () => {
    setLoading(true)
    const project = await getProjectApi()
    console.log(project)
    if (project.status === 200) {
        setData(project?.data?.all_project?.slice(-3))
        const filteredProject = project?.data.all_project.filter((user_project, i) => user_project.creator === user.user_id )
        setData(filteredProject.slice(-3))
        setAssignedProjects(project.data.total_project)
        setAssignedTaskCount(project.data.total_task)
        setCompletedProjectCounts(project.data.total_completed)
        setBarData(project.data)
        getProjectApi()
        setLoading(false)
    } else {
        toast.error("Error Occurred")
    }
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

export default DashboardScreen;
