// src/components/CategoryForm.js
import React, { useState } from 'react';
const CategoryForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCategory = await createCategory({ name, startingPrice, image });
    onSubmit(prev => [...prev, newCategory.data]);
    setName('');
    setStartingPrice('');
    setImage('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category Name" required />
      <input type="number" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} placeholder="Starting Price" required />
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" required />
      <button type="submit">Add Category</button>
    </form>
  );
};

export default CategoryForm;
