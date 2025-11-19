import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from '../utils/ThemeContext';
import { useProfile } from "../utils/ProfileContext";
import { API_BASE_URL } from "../utils/api";

export default function Home(){
    // const [profilePic, setProfilePic] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();
    const { profilePic, isGuest, setIsGuest} = useProfile();

    const navigate = useNavigate();

    async function handleLogout(){
        try{
            const res = await fetch(`${API_BASE_URL}/logout`,
                {
                    method: 'POST',
                    headers: {'Content-Type' : 'application/json'},
                    credentials: 'include'   
                }
            );
            if(!res.ok){
                throw new Error();
            }
            const data = await res.json();
            console.log(data.message);
            setIsGuest(false);
            navigate('/');
        }catch(e){
            console.log(e);
        }
    }

  function sidebarMenu() {
  setSidebarOpen(!sidebarOpen);
}
      
// Add this state at the top of your component
// const [isDarkMode, setIsDarkMode] = useState(true);
return (
  <>
    {/* Main Header */}
    <div className={`${isDarkMode 
      ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-b-2 border-orange-300' 
      : 'bg-gradient-to-r from-orange-100 to-orange-200 border-b-2 border-orange-600'
    } shadow-xl p-4 sticky top-0 z-10 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Left: Create Post & People */}
        <div className="flex items-center space-x-4">
          {/* Create Post */}
          {isGuest ? (
            <div className="flex items-center space-x-3">
              <span className={`${isDarkMode ? 'text-orange-300' : 'text-orange-700'} text-3xl font-bold opacity-50 cursor-not-allowed`}>
                ➕
              </span>
              <span className={`${isDarkMode ? 'text-orange-300' : 'text-orange-700'} font-bold text-xl opacity-50 cursor-not-allowed`}>
                Create Post
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <NavLink 
                to='/home/createPost' 
                className={`${isDarkMode 
                  ? 'text-orange-300 hover:text-orange-400' 
                  : 'text-orange-700 hover:text-orange-800'
                } text-3xl font-bold transition-all duration-300 transform hover:scale-110 drop-shadow-sm`}
              >
                ➕
              </NavLink>
              <NavLink 
                to='/home/createPost' 
                className={`${isDarkMode 
                  ? 'text-orange-300 hover:text-orange-400' 
                  : 'text-orange-700 hover:text-orange-800'
                } font-bold text-xl hover:underline transition-all duration-300 drop-shadow-sm`}
              >
                Create Post
              </NavLink>
            </div>
          )}

          {/* People Link */}
          <NavLink 
            to='strangers' 
            className={`${isDarkMode 
              ? 'text-orange-300 hover:text-orange-400' 
              : 'text-orange-700 hover:text-orange-800'
            } font-bold text-lg hover:underline transition-all duration-300 drop-shadow-sm hidden sm:block`}
          >
            People 🕵️‍♀️
          </NavLink>
        </div>
      
        <div className="text-center flex-1">
          <NavLink 
            to='/home' 
            className={`transition-all duration-300 drop-shadow-lg group`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="flex items-center space-x-1">
                {/* Dark Mode: Softer but readable | Light Mode: Stronger gradient */}
                <span className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r 
                  ${isDarkMode 
                    ? 'from-orange-300 via-pink-400 to-red-400'  // lighter gradient in dark mode
                    : 'from-orange-500 via-red-600 to-pink-600' // stronger gradient in light mode
                  } bg-clip-text text-transparent`}>
                  Insta
                </span>
                <span className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r 
                  ${isDarkMode 
                    ? 'from-orange-300 via-pink-400 to-red-400'
                    : 'from-orange-500 via-red-600 to-pink-600'
                  } bg-clip-text text-transparent`}>
                  Chat
                </span>
                <span className="text-3xl transform group-hover:rotate-12 transition-transform duration-300">
                  💬
                </span>
              </span>
            </div>
          </NavLink>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">

          {/* Messages */}
          <div className="relative">
            <NavLink
              to="message"
              className={`${isDarkMode 
                ? 'bg-gray-700 text-orange-300 hover:text-orange-400 hover:bg-gray-600 border-orange-300 hover:border-orange-400' 
                : 'bg-white text-orange-700 hover:text-orange-800 hover:bg-orange-50 border-orange-600 hover:border-orange-700'
              } shadow-md px-4 py-3 rounded-full text-lg font-semibold border-2 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2`}
              title="Messages"
            >
              <span className="text-2xl">💬</span>
              <span className="hidden sm:inline">Messages</span>
            </NavLink>
            {/* Notification Dot */}
            <span className={`absolute -top-1 -right-1 w-4 h-4 ${
              isDarkMode ? 'bg-orange-400 border-gray-800' : 'bg-red-500 border-white'
            } rounded-full border-2 animate-pulse`}></span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => toggleTheme(!isDarkMode)}
            className={`${isDarkMode 
              ? 'bg-gray-700 text-orange-300 hover:bg-gray-600 border-orange-300 hover:border-orange-400' 
              : 'bg-white text-orange-700 hover:bg-orange-50 border-orange-600 hover:border-orange-700'
            } p-2 rounded-full text-2xl border-2 transition-all duration-300 transform hover:scale-110 shadow-md`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>

          {/* Profile Pic */}
          {profilePic && (
            <NavLink to='profile' className="hover:scale-105 transition-all duration-300 transform">
              <img
                src={`${profilePic}`}
                alt="profile"
                className={`w-12 h-12 rounded-full border-2 ${isDarkMode 
                  ? 'border-orange-300 hover:border-orange-400' 
                  : 'border-orange-600 hover:border-orange-700'
                } object-cover transition-all duration-300 shadow-md`}
              />
            </NavLink>
          )}

          {/* Hamburger Menu */}
          <div 
            onClick={sidebarMenu} 
            className={`${isDarkMode 
              ? 'text-orange-300 hover:text-orange-400' 
              : 'text-orange-700 hover:text-orange-800'
            } text-2xl font-bold cursor-pointer transition-all duration-300 drop-shadow-sm`}
          >
            ☰
          </div>

          {/* Sidebar */}
          {sidebarOpen && (
            <div className={`fixed top-0 right-0 w-80 h-full ${isDarkMode 
              ? 'bg-gray-800 border-l-2 border-orange-300' 
              : 'bg-white border-l-2 border-orange-600'
            } shadow-2xl z-50 p-6 transition-all duration-300 transform translate-x-0`}>
              
              {/* Close Button */}
              <button 
                onClick={sidebarMenu} 
                className={`${isDarkMode 
                  ? 'text-orange-300 hover:text-orange-400' 
                  : 'text-orange-700 hover:text-orange-800'
                } text-2xl float-right transition-all duration-300 p-2`}
              >
                ✕
              </button>

              {/* Sidebar Content */}
              <div className="mt-16 flex flex-col space-y-4">
                
                {/* Theme Toggle in Sidebar */}
                <div className={`p-4 rounded-lg border-2 ${isDarkMode 
                  ? 'bg-gray-700 border-orange-300' 
                  : 'bg-orange-50 border-orange-600'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`${isDarkMode ? 'text-orange-300' : 'text-orange-700'} font-semibold text-lg`}>
                      Theme
                    </span>
                    <button
                      onClick={() => toggleTheme(!isDarkMode)}
                      className={`${isDarkMode 
                        ? 'bg-gray-600 text-orange-300 hover:bg-gray-500 border-orange-300 hover:border-orange-400' 
                        : 'bg-orange-200 text-orange-800 hover:bg-orange-300 border-orange-600 hover:border-orange-700'
                      } px-4 py-2 rounded-lg border-2 transition-all duration-300 font-medium`}
                    >
                      {isDarkMode ? '🌞 Light' : '🌙 Dark'}
                    </button>
                  </div>
                </div>

                {/* Profile Link */}
                <NavLink 
                  to='profile' 
                  onClick={sidebarMenu} 
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg border-2 shadow-md transition-all duration-300 font-semibold text-lg ${isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-orange-300 border-orange-300 hover:border-orange-400' 
                    : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-600 hover:border-orange-700'
                  }`}
                >
                  <span>👤</span>
                  <span>Your Profile</span>
                </NavLink>

                {/* Friends Link */}
                <NavLink 
                  to='friends' 
                  onClick={sidebarMenu} 
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg border-2 shadow-md transition-all duration-300 font-semibold text-lg ${isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-orange-300 border-orange-300 hover:border-orange-400' 
                    : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-600 hover:border-orange-700'
                  }`}
                >
                  <span>🤝</span>
                  <span>Your Friends</span>
                </NavLink>

                {/* Find People Link (Mobile Only) */}
                <NavLink 
                  to='strangers' 
                  onClick={sidebarMenu} 
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg border-2 shadow-md transition-all duration-300 font-semibold text-lg sm:hidden ${isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-orange-300 border-orange-300 hover:border-orange-400' 
                    : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-600 hover:border-orange-700'
                  }`}
                >
                  <span>🕵️‍♀️</span>
                  <span>Find People</span>
                </NavLink>

                {/* Logout Button */}
                <button 
                  onClick={() => {
                    sidebarMenu();
                    handleLogout();
                  }} 
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg border-2 shadow-md transition-all duration-300 font-semibold text-lg ${isDarkMode 
                    ? 'bg-gray-700 hover:bg-red-600 text-red-400 hover:text-white border-red-400 hover:border-red-500' 
                    : 'bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border-red-400 hover:border-red-500'
                  }`}
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Guest Access Notice */}
    {isGuest && (
      <div className={`p-4 shadow-lg border-b-2 ${isDarkMode 
        ? 'bg-gradient-to-r from-orange-400 to-red-400 border-orange-300' 
        : 'bg-gradient-to-r from-orange-200 to-red-200 border-orange-600'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-3 text-gray-900">
            <span className="text-xl">⚠️</span>
            <p className="font-semibold text-base text-center">
              <strong>Guest Mode:</strong> You have read-only access. 
              <span className="hidden sm:inline"> Sign up to post, comment, and interact with friends!</span>
              <span className="sm:hidden"> Sign up for full access!</span>
            </p>
          </div>
        </div>
      </div>
    )}

    {/* Main Content Area */}
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode 
      ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
      : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      <Outlet />
    </div>
  </>
);
}