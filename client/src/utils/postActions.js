export async function likePost(post_id, setRefresh) {
    try{
        const res = await fetch(`http://localhost:4000/post/${post_id}/like`,
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
navigate(`/home/post/${id}`);
}