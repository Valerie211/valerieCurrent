import React, { useState, useEffect } from 'react';
import { FaPaperclip } from 'react-icons/fa';
import { createCommentApi } from '../../utils/comment';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";

const TaskDetailCommentSection = ({ getComments }) => {
  const { id } = useParams();
  const [user, setUser] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
console.log("file",file)
  useEffect(() => {
    // Update user state from localStorage when component mounts
    const userData = jwtDecode(JSON.parse(localStorage.getItem("token")));
    if (userData) {
      setUser(userData.user_id);
    }
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', content);
    formData.append('task', id);
    formData.append('user', user);
    formData.append('file', file);
const data = formData.get(file)
console.log("form",data);
    try {
      const result = await createCommentApi(formData, id);
      if (result) {
        getComments();
        toast.success("Successfully created");
        setContent("");
        setFile(null);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'content') {
      setContent(value);
    }
  };

  return (
    <div className="task-detail-comment-section mt-4">
      <textarea
        className="comment-input w-full px-4 py-2 border rounded-md resize-none focus:outline-none focus:border-blue-500"
        value={content}
        name='content'
        onChange={handleChange}
        placeholder="Add a comment..."
        rows={4}
        cols={50}
      />
      
      <button type="button" onClick={handleSubmit} className="submit-button mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">Submit</button>
    </div>
  );
};

export default TaskDetailCommentSection;
