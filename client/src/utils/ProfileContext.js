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
        console.log('Fetching profile pic from:', `${API_BASE_URL}/getProfilePic`);
        const res = await fetch(`${API_BASE_URL}/getProfilePic`, {
            credentials: 'include',
        });
        console.log('Response status:', res.status);
        if (!res.ok) {
            const errorData = await res.json();
            console.error('Error response:', errorData);
            throw new Error(`Failed to fetch profile picture: ${res.status}`);
        }
        const data = await res.json();
        console.log('Profile pic data:', data);
        setProfilePic(data.profilePic.profilePic);
        } catch (e) {
            console.error('Error fetching profile pic:', e);
        }
    };

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