import React, { useEffect, useState } from "react";
import { getProducts } from "./fetchProducts";
import Loading from "./Loading";

const Modal = ({ isOpen, onClose, onSubmit, formData, handleInputChange }) => {
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getProducts();
      setCategories(data.categories);
    };
    fetchCategories();
  }, []);

  if (!isOpen) return null;

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);

    const imageData = new FormData(); // Renamed to avoid shadowing
    imageData.append("image", file);

    try {
      const res = await fetch(
        "https://api.imgbb.com/1/upload?key=f3145a10e034400f4b912f8123f851b1",
        {
          method: "POST",
          body: imageData,
        }
      );
      const data = await res.json();
      if (data.success) {
        const inputName = event.target.name === "sizeChart" ? "sizeurl" : "image";
        handleInputChange({ target: { name: inputName, value: data.data.url } });
      } else {
        console.error("Image upload failed", data.error.message);
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <h3 className="text-xl font-bold mb-4">
          {formData._id ? "Edit Subcategory" : "Add New Subcategory"}
        </h3>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
              required
            >
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Size Chart URL
            </label>
            <input
              type="file"
              name="sizeChart"
              accept=".jpg, .jpeg, .png, .gif"
              onChange={handleImageUpload}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
            />
            {uploading && <p className="text-blue-500">Uploading image...</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
            <input
              type="file"
              name="image"
              accept=".jpg, .jpeg, .png, .gif"
              onChange={handleImageUpload}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
            />
            {uploading && <p className="text-blue-500">Uploading image...</p>}
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              {formData._id ? "Update Subcategory" : "Save Subcategory"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SubCategoryPage = () => {
  const [subcategories, setSubCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    image: "",
    sizeurl: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSubcategories = async () => {
      setIsLoading(true);
      const data = await getProducts();
      setSubCategories(data.subCategories || []);
      setIsLoading(false);
    };
    fetchSubcategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addOrEditSubCategory = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const url = formData._id
      ? `https://stile-backend-gnqp.vercel.app/admin/update/subcategory`
      : `https://stile-backend-gnqp.vercel.app/admin/create/subCategory`;

    const method = formData._id ? "PATCH" : "POST";
    const payload = formData._id
      ? { _id: formData._id, ...formData }
      : { ...formData };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setFormData({ name: "", category: "", image: "", sizeurl: "" });
        setIsModalOpen(false);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (subcategory) => {
    setFormData(subcategory);
    setIsModalOpen(true);
  };

  const deleteSubCategory = async (id) => {
    setIsLoading(true);
    try {
      await fetch(`https://stile-backend-gnqp.vercel.app/admin/delete/subcategory`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      setSubCategories((prev) =>
        prev.filter((subcategory) => subcategory._id !== id)
      );
    } catch (err) {
      console.error("Error deleting subcategory:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {isLoading && <Loading />}
      <h2 className="text-lg font-bold mb-6 flex justify-between items-center">
        Subcategories
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-sm text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
        >
          Add Subcategory
        </button>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {subcategories?.map((subcategory) => (
          <div key={subcategory._id} className="bg-white rounded-lg shadow-md p-4">
            <img
              src={subcategory.image || "https://via.placeholder.com/300"}
              alt={subcategory.name}
              className="w-full h-32 object-contain rounded mb-4"
            />
            <h3 className="text-xl font-semibold">{subcategory.name}</h3>
            <p className="text-gray-600">
              {subcategory.category?.name || "No category assigned"}
            </p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(subcategory)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteSubCategory(subcategory._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addOrEditSubCategory}
        formData={formData}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};

export default SubCategoryPage;
