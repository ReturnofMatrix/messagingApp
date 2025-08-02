import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Auth.css';

export default function Signup(){
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [conpass, setConpass] = useState('');
    const [birthday, setDate] = useState('');
    const [bio, setBio] = useState('');
    const [hobbies, setHobby] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const navigate = useNavigate();

    async function submitForm(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("email", email);
        formData.append("username", username);
        formData.append("password", password);
        formData.append("conpass", conpass);
        formData.append("birthday", birthday);
        formData.append("bio", bio);
        formData.append("hobbies", hobbies);

        if(profilePic)formData.append('profilePic', profilePic);

        try{
            const res = await fetch('http://localhost:4000/signup',
                {
                    method: "POST",
                    body: formData
                });
            if(!res.ok){
                throw new Error();
            }
            const data = await res.json();
            console.log(data);
            navigate('/');
        }catch(e){
            console.log(e);
        }
    }

    return(
        <div className="auth-container">
            <h4>Sign up form</h4>
            <form onSubmit={submitForm} method="post" encType="multipart/form-data">
                <label htmlFor="email">Email : </label>
                <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" name="email" id="email" required/><br/>
                <label htmlFor="username">Username : </label>
                <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" name="username" id="username" required/><br/>
                <label htmlFor="password">Password :</label>
                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" name="password" id="password" required/><br/>
                <label htmlFor="conpass">Confirm password :</label>
                <input onChange={(e) => setConpass(e.target.value)} value={conpass} type="password" name="conpass" id="conpass" required/><br/>
                <label htmlFor="birthday">Birthday : </label>
                <input onChange={(e) => setDate(e.target.value)} type="date" name="birthday" id="birthday"/><br/>
                <label htmlFor="bio">Bio : </label>
                <input onChange={(e) => setBio(e.target.value)} type="text" name="bio" id="bio"/><br/>
                <label htmlFor="hobbies">Hobbies : </label>
                <input onChange={(e) => setHobby(e.target.value)} type="text" name="hobbies" id="hobbies"/><br/>
                <label htmlFor="profilepic">Profile Picture : </label>
                <input onChange={(e) => {
                    const file = e.target.files[0];
                    if(file){
                        setProfilePic(file);
                        setPreviewUrl(URL.createObjectURL(file));
                    }
                }} 
                accept="image/*" type="file" name="profilepic" id="profilepic"/><br/>
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
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}