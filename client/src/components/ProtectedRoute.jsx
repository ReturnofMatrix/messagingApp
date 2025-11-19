import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";

export default function ProtectedRoute({ children }){
    const [isLoggedin, setIsloggenin] = useState(null);

    useEffect(() => {
        const fetchStatus = async (req, res) => {
            try{
                const res = await fetch(`${API_BASE_URL}/status`,
                    {credentials: 'include'}
                );
                if(res.ok){
                    const data = await res.json();
                    setIsloggenin(data.isLoggedin);
                }else{
                    setIsloggenin(false);
                }  
            }catch(e){
                setIsloggenin(false);
                console.log(e);
            }
        }
        fetchStatus();
    }, []);

    if(isLoggedin === null){
        return <div>Loading...</div>
    }
    if (!isLoggedin) {
        return <Navigate to='/' replace/>;
    }
    return children
}