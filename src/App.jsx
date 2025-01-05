// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CategoryForm from './components/CategoryForm';
import CategoryPage from './components/categories';
import SubCategoryPage from './components/subcategory';
import ProductPage from './components/products';
// Import other forms...

const App = () => {
  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        {/* Sidebar Navigation */}
        <nav className="bg-gray-800 text-white w-full md:w-[15%] p-4 md:min-h-screen">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="flex items-center p-2 rounded hover:bg-gray-700 transition duration-200">
                <span className="material-icons">Categories</span>
                
              </Link>
            </li>
            <li>
              <Link to="/subcategories" className="flex items-center p-2 rounded hover:bg-gray-700 transition duration-200">
        
                <span className="">Subcategories</span>
              </Link>
            </li>
            <li>
              <Link to="/products" className="flex items-center p-2 rounded hover:bg-gray-700 transition duration-200">
                <span className="">Products</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="w-full md:w-3/4 p-6">
          <Routes>
            <Route path="/" element={<CategoryPage />} />
            <Route path="/subcategories" element={<SubCategoryPage />} />
            <Route path="/products" element={<ProductPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
