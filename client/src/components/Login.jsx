import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const [username, setUsername] = useState('');
    const [password, setPass] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try{
            const res = await fetch('http://localhost:4000/login', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                'credentials': 'include',
                body: JSON.stringify({ username, password})
            });
            if(!res.ok){
                throw new Error();
            }
            const data = await res.json();
            console.log(data);
            if(data.loggedIn){
                console.log('inside home.');
                navigate('/home');
            }
        }catch(e){
            console.log(e);
        }
    }

    return(
  <div className="login-container">
    <form onSubmit={handleSubmit} className="login-form">
      <label htmlFor="username">Username :</label>
      <input 
        onChange={(e) => setUsername(e.target.value)} 
        value={username} 
        type="text" 
        name="username" 
        id="username"
      />

      <label htmlFor="password">Password :</label>
      <input 
        onChange={(e) => setPass(e.target.value)} 
        value={password} 
        type="password" 
        name="password" 
        id="password"
      />

      <button type="submit">Login</button>
    </form>
    <button className="signup-btn" onClick={() => navigate('/signup')}>
      Sign up here...
    </button>
  </div>
)

}