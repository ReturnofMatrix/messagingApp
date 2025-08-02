import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import '../css/Friends.css';

export default function Message(){
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(
        () => {
            const getUsers = async () => {
                try{
                const res = await fetch('http://localhost:4000/home',
                    {
                        method: 'GET',
                        'credentials': 'include'
                    }
                );
                if(!res.ok){
                    throw new Error();
                }
                const data = await res.json();
                setUsers(data.messageFriends);
                }catch(e){
                    console.log(e);
                }
            };
            getUsers();
        }, []);
        
    return (
        <div>
            <ol className="friends-list">
                {users.length !== 0 ? 
                users.map((user) => <li key={user.id} onClick={() => navigate(`/home/message/${user.id}`)}>{user.username}</li>) :
                <p>For you to message friend. you and your friend has to accept each others friend request.</p>}
            </ol>
            < Outlet />
        </div>
    )
}