import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { likePost, commentOnPost } from "../utils/postActions";
import { useNavigate } from "react-router-dom";
import '../css/Single.css';

export default function Single(){
    const [post, setPost] = useState('');
    const [text, setText] = useState('');
    const [refresh, setRefresh] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchPost = async () => {
            try{
                const res = await fetch(`http://localhost:4000/post/${id}/comments`,
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
        try{
                const res = await fetch(`http://localhost:4000/post/${post.id}/comment`,
                    {
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({text}),
                        headers: {'Content-Type': 'application/json'},
                    }
                );
                if(!res.ok){throw new Error()}
                const data = await res.json();
                console.log(data.result);
                setText('');
                setRefresh(pre => !pre);
            }catch(e){
                console.log(e);
            }
    }

    return(
        <div>
            {post && 
            <div className="post">
                <p><strong>{post.author.username}</strong></p>
                <h4>{post.content}</h4>
                <p><small>{new Date(post.created_at).toLocaleString()}</small></p>
                <p><span style={{ marginRight: "50px"}}>
                <strong>{post.likesCount}</strong>
                <button onClick={() => likePost(post.id, setRefresh)}>{post.userLiked? <span>❤️</span>:<span>🤍</span>}
                </button></span><span><button onClick={() => commentOnPost(post.id, navigate)}>💬</button></span><strong>{post.hasComments.length}</strong></p>
                <ul>{ post.hasComments.map(comment => <li key={comment.id}>{comment.text}</li>)}</ul>
            </div>}
            <form onSubmit={postComment}>
                <textarea onChange={(e) => setText(e.target.value)} value={text} placeholder="type your comment here." rows='2'></textarea>
                <button type="submit">post comment</button>
            </form>
        </div>
    )
}