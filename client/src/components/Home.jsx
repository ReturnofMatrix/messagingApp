import { Outlet, NavLink, useNavigate } from "react-router-dom";
import '../css/Home.css';
import { useEffect, useState } from "react";

export default function Home(){
    const [profilePic, setProfilePic] = useState(null);
    const navigate = useNavigate();

        useEffect(() => {
        async function fetchIndex() {
            try{
                const res = await fetch('http://localhost:4000/getProfilePic',
                    {credentials: 'include'}
                );
                if(!res.ok){
                    throw new Error()
                }
                const data = await res.json()
                setProfilePic(data.profilePic.profilePic);
                console.log(data.profilePic);
            }catch(e){
                console.log(e);
            }
        }
        fetchIndex();
    }, [])

    async function handleLogout(){
        try{
            const res = await fetch('http://localhost:4000/logout',
                {
                    method: 'POST',
                    headers: {'Content-Type' : 'application/json'},
                    credentials: 'include'   
                }
            );
            if(!res.ok){
                throw new Error();
            }
            const data = await res.json();
            console.log(data.message);
            navigate('/');
        }catch(e){
            console.log(e);
        }
    }
        
    return (
  <>
    <div className="navbar">
      <div className="navbar-left">
        <NavLink to='/home'>Home</NavLink>
        <NavLink to='message'>Message</NavLink>
        <NavLink to='strangers'>Strangers</NavLink>
        <NavLink to='friends'>Friends</NavLink>
        <NavLink to='profile'>Profile</NavLink>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="navbar-right">
        {profilePic && (
          <img
            src={`http://localhost:4000${profilePic}`}
            alt="profile"
            className="profile-pic"
          />
        )}
        <div className="hamburger">☰</div>
      </div>
    </div>

    <div className="outlet-container">
      <Outlet/>
    </div>
  </>
);
}