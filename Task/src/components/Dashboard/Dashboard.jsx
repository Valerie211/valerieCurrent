import { useEffect, useState } from "react";
import DashboardCards from "../Cards/DashboardCards";
import DashboardLineCard from "../Cards/DashboardLineCard";
import DoughnutCard from "../Cards/DoughnutCard"
import { getProjectApi } from "../../utils/projects";
import { toast } from "react-toastify";


const Dashboard = ({projectCount,tasksCount,completedProjectCount,loading}) => {




    if(loading){
      return <h2>Loading...</h2>
    }
  
  return (
    <div className="flex gap-2 ">
      <DashboardCards title="Total Projects" num={projectCount}/>
      <DashboardCards title="Total Tasks" num={tasksCount}/>
      <DashboardCards title="Total Completed" num={completedProjectCount}/>

    </div>
  );
}

export default Dashboard;
