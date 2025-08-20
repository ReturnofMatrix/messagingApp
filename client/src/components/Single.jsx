import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { likePost, commentOnPost } from "../utils/postActions";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../utils/ProfileContext";
import { API_BASE_URL } from "../utils/api";

export default function Single(){
    const [post, setPost] = useState('');
    const [text, setText] = useState('');
    const [refresh, setRefresh] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const { isGuest } = useProfile();
    
    useEffect(() => {
        const fetchPost = async () => {
            try{
                const res = await fetch(`${API_BASE_URL}/post/${id}`,
                    {
                        credentials: 'include',
                        headers: {'Content-Type': 'application/json'},
                    }
                );
                if(!res.ok){throw new Error()}
                const data = await res.json();
                console.log(data.post);
                setPost(data.post);
            }catch(e){
                console.log(e);
            }
        }
    fetchPost();
    }, [refresh]);

    async function postComment(e){
        e.preventDefault();
        if(!text.trim())return;
        try{
                const res = await fetch(`${API_BASE_URL}/post/${post.id}/comment`,
                    {
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({text}),
                        headers: {'Content-Type': 'application/json'},
                    }
                );
                if(!res.ok){throw new Error()}
                const data = await res.json();
                setText('');
                setRefresh(pre => !pre);
            }catch(e){
                console.log(e);
            }
    }

  const dateOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
};

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex justify-center">
    <div className="max-w-2xl w-full space-y-6 p-4">
      {/* Post Card */}
      {post && (
        <div className="bg-gray-800 rounded-xl shadow-xl p-6 border-2 border-orange-200 hover:shadow-2xl hover:border-orange-300 transition-all duration-300">
          {/* Author Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full flex items-center justify-center">
              <span className="text-gray-900 font-bold text-sm">
                {post.author.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <strong className="text-orange-300 font-bold text-lg">{post.author.username}</strong>
              <p className="text-gray-400 text-xs">
                {new Date(post.created_at).toLocaleString("en-US", dateOptions)}
              </p>
            </div>
          </div>
          
          {/* Post Image */}
          {post.photo && (
            <div className="mb-4 flex justify-center items-center">
              <img
                src={`${post.photo}`}
                alt="upload from user"
                className="max-h-[500px] w-full object-contain rounded-lg shadow-lg border-2 border-orange-300 bg-black hover:border-orange-400 transition-colors duration-300"
              />
            </div>
          )}
          
          {/* Post Content */}
          {post.caption && (
            <div className="mb-4">
              <h4 className="text-orange-100 text-lg font-medium leading-relaxed bg-gray-700 p-4 rounded-lg shadow-inner border-l-4 border-orange-400 hover:bg-gray-600 transition-colors duration-300">
                {post.caption}
              </h4>
            </div>
          )}
           
          {/* Interaction Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-700 mb-4">
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-2 group">
                <button
                  onClick={() => likePost(post.id, setRefresh)}
                  disabled={isGuest}
                  className="text-2xl hover:scale-125 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed group-hover:animate-pulse"
                >
                  {post.userLiked ? <span>❤️</span> : <span>🤍</span>}
                </button>
                <strong className="text-orange-400 font-semibold text-sm">
                  {post.likesCount} {post.likesCount === 1 ? 'like' : 'likes'}
                </strong>
              </span>
              
              <span className="flex items-center space-x-2 group">
                <button
                  onClick={() => commentOnPost(post.id, navigate)}
                  disabled={isGuest}
                  className="text-2xl hover:scale-125 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed group-hover:animate-pulse"
                >
                  💬
                </button>
                <strong className="text-orange-400 font-semibold text-sm">
                  {post.hasComments.length} {post.hasComments.length === 1 ? 'comment' : 'comments'}
                </strong>
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-orange-300 transition-colors duration-200">
                <span className="text-lg">🔗</span>
              </button>
            </div>
          </div>
           
          {/* Comment Form */}
          <form onSubmit={postComment} className="bg-gray-800 rounded-xl shadow-lg p-4 border-2 border-orange-200 space-y-3 mb-6 hover:border-orange-300 transition-colors duration-300">
            <textarea
              onChange={(e) => setText(e.target.value)}
              value={text}
              disabled={isGuest}
              placeholder="Share your thoughts..."
              rows="3"
              className="w-full px-4 py-3 bg-gray-700 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-orange-100 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-400 hover:bg-gray-600 focus:bg-gray-600"
            />
            <button
              type="submit"
              disabled={isGuest}
              className="w-full bg-gradient-to-r from-orange-300 to-orange-400 text-gray-900 font-bold px-4 py-3 rounded-lg hover:from-orange-400 hover:to-orange-500 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              Post Comment
            </button>
          </form>
           
          {/* Comments List */}
          {post.hasComments.length > 0 && (
            <div>
              <h5 className="text-orange-300 font-semibold text-lg mb-3 flex items-center">
                <span className="mr-2">💬</span>
                Comments ({post.hasComments.length})
              </h5>
              <ul className="space-y-3">
                {post.hasComments.map(comment => (
                  <li
                    key={comment.id}
                    className="bg-gray-700 p-4 rounded-lg border-2 border-orange-200 flex flex-col space-y-2 hover:bg-gray-600 hover:border-orange-300 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full flex items-center justify-center">
                        <span className="text-gray-900 font-bold text-xs">
                          {comment.commenter.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <strong className="text-orange-300 font-semibold">{comment.commenter.username}</strong>
                        <span className="text-gray-400 text-xs">
                          {new Date(comment.created_at).toLocaleString("en-US", dateOptions)}
                        </span>
                      </div>
                    </div>
                    <p className="text-orange-100 leading-relaxed ml-11">{comment.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);
}