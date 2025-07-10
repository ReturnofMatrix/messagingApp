import { useEffect, useState } from "react";
import '../css/Profile.css';

export default function Profile(){
    const [profileData, setProfiledata] = useState('');
    const [editKey, setEditkey] = useState('');
    const [editValue, setEditvalue] = useState('');
    console.log(profileData);

    useEffect(
        () => {
            const fetchProfile = async () => {
                try{
                    const res = await fetch('http://localhost:4000/profile',
                        {
                            headers: {'Content-Type' : 'application/json'},
                            credentials: 'include'   
                        }
                    );
                    if(!res.ok){
                        throw new Error();
                    }
                    const data = await res.json();
                    console.log(data.allInfo);
                    setProfiledata(data.allInfo);
                }catch(e){
                    console.log(e);
                }
            };
            fetchProfile();
        },[]
    );

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

    function editClick( key, value) {
        setEditkey(key);
        setEditvalue(value);
    }
    
    return (
        <div className="profile-container">
            <ul>
                {Object.entries(profileData).map(([key, value]) => 
                    <li key={key}><strong>{key} : </strong>
                    {key === editKey ? <input value={editValue} onChange={(e) => setEditvalue(e.target.value)}/>: value}
                    {key === editKey ? <span onClick={handleEdit}>✅</span>
                    : <span onClick={() => editClick(key, value)}>✏️</span>}</li>
                )}
            </ul>
        </div>
    );
}