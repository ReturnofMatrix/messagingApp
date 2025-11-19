import React from 'react';
import ReactDOM from 'react-dom/client';
import { routes } from './components/routes';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import { ThemeProvider } from './utils/ThemeContext';
import { ProfileProvider } from './utils/ProfileContext';
import { PostProvider } from './utils/postContext';
import './index.css';
const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ProfileProvider>
      <ThemeProvider>
        <PostProvider>
          <RouterProvider router={router}/>
        </PostProvider>
      </ThemeProvider>
    </ProfileProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
