import Signup from "./Signup";
import Login from "./Login";
import Home from "./Home";
import Profile from "./Profile";
import Message from "./Message";
import Post from "./Post";
import Single from "./Single";
import ProtectedRoute from "./ProtectedRoute";
import MessageAFriend from "./MessageAFriend";
import AllFriends from "./AllFriends";
import Strangers from './Strangers';
import CreatePost from "./CreatePost";

export const routes = [
    {
        path: '/',
        element: < Login />,
        errorElement: <Login/>
    },
    {
        path: '/signup',
        element: < Signup/>
    },
    {
        path: '/home',
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Post />
            },
            {
                path: 'post/:id',
                element: < Single />
            },
            {
                path: 'createPost',
                element: <CreatePost />
            },
            {
                path: 'message',
                element: <Message />,
            },
            {
                path: 'message/:receiverId',
                element: <MessageAFriend />
            },
            {
                path: 'friends',
                element: <AllFriends/>,
            },
            {
                path: 'strangers',
                element: <Strangers />,
            },
            {
                path: 'profile',
                element: <Profile />
            }]
    },
]