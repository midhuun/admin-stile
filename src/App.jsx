import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CategoryPage from './components/categories';
import SubCategoryPage from './components/subcategory';
import ProductPage from './components/products';
import Banner from './components/banner';
import AddProduct from './components/addProduct';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const authStatus = localStorage.getItem('authenticated');
    if (authStatus === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    if (password === 'Prem1974') {
      setAuthenticated(true);
      localStorage.setItem('authenticated', 'true');
    } else {
      alert('Incorrect Password');
    }
  };

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Enter Password</h1>
        <input
          type="password"
          className="p-2 border rounded mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2 rounded" onClick={handleLogin}>
          Submit
        </button>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <nav className="bg-gray-800 text-white w-full md:w-[15%] p-4 md:min-h-screen">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          <ul className="space-y-4">
            <li><Link to="/" className="flex items-center p-2 rounded hover:bg-gray-700 transition">Categories</Link></li>
            <li><Link to="/subcategories" className="flex items-center p-2 rounded hover:bg-gray-700 transition">Subcategories</Link></li>
            <li><Link to="/products" className="flex items-center p-2 rounded hover:bg-gray-700 transition">Products</Link></li>
            <li><Link to="/banner" className="flex items-center p-2 rounded hover:bg-gray-700 transition">Banner</Link></li>
          </ul>
        </nav>
        <div className="w-full md:w-3/4 p-6">
          <Routes>
            <Route path="/" element={<CategoryPage />} />
            <Route path="/subcategories" element={<SubCategoryPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/banner" element={<Banner />} />
            <Route path="/addProduct" element={<AddProduct />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
