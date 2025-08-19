import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Vehicles from './pages/Vehicles';
import NotFound from './pages/NotFound';
import AboutUs from './pages/AboutUs/AboutUs';
import Certified from './pages/Certified/Certified';
import Finance from './pages/Finance/Finance';
import './index.css';
import Service from './pages/Service/Service'; // Importing the Service page

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/certified" element={<Certified />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/service" element={<Service />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;