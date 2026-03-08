import { create } from 'zustand';
import api from '../services/api';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  fetch: async () => {
    try {
      const { data } = await api.get('/notifications');
      set({
        notifications: data.notifications,
        unreadCount: data.notifications.filter((n) => !n.isRead).length,
      });
    } catch (e) {
      // silent fail
    }
  },

  markAllRead: async () => {
    try {
      await api.patch('/notifications/read-all');
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (e) {
      // silent fail
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));

export default useNotificationStore;
