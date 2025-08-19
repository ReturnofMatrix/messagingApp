import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
require('dotenv').config();
const API_URL = process.env.REACT_APP_API_URL;

export default function ProtectedRoute({ children }){
    const [isLoggedin, setIsloggenin] = useState(null);

    useEffect(() => {
        const fetchStatus = async (req, res) => {
            try{
                const res = await fetch(`${API_URL}/status`,
                    {credentials: 'include'}
                );
                const data = await res.json();
                setIsloggenin(data.isLoggedin);
            }catch(e){
                console.log(e);
            }
        }
        fetchStatus();
    }, []);

    if(isLoggedin === null){
        return <div>Loading...</div>
    }
    if (!isLoggedin) {
        return <div>401 Unauthorized — please <a href="/">Login</a>.</div>;
    }
    return children
}