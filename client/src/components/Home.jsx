import { Outlet, NavLink, useNavigate } from "react-router-dom";
import '../css/Home.css';

export default function Home(){
    const navigate = useNavigate();

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
      <NavLink to="">Friends</NavLink>
      <NavLink to='profile'>Profile</NavLink>
      <button onClick={handleLogout}>Logout</button>
    </div>
    <div className="outlet-container">
      <Outlet/>
    </div>
  </>
);
}