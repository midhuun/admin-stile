// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <Link to="/categories" className="text-white">Categories</Link>
        <Link to="/subcategories" className="text-white ml-4">Subcategories</Link>
        <Link to="/products" className="text-white ml-4">Products</Link>
        <Link to="/banner" className="text-white ml-4">Banner</Link>
      </div>
    </nav>
  );
};

export default Navbar;
