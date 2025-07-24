import { useEffect, useState } from "react";
import '../css/Post.css';
import { useNavigate } from "react-router-dom";
import { likePost, commentOnPost } from "../utils/postActions";

export default function Post(){
    const [userPosts, setUserposts] = useState([]);
    const [content, setContent] = useState('');
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchIndex() {
            try{
                const res = await fetch('http://localhost:4000/indexPage',
                    {credentials: 'include'}
                );
                if(!res.ok){
                    throw new Error()
                }
                const data = await res.json()
                setUserposts(data.posts);
                console.log(userPosts);
            }catch(e){
                console.log(e);
            }
        }
        fetchIndex();
    }, [refresh])

    async function createPost(e) {
        e.preventDefault();
        try{
            const res = await fetch('http://localhost:4000/post',
                {
                    credentials: 'include',
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({content})
                }
            );
            if(!res.ok){throw new Error()}
            const data = await res.json();
            console.log(data);
            setContent('');
            setRefresh(pre => !pre);
        }catch(e){
            console.log(e);
        }
    }

    return (
        <div className="container">
            {userPosts.map(post => <div key={post.id} className="post">
                <p><strong>{post.author.username}</strong></p>
                <h4>{post.content}</h4>
                <p><small>{new Date(post.created_at).toLocaleString()}</small></p>
                <p><span style={{ marginRight: "50px"}}>
                    <strong>{post.likeCount}</strong>
                    <button onClick={() => likePost(post.id, setRefresh)}>{post.userLiked? <span>❤️</span>:<span>🤍</span>}
                    </button></span><span><button onClick={() => commentOnPost(post.id, navigate)}>💬</button><strong>{post.commentsCount}</strong></span></p>
            </div>)}

            <form onSubmit={createPost} className="form">
                <textarea onChange={(e) => setContent(e.target.value)} value={content} rows='2' 
                placeholder="type your post content here."></textarea>
                <button type="submit">Create Post.</button>
            </form>
        </div>
    )

}