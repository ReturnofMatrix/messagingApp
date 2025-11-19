import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProfile } from "../utils/ProfileContext";
import { useTheme } from '../utils/ThemeContext';
import { API_BASE_URL } from "../utils/api";
import socket from "../utils/socket";

export default function MessageAFriend() {
  const { receiverId } = useParams();
  const [chatHistory, setChatHistory] = useState([]);
  const [text, setText] = useState('');
  const [myId, setMyId] = useState(null); // store current user's id
  const { isGuest } = useProfile();
  const navigate = useNavigate();
  const [friendName, setFriendName] = useState('');
  const { isDarkMode } = useTheme();
  const chatContainerRef = useRef(null);

  const handleReceive = useCallback((newMessage) => {
    setChatHistory(prev => [...prev, newMessage]);
  }, []);

  useEffect(() => {
    let myCurrentId = null
    const fetchChatHistory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/message/${receiverId}`,
          {
            credentials: 'include'
          }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setChatHistory(data.allMessages);
        setMyId(data.myId); // Assuming you send your user id too!
        myCurrentId = data.myId;
        console.log(data.friendName.username);
        setFriendName(data.friendName.username);
        socket.emit("joinRoom", {myId: data.myId, receiverId});
      } catch (e) {
        console.log(e);
      }
    };
    fetchChatHistory();
    socket.on("receiveMessage", handleReceive);

    return ()=>{
      socket.off("receiveMessage", handleReceive);
      if(myCurrentId){
        socket.emit("leaveRoom", {myId: myCurrentId, receiverId});
      }
    }
  }, [receiverId, handleReceive]);

  useEffect(() => {
    if(chatContainerRef.current){
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  async function handleFormsubmit(e) {
    e.preventDefault();
    console.log(text);
    const trimmedText = text.trim();
    if(trimmedText){
       try {
        const res = await fetch(`${API_BASE_URL}/message/${receiverId}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
            credentials: 'include'
          }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setMyId(data.myId);
        setText('');
      } catch (e) {
        console.log(e);
      }
    }
  }

return (
    <div className={`min-h-screen ${isDarkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    } flex justify-center transition-all duration-300`}>
      <div className="max-w-2xl w-full space-y-6 p-4">

        {/* Chat Header with Friend Name */}
        <div className={`${isDarkMode 
            ? 'bg-gray-800 border-orange-200' 
            : 'bg-white border-orange-400'
        } rounded-xl shadow-xl p-4 border-2 hover:shadow-2xl transition-all duration-300`}>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full flex items-center justify-center shadow-md">
              <span className="text-gray-900 font-bold text-sm">
                {friendName ? friendName.charAt(0).toUpperCase() : '💬'}
              </span>
            </div>
            <div>
              <h2 className={`${isDarkMode ? 'text-orange-300' : 'text-orange-800'} font-bold text-lg`}>
                {friendName ? `Chat with ${friendName}` : 'Chat'}
              </h2>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                {friendName ? 'Send messages in real-time' : 'Loading chat...'}
              </p>
            </div>
          </div>
          {/* Back button */}
          <button 
            onClick={() => navigate('/home/message')}
            className={`mt-3 ${isDarkMode 
                ? 'text-orange-300 hover:text-orange-200' 
                : 'text-orange-700 hover:text-orange-600'
            } transition-colors duration-300 flex items-center space-x-2 font-medium`}
          >
            <span>←</span>
            <span>Back to friends list</span>
          </button>
        </div>

        {/* Chat History */}
        <div className={`${isDarkMode 
            ? 'bg-gray-800 border-orange-200' 
            : 'bg-white border-orange-400'
        } rounded-xl shadow-xl border-2 overflow-hidden hover:shadow-2xl transition-all duration-300`}>
          <div ref={chatContainerRef} className="p-6 space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            {chatHistory && chatHistory.length > 0 ? (
              chatHistory.map((message) => {
                const isMine = message.senderid === myId;
                return (
                  <div 
                    key={message.id} 
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'} group`}
                  >
                    <div className={`flex items-end space-x-2 max-w-xs ${isMine ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {isMine && (
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-gray-900 font-bold text-xs">You</span>
                        </div>
                      )}
                      <div 
                        className={`px-4 py-3 rounded-2xl shadow-lg text-base leading-relaxed transition-all duration-300 group-hover:shadow-xl ${
                          isMine 
                            ? 'bg-gradient-to-r from-orange-300 to-orange-400 text-gray-900 font-medium rounded-bl-2xl rounded-br-sm'
                            : isDarkMode
                              ? 'bg-gray-700 text-orange-100 border-2 border-orange-200 rounded-br-2xl rounded-bl-sm hover:bg-gray-600'
                              : 'bg-orange-50 text-orange-900 border-2 border-orange-300 rounded-br-2xl rounded-bl-sm hover:bg-orange-100'
                        }`}
                      >
                        {message.text}
                      </div>
                      {!isMine && (
                        <div className={`w-8 h-8 ${isDarkMode 
                            ? 'bg-gray-600 border-orange-300' 
                            : 'bg-orange-100 border-orange-400'
                        } rounded-full flex items-center justify-center flex-shrink-0 border-2 shadow-sm`}>
                          <span className={`${isDarkMode ? 'text-orange-300' : 'text-orange-700'} font-bold text-xs`}>
                            {friendName ? friendName.charAt(0).toUpperCase() : 'F'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-orange-300 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                  <span className="text-2xl">💬</span>
                </div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base`}>
                  {friendName 
                    ? `No messages with ${friendName} yet. Start the conversation!` 
                    : 'No messages yet. Start the conversation!'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Send Message */}
        <div className={`${isDarkMode 
            ? 'bg-gray-800 border-orange-200 hover:border-orange-300' 
            : 'bg-white border-orange-400 hover:border-orange-500'
        } rounded-xl shadow-xl p-6 border-2 transition-all duration-300 hover:shadow-2xl`}>
          <div className="space-y-4">
            <textarea
              onChange={(e) => setText(e.target.value)}
              value={text}
              disabled={isGuest}
              rows="3"
              placeholder={friendName ? `Message ${friendName}...` : "Type your message here..."}
              className={`w-full px-4 py-3 ${isDarkMode 
                  ? 'bg-gray-700 border-orange-300 text-orange-100 placeholder-gray-400 hover:bg-gray-600 focus:bg-gray-600' 
                  : 'bg-orange-50 border-orange-400 text-orange-900 placeholder-gray-500 hover:bg-orange-100 focus:bg-white'
              } border-2 rounded-lg focus:outline-none focus:ring-2 ${isDarkMode 
                  ? 'focus:ring-orange-400 focus:border-orange-400' 
                  : 'focus:ring-orange-500 focus:border-orange-500'
              } font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed resize-none`}
            />
            <button 
              type="submit" 
              disabled={isGuest || !text.trim()}
              onClick={handleFormsubmit}
              className={`w-full bg-gradient-to-r ${isDarkMode 
                  ? 'from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500' 
                  : 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
              } text-gray-900 font-bold px-4 py-3 rounded-lg hover:scale-105 
              transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
              shadow-md hover:shadow-lg flex items-center justify-center space-x-2 
              disabled:hover:scale-100`}
            >
              <span>📤</span>
              <span>Send Message</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
