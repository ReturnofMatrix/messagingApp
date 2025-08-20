import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { likePost, commentOnPost } from "../utils/postActions";
import { useTheme } from '../utils/ThemeContext';
import imageCompression from 'browser-image-compression';
import { useProfile } from "../utils/ProfileContext";
import { API_BASE_URL } from "../utils/api";

export default function Profile(){
    const [profileData, setProfileData] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [editKey, setEditKey] = useState('');
    const [editValue, setEditValue] = useState('');

    const [editProfile, setEditProfile] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [previewUrl, setPreviewUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const { isDarkMode } = useTheme();
    const { fetchProfilePic, isGuest, profilePic, setProfilePic, profilePicUloading, setProfilePicUploading } = useProfile();
    const navigate = useNavigate();

    // Fetch profile data and posts
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/profile`, {
                    credentials: 'include'   
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch profile');
                }
                const data = await res.json();
                setProfileData(data.allProfileInfo);
                setUserPosts(data.posts);
            } catch (e) {
                console.error('Error fetching profile:', e);
            }
        };
        fetchProfile();
    }, [refresh]);

    // Handle profile field edit
    async function handleEdit() {
        if (!editKey || !editValue.trim()) return;
        
        try {
            const res = await fetch(`${API_BASE_URL}/edit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ editKey, editValue })
            });
            
            if (!res.ok) {
                throw new Error('Failed to update profile');
            }
            
            const data = await res.json();
            setProfileData(data.allInfo);
            setEditKey('');
            setEditValue('');
            await fetchProfilePic();
        } catch (e) {
            console.error('Error updating profile:', e);
        }
    }

    // Handle profile picture update
    async function editProfilePic(e) {
        e.preventDefault();
        if (!selectedFile) return;
        setProfilePicUploading(true);

        setTimeout(() => {
            setProfilePicUploading(false);
        }, 3000);

        resetEditState();

        try {
            const options = { 
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
                useWebWorker: true 
            };
            const compressedFile = await imageCompression(selectedFile, options);
            const formData = new FormData();
            formData.append('profilePic', compressedFile);
            setProfilePic(previewUrl);

            const res = await fetch(`${API_BASE_URL}/editProfilePic`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            
            if (!res.ok) {
                throw new Error('Failed to update profile picture');
            }

            await res.json();
            setRefresh(prev => prev + 1);
            await fetchProfilePic();
            setProfilePicUploading(false);
        } catch (e) {
            console.error('Error updating profile picture:', e);
        }
    }

    // Handle profile picture removal
    async function removeProfilePic(e) {
        e.preventDefault();
        setProfilePicUploading(true);
        setTimeout(() => {
            setProfilePicUploading(false);
        }, 3000);

        try {
            const res = await fetch(`${API_BASE_URL}/removeProfilePic`, {
                method: 'POST',
                credentials: 'include',
            });
            
            if (!res.ok) {
                throw new Error('Failed to remove profile picture');
            }

            await res.json();
            resetEditState();
            setRefresh(prev => prev + 1);
            await fetchProfilePic();
        } catch (e) {
            console.error('Error removing profile picture:', e);
        }
    }

    // Reset edit state
    function resetEditState() {
        setEditProfile(false);
        setPreviewUrl('');
        setSelectedFile(null);
    }

    // Handle file selection
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }

    // Start editing profile field
    function editClick(key, value) {
        setEditKey(key);
        setEditValue(value);
    }

    // Start editing profile picture
    function startEditProfile() {
        setEditProfile(true);
        setPreviewUrl(profilePic || '');
    }

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
                        <span className="text-3xl">👤</span>
                        <h2 className={`${isDarkMode ? 'text-orange-300' : 'text-orange-800'} text-2xl font-bold`}>
                            My Profile
                        </h2>
                    </div>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Manage your profile and view your posts
                    </p>
                </div>

                {/* Profile Picture Section */}
                {editProfile ? (
                    <div className={`${isDarkMode 
                        ? 'bg-gray-800 border-orange-200' 
                        : 'bg-white border-orange-400'
                    } rounded-xl shadow-xl p-6 border-2 hover:shadow-2xl transition-all duration-300`}>
                        <div className="text-center mb-4">
                            <h3 className={`${isDarkMode ? 'text-orange-300' : 'text-orange-800'} font-bold text-lg mb-2`}>
                                Update Profile Picture
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                                Choose a new profile picture
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="profile" className={`block ${isDarkMode ? 'text-orange-300' : 'text-orange-700'} font-semibold mb-2`}>
                                    Select New Picture
                                </label>
                                <input 
                                    onChange={handleFileSelect}
                                    type="file" 
                                    name="profile" 
                                    id="profile"
                                    accept="image/*"
                                    className={`w-full ${isDarkMode ? 'text-orange-100' : 'text-orange-900'} 
                                        file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                                        file:bg-gradient-to-r file:from-orange-300 file:to-orange-400 
                                        file:text-gray-900 file:font-semibold 
                                        hover:file:from-orange-400 hover:file:to-orange-500 
                                        file:transition-all file:duration-300 file:shadow-md 
                                        hover:file:shadow-lg file:cursor-pointer transition`}
                                />
                            </div>
                            
                            {previewUrl && (
                                <div className="flex justify-center">
                                    <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${isDarkMode ? 'border-orange-300' : 'border-orange-400'} shadow-lg`}>
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex flex-wrap gap-3">
                                {/* Update Picture */}
                                <button
                                    type="submit" 
                                    disabled={!selectedFile}
                                    onClick={editProfilePic}
                                    className={`flex-1 min-w-[120px] bg-gradient-to-r ${isDarkMode 
                                        ? 'from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500' 
                                        : 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                                    } text-gray-900 font-bold px-4 py-3 rounded-lg hover:scale-105 
                                    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
                                    shadow-md hover:shadow-lg flex items-center justify-center space-x-2 
                                    disabled:hover:scale-100`}
                                >
                                    <span>✅</span>
                                    <span>Update</span>
                                </button>

                                {/* Remove Picture */}
                                <button
                                    type="button"
                                    onClick={removeProfilePic}
                                    className={`px-4 py-3 ${isDarkMode 
                                        ? 'bg-red-700 text-red-100 hover:bg-red-600' 
                                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                                    } rounded-lg border-2 border-red-300 hover:border-red-400 transition-all duration-300 shadow-md hover:shadow-lg`}
                                >
                                    Remove Profile Picture.
                                </button>

                                {/* Cancel */}
                                <button 
                                    type="button"
                                    onClick={resetEditState}
                                    className={`px-4 py-3 ${isDarkMode 
                                        ? 'bg-gray-700 text-orange-300 hover:bg-gray-600' 
                                        : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                                    } rounded-lg border-2 border-orange-300 hover:border-orange-400 transition-all duration-300 shadow-md hover:shadow-lg`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={`${isDarkMode 
                        ? 'bg-gray-800 border-orange-200' 
                        : 'bg-white border-orange-400'
                    } rounded-xl shadow-xl p-6 border-2 hover:shadow-2xl transition-all duration-300`}>
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative group">
                                <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${isDarkMode ? 'border-orange-300 group-hover:border-orange-400' : 'border-orange-400 group-hover:border-orange-500'} shadow-lg transition-colors duration-300`}>
                                    <img
                                        src={profilePic || '/default-profile.png'}
                                        alt="profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/default-profile.png';
                                        }}
                                    />
                                </div>
                                {/* only show edit pen icon when its not uploading and not guest. */}
                                {( !profilePicUloading && !isGuest) && (
                                    <button 
                                        onClick={startEditProfile}
                                        className={`absolute -bottom-2 -right-2 w-10 h-10 ${isDarkMode 
                                            ? 'bg-orange-300 hover:bg-orange-400' 
                                            : 'bg-orange-500 hover:bg-orange-600'
                                        } text-gray-900 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110`}
                                        title="Edit Profile Picture"
                                    >
                                        🖌️
                                    </button>
                                )}
                                  {profilePicUloading && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                                        <div className={`${isDarkMode 
                                            ? 'bg-gray-800 border-orange-300' 
                                            : 'bg-white border-orange-500'
                                        } rounded-2xl p-8 border-2 shadow-2xl flex flex-col items-center space-y-4 transform animate-pulse`}>
                                            
                                            {/* Profile Picture with Circular Loading Animation */}
                                            <div className="relative">
                                                <div className={`w-20 h-20 rounded-full overflow-hidden border-4 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} shadow-lg`}>
                                                    <img
                                                        src={profilePic}
                                                        alt="profile"
                                                        className="w-full h-full object-cover opacity-50"
                                                    />
                                                </div>
                                                {/* Spinning border overlay */}
                                                <div className={`absolute top-0 left-0 w-20 h-20 border-4 border-transparent ${isDarkMode 
                                                    ? 'border-t-orange-300' 
                                                    : 'border-t-orange-500'
                                                } rounded-full animate-spin`}></div>
                                            </div>
                                            
                                            {/* Loading Text */}
                                            <div className="text-center">
                                                <h3 className={`${isDarkMode ? 'text-orange-300' : 'text-orange-600'} text-lg font-semibold mb-1`}>
                                                    Updating Profile Picture...
                                                </h3>
                                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                                                    Please wait while we save your changes
                                                </p>
                                            </div>
                                            
                                            {/* Progress Dots */}
                                            <div className="flex space-x-2">
                                                <div className={`w-2 h-2 ${isDarkMode ? 'bg-orange-300' : 'bg-orange-500'} rounded-full animate-bounce`} style={{animationDelay: '0ms'}}></div>
                                                <div className={`w-2 h-2 ${isDarkMode ? 'bg-orange-300' : 'bg-orange-500'} rounded-full animate-bounce`} style={{animationDelay: '150ms'}}></div>
                                                <div className={`w-2 h-2 ${isDarkMode ? 'bg-orange-300' : 'bg-orange-500'} rounded-full animate-bounce`} style={{animationDelay: '300ms'}}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}      
                            </div>
                            <div className="text-center">
                                <h2 className={`${isDarkMode ? 'text-orange-300' : 'text-orange-800'} font-bold text-xl`}>
                                    {profileData.username || 'Username'}
                                </h2>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                                    {isGuest ? 'Guest user' : 'Tap the edit icon to change picture'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Profile Information */}
                <div className={`${isDarkMode 
                    ? 'bg-gray-800 border-orange-200' 
                    : 'bg-white border-orange-400'
                } rounded-xl shadow-xl p-6 border-2 hover:shadow-2xl transition-all duration-300`}>
                    <h3 className={`${isDarkMode ? 'text-orange-300' : 'text-orange-800'} font-bold text-lg mb-4 flex items-center`}>
                        <span className="mr-2">📝</span>
                        Profile Information
                    </h3>
                    <ul className="space-y-4">
                        {Object.entries(profileData)
                            .filter(([key]) => key !== 'profilePic')
                            .map(([key, value]) => (
                                <li key={key} className={`${isDarkMode 
                                    ? 'bg-gray-700 border-orange-200 hover:bg-gray-600 hover:border-orange-300' 
                                    : 'bg-orange-50 border-orange-300 hover:bg-orange-100 hover:border-orange-400'
                                } p-4 rounded-lg border-2 transition-all duration-300`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <strong className={`${isDarkMode ? 'text-orange-300' : 'text-orange-700'} font-semibold capitalize block mb-1`}>
                                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                            </strong>
                                            {key === editKey ? (
                                                <input 
                                                    value={editValue} 
                                                    onChange={(e) => setEditValue(e.target.value)} 
                                                    className={`w-full px-3 py-2 ${isDarkMode 
                                                        ? 'bg-gray-600 border-orange-300 text-orange-100 focus:ring-orange-400 focus:border-orange-400' 
                                                        : 'bg-white border-orange-400 text-orange-900 focus:ring-orange-500 focus:border-orange-500'
                                                    } border-2 rounded-lg focus:outline-none focus:ring-2 font-medium transition-all duration-300`}
                                                />
                                            ) : (
                                                <span className={`${isDarkMode ? 'text-orange-100' : 'text-orange-900'} text-lg`}>
                                                    {key === 'joinedDate' ? new Date(value).toLocaleDateString() : value || 'Not set'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            {key === editKey ? (
                                                <button 
                                                    onClick={handleEdit}
                                                    className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg"
                                                    title="Save changes"
                                                >
                                                    ✅
                                                </button>
                                            ) : (
                                                !isGuest && key !== 'joinedDate' && (
                                                    <button 
                                                        onClick={() => editClick(key, value)}
                                                        className={`w-10 h-10 ${isDarkMode 
                                                            ? 'bg-orange-300 hover:bg-orange-400' 
                                                            : 'bg-orange-500 hover:bg-orange-600'
                                                        } text-gray-900 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg`}
                                                        title="Edit this field"
                                                    >
                                                        🖌️
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>

                {/* User Posts */}
                <div className={`${isDarkMode 
                    ? 'bg-gray-800 border-orange-200' 
                    : 'bg-white border-orange-400'
                } rounded-xl shadow-xl p-6 border-2 hover:shadow-2xl transition-all duration-300`}>
                    <h3 className={`${isDarkMode ? 'text-orange-300' : 'text-orange-800'} font-bold text-lg mb-4 flex items-center`}>
                        <span className="mr-2">📋</span>
                        Your Posts ({userPosts.length})
                    </h3>
                    {userPosts.length > 0 ? (
                        <div className="space-y-4">
                            {userPosts.map(post => (
                                <div key={post.id} className={`${isDarkMode 
                                    ? 'bg-gray-700 border-orange-200 hover:bg-gray-600 hover:border-orange-300' 
                                    : 'bg-orange-50 border-orange-300 hover:bg-orange-100 hover:border-orange-400'
                                } rounded-lg p-4 border-2 transition-all duration-300`}>
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full flex items-center justify-center shadow-md">
                                            <span className="text-gray-900 font-bold text-xs">
                                                {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <div>
                                            <strong className={`${isDarkMode ? 'text-orange-300' : 'text-orange-700'} font-semibold`}>
                                                {post.author?.username || 'Unknown'}
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
                                    
                                    <div className={`flex items-center space-x-6 pt-2 border-t ${isDarkMode ? 'border-gray-600' : 'border-orange-200'}`}>
                                        <span className="flex items-center space-x-2 group">
                                            <button 
                                                onClick={() => likePost(post.id, () => setRefresh(prev => prev + 1))} 
                                                className="text-xl hover:scale-125 transition-transform duration-200 group-hover:animate-pulse"
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
                                                className="text-xl hover:scale-125 transition-transform duration-200 group-hover:animate-pulse"
                                            >
                                                💬
                                            </button>
                                            <strong className={`${isDarkMode ? 'text-orange-400' : 'text-orange-600'} font-semibold text-sm`}>
                                                {post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-orange-300 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                                <span className="text-2xl">📝</span>
                            </div>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base`}>
                                You don't have any posts yet. Create your first post!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}