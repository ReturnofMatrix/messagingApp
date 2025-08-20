import { useEffect, useState } from "react";
import { useTheme } from '../utils/ThemeContext';
import { useProfile } from "../utils/ProfileContext";
import { API_BASE_URL } from "../utils/api";

export default function AllFriends(){
    const [list, setFriends] = useState('');
    const [refresh, setRefresh] = useState(false);
    const { isGuest } = useProfile();
    const { isDarkMode } = useTheme();

    useEffect(() => {
        async function fetchFriends() {
            try{
                const res = await fetch(`${API_BASE_URL}/friends/get`,
                    {credentials: 'include'}
                );
                if(!res.ok){
                    throw new Error()
                }
                const data = await res.json()
                setFriends(data);
            }catch(e){
                console.log(e);
            }
        }
        fetchFriends();
    }, [refresh])

    async function unfollow(id) {
        try{
            const res = await fetch(`${API_BASE_URL}/friend/reject/${id}`,
                {
                    credentials: 'include',
                    method: 'DELETE'
                },
            );
            if(!res.ok){
                throw new Error()
            }
            const data = await res.json();
            console.log(data);
            setRefresh(pre => !pre);
        }catch(e){
            console.log(e);
        }
    }

    async function accept(id) {
        try{
            const res = await fetch(`${API_BASE_URL}/friend/accept/${id}`,
                {
                    credentials: 'include',
                    method: 'PUT'
                },
            );
            if(!res.ok){
                throw new Error()
            }
            const data = await res.json();
            console.log(data);
            setRefresh(pre => !pre);
        }catch(e){
            console.log(e);
        }
    }

return (
    <div className={`${isDarkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    } min-h-screen flex justify-center transition-all duration-300`}>
        <div className="max-w-2xl w-full space-y-6 p-4">
            {list && (
                <div className="space-y-6">
                    
                    {/* Your Friends Section */}
                    <div className={`${isDarkMode 
                        ? 'bg-gray-800 border-orange-200' 
                        : 'bg-white border-orange-400'
                    } rounded-xl shadow-xl p-6 border-2 hover:shadow-2xl transition-all duration-300`}>
                        <h4 className={`${isDarkMode ? 'text-orange-300' : 'text-orange-800'} font-bold text-2xl text-center mb-6 flex items-center justify-center`}>
                            <span className="mr-3">👥</span>
                            Your Friends
                            {list.onlyFriends.length > 0 && (
                                <span className={`ml-3 ${isDarkMode ? 'bg-orange-400 text-gray-900' : 'bg-orange-600 text-white'} px-2 py-1 rounded-full text-sm font-bold`}>
                                    {list.onlyFriends.length}
                                </span>
                            )}
                        </h4>
                        {list.onlyFriends.length !== 0 ? (
                            <div className="space-y-4">
                                {list.onlyFriends.map(friend => (
                                    <div 
                                        key={friend.id} 
                                        className={`${isDarkMode 
                                            ? 'bg-gray-700 border-orange-200 hover:bg-gray-600 hover:border-orange-300' 
                                            : 'bg-orange-50 border-orange-300 hover:bg-orange-100 hover:border-orange-400'
                                        } rounded-xl shadow-md p-4 border-2 flex justify-between items-center transition-all duration-300`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                                                <span className="text-gray-900 font-bold text-sm">
                                                    {friend.requester.username.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className={`${isDarkMode ? 'text-orange-100' : 'text-orange-900'} font-bold text-lg`}>
                                                    {friend.requester.username}
                                                </p>
                                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                                                    Friend
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={(e) => unfollow(friend.id)} 
                                            disabled={isGuest}
                                            className={`bg-gradient-to-r ${isDarkMode 
                                                ? 'from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500' 
                                                : 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                                            } text-gray-900 font-bold px-4 py-2 rounded-lg hover:scale-105 
                                            transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
                                            shadow-md hover:shadow-lg disabled:hover:scale-100`}
                                        >
                                            Unfollow
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50 shadow-lg">
                                    <span className="text-2xl text-gray-900">👥</span>
                                </div>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base`}>
                                    You have no friends yet. Connect with someone!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Friend Requests to Me Section */}
                    <div className={`${isDarkMode 
                        ? 'bg-gray-800 border-orange-200' 
                        : 'bg-white border-orange-400'
                    } rounded-xl shadow-xl p-6 border-2 hover:shadow-2xl transition-all duration-300`}>
                        <h4 className={`${isDarkMode ? 'text-orange-300' : 'text-orange-800'} font-bold text-2xl text-center mb-6 flex items-center justify-center`}>
                            <span className="mr-3">📩</span>
                            Friend Requests to Me
                            {list.requestsToMe.length > 0 && (
                                <span className={`ml-3 ${isDarkMode ? 'bg-red-500' : 'bg-red-600'} text-white px-2 py-1 rounded-full text-sm font-bold animate-pulse`}>
                                    {list.requestsToMe.length}
                                </span>
                            )}
                        </h4>
                        {list.requestsToMe.length !== 0 ? (
                            <div className="space-y-4">
                                {list.requestsToMe.map(friend => (
                                    <div 
                                        key={friend.id} 
                                        className={`${isDarkMode 
                                            ? 'bg-gray-700 border-orange-200 hover:bg-gray-600 hover:border-orange-300' 
                                            : 'bg-orange-50 border-orange-300 hover:bg-orange-100 hover:border-orange-400'
                                        } rounded-xl shadow-md p-4 border-2 flex justify-between items-center transition-all duration-300`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <div className="w-12 h-12 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                                                    <span className="text-gray-900 font-bold text-sm">
                                                        {friend.requested.username.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                {/* New request indicator */}
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                                            </div>
                                            <div>
                                                <p className={`${isDarkMode ? 'text-orange-100' : 'text-orange-900'} font-bold text-lg`}>
                                                    {friend.requested.username}
                                                </p>
                                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                                                    Wants to be friends
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={(e) => accept(friend.id)} 
                                                className={`bg-gradient-to-r ${isDarkMode 
                                                    ? 'from-green-400 to-green-500 hover:from-green-500 hover:to-green-600' 
                                                    : 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                                                } text-white font-bold px-4 py-2 rounded-lg hover:scale-105 
                                                transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-1`}
                                            >
                                                <span>Accept</span>
                                                <span>✅</span>
                                            </button>
                                            <button 
                                                onClick={(e) => unfollow(friend.id)} 
                                                className={`bg-gradient-to-r ${isDarkMode 
                                                    ? 'from-red-400 to-red-500 hover:from-red-500 hover:to-red-600' 
                                                    : 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                                } text-white font-bold px-4 py-2 rounded-lg hover:scale-105 
                                                transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-1`}
                                            >
                                                <span>Reject</span>
                                                <span>❌</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50 shadow-lg">
                                    <span className="text-2xl text-gray-900">📩</span>
                                </div>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base`}>
                                    No friend requests yet.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* My Friend Requests to Others Section */}
                    <div className={`${isDarkMode 
                        ? 'bg-gray-800 border-orange-200' 
                        : 'bg-white border-orange-400'
                    } rounded-xl shadow-xl p-6 border-2 hover:shadow-2xl transition-all duration-300`}>
                        <h4 className={`${isDarkMode ? 'text-orange-300' : 'text-orange-800'} font-bold text-2xl text-center mb-6 flex items-center justify-center`}>
                            <span className="mr-3">📤</span>
                            My Friend Requests to Others
                            {list.myPendings.length > 0 && (
                                <span className={`ml-3 ${isDarkMode ? 'bg-yellow-500 text-gray-900' : 'bg-yellow-600 text-white'} px-2 py-1 rounded-full text-sm font-bold`}>
                                    {list.myPendings.length}
                                </span>
                            )}
                        </h4>
                        {list.myPendings.length !== 0 ? (
                            <div className="space-y-4">
                                {list.myPendings.map(friend => (
                                    <div 
                                        key={friend.id} 
                                        className={`${isDarkMode 
                                            ? 'bg-gray-700 border-orange-200 hover:bg-gray-600 hover:border-orange-300' 
                                            : 'bg-orange-50 border-orange-300 hover:bg-orange-100 hover:border-orange-400'
                                        } rounded-xl shadow-md p-4 border-2 flex justify-between items-center transition-all duration-300`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <div className="w-12 h-12 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                                                    <span className="text-gray-900 font-bold text-sm">
                                                        {friend.requester.username.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                {/* Pending indicator */}
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white"></div>
                                            </div>
                                            <div>
                                                <p className={`${isDarkMode ? 'text-orange-100' : 'text-orange-900'} font-bold text-lg`}>
                                                    {friend.requester.username}
                                                </p>
                                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm flex items-center space-x-1`}>
                                                    <span>⏳</span>
                                                    <span>Pending</span>
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={(e) => unfollow(friend.id)} 
                                            disabled={isGuest}
                                            className={`bg-gradient-to-r ${isDarkMode 
                                                ? 'from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500' 
                                                : 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                                            } text-gray-900 font-bold px-4 py-2 rounded-lg hover:scale-105 
                                            transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
                                            shadow-md hover:shadow-lg disabled:hover:scale-100`}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50 shadow-lg">
                                    <span className="text-2xl text-gray-900">📤</span>
                                </div>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base`}>
                                    Send a friend request to connect!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Guest Mode Notice */}
                    {isGuest && (
                        <div className={`${isDarkMode 
                            ? 'bg-gradient-to-r from-orange-400 to-red-400 border-orange-300' 
                            : 'bg-gradient-to-r from-orange-200 to-red-200 border-orange-400'
                        } p-4 rounded-xl shadow-lg border-2`}>
                            <div className="flex items-center justify-center space-x-3 text-gray-900">
                                <span className="text-xl">⚠️</span>
                                <p className="font-semibold text-base text-center">
                                    <strong>Guest Mode:</strong> Sign up to manage friends and accept requests!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
);
}