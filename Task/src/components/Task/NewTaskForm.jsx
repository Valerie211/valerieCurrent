import React,{useEffect, useState} from 'react';
import {toast} from "react-toastify"
import { jwtDecode} from "jwt-decode"
import { createTaskApi, getSharedWithApi } from '../../utils/tasks';
import { useParams } from 'react-router-dom';
import { MdClose } from "react-icons/md";

const NewTaskForm = ({closeModal,getTasks}) => {
  const { project_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const user = jwtDecode(JSON.parse(localStorage.getItem('token')))?.user_id;
  const [payload, setPayload] = useState({
    title: '',
    due_date: '',
    creator: 0,
    project: 0,
    start_date: '',
    end_date: '',
    pri_status: '',
    start_time: '',
    due_time: '',
    progress_status: '',
    description: '',
    shared_with: [], // Storing complete user objects here
  });

  const handleUserSelect = (userId) => {
    const selectedUser = usersData.find((user) => user.id === userId);
    setSelectedUsers((prev) => [...prev, selectedUser]);
    setPayload((prev) => ({
      ...prev,
      shared_with: [...prev.shared_with, selectedUser],
    }));
  };

  const handleUserRemove = (userId) => {
    const updatedSelectedUsers = selectedUsers.filter((user) => user.id !== userId);
    setSelectedUsers(updatedSelectedUsers);
    setPayload((prev) => ({
      ...prev,
      shared_with: prev.shared_with.filter((user) => user.id !== userId),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    console.log("payload",payload)
    e.preventDefault();
    const data = {
      title: payload.title,
      description: payload.description,
      due_date: payload.due_date,
      creator: user,
      project: parseInt(project_id),
      start_date: payload.start_date,
      start_time: payload.start_time,
      pri_status: payload.pri_status,
      due_time: payload.due_time,
      progress_status: payload.progress_status,
      shared_with_users: payload.shared_with.map(item=> item.id), // Sending complete user objects to the backend
    };
    console.log("data",data)
    const result = await createTaskApi(data, project_id);
    if (result.status === 201) {
      toast.success('Task successfully created');
      setPayload({
        title: '',
        creator: 0,
        project: 0,
        start_date: '',
        due_date: '',
        pri_status: '',
        due_time: '',
        progress_status: '',
        description: '',
        shared_with: [],
      });
    }
    closeModal();
    getTasks();
  };

  const getUsers = async () => {
    setLoading(true);
    try {
      const result = await getSharedWithApi(project_id);
      if (result.status === 200) {
        setUsersData(result?.data.shared_with_users);
        setFilteredUsers(result?.data.shared_with_users);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = usersData.filter(
      (user) =>
        user.first_name.toLowerCase().includes(query) || user.last_name.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    getUsers();
  }, [project_id]);

console.log("filteredData",filteredUsers)

  return (
    <div className='bg-white w-full'>
      <form className='px-4' onSubmit={submitHandler}>
        <div className='flex gap-4'>
            <div className='w-1/2'>
                <label htmlFor='title' className='text-xs'>Title</label>
                <input
                name="title"
                onChange={handleChange}
                value={payload.title}
                 className='w-full border py-2 px-2 rounded-sm'/>
            </div>
            <div className='w-1/2'>
                <label htmlFor='Start Date' className='text-xs'>Start Date <span className='text-red-400'>*</span></label>
                <input
                name="start_date"
                 type='date' 
                 value={payload.start_date}
                onChange={handleChange}
                className='w-full border py-2 px-2 rounded-sm'/>
            </div>
        </div>
        <div className='flex gap-4'>
            <div className='w-1/2'>
                <label htmlFor='title' className='text-xs'>Deadline</label>
                <input 
                type='date'
                name="due_date"
                 value={payload.due_date}
                onChange={handleChange}
                 className='w-full border py-2 px-2 rounded-sm'/>
            </div>
            <div className='w-1/2'>
                <label htmlFor='' className='text-xs'>Start_time</label>
                <input 
                 name="start_time"
                 type='time' 
                 value={payload.start_time}
                onChange={handleChange}
                className='w-full border py-2 px-2 rounded-sm'/>
            </div>
           
        </div>

        <div className='flex gap-4'>
        <div className='w-1/2'>
                <label htmlFor='time' className='text-xs'>End Time <span className='text-red-400'>*</span></label>
                <input 
                type='time'
                name="due_time" 
                 value={payload.due_time}
                onChange={handleChange}
                 placeholder='09:30' className='w-full border py-2 px-2 rounded-sm'/>
            </div>
            <div className='w-1/2'>
                <label htmlFor='' className='text-xs'>Status</label>
                <select
              name='progress_status'
              value={payload.progress_status}
              onChange={handleChange}
              className='w-full border py-2 px-2 rounded-sm'
            >
              <option value=''>Select Status</option>
              <option value='not_assigned'>Not Started</option>
              <option value='progress'>In Progress</option>
              <option value='complete'>Completed</option>
            </select>
            </div>
           
        </div>
        <div className='flex gap-4'>
        <div className='w-1/2'>
                <label htmlFor='' className='text-xs'>Priority <span className='text-red-400'>*</span></label>
                <select
              name='pri_status'
              value={payload.pri_status}
              onChange={handleChange}
              className='w-full border py-2 px-2 rounded-sm'
            >
              <option value=''>Select Priority</option>
              <option value='high'>High</option>
              <option value='medium'>Medium</option>
              <option value='low'>Low</option>
            </select>
            </div>
              <div className='w-1/2 flex flex-col'>
            <label htmlFor='title' className='text-xs'>Assigned to <span className='text-red-400'>*</span></label>
            <input
              type="text"
              placeholder="Search users..."
              onChange={handleSearch}
              className='w-full border py-2 px-2 rounded-sm mb-2'
            />
            <select
              multiple
              className='px-2 py-2'>
              {filteredUsers.length > 0 &&
                filteredUsers.map((user) => (
                  <option key={user.id} value={user.id} onClick={() => handleUserSelect(user.id)}>
                    {`${user.first_name} ${user.last_name}`}
                  </option>
                ))}
            </select>
            <div className="mt-2">
              <p className="text-xs">Selected Users:</p>
              {selectedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between bg-gray-100 py-1 px-2 rounded-md mt-1">
                  <span>{`${user.first_name} ${user.last_name}`}</span>
                  <button type="button" onClick={() => handleUserRemove(user.id)} className="text-red-500">
                    <MdClose />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div  className=" flex flex-col">
            <label>Description</label>
            <textarea 
               name="description"
                 type='text' 
                 value={payload.description}
                onChange={handleChange}
             className='border '>

            </textarea>
        </div>
        <button type='submit' className='bg-blue-400 mt-4 rounded-sm py-2 text-white px-2'>submit data</button>
      </form>
    </div>
  );
}

export default NewTaskForm;
