import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useTheme } from '../utils/ThemeContext';
import { API_BASE_URL } from "../utils/api";

export default function Message(){
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    useEffect(
        () => {
            const getUsers = async () => {
                try{
                const res = await fetch(`${API_BASE_URL}/home`,
                    {
                        method: 'GET',
                        'credentials': 'include'
                    }
                );
                if(!res.ok){
                    throw new Error();
                }
                const data = await res.json();
                setUsers(data.messageFriends);
                }catch(e){
                    console.log(e);
                }
            };
            getUsers();
        }, []);
        
return (
    <div className={`${isDarkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    } min-h-screen flex justify-center p-4 transition-all duration-300`}>
      <div className="max-w-2xl w-full space-y-6">
        
        {/* Header */}
        <div className={`${isDarkMode 
            ? 'bg-gray-800 border-orange-200' 
            : 'bg-white border-orange-400'
        } rounded-xl shadow-xl p-6 border-2 text-center hover:shadow-2xl transition-all duration-300`}>
          <div className="flex items-center justify-center space-x-3 mb-2">
            <span className="text-3xl">💬</span>
            <h2 className={`${isDarkMode ? 'text-orange-300' : 'text-orange-800'} text-2xl font-bold`}>
              Messages
            </h2>
          </div>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            Connect and chat with your friends
          </p>
        </div>

        {/* Friends List */}
        {users.length !== 0 ? (
          <div className={`${isDarkMode 
              ? 'bg-gray-800 border-orange-200' 
              : 'bg-white border-orange-400'
          } rounded-xl shadow-xl p-6 border-2 hover:shadow-2xl transition-all duration-300`}>
            <h3 className={`${isDarkMode ? 'text-orange-300' : 'text-orange-800'} font-bold text-lg mb-4 flex items-center`}>
              <span className="mr-2">👥</span>
              Your Conversations ({users.length})
            </h3>
            <div className="space-y-4">
              {users.map((user) => (
                <div 
                  key={user.id} 
                  onClick={() => navigate(`/home/message/${user.id}`)} 
                  className={`${isDarkMode 
                      ? 'bg-gray-700 border-orange-200 hover:bg-gray-600 hover:border-orange-300' 
                      : 'bg-orange-50 border-orange-300 hover:bg-orange-100 hover:border-orange-400'
                  } rounded-lg p-4 border-2 transition-all duration-300 cursor-pointer group`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar with online indicator */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <span className="text-gray-900 font-bold text-lg">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                      )}
                      {user.unreadCount > 0 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {user.unreadCount > 9 ? '9+' : user.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Message content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <strong className={`${isDarkMode ? 'text-orange-300' : 'text-orange-700'} font-bold text-lg group-hover:text-orange transition-colors duration-300`}>
                          {user.username}
                        </strong>
                        {/* <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs group-hover:text-gray-300 transition-colors duration-300`}>
                          {formatTime(user.lastMessageTime)}
                        </span> */}
                      </div>
                    </div>

                    {/* Chat arrow */}
                    <div className={`${isDarkMode ? 'text-orange-300' : 'text-orange-600'} group-hover:text-orange-200 group-hover:translate-x-1 transition-all duration-300`}>
                      <span className="text-xl">💬</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`${isDarkMode 
              ? 'bg-gray-800 border-orange-200' 
              : 'bg-white border-orange-400'
          } rounded-xl shadow-xl p-8 border-2 text-center hover:shadow-2xl transition-all duration-300`}>
            <div className="mb-6">
              <div className="w-20 h-20 bg-orange-300 rounded-full flex items-center justify-center mx-auto mb-4 opacity-75">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className={`${isDarkMode ? 'text-orange-100' : 'text-orange-900'} text-xl font-semibold mb-3`}>
                No friends to message yet
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base leading-relaxed mb-4`}>
                To message a friend, you and your friend must accept each other's friend request.
              </p>
              <div className={`${isDarkMode 
                  ? 'bg-gray-700 border-orange-400' 
                  : 'bg-orange-50 border-orange-500'
              } rounded-lg p-4 border-l-4`}>
                <h4 className={`${isDarkMode ? 'text-orange-300' : 'text-orange-700'} font-semibold mb-2 flex items-center`}>
                  <span className="mr-2">💡</span>
                  How to connect:
                </h4>
                <ul className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm space-y-1 text-left`}>
                  <li>• Send friend requests to people you know</li>
                  <li>• Accept friend requests from others</li>
                  <li>• Once both of you are friends, start messaging!</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
