import { useEffect, useState } from "react"

export default function AllFriends(){
    const [list, setFriends] = useState('');
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        async function fetchFriends() {
            try{
                const res = await fetch('http://localhost:4000/friends/get',
                    {credentials: 'include'}
                );
                if(!res.ok){
                    throw new Error()
                }
                const data = await res.json()
                setFriends(data);
            }catch(e){
                console.log(e);
            }
        }
        fetchFriends();
    }, [refresh])

    async function unfollow(id) {
        try{
            const res = await fetch(`http://localhost:4000/friend/reject/${id}`,
                {
                    credentials: 'include',
                    method: 'DELETE'
                },
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

    async function accept(id) {
        try{
            const res = await fetch(`http://localhost:4000/friend/accept/${id}`,
                {
                    credentials: 'include',
                    method: 'PUT'
                },
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

    return (
        <div>
            {list && 
            <div>
                <h4>Your Friends.</h4>
                <ol>
{list.onlyFriends.map(friend => <li key={friend.id}>{friend.requester.username}<button onClick={(e) => unfollow(friend.id)}>Unfollow</button></li>)}
                </ol>
                <h4>My pendings.</h4>
                <ol>
{list.myPendings.map(friend => <li key={friend.id}>{friend.requester.username}<button onClick={(e) => unfollow(friend.id)}>Cancel</button>Pending</li>)}
                </ol>
                <h4>Requests to me.</h4>
                <ol>
{list.requestsToMe.map(friend => <li key={friend.id}>{friend.requested.username}<button onClick={(e) => accept(friend.id)}>Accept ✅</button><button onClick={(e) => unfollow(friend.id)}>Reject ❌</button></li>)}
                </ol>
            </div>}
        </div>
    )
}