import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Friends.css';

export default function Friends(){
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
                setUsers(data.allUsers);
                }catch(e){
                    console.log(e);
                }
            };
            getUsers();
        }, []);
        
    return (
            <ol className="friends-list">
                {users.length !== 0 ? 
                users.map((user) => <li key={user.id} onClick={() => navigate(`message/${user.id}`)}>{user.username}</li>) : <p>There are no users.</p>}
            </ol>
    )
}