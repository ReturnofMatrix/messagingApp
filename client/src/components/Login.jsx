import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../utils/ProfileContext";
import { API_BASE_URL } from "../utils/api";

    export default function Login(){
        const [username, setUsername] = useState('');
        const [password, setPass] = useState('');
        const { setIsGuest, setIsLoggedIn } = useProfile();
        const navigate = useNavigate();

        async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            console.log('Login response:', data);
            if (data.loggedIn) {
                setIsLoggedIn(true);
                navigate('/home');
            }
        } catch (e) {
            console.error('Login error:', e);
        }
    }

    async function guestLogin(e) {
        e.preventDefault();
        try{ 
            const res = await fetch(`${API_BASE_URL}/guestLogin`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify({ username: 'guest', password: 'guest'})
            });
            if(!res.ok){
                throw new Error();
            }
            const data = await res.json();
            if(data.loggedIn){
                setIsGuest(true);
                setIsLoggedIn(true);
                navigate('/home');
            }
        }catch(e){
            console.log(e);
        }
    }

return (
    <div className="min-h-screen bg-gray-700 flex flex-col items-center justify-center space-y-4">
        <div className="bg-gray-700 rounded-2xl shadow-lg p-8 max-w-sm w-full border-2 border-orange-100 space-y-5">
            <h2 className="text-3xl font-extrabold text-orange-200 text-center mb-6 tracking-wide">instaChat 💬</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-orange-200">Username</label>
                    <input 
                        onChange={(e) => setUsername(e.target.value)} 
                        value={username} 
                        type="text" 
                        name="username" 
                        id="username"
                        placeholder="Your username"
                        className="mt-1 w-full px-4 py-3 bg-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 text-black-100 transition"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-orange-200">Password</label>
                    <input 
                        onChange={(e) => setPass(e.target.value)} 
                        value={password} 
                        type="password" 
                        name="password" 
                        id="password"
                        placeholder="Your password"
                        className="mt-1 w-full px-4 py-3 bg-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 text-black-100 transition"
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-300 to-red-300 text-gray-100 px-4 py-3 rounded-lg hover:from-orange-400 hover:to-red-400 hover:scale-105 transition transform"
                >
                    Login
                </button>
            </form>
            <button 
                onClick={() => navigate('/signup')} 
                className="w-full text-red-300 text-sm font-semibold hover:text-red-400 transition"
            >
                Sign up here...
            </button>
        </div>
        <button 
            onClick={guestLogin} 
            className="w-full max-w-sm bg-gradient-to-r from-orange-300 to-red-300 text-black-100 text-base font-semibold px-4 py-3 rounded-lg hover:from-orange-400 hover:to-red-400 hover:scale-110 transition transform"
        >
            Login as Guest
        </button>
    </div>
);
}