import React, { useEffect, useState } from 'react';
import Notifications from '../components/Notification/Notifications';
import { getAllNotificationApi, createNotificationApi } from '../utils/notification';
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";

const NotificationsScreen = () => {
  const userData = jwtDecode(JSON.parse(localStorage.getItem("token")));
  console.log("user",userData.user_id)
  const [notifications, setNotificationData] = useState([]);

  const fetchNotifications = async () => {
    try {
      const result = await getAllNotificationApi();
      console.log("result", result);
      if (result.status === 200) {
        const newNotification = result.data.filter(item => item.recipient === userData.user_id);
        console.log("newNotification", newNotification);
        setNotificationData(newNotification);
      }
    } catch (error) {
      toast.error("An error occurred while fetching notifications.");
    }
  };

  useEffect(() => {
    // Fetch notifications on component mount.
    fetchNotifications();
  }, []);

  const markNotificationAsRead = async (id) => {
    try {
      const response = await createNotificationApi(id);
      if (response.status === 200) {
        toast.success(response.data.message);
        // Mark the notification as read in the local state
        setNotificationData(prevState =>
          prevState.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
      }
    } catch (error) {
      toast.error("An error occurred while marking notification as read.");
    }
  };

  return (
    <div className='mt-8'>
     <h2 className='flex justify-center items-center h-20 text-lg font-bold bg-white   text-[#a748f6]'>All Notifications</h2>
      {/* Check if notifications array exists and has elements */}
      {notifications && notifications.length > 0 && notifications.map(item => (
        <Notifications
          key={item.id}
          notification_id={item.id}
          read={item.read}
          message={item.message}
          created_at={item.created_at}
          markAsRead={markNotificationAsRead}
        />
      ))}
    </div>
  );
}

export default NotificationsScreen;
