import { useEffect, useState } from "react";
import '../css/Profile.css';
import { useNavigate, useParams } from "react-router-dom";
import { likePost, commentOnPost } from "../utils/postActions";

export default function Profile(){
    const [profileData, setProfiledata] = useState({});
    const [userPosts, setUserposts] = useState([]);
    console.log(profileData, userPosts);
    const [editKey, setEditkey] = useState('');
    const [editValue, setEditvalue] = useState('');
    const navigate = useNavigate();

    const [editProfile, setEditProfile] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [profilePic, setProfilePic] = useState(null);

    useEffect(
        () => {
            const fetchProfile = async () => {
                try{
                    const res = await fetch('http://localhost:4000/profile',
                        {
                            credentials: 'include'   
                        }
                    );
                    if(!res.ok){
                        throw new Error();
                    }
                    const data = await res.json();
                    console.log(data);
                    setProfiledata(data.allProfileInfo);
                    setUserposts(data.posts);
                }catch(e){
                    console.log(e);
                }
            };
            fetchProfile();
        }, [refresh]);

    async function handleEdit(){
        console.log(editKey, editValue);
        try{
            const res = await fetch('http://localhost:4000/edit',
                {
                    method: 'POST',
                    headers: {'Content-Type' : 'application/json'},
                    credentials: 'include',
                    body: JSON.stringify({
                        editKey, editValue
                    })
                }
            );
            if(!res.ok){
                throw new Error();
            }
            const data = await res.json();
            console.log(data.allInfo);
            setProfiledata(data.allInfo);
            setEditkey('');
            setEditvalue('');
        }catch(e){
            console.log(e);
        }
    }

    async function editProfilePic(e){
        e.preventDefault();
        console.log('inside edit profile ');
        const formData = new FormData();
        formData.append('profilePic', profilePic);
        try{
            const res = await fetch('http://localhost:4000/editProfilePic',
                {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                }
            );
            if(!res.ok){
                console.log('inside throw error');
                throw new Error();
            }
            const data = await res.json();

            console.log('image is updatated.',data);
            setEditProfile(false);
            setPreviewUrl(null);
            setProfilePic(null);

            setRefresh(pre=> !pre);
        }catch(e){
            console.log('inside catch error.');
            console.log(e);
        }
    }

    function editClick( key, value) {
        setEditkey(key);
        setEditvalue(value);
    }
    
    return (
        <div className="profile-container">
            {editProfile ?
            <form onSubmit={editProfilePic}>
                <label htmlFor="profile">Profile Pic.</label>
                <input onChange={(e) => {
                    const file = e.target.files[0];
                    if(file){
                        setPreviewUrl(URL.createObjectURL(file));
                        setProfilePic(file);
                    }
                }} 
                type="file" name="profile" id="profile" />
                {previewUrl && (
                    <div style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        marginTop: "10px",
                        border: "2px solid #ccc"
                    }}>
                        <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                )}
                 <button type="submit" style={{ marginTop: "10px" }}>confirm change ✅</button>
            </form>:
            <div className="profile-pic-wrapper">
                <img
                    src={`http://localhost:4000${profileData.profilePic}?t=${Date.now()}`}
                    alt="profile"
                    className="profile-pic"
                />
                <span onClick={() => setEditProfile(true)} className="edit-icon">✏️</span>
            </div>
            }
            <ul>
                {Object.entries(profileData)
                .filter(([key]) => key !== 'profilePic' && key !== 'createdPosts')
                .map(([key, value]) => (
                    <li key={key}>
                    <strong>{key} : </strong>
                    {key === editKey ? (
                        <input value={editValue} onChange={(e) => setEditvalue(e.target.value)} />
                    ) : (
                        value
                    )}
                    {key === editKey ? (
                        <span onClick={handleEdit}>✅</span>
                    ) : (
                        <span onClick={() => editClick(key, value)}>✏️</span>
                    )}
                    </li>
                ))}
            </ul>

            <div>
                <h2>Your posts. </h2>
                {userPosts.length !== 0 ? <div>
                    {userPosts.map(post => <div key={post.id} className="post">
                <p><strong>{post.author.username}</strong></p>
                <h4>{post.content}</h4>
                <p><small>{new Date(post.created_at).toLocaleString()}</small></p>
                <p><span style={{ marginRight: "50px"}}>
                    <strong>{post.likeCount}</strong>
                    <button onClick={() => likePost(post.id, setRefresh)}>{post.userLiked? <span>❤️</span>:<span>🤍</span>}
                    </button></span><span><button onClick={() => commentOnPost(post.id, navigate)}>💬</button><strong>{post.commentsCount}</strong>
                    </span></p>
                </div>)}
                </div>
                : <p>You dont have any posts to show.</p>}
            </div>
        </div>
    );
}