import { API_BASE_URL } from "./api";

export async function likePost(post_id, setRefresh) {
    try{
        const res = await fetch(`${API_BASE_URL}/post/${post_id}/like`,
            {
                credentials: 'include',
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
            }
        );
        if(!res.ok){throw new Error()}
        const data = await res.json();
        if(setRefresh){
            setRefresh(pre => !pre);
        }
        return data;
    }catch(e){
        console.log(e);
    }
}

export function commentOnPost(id, navigate) {
    console.log('inside commentOnPost');
    navigate(`/home/post/${id}`);
}