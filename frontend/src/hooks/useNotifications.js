import { useEffect } from 'react';
import useNotificationStore from '../store/notificationStore';
import { getSocket } from './useSocket';

const useNotifications = () => {
  const { fetch, addNotification, notifications, unreadCount, markAllRead } = useNotificationStore();

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNew = (notification) => addNotification(notification);
    socket.on('new_notification', handleNew);
    return () => socket.off('new_notification', handleNew);
  }, []);

  return { notifications, unreadCount, markAllRead, refresh: fetch };
};

export default useNotifications;
