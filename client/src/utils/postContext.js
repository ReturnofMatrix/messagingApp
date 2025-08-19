import { createContext, useContext, useState } from "react";
const PostContext = createContext();

export function PostProvider({ children }) {

    const[uploadingPost, setUploadingPost] = useState({});
    const[uploading, setUploading] = useState(false);

    return(
        <PostContext.Provider value={{ uploadingPost, setUploadingPost, uploading, setUploading}}>
            {children}
        </PostContext.Provider>
    );
}

export const usePostContext = () => useContext(PostContext);