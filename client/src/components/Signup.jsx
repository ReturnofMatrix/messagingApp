import { useState } from "react";
import { useNavigate } from "react-router-dom";
import imageCompression from 'browser-image-compression';
import { API_BASE_URL } from "../utils/api";

export default function Signup(){
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');
    const [conpass, setConpass] = useState('');
    const [birthday, setDate] = useState('');
    const [bio, setBio] = useState('');
    const [hobbies, setHobby] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const navigate = useNavigate();

    async function submitForm(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("email", email);
        formData.append("username", username);
        formData.append("gender", gender);
        formData.append("password", password);
        formData.append("conpass", conpass);
        formData.append("birthday", birthday);
        formData.append("bio", bio);
        formData.append("hobbies", hobbies);

        async function handleImageSelect(file) {
            const options = { 
                maxSizeMB: 1, // compress to ~1MB
                maxWidthOrHeight: 1024,
                useWebWorker: true 
            };
            const compressedFile = await imageCompression(file, options);
            formData.append('profilePic', compressedFile);
        }

        if(profilePic){
            handleImageSelect(profilePic);
        }
        

        try{
            const res = await fetch(`${API_BASE_URL}/signup`,
                {
                    method: "POST",
                    body: formData
                });
            if(!res.ok){
                throw new Error();
            }
            const data = await res.json();
            console.log(data);
            navigate('/');
        }catch(e){
            console.log(e);
        }
    }

return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center">
        <div className="bg-gray-700 rounded-xl shadow-lg p-8 max-w-md w-full border-2 border-orange-100">
            <h4 className="text-3xl font-bold text-orange-200 text-center mb-6">instaChat</h4>
            <form onSubmit={submitForm} encType="multipart/form-data" className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-orange-200">Email</label>
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        type="text" 
                        name="email" 
                        id="email" 
                        required
                        placeholder="Your email"
                        className="mt-1 w-full px-4 py-3 bg-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 text-black-100 transition"
                    />
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-orange-200">Username</label>
                    <input 
                        onChange={(e) => setUsername(e.target.value)} 
                        value={username} 
                        type="text" 
                        name="username" 
                        id="username" 
                        required
                        placeholder="Your username"
                        className="mt-1 w-full px-4 py-3 bg-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 text-black-100 transition"
                    />
                </div>
                <div>
                    <label htmlFor="gender" className="block text-sm font-semibold text-orange-200">Select Gender</label>
                    <select onChange={(e) => setGender(e.target.value)} name="gender" id="gender" className="mt-1 w-full px-4 py-3 bg-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 text-black-100 transition">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-orange-200">Password</label>
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        type="password" 
                        name="password" 
                        id="password" 
                        required
                        placeholder="Your password"
                        className="mt-1 w-full px-4 py-3 bg-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 text-black-100 transition"
                    />
                </div>
                <div>
                    <label htmlFor="conpass" className="block text-sm font-semibold text-orange-200">Confirm Password</label>
                    <input 
                        onChange={(e) => setConpass(e.target.value)} 
                        value={conpass} 
                        type="password" 
                        name="conpass" 
                        id="conpass" 
                        required
                        placeholder="Confirm your password"
                        className="mt-1 w-full px-4 py-3 bg-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 text-black-100 transition"
                    />
                </div>
                <div>
                    <label htmlFor="birthday" className="block text-sm font-semibold text-orange-200">Birthday</label>
                    <input 
                        onChange={(e) => setDate(e.target.value)} 
                        type="date" 
                        name="birthday" 
                        id="birthday"
                        className="mt-1 w-full px-4 py-3 bg-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 text-black-100 transition"
                    />
                </div>
                <div>
                    <label htmlFor="bio" className="block text-sm font-semibold text-orange-200">Bio</label>
                    <input 
                        onChange={(e) => setBio(e.target.value)} 
                        type="text" 
                        name="bio" 
                        id="bio"
                        placeholder="Tell us about yourself"
                        className="mt-1 w-full px-4 py-3 bg-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 text-black-100 transition"
                    />
                </div>
                <div>
                    <label htmlFor="hobbies" className="block text-sm font-semibold text-orange-200">Hobbies</label>
                    <input 
                        onChange={(e) => setHobby(e.target.value)} 
                        type="text" 
                        name="hobbies" 
                        id="hobbies"
                        placeholder="Your hobbies"
                        className="mt-1 w-full px-4 py-3 bg-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 text-black-100 transition"
                    />
                </div>
                <div>
                    <label htmlFor="profilepic" className="block text-sm font-semibold text-orange-200">Profile Picture</label>
                    <input 
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setProfilePic(file);
                                setPreviewUrl(URL.createObjectURL(file));
                            }
                        }} 
                        accept="image/*" 
                        type="file" 
                        name="profilepic" 
                        id="profilepic"
                        className="mt-1 w-full text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-200 file:text-orange-600 file:font-semibold hover:file:bg-orange-300 transition"
                    />
                </div>
                {previewUrl && (
                    <div className="w-24 h-24 rounded-full overflow-hidden mt-4 border-2 border-red-300">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-300 to-red-300 text-gray-100 px-4 py-3 rounded-lg hover:from-orange-400 hover:to-red-400 hover:scale-110 transition transform"
                >
                    Submit
                </button>
            </form>
        </div>
    </div>
);
}