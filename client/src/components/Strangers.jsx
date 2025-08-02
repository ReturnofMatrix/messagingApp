import { useEffect, useState } from "react"

export default function Strangers(){
    const[strangers, setStrangers] = useState([]);
    const[refresh, setRefresh] = useState(false);
    const[search, setSearch] = useState('');

    useEffect(() => {
        async function fetchFriends() {
            try{
                const res = await fetch('http://localhost:4000/strangers',
                    {credentials: 'include'}
                );
                if(!res.ok){
                    throw new Error()
                }
                const data = await res.json();
                setStrangers(data.result);
            }catch(e){
                console.log(e);
            }
        }
        fetchFriends();
    }, [refresh])

    async function follow(id) {
        try{
                const res = await fetch(`http://localhost:4000/friend/request/${id}`,
                    {credentials: 'include',
                        method: 'POST'
                    }
                );
                if(!res.ok){
                    throw new Error()
                }
                const data = await res.json();
                console.log(data);
                setRefresh(pre => !pre);
            }catch(e){
                console.log(e);
            }
    }

    const filteredStrangers = strangers.filter(stranger => 
        stranger.username.toLowerCase().includes(search.trim().toLowerCase())
    )

    return (
        <div>
            <input value={search} type="search" 
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search strangers"/>

            {<ul>
                {filteredStrangers.map(stranger => <li key={stranger.id}>
                    <p><strong>{stranger.username}</strong>
                    <small><button onClick={() => follow(stranger.id)}>Follow</button></small></p>
                </li>)}
            </ul>}
        </div>
    )
}