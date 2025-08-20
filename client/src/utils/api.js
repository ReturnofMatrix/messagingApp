export const API_BASE_URL = (process.env.NODE_ENV === 'development') 
        ? 'http://localhost:4000': process.env.REACT_APP_API_URL;
