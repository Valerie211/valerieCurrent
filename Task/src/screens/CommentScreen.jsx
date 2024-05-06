
import { useEffect, useState } from 'react';
import CommentList from '../components/Comments/CommentList';
import TaskDetailCommentSection from '../components/Comments/Comments';
import TasksDetails from '../components/Comments/TasksDetails';
import { toast } from 'react-toastify';
import { getAllCommentsApi } from '../utils/comment';
import { useParams } from 'react-router-dom';

const CommentScreen = () => {
  const {id}= useParams()
  const [loading,setLoading] = useState(false)
  const [comments,setComments] = useState([])
  const getComments =async()=>{
    setLoading(true)
    try {
      const result = await getAllCommentsApi(id)
      console.log("result")
      if(result.status === 200){
        setLoading(false)
        setComments(result?.data)
      }
    } catch (error) {
      toast.error(error)
    }
  }
  useEffect(()=>{
getComments()
  },[])
  return (
    <div className=' py-4 mt-5'>
        <TasksDetails />
      <TaskDetailCommentSection getComments={getComments}/>
      <CommentList Comments= {comments}   loading={loading} />
    </div>
  );
}

export default CommentScreen;
