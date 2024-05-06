import React from 'react';
import icon from '../../assets/user.png';
import { downloadFile } from '../../utils/comment';
import { formattedDate } from '../../utils/formatDate';

const CommentList = ({ Comments, loading }) => {
    console.log("comments", Comments)

    const getFileExtension = (filename) => {
        return filename.split('.').pop();
    };

    const handleDownload = (fileUrl, fileName) => {
        // Ensure the file extension is preserved
        const fileExtension = getFileExtension(fileName);
        downloadFile(fileUrl, fileName, fileExtension); // Pass the file extension to the download function
    };

    return (
        <div className='px-2 mt-10'>
            <h2 className='flex justify-center items-center h-16 text-md font-bold bg-white text-[#a748f6]'>All CommentList</h2>
            {loading && <div>Loading...</div>}
            {Comments?.map((comment, index) => (
                <div className='mt-5 bg-white' key={index}>
                    <div className='flex gap-4 px-5 items-center h-10 bg-white'>
                        <img src={icon} width={20} height={20} className='rounded-full' />
                        <div className='flex justify-between w-full items-center'>
                            <h4 className='text-md font-bold whitespace-nowrap text-[#a748f6]'>
                                {comment?.user?.first_name} {comment?.user?.last_name}
                            </h4>
                            <h5 className='text-xs whitespace-nowrap text-[#a748f6]'>{formattedDate(comment?.created_at)}</h5>
                        </div>
                    </div>
                    <p className='pl-10'>{comment?.content}</p>
                    {comment.files && (
                        <div className="flex gap-1 items-center">
                            <h5 className="text-sm font-semibold px-10">Attachments:</h5>
                            <ul className="file-list">
                                <li>
                                    <button className="text-blue-500" onClick={() => handleDownload(comment.files, comment.files.split("/").pop())}>
                                        Download {comment.files.split("/").pop()}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CommentList;
