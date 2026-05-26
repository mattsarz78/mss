import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Placeholder components for routing
const Home = () => (
  <div className="home">
    <h1>Welcome to MattSarzSports</h1>
    <p>React Version</p>
  </div>
);

const Football = () => (
  <div className="football">
    <h1>Football</h1>
  </div>
);

const Conference = () => (
  <div className="conference">
    <h1>Conference Games</h1>
  </div>
);

const Season = () => (
  <div className="season">
    <h1>Season Contents</h1>
  </div>
);

const App: React.FC = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/football" element={<Football />} />
        <Route path="/conference" element={<Conference />} />
        <Route path="/season" element={<Season />} />
      </Routes>
    </div>
  );
};

export default App;
