import { useEffect, useState } from 'react';
import Reflection from '../components/Reflections/Reflection';
import EditReflectionForm from '../components/Reflections/EditReflection';
import { IoMdSearch } from "react-icons/io";
import { toast } from 'react-toastify';
import { getReflectionApi } from '../utils/reflection';
import { useParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"

const ReflectionForManagerScreen = () => {
  const user = jwtDecode(JSON.parse(localStorage.getItem("token")))

  const [filterMood, setFilterMood] = useState('');
  const {id} = useParams()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedReflection, setSelectedReflection] = useState(null);


  const getReflections = async () => {
    setLoading(true)
    try {
      console.log("it's working",id)
      const result = await getReflectionApi(id)
      console.log("result---->",result)
      if (result.status === 200) {
        
        setData(result?.data?.reflects)
        setLoading(false)
      }
      console.log("it should work")
    } catch (error) {
      toast.error(error)
    }
  }

  useEffect(() => {
    getReflections(id)
  }, [id])
 
  const handleModal = (tas) => {
    setSelectedReflection(tas);
    setIsOpen(!isOpen);
  };
  const filteredData = data.filter((task) => {
    if (!filterMood) return true;
    return task.mood.toLowerCase() === filterMood.toLowerCase();
  });

  console.log("data======>234567890", data)
  return (
    <div className='relative w-full'>
      <div>
        <h2 className='px-4 text-center text-lg font-bold mt-4'>Reflections</h2>
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
          {filteredData?.length > 0 && 
          filteredData?.map((reflect,i)=>{
          return <Reflection key={reflect.id} title={reflect?.task_title} created_at={reflect?.mood} tasks={reflect?.mood} openForm={()=>handleModal(reflect)} />})}
          {
            loading && <p>Loading...</p>
          }
          {
            data?.length === 0 && <p>No reflection data available</p>
          }
        </div>
      </div>
      {
        isOpen && <div className='flex bg-opacity-30 bg-black backdrop-blur-sm justify-center absolute border-black overflow-scroll h-auto w-full px-4  z-10 flex-end  top-0'>
          <EditReflectionForm openForm={handleModal} reflectionData={selectedReflection} />
        </div>
      }
    </div>
  );
}

export default ReflectionForManagerScreen;
