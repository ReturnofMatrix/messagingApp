import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../css/Message.css';

export default function Message() {
  const { receiverId } = useParams();
  const [chatHistory, setChatHistory] = useState([]);
  const [text, setText] = useState('');
  const [myId, setMyId] = useState(null); // store current user's id
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await fetch(`http://localhost:4000/message/${receiverId}`,
          {
            credentials: 'include'
          }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setChatHistory(data.allMessages);
        setMyId(data.myId); // Assuming you send your user id too!
      } catch (e) {
        console.log(e);
      }
    };
    fetchChatHistory();
  }, [receiverId]);

  async function handleFormsubmit(e) {
    e.preventDefault();
    console.log(text);
    const trimmedText = text.trim();
    if(trimmedText){
       try {
        const res = await fetch(`http://localhost:4000/message/${receiverId}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
            credentials: 'include'
          }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setChatHistory(data.allMessages);
        setMyId(data.myId);
        setText('');
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
      <div>
        <div className="chat-history">
          {chatHistory && chatHistory.map((message) => {
            const isMine = message.senderid === myId;
            return (
              <div 
                key={message.id} 
                className={`message-row ${isMine ? 'mine' : 'theirs'}`}
              >
                <div className="message-bubble">
                  {message.text}
                </div>
              </div>
            );
          })}
       </div>

      <form onSubmit={handleFormsubmit} className="chat-form">
        <textarea
          onChange={(e) => setText(e.target.value)}
          value={text}
          rows='2'
          placeholder="Type your message here..."
        ></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
