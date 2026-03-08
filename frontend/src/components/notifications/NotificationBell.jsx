import { useState, useRef, useEffect } from 'react';
import useNotifications from '../../hooks/useNotifications';
import { FiBell, FiFileText, FiMessageSquare, FiThumbsUp, FiAlertOctagon, FiUsers, FiAward, FiInfo } from 'react-icons/fi';

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const TYPE_ICON = {
    REPORT_STATUS: <FiFileText size={18} />,
    COMMENT: <FiMessageSquare size={18} />,
    UPVOTE: <FiThumbsUp size={18} />,
    SOS_ALERT: <FiAlertOctagon size={18} className="text-red-500" />,
    NGO_ASSIGNMENT: <FiUsers size={18} />,
    REWARD: <FiAward size={18} />,
    SYSTEM: <FiInfo size={18} />,
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen((o) => !o); if (!open && unreadCount > 0) markAllRead(); }}
        className="relative p-2 rounded-lg hover:bg-stone-100 transition-colors"
        title="Notifications"
      >
        <FiBell size={20} className="text-[#1a1a1a]" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-0.5 font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200">
            <span className="font-semibold text-sm text-[#1a1a1a]">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-[#339966] hover:text-[#2b8056]">Mark all read</button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-stone-400 text-sm py-8">No notifications</p>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <div key={n._id} className={`px-4 py-3 border-b border-stone-100 hover:bg-stone-50 transition-colors ${!n.isRead ? 'bg-[#f0fae8]' : ''}`}>
                  <div className="flex gap-3">
                    <span className="text-[#8ED462] flex-shrink-0 mt-0.5">{TYPE_ICON[n.type] || <FiInfo size={18} />}</span>
                    <div className="min-w-0">
                      <p className="text-sm text-[#1a1a1a] font-medium">{n.title}</p>
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-stone-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                    {!n.isRead && <span className="w-2 h-2 bg-[#8ED462] rounded-full mt-1.5 flex-shrink-0"></span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
