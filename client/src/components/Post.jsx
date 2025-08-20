import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { likePost, commentOnPost } from "../utils/postActions";
import { useTheme } from '../utils/ThemeContext';
import { useProfile } from "../utils/ProfileContext";
import { usePostContext } from "../utils/postContext";
import { API_BASE_URL } from "../utils/api";

export default function Post(){
    const [userPosts, setUserposts] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();
    const { isGuest } = useProfile();
    const { isDarkMode } = useTheme();
    const { uploadingPost, uploading } = usePostContext();

    useEffect(() => {
        async function fetchIndex() {
            try{
                const res = await fetch(`${API_BASE_URL}/indexPage`,
                    {credentials: 'include'}
                );
                if(!res.ok){
                    throw new Error()
                }
                const data = await res.json();
                console.log(data);
                setUserposts(data.posts);
                if(uploading){
                    uploadingPost['username'] = data.username;
                    console.log(uploadingPost);
                }
            }catch(e){
                console.log(e);
            }
        }
        fetchIndex();
    }, [refresh, uploading])

    return (
        <div className={`${isDarkMode 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-gray-50 to-gray-100'
        } min-h-screen flex justify-center transition-all duration-300`}>
            <div className="max-w-2xl w-full space-y-6 p-4">
                {uploading && 
                    <div className={`${isDarkMode 
                        ? 'bg-gray-800 border-orange-300' 
                        : 'bg-white border-orange-600'
                    } rounded-xl shadow-xl p-6 border-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}>
                        
                        {/* Loading Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center z-10">
                        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} px-4 py-2 rounded-full shadow-lg border-2 ${isDarkMode ? 'border-orange-300' : 'border-orange-600'} flex items-center space-x-2`}>
                            <div className="animate-spin w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full"></div>
                            <span className={`${isDarkMode ? 'text-orange-300' : 'text-orange-700'} font-semibold text-sm`}>
                            Uploading...
                            </span>
                        </div>
                        </div>

                        {/* Author Header */}
                        <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border-2 ${isDarkMode 
                            ? 'bg-gray-700 border-orange-300' 
                            : 'bg-orange-100 border-orange-600'
                        }`}>
                            <span className={`${isDarkMode ? 'text-orange-300' : 'text-orange-700'} font-bold text-sm`}>
                            {uploadingPost.username?.charAt(0).toUpperCase() || '?'}
                            </span>
                        </div>
                        <div>
                            <strong className={`${isDarkMode ? 'text-orange-300' : 'text-orange-800'} font-bold text-lg`}>
                            {uploadingPost.username}
                            </strong>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs flex items-center space-x-1`}>
                            <span className="animate-pulse">●</span>
                            <span>Publishing post...</span>
                            </p>
                        </div>
                        </div>

                        {/* Post Image */}
                        {uploadingPost.photo && (
                        <div className="mb-4 flex justify-center">
                            <div className="relative">
                            <img
                                src={uploadingPost.photo}
                                alt="Uploading preview"
                                className={`max-h-[500px] w-full object-contain rounded-lg shadow-lg border-2 ${isDarkMode 
                                ? 'border-orange-300 bg-gray-900' 
                                : 'border-orange-600 bg-gray-50'
                                } transition-all duration-300 opacity-90`}
                            />
                            {/* Image loading indicator */}
                            <div className="absolute top-2 right-2">
                                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} px-2 py-1 rounded-full shadow-md border ${isDarkMode ? 'border-orange-300' : 'border-orange-600'} flex items-center space-x-1`}>
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                            </div>
                            </div>
                        </div>
                        )}

                        {/* Post Caption */}
                        {uploadingPost.caption && (
                        <div className="mb-4">
                            <p className={`${isDarkMode 
                            ? 'text-orange-100 bg-gray-700 border-orange-300' 
                            : 'text-orange-900 bg-orange-50 border-orange-600'
                            } text-base leading-relaxed p-4 rounded-lg border-l-4 shadow-inner transition-all duration-300 opacity-90`}>
                            {uploadingPost.caption}
                            </p>
                        </div>
                        )}

                        {/* Upload Progress Bar */}
                        <div className={`mt-4 p-3 rounded-lg border-2 ${isDarkMode 
                        ? 'bg-gray-700 border-orange-300' 
                        : 'bg-orange-50 border-orange-600'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className={`${isDarkMode ? 'text-orange-300' : 'text-orange-700'} text-sm font-semibold`}>
                            Upload Progress
                            </span>
                            <span className={`${isDarkMode ? 'text-orange-400' : 'text-orange-600'} text-xs`}>
                            Processing...
                            </span>
                        </div>
                        <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-orange-200'}`}>
                            <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full animate-pulse" 
                                style={{width: '65%', transition: 'width 0.3s ease'}}>
                            </div>
                        </div>
                        </div>
                    </div>
                }
                {(userPosts.length === 0 && uploading === false) ? (
                    <div className={`${isDarkMode 
                        ? 'bg-gray-800 border-orange-200' 
                        : 'bg-white border-orange-400'
                    } rounded-xl shadow-xl p-8 border-2 text-center hover:shadow-2xl transition-all duration-300`}>
                        <div className="mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <span className="text-2xl text-gray-900">📝</span>
                            </div>
                            <h3 className={`${isDarkMode ? 'text-orange-100' : 'text-orange-800'} text-xl font-semibold mb-2`}>
                                No posts yet
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base leading-relaxed`}>
                                There are no posts to show. Create your first post or follow some people to see their content in your feed.
                            </p>
                        </div>
                    </div>
                ) : (
                    userPosts.map(post => (
                        <div key={post.id} className={`${isDarkMode 
                            ? 'bg-gray-800 border-orange-200 hover:border-orange-300' 
                            : 'bg-white border-orange-400 hover:border-orange-500'
                        } rounded-xl shadow-xl p-6 border-2 hover:shadow-2xl transition-all duration-300`}>
                            
                            {/* Author Header */}
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-gray-900 font-bold text-sm">
                                        {post.author.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <strong className={`${isDarkMode ? 'text-orange-300' : 'text-orange-800'} font-bold text-lg`}>
                                        {post.author.username}
                                    </strong>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                                        {new Date(post.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Post Image */}
                            {post.photo && (
                                <div className="mb-4 flex justify-center items-center">
                                    <img
                                        src={`${post.photo}`}
                                        alt="upload from user"
                                        className={`max-h-[500px] w-full object-contain rounded-lg shadow-lg border-2 ${isDarkMode 
                                            ? 'border-orange-300 hover:border-orange-400 bg-black' 
                                            : 'border-orange-400 hover:border-orange-500 bg-gray-100'
                                        } transition-colors duration-300`}
                                    />
                                </div>
                            )}

                            {/* Post Caption */}
                            {post.caption && (
                                <div className="mb-4">
                                    <h4 className={`${isDarkMode 
                                        ? 'text-orange-100 bg-gray-700 hover:bg-gray-600 border-orange-400' 
                                        : 'text-orange-900 bg-orange-50 hover:bg-orange-100 border-orange-500'
                                    } text-lg font-medium leading-relaxed p-4 rounded-lg shadow-inner border-l-4 transition-colors duration-300`}>
                                        {post.caption}
                                    </h4>
                                </div>
                            )}

                          {/* Interaction Buttons */}
                            <div className={`flex items-center justify-between pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-center space-x-6">
                                    <span className="flex items-center space-x-2 group">
                                        <button 
                                            onClick={() => likePost(post.id, setRefresh)} 
                                            disabled={isGuest} 
                                            className="text-2xl hover:scale-125 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed group-hover:animate-pulse"
                                        >
                                            {post.userLiked ? <span>❤️</span> : <span>🤍</span>}
                                        </button>
                                        <strong className={`${isDarkMode ? 'text-orange-400' : 'text-orange-600'} font-semibold text-sm`}>
                                            {post.likeCount} {post.likeCount === 1 ? 'like' : 'likes'}
                                        </strong>
                                    </span>
                                    
                                    <span className="flex items-center space-x-2 group">
                                        <button 
                                            onClick={() => commentOnPost(post.id, navigate)} 
                                            className="text-2xl hover:scale-125 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed group-hover:animate-pulse"
                                        >
                                            💬
                                        </button>
                                        <strong className={`${isDarkMode ? 'text-orange-400' : 'text-orange-600'} font-semibold text-sm`}>
                                            {post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}
                                        </strong>
                                        </span>
                                    </div>
                              
                                {/* Share/Link Button */}
                                <div className="flex items-center space-x-2">
                                    <button className={`${isDarkMode 
                                      ? 'text-gray-400 hover:text-orange-300' 
                                      : 'text-gray-500 hover:text-orange-600'
                                    } transition-colors duration-200 hover:scale-110 transform`}>
                                      <span className="text-lg">🔗</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
  );
}