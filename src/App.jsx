import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import Navbar from './components/Navbar.jsx';

const App = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
    </Routes>
  </>
);

export default App;
