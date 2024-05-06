import React, { useEffect, useState } from 'react';
import { MdClose } from "react-icons/md";
import { createProjectApi, getProjectApi } from '../../utils/projects';
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode"
import { getAllUsersApi } from '../../utils/auth';

const CreateProject = ({ closeModal, handleClick, getProjectApi }) => {
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const user = jwtDecode(JSON.parse(localStorage.getItem("token")))?.user_id;

  const [payload, setPayload] = useState({
    title: "",
    description: "",
    due_date: "",
    shared_with: [],
    creator: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserSelect = (userId) => {
    const selectedUser = usersData.find((user) => user.id === userId);
    setSelectedUsers((prev) => [...prev, selectedUser]);
    setPayload((prev) => ({
      ...prev,
      shared_with: [...prev.shared_with, userId]
    }));
  };

  const handleUserRemove = (userId) => {
    const updatedSelectedUsers = selectedUsers.filter((user) => user.id !== userId);
    setSelectedUsers(updatedSelectedUsers);
    setPayload((prev) => ({
      ...prev,
      shared_with: prev.shared_with.filter((id) => id !== userId)
    }));
  };

  const getUsers = async () => {
    setLoading(true);
    try {
      const result = await getAllUsersApi();
      if (result.status === 200) {
        setUsersData(result?.data.user_list);
        setFilteredUsers(result?.data.user_list);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = usersData.filter(
      (user) =>
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const data = {
        title: payload.title,
        description: payload.description,
        due_date: payload.due_date,
        shared_with: payload.shared_with,
        creator: user
      };
      const result = await createProjectApi(data);
      if (result.status === 201) {
        handleClick();
        getProjectApi();
        toast.success("Project successfully created");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className='bg-white w-[500px] pb-4'>
      <div className='flex items-center justify-between px-3 py-3'>
        <h2 className='text-sm'>Add Project</h2>
      </div>
      <form className='px-4 ' onSubmit={submitHandler}>
        <div className='flex gap-4'>
          <div className='w-full'>
            <label htmlFor='title' className='text-xs'>Title</label>
            <input
              id="title"
              name="title"
              value={payload.title}
              onChange={handleChange}
              className='w-full border py-2 px-2 rounded-sm' />
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <div className='w-1/2'>
            <label htmlFor='title' className='text-xs'>Due Date<span className='text-red-500'>*</span></label>
            <input type='date'
              id="due_date"
              value={payload.due_date}
              name='due_date'
              onChange={handleChange}
              className='w-full border py-2 px-2 rounded-sm' />
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
        <div className="flex flex-col">
          <label>Description</label>
          <textarea onChange={handleChange} name="description" value={payload.description} className='border '></textarea>
        </div>
        <div className='flex justify-end gap-4 mr-4'>
          <button className='bg-red-100  text-red-400 mt-4 rounded-sm py-2  px-2' onClick={handleClick}>Close</button>
          <button type="submit" className='bg-blue-400 mt-4 rounded-sm py-2 text-white px-2'>Save Data</button>
        </div>
      </form>
    </div>
  );
}

export default CreateProject;
