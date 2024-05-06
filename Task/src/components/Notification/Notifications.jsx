import React from 'react';
import { toast } from 'react-toastify';
import icon from '../../assets/user.png';
import { formattedDate } from '../../utils/formatDate';
import { getTime } from '../../utils/getTime';

const Notifications = ({ message, created_at, notification_id, read, markAsRead }) => {
  const markRead = async (id) => {
    markAsRead(id);
    try {
      // Update notification status as read in the backend
      // const response = await createNotificationApi(id);
      // if (response.status === 200) {
      //   toast.success(response?.data?.message);
      // }
    } catch (error) {
      toast.error("An error occurred while marking notification as read.");
    }
  };

  return (
    <div
      onClick={() => markRead(notification_id)}
      className={`mt-10 cursor-pointer bg-${read ? 'black' : 'gray-400'}`}
      key={notification_id}
    >
      <div className='mt-5'>
        <div className='flex gap-4 px-5 items-center h-20 bg-white'>
          <img src={icon} width={20} className='rounded-full'/>
          <div className='flex justify-between w-full items-center whitespace-nowrap'>
            <p className='text-md text-sm font-bold text-wrap text-[#a748f6]'>{message}</p>
            <p className='text-xs whitespace-nowrap text-[#a748f6]'>{formattedDate(created_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
