import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "./api";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) =>{
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicUloading, setProfilePicUploading] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if(isLoggedIn){
            fetchProfilePic();
        }
    }, [isLoggedIn]);

    const fetchProfilePic = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/getProfilePic`, {
            credentials: 'include'
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setProfilePic(data.profilePic.profilePic);
        } catch (e) {
            console.log(e);
        }
    }


    return(
        <ProfileContext.Provider value={{
    profilePic, setProfilePic, fetchProfilePic, isGuest, setIsGuest, setIsLoggedIn,
    profilePicUloading, setProfilePicUploading
        }}>
            {children}
        </ProfileContext.Provider>
    );
}

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if(!context){
        throw new Error('useProfile must be used within ProfileProvider');
    }
    return context;
}