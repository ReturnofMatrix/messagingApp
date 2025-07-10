import Signup from "./Signup";
import Login from "./Login";
import Home from "./Home";
import Profile from "./Profile";
import Friends from "./Friends";
import Message from "./Message";
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
                element: <Friends/>
            },
            {
                path: 'profile',
                element: <Profile />
            },
            {
                path: 'message/:receiverId',
                element: <Message />
            }]
    },
]