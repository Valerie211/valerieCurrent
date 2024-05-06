import React, { useState, useEffect } from 'react';
import Reflection from '../components/Reflections/Reflection';
import EditReflectionForm from '../components/Reflections/EditReflection';
import { IoMdSearch } from "react-icons/io";
import { getReflectionApi, removeReflectionApi } from '../utils/reflection';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const ReflectionScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [filterMood, setFilterMood] = useState('');
  const { id } = useParams();

  const getReflections = async () => {
    setLoading(true);
    try {
      const result = await getReflectionApi(id);
      console.log(result);
      if (result.status === 200) {
        setData(result?.data?.reflects);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getReflections();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete?");
    if (!confirmed) return;
    try {
      const result = await removeReflectionApi(id);
      if (result.status === 204) {
        toast.success("Successfully deleted");
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleModal = (task) => {
    setSelectedReflection(task);
    setIsOpen(!isOpen);
  };

  const filteredData = data.filter((task) => {
    if (!filterMood) return true;
    return task.mood.toLowerCase() === filterMood.toLowerCase();
  });

  return (
    <div className='relative w-full'>
      <div>
        <h2 className='px-4 text-center text-lg font-bold mt-4'>Reflections</h2>
        {/* <div className='bg-[#fcfcfc] w-96 justify-between flex rounded-full mt-4 shadow-sm mx-auto'>
          <input type='search' placeholder='Search by project' className='py-2 text-center rounded-full px-2 outline-none' />
          <button className='text-black flex justify-center rounded-sm px-3 py-2 '><IoMdSearch size={24} /></button>
        </div> */}
        <div className=" p-4">
        <label className="block mb-2">Filter by mood:</label>
        <select value={filterMood} onChange={(e) => setFilterMood(e.target.value)} className="px-3 py-2 rounded border">
          <option value="">All</option>
          <option value="Satisfied">Satisfied</option>
          <option value="Stressed/Frustrated">Stressed/Frustrated</option>
          <option value="Mixed Feelings/Neutral">Mixed Feelings/Neutral</option>
          <option value="Calm/Relieved">Calm/Relieved</option>
        </select>
      </div>
        <div className='mt-5 px-4 flex flex-wrap justify-evenly gap-4'>
          {filteredData.length > 0 ? (
            filteredData.map((task) => (
              <Reflection key={task.id} title={task.task_title} created_at={task.mood} handleDelete={() => handleDelete(task.id)} tasks={task.whatContributedMost} openForm={() => handleModal(task)} />
            ))
          ) : (
            <p className='text-black'>No data available</p>
          )}
          {loading && (<p>Loading...</p>)}
        </div>
      </div>
      {isOpen && (
        <div className='flex bg-opacity-30 bg-black backdrop-blur-sm justify-center absolute border-black overflow-scroll h-auto w-full px-4 z-10 flex-end top-0'>
          <EditReflectionForm openForm={() => setIsOpen(!isOpen)} getReflections={getReflections} reflectionData={selectedReflection} />
        </div>
      )}
      
    </div>
  );
}

export default ReflectionScreen;
