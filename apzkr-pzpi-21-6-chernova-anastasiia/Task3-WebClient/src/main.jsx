import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserCinema from './cinema/UserCinema';
import MovieCinema from './cinema/MovieCinema';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Context.Provider value={{ 
      user: new UserCinema(),
      movie: new MovieCinema({
        movies: [] 
      }),
    }}>
      <App />
    </Context.Provider>
  </React.StrictMode>
);
