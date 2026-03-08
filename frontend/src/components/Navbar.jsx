import React, { useState } from "react";
import logo from '../assets/logo.svg';
import userAvatar from '../assets/user_avatar.svg';
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import NotificationBell from "./notifications/NotificationBell";
import { FiShoppingBag, FiAward, FiAlertCircle, FiClipboard, FiBarChart2, FiBriefcase, FiCompass } from 'react-icons/fi';

const exploreLinks = [
  { label: 'Marketplace', path: '/marketplace', desc: 'Buy eco-friendly civic goods', Icon: FiShoppingBag },
  { label: 'Rewards', path: '/rewards', desc: 'Earn points for reports', Icon: FiAward },
  { label: 'SOS Center', path: '/sos', desc: 'Emergency alert system', Icon: FiAlertCircle },
  { label: 'Volunteer Board', path: '/volunteer/tasks', desc: 'Join civic action tasks', Icon: FiClipboard },
  { label: 'Impact Dashboard', path: '/impact', desc: 'City-wide analytics', Icon: FiBarChart2 },
  { label: 'NGO Portal', path: '/ngo/dashboard', desc: 'Manage NGO cases', Icon: FiBriefcase, requiresRole: ['ngo', 'admin'] },
];

const NavItem = ({ children, isRoute, path }) => (
  <div className="relative group flex items-center justify-center px-5 h-[46.75px] cursor-pointer">
    <span className="absolute inset-0 bg-[#F5F1E4] rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400 ease-[cubic-bezier(0.17,0.67,0.3,1.33)] z-0" />
    <div className="relative z-10 flex items-center gap-1.5">
      {isRoute
        ? <Link to={path} className="text-[16px] font-medium text-[#2C2E2A] whitespace-nowrap">{children}</Link>
        : <a href={path} className="text-[16px] font-medium text-[#2C2E2A] whitespace-nowrap">{children}</a>
      }
    </div>
  </div>
);

