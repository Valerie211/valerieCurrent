import React from 'react';
import { useLocation } from 'react-router-dom';

const TasksDetails = () => {
  const location = useLocation()
  const taskData = location?.state
  console.log("taskData",taskData)
  return (
    <div className='w-full shadow-md rounded-lg h-56 py-2 px-2 bg-white'>
      <h2 className='text-center font-bold'>Task Details</h2>
      <div>
        <h2> Title: {taskData?.title}</h2>
        <div className='flex w-full'>
        <h2 className='w-1/2'> Start Date: {taskData?.start_date} </h2>
        <h2 className='w-1/2'> Deadline: {taskData?.due_date}</h2>
        </div>
        <div className='flex w-full mt-2'>
        <h2 className='w-1/2'> Start Time: {taskData?.start_time }</h2>
        <h2 className='w-1/2'> Due Time: {taskData?.due_time }</h2>
        </div>
        <div className='flex w-full mt-2'>
        <h2 className='w-1/2'> Status: {taskData?.progress_status === "not_assigned" ? "Not Started" : taskData?.progress_status==="progress" ? "In Progress":taskData?.progress_status} </h2>
        <h2 className='w-1/2'> Priority: {taskData?.pri_status}</h2>
        </div>
        <p className='mt-2'>description: {taskData?.description}</p>
        
      </div>
    </div>
  );
}

export default TasksDetails;
