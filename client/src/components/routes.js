import Signup from "./Signup";
import Login from "./Login";
import Home from "./Home";
import Profile from "./Profile";
import Friends from "./Friends";
import Message from "./Message";
import Post from "./Post";
import Single from "./Single";
import ProtectedRoute from "./ProtectedRoute";

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
                path: 'friends',
                element: <Friends/>,
                children: [
                    {
                        path: 'message/:receiverId',
                        element: <Message />
                    }]
            },
            {
                path: 'profile',
                element: <Profile />
            }]
    },
]