const Navbar = ({ onOpenReport }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileExploreOpen, setIsMobileExploreOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const visibleExploreLinks = exploreLinks.filter(link => {
    if (link.requiresRole) return user && link.requiresRole.includes(user.role);
    return true;
  });

  return (
    <>
      {/* ── Desktop ── */}
      <nav className="hidden lg:block w-full fixed top-6 left-0 z-50 px-6 font-sans">
        <div className="mx-auto flex items-stretch justify-between h-17 gap-4 max-w-[1400px]">

          {/* Main pill */}
          <div className="flex items-center grow shadow-sm bg-white rounded-[10px] pl-4 pr-3 h-full overflow-visible">
            <Link to="/" className="flex items-center gap-2 group mr-4 shrink-0">
              <img src={logo} alt="LifeLine" className="h-7 w-auto" />
              <span className="text-[18px] font-semibold text-[#1a1a1a] tracking-normal">LifeLine</span>
            </Link>

            <div className="flex items-center gap-0 flex-1 flex-wrap">
              <NavItem path="/" isRoute>Home</NavItem>
              <NavItem path="#mission">Mission</NavItem>
              <NavItem path="#reports">Community</NavItem>
              <NavItem path="#map">Map</NavItem>
              {/* Explore dropdown */}
              <div className="relative group flex items-center justify-center px-5 h-[46.75px] cursor-pointer">
                <span className="absolute inset-0 bg-[#8ED462] rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400 ease-[cubic-bezier(0.17,0.67,0.3,1.33)] z-0" />
                <div className="relative z-10 flex items-center gap-1">
                  <span className="text-[16px] font-semibold text-[#2C2E2A] whitespace-nowrap group-hover:text-[#0b3b08]">
                    Explore ▾
                  </span>
                </div>
                {/* Dropdown panel */}
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                  {visibleExploreLinks.map(({ Icon: ExploreIcon, label, path, desc }) => (
                    <Link
                      key={path}
                      to={path}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-[#F5F1E4] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F5F5F2] flex items-center justify-center shrink-0 mt-px">
                        <ExploreIcon size={16} className="text-[#1a1a1a]" />
                      </div>
                      <div>
                        <span className="text-[15px] font-medium text-[#1a1a1a] block">{label}</span>
                        <span className="text-[12px] text-stone-400 mt-0.5 block">{desc}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {user?.role === 'admin' && (
                <NavItem path="/dashboard" isRoute>Dashboard</NavItem>
              )}
            </div>

            {/* Right side: notification bell + auth button */}
            <div className="flex items-center gap-2 ml-2 shrink-0">
              {user && <NotificationBell />}
              <div className="relative group flex items-center justify-center px-5 h-10 cursor-pointer">
                <span className="absolute inset-0 bg-[#1a1a1a] rounded-full transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:bg-black" />
                <span className="relative z-10 text-[15px] font-medium text-white">
                  {user
                    ? <button onClick={logout}>Logout</button>
                    : <Link to="/login">Login</Link>
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Report Issue button */}
          <div
            className="flex items-center justify-between shadow-sm shrink-0 relative overflow-hidden group cursor-pointer bg-white rounded-[10px] h-full min-w-44"
            onClick={onOpenReport}
          >
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-black rounded-full transition-all duration-250 ease-[cubic-bezier(0.5,0,0,1)] w-10 h-10 group-hover:right-0 group-hover:w-full group-hover:h-full group-hover:rounded-[10px] z-0" />
            <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center justify-between w-full h-full px-2.5 z-10 relative">
              <span className="text-[#1a1a1a] text-[16px] font-medium ml-2 relative z-10 transition-colors duration-400 group-hover:text-white">
                Report Issue
              </span>
              <div className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden relative z-10 pointer-events-none">
                <img src={user?.avatar ?? userAvatar} alt="User" className="w-full h-full object-cover" />
              </div>
            </a>
          </div>
        </div>
      </nav>

      {/* ── Mobile ── */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ease-in-out font-sans ${isMobileMenuOpen ? 'bg-[#8ED462] pointer-events-auto' : 'bg-transparent pointer-events-none h-auto'}`}>
        <div className="flex flex-col p-4 pointer-events-auto">

          {/* Top bar */}
          <div className="bg-white rounded-[10px] shadow-sm px-3 py-2 flex items-center justify-between min-h-[61px]">
            <Link to="/" className="flex items-center gap-2 pl-1">
              <img src={logo} alt="LifeLine" className="h-6 w-auto" />
              <span className="text-[18px] font-semibold text-[#1a1a1a]">LifeLine</span>
            </Link>
            <div className="flex items-center gap-2">
              {user && <NotificationBell />}
              <button
                onClick={onOpenReport}
                className="bg-[#F5F1E4] hover:bg-[#ebe5d5] text-[#1a1a1a] px-4 py-2 rounded-lg text-[15px] font-medium transition-colors"
              >
                Report
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 rounded-full bg-[#8ED462] text-[#0b3b08] flex items-center justify-center transition-colors shadow-sm"
              >
                {isMobileMenuOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Main links */}
          <div className={`transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden ${isMobileMenuOpen ? 'max-h-[600px] opacity-100 mt-1' : 'max-h-0 opacity-0 mt-0'}`}>
            <div className="bg-white rounded-[10px] shadow-sm flex flex-col py-2">
              {[
                { label: 'Home', path: '/', isRoute: true },
                { label: 'Our Mission', path: '#mission', isRoute: false },
                { label: 'Community Feed', path: '#reports', isRoute: false },
                { label: 'Impact Map', path: '#map', isRoute: false },
              ].map((item, i, arr) => (
                item.isRoute
                  ? <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`px-5 py-3 text-[17px] font-medium text-[#1a1a1a] hover:bg-gray-50 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>{item.label}</Link>
                  : <a key={item.path} href={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`px-5 py-3 text-[17px] font-medium text-[#1a1a1a] hover:bg-gray-50 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>{item.label}</a>
              ))}

              {/* Explore section toggle */}
              <button
                onClick={() => setIsMobileExploreOpen(!isMobileExploreOpen)}
                className="px-5 py-3 text-[17px] font-semibold text-[#0b3b08] bg-[#F0FAE8] hover:bg-[#e4f5d8] flex items-center justify-between border-t border-gray-100"
              >
                <span className="flex items-center gap-2"><FiCompass size={16} />Explore Features</span>
                <span>{isMobileExploreOpen ? '▲' : '▼'}</span>
              </button>

              {isMobileExploreOpen && visibleExploreLinks.map(({ Icon: ExploreIcon, label, path }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-5 py-3 text-[16px] font-medium text-[#2C2E2A] hover:bg-[#F5F1E4] border-b border-gray-50 last:border-0 flex items-center gap-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#F5F5F2] flex items-center justify-center shrink-0">
                    <ExploreIcon size={15} className="text-[#1a1a1a]" />
                  </div>
                  {label}
                </Link>
              ))}

              {user?.role === 'admin' && (
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-3 text-[17px] font-medium text-[#5c8a00] border-t border-gray-100 hover:bg-gray-50">
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Auth pill */}
          <div className={`transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] delay-75 overflow-hidden ${isMobileMenuOpen ? 'max-h-[100px] opacity-100 mt-1' : 'max-h-0 opacity-0 mt-0'}`}>
            <div className="bg-[#1a1a1a] rounded-[10px] shadow-sm px-5 py-3 flex items-center justify-between group cursor-pointer">
              <span className="text-[18px] font-medium text-white">
                {user
                  ? <button onClick={() => { logout(); setIsMobileMenuOpen(false); }}>Logout</button>
                  : <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                }
              </span>
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center overflow-hidden group-hover:bg-white/20 transition-colors">
                <img src={user?.avatar ?? userAvatar} alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute inset-0 z-[-1]" onClick={() => setIsMobileMenuOpen(false)} />
        )}
      </div>
    </>
  );
};

export default Navbar;
