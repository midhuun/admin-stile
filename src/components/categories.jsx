import React, { useEffect, useState } from "react";
import { getProducts } from "./fetchProducts";

const Modal = ({ isOpen, onClose, onSubmit, formData, handleInputChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("https://api.imgbb.com/1/upload?key=f3145a10e034400f4b912f8123f851b1", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log(data);
      if (data.success) {
        handleInputChange({ target: { name: "image", value: data.data.url } });
      } else {
        console.error("Image upload failed", data.error.message);
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <h3 className="text-xl font-bold mb-4">
          {formData._id ? "Edit Category" : "Add New Category"}
        </h3>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Starting Price</label>
            <input
              type="number"
              name="startingPrice"
              value={formData.startingPrice}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Upload Image</label>
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .gif"
              onChange={handleImageUpload}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            {uploading && <p className="text-blue-500">Uploading image...</p>}
            {formData.image && <p className="text-green-500 mt-2">Image uploaded successfully!</p>}
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {formData._id ? "Update Category" : "Save Category"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", startingPrice: "", image: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit,setIsEdit] = useState(false);
  useEffect(() => {
    const getAllProducts = async () => {
      const data = await getProducts();
      console.log(data);
      setCategories(data.categories);
    };
    getAllProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addCategory = async (e) => {
    e.preventDefault();
      const url = formData._id
      ? `https://stile-backend-gnqp.vercel.app/admin/update/category` 
      : "https://stile-backend-gnqp.vercel.app/admin/create/category"; 

    const method = formData._id ? "PUT" : "POST"; 
    console.log(formData)
    const res = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log(data);
   
    setFormData({ name: "", startingPrice: "", image: "" });
    setIsModalOpen(false);
    
  };

  const handleEdit = (category) => {
    setFormData(category);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const deleteCategory = async (_id) => {
    try {
      await fetch(`http://localhost:3000/admin/delete/category`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({_id:_id})
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-sm md:text-lg  mb-6 flex justify-between items-center">
        Categories
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-sm text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
        >
          Add Category
        </button>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {categories?.map((category) => (
          <div key={category._id} className="bg-white rounded-lg shadow-md p-4 transition-transform transform ">
            <div className="flex justify-center mb-4">
              <img src={category.image} alt={category.name} className="w-full h-32 object-cover rounded" />
            </div>
            <h3 className="text-xl font-semibold">{category.name}</h3>
            <p className="text-gray-600">${category.startingPrice}</p>
            <div className="flex justify-between">
              <button
                onClick={() => handleEdit(category)} // Open modal with existing category data
                className="mt-4 text-sm bg-[#4A90E2] text-white px-3 py-1 rounded hover:bg-[#3c77bb] transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCategory(category._id)} // Pass category ID to delete
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding/Editing Category */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addCategory}
        formData={formData}
        handleInputChange={handleInputChange}
        
      />
    </div>
  );
};

export default CategoryPage;
