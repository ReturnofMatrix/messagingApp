import { useEffect, useState } from "react"
import { useTheme } from '../utils/ThemeContext';
import { useProfile } from "../utils/ProfileContext";
import { API_BASE_URL } from "../utils/api";

export default function Strangers(){
    const[strangers, setStrangers] = useState([]);
    const[refresh, setRefresh] = useState(false);
    const[search, setSearch] = useState('');
    const{ isGuest } = useProfile();
    const { isDarkMode } = useTheme();

    useEffect(() => {
        async function fetchFriends() {
            try{
                const res = await fetch(`${API_BASE_URL}/strangers`,
                    {credentials: 'include'}
                );
                if(!res.ok){
                    throw new Error()
                }
                const data = await res.json();
                setStrangers(data.result);
            }catch(e){
                console.log(e);
            }
        }
        fetchFriends();
    }, [refresh])

    async function follow(id) {
        try{
                const res = await fetch(`${API_BASE_URL}/friend/request/${id}`,
                    {credentials: 'include',
                        method: 'POST'
                    }
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

    const filteredStrangers = strangers.filter(stranger => 
        stranger.username.toLowerCase().includes(search.trim().toLowerCase())
    )

return (
    <div className={`${isDarkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    } min-h-screen flex justify-center transition-all duration-300`}>
        <div className="max-w-2xl w-full space-y-6 p-4">
            
            {/* Search Input */}
            <div className={`${isDarkMode 
                ? 'bg-gray-800 border-orange-200' 
                : 'bg-white border-orange-400'
            } rounded-xl shadow-xl p-4 border-2 hover:shadow-2xl transition-all duration-300`}>
                <div className="flex items-center space-x-3">
                    <span className={`${isDarkMode ? 'text-orange-300' : 'text-orange-700'} text-xl`}>
                        🔍
                    </span>
                    <input 
                        value={search} 
                        type="search" 
                        onChange={(e) => setSearch(e.target.value)} 
                        placeholder="Search people here to follow..."
                        className={`flex-1 px-4 py-3 ${isDarkMode 
                            ? 'bg-gray-700 border-orange-300 text-orange-100 placeholder-gray-400 hover:bg-gray-600 focus:bg-gray-600' 
                            : 'bg-orange-50 border-orange-400 text-orange-900 placeholder-gray-500 hover:bg-orange-100 focus:bg-white'
                        } border-2 rounded-lg focus:outline-none focus:ring-2 ${isDarkMode 
                            ? 'focus:ring-orange-400 focus:border-orange-400' 
                            : 'focus:ring-orange-500 focus:border-orange-500'
                        } text-lg font-medium transition-all duration-300`}
                    />
                </div>
            </div>

            {/* Results */}
            {filteredStrangers.length > 0 ? (
                <div className="space-y-4">
                    <h3 className={`${isDarkMode ? 'text-orange-300' : 'text-orange-800'} font-semibold text-lg flex items-center`}>
                        <span className="mr-2">👥</span>
                        Found {filteredStrangers.length} {filteredStrangers.length === 1 ? 'person' : 'people'}
                    </h3>
                    {filteredStrangers.map(stranger => (
                        <div key={stranger.id} className={`${isDarkMode 
                            ? 'bg-gray-800 border-orange-200 hover:border-orange-300' 
                            : 'bg-white border-orange-400 hover:border-orange-500'
                        } rounded-xl shadow-xl p-6 border-2 hover:shadow-2xl transition-all duration-300`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-gray-900 font-bold text-lg">
                                            {stranger.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <strong className={`${isDarkMode ? 'text-orange-300' : 'text-orange-800'} font-bold text-xl`}>
                                            {stranger.username}
                                        </strong>
                                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                                            New connection
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => follow(stranger.id)} 
                                    disabled={isGuest}
                                    className={`bg-gradient-to-r ${isDarkMode 
                                        ? 'from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500' 
                                        : 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                                    } text-gray-900 font-bold px-6 py-3 rounded-lg hover:scale-105 
                                    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
                                    shadow-md hover:shadow-lg flex items-center space-x-2 disabled:hover:scale-100`}
                                >
                                    <span>➕</span>
                                    <span>Follow</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : search.trim() !== '' ? (
                // No results found state
                <div className={`${isDarkMode 
                    ? 'bg-gray-800 border-orange-200' 
                    : 'bg-white border-orange-400'
                } rounded-xl shadow-xl p-8 border-2 text-center hover:shadow-2xl transition-all duration-300`}>
                    <div className="mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50 shadow-lg">
                            <span className="text-2xl text-gray-900">😔</span>
                        </div>
                        <h3 className={`${isDarkMode ? 'text-orange-100' : 'text-orange-800'} text-xl font-semibold mb-2`}>
                            No results found
                        </h3>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base leading-relaxed`}>
                            No users found matching "<span className={`${isDarkMode ? 'text-orange-300' : 'text-orange-700'} font-semibold`}>{search}</span>". 
                            Try searching with a different username.
                        </p>
                    </div>
                </div>
            ) : (
                // Initial/empty search state
                <div className={`${isDarkMode 
                    ? 'bg-gray-800 border-orange-200' 
                    : 'bg-white border-orange-400'
                } rounded-xl shadow-xl p-8 border-2 text-center hover:shadow-2xl transition-all duration-300`}>
                    <div className="mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="text-2xl text-gray-900">🔍</span>
                        </div>
                        <h3 className={`${isDarkMode ? 'text-orange-100' : 'text-orange-800'} text-xl font-semibold mb-2`}>
                            Discover new people
                        </h3>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base leading-relaxed`}>
                            Start typing to search for people you'd like to follow and connect with.
                        </p>
                    </div>

                    {/* Optional: Add some suggested actions */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                        <div className={`${isDarkMode 
                            ? 'bg-gray-700 text-orange-300 border-orange-200' 
                            : 'bg-orange-50 text-orange-700 border-orange-300'
                        } px-4 py-2 rounded-lg border-2 text-sm font-medium flex items-center space-x-2`}>
                            <span>💡</span>
                            <span>Tip: Search by exact username</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Guest Mode Notice - Show if user is guest and tries to follow */}
            {isGuest && (
                <div className={`${isDarkMode 
                    ? 'bg-gradient-to-r from-orange-400 to-red-400 border-orange-300' 
                    : 'bg-gradient-to-r from-orange-200 to-red-200 border-orange-400'
                } p-4 rounded-xl shadow-lg border-2`}>
                    <div className="flex items-center justify-center space-x-3 text-gray-900">
                        <span className="text-xl">⚠️</span>
                        <p className="font-semibold text-base text-center">
                            <strong>Guest Mode:</strong> Sign up to follow people and build your network!
                        </p>
                    </div>
                </div>
            )}
        </div>
    </div>
);
}