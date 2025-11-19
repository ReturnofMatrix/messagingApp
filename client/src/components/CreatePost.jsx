import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../utils/ThemeContext';
import imageCompression from 'browser-image-compression';
import { usePostContext } from "../utils/postContext";
import { API_BASE_URL } from "../utils/api";

export default function CreatePost(){
    const [caption, setCaption] = useState('');
    const [photo, setPhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isDarkMode } = useTheme();
    const { setUploading, setUploadingPost } = usePostContext();
    const navigate = useNavigate(); 

    async function createPost(e) {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            navigate('/home');
        }, 3000);

        setUploading(true);

        const formData = new FormData();
        const uploadingPost = {};

        if(caption.trim()){
            formData.append('caption', caption);
            uploadingPost['caption'] = caption;
            setCaption('');
        }

        if(photo){
                const options = { 
                maxSizeMB: 1, // compress to ~1MB
                maxWidthOrHeight: 1024,
                useWebWorker: true 
            };
            const compressedFile = await imageCompression(photo, options);
            formData.append('photo', compressedFile);
            uploadingPost['photo'] = URL.createObjectURL(compressedFile);
            setPhoto(null);
        }
        setUploadingPost(uploadingPost);

        try{
            const res = await fetch(`${API_BASE_URL}/post`,
                {
                    credentials: 'include',
                    method: 'POST',
                    body: formData
                }
            );
            if(!res.ok){throw new Error()}
            const data = await res.json();
            console.log(data);
            setUploading(false);
        }catch(e){
            console.log(e);
        }
    }

    return (
        <div className={`${isDarkMode 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-gray-50 to-gray-100'
        } min-h-screen flex items-center justify-center p-4 transition-all duration-300 relative`}>
            
            {/* Loading Overlay */}
            {isSubmitting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className={`${isDarkMode 
                        ? 'bg-gray-800 border-orange-300' 
                        : 'bg-white border-orange-500'
                    } rounded-2xl p-8 border-2 shadow-2xl flex flex-col items-center space-y-4 transform animate-pulse`}>
                        
                        {/* Circular Loading Animation */}
                        <div className="relative">
                            <div className={`w-16 h-16 border-4 ${isDarkMode 
                                ? 'border-gray-600' 
                                : 'border-gray-200'
                            } rounded-full`}></div>
                            <div className={`absolute top-0 left-0 w-16 h-16 border-4 border-transparent ${isDarkMode 
                                ? 'border-t-orange-300' 
                                : 'border-t-orange-500'
                            } rounded-full animate-spin`}></div>
                        </div>
                        
                        {/* Loading Text */}
                        <div className="text-center">
                            <h3 className={`${isDarkMode ? 'text-orange-300' : 'text-orange-600'} text-lg font-semibold mb-1`}>
                                Creating your post...
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                                Please wait while we process your content
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

            <div className="max-w-md w-full">
                
                {/* Header */}
                <div className={`${isDarkMode 
                    ? 'bg-gray-800 border-orange-200' 
                    : 'bg-white border-orange-400'
                } rounded-xl shadow-xl p-6 border-2 text-center mb-6 hover:shadow-2xl transition-all duration-300`}>
                    <div className="flex items-center justify-center space-x-3 mb-2">
                        <span className="text-3xl">📝</span>
                        <h2 className={`${isDarkMode ? 'text-orange-300' : 'text-orange-800'} text-2xl font-bold`}>
                            Create New Post
                        </h2>
                    </div>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Share your thoughts and moments
                    </p>
                </div>

                {/* Create Post Form */}
                <div className={`${isDarkMode 
                    ? 'bg-gray-800 border-orange-200 hover:border-orange-300' 
                    : 'bg-white border-orange-400 hover:border-orange-500'
                } rounded-xl shadow-xl p-6 border-2 space-y-4 hover:shadow-2xl transition-all duration-300 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
                    
                    {/* Image Preview */}
                    {previewUrl && (
                        <div className="flex justify-center">
                            <div className="relative">
                                <img 
                                    src={previewUrl} 
                                    alt="preview" 
                                    className={`max-w-full max-h-64 rounded-lg border-2 ${isDarkMode 
                                        ? 'border-orange-300 hover:border-orange-400' 
                                        : 'border-orange-400 hover:border-orange-500'
                                    } object-cover shadow-lg transition-colors duration-300`}
                                />
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setPreviewUrl('');
                                        setPhoto(null);
                                    }}
                                    className={`absolute top-2 right-2 w-8 h-8 ${isDarkMode 
                                        ? 'bg-red-500 hover:bg-red-600' 
                                        : 'bg-red-600 hover:bg-red-700'
                                    } text-white rounded-full flex items-center justify-center transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-110`}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Caption Input */}
                    <div>
                        <label className={`${isDarkMode ? 'text-orange-300' : 'text-orange-700'} block font-semibold mb-2`}>
                            Caption
                        </label>
                        <textarea 
                            onChange={(e) => setCaption(e.target.value)} 
                            value={caption} 
                            rows="3" 
                            placeholder="What's on your mind?"
                            className={`w-full px-4 py-3 ${isDarkMode 
                                ? 'bg-gray-700 border-orange-300 text-orange-100 placeholder-gray-400 hover:bg-gray-600 focus:bg-gray-600' 
                                : 'bg-orange-50 border-orange-400 text-orange-900 placeholder-gray-500 hover:bg-orange-100 focus:bg-white'
                            } border-2 rounded-lg focus:outline-none focus:ring-2 ${isDarkMode 
                                ? 'focus:ring-orange-400 focus:border-orange-400' 
                                : 'focus:ring-orange-500 focus:border-orange-500'
                            } font-medium transition-all duration-300 resize-none`}
                        />
                    </div>

                    {/* File Input */}
                    <div>
                        <label className={`${isDarkMode ? 'text-orange-300' : 'text-orange-700'} block font-semibold mb-2`}>
                            Add Photo
                        </label>
                        <input 
                            type="file" 
                            name="photo"
                            accept="image/*"
                            onChange={(e) => { 
                                const file = e.target.files[0];
                                if (file) {
                                    setPreviewUrl(URL.createObjectURL(file));
                                    setPhoto(file);
                                }
                            }} 
                            className={`w-full ${isDarkMode ? 'text-orange-100' : 'text-orange-900'} 
                                file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                                file:bg-gradient-to-r file:from-orange-300 file:to-orange-400 
                                file:text-gray-900 file:font-semibold 
                                hover:file:from-orange-400 hover:file:to-orange-500 
                                file:transition-all file:duration-300 file:shadow-md 
                                hover:file:shadow-lg file:cursor-pointer transition`}
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        disabled={(!caption && !photo) || isSubmitting}
                        onClick={createPost}
                        className={`w-full bg-gradient-to-r ${isDarkMode 
                            ? 'from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500' 
                            : 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                        } text-gray-900 font-bold px-4 py-3 rounded-lg hover:scale-105 
                        transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
                        shadow-md hover:shadow-lg flex items-center justify-center space-x-2 
                        disabled:hover:scale-100 relative overflow-hidden`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                                <span>Creating...</span>
                            </>
                        ) : (
                            <>
                                <span>🚀</span>
                                <span>Create Post</span>
                            </>
                        )}
                    </button>

                    {/* Cancel/Back Button */}
                    <button 
                        type="button" 
                        onClick={() => alert('Navigate to home')}
                        disabled={isSubmitting}
                        className={`w-full ${isDarkMode 
                            ? 'bg-gray-700 text-orange-300 hover:bg-gray-600 border-orange-200 hover:border-orange-300' 
                            : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-300 hover:border-orange-400'
                        } font-semibold px-4 py-3 rounded-lg border-2 transition-all duration-300 
                        shadow-md hover:shadow-lg flex items-center justify-center space-x-2
                        disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <span>↩️</span>
                        <span>Back to Feed</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
