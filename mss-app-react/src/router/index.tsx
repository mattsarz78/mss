import { Route, Routes } from 'react-router-dom';

// Placeholder components for routing
const Home = () => <div>Home Page</div>;
const Football = () => <div>Football Page</div>;
const Conference = () => <div>Conference Games Page</div>;
const Season = () => <div>Season Contents Page</div>;

const router = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/football" element={<Football />} />
    <Route path="/conference" element={<Conference />} />
    <Route path="/season" element={<Season />} />
  </Routes>
);

export default router;
