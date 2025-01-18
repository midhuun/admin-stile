import React, { useEffect, useState } from "react";
import { getProducts } from "./fetchProducts";

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  handleInputChange,
  isEditing,
}) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [key, setKey] = useState("");
  const [size, setSize] = useState("");
  const [stock, setStock] = useState("");
  const [value, setValue] = useState("");
  const [attributes, setAttributes] = useState({});
  const [sizes, setSizes] = useState({});

  // console.log(attributes)
  useEffect(() => {
    async function getData() {
      const data = await getProducts();
      setCategories(data.categories || []);
      setSubcategories(data.subCategories || []);
    }
    getData();
  }, []);
  const handleSize = () => {
    if (!size || !stock) {
      alert("Size or Stock is missing");
      return
    } else {
      const trimkey = size.trim();
      trimkey.split(" ").join("-");
      setSizes((prev) => ({ ...prev, [trimkey]: stock }));
      handleInputChange({target:{name:"sizes",value:{[trimkey]:stock}}})
      setSize("");
      setStock("");
    }
  };
  // console.log(sizes)
  const removeSize = (size) => {
    setSizes((prev) => {
      const newAttributes = { ...prev };
      delete newAttributes[key];
      return newAttributes;
    });
  };
  const handleAttribute = () => {
    if (!key || !value) {
      alert("Key or value is missing");
      return
    } else {
      const trimkey = key.trim();
      trimkey.split(" ").join("-");
      setAttributes((prev) => ({ ...prev, [trimkey]: value }));
    
      handleInputChange({target:{name:"attributes",value:{[trimkey]:value}}})
      setKey("");
      setValue("");
    }
  };

  const handleRemoveAttribute = (key) => {
    setAttributes((prev) => {
      const newAttributes = { ...prev };
      delete newAttributes[key];
      return newAttributes;
    });
  };
  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(files)?.map((file) => {
        const formData = new FormData();
        formData.append("image", file);

        return fetch(
          "https://api.imgbb.com/1/upload?key=f3145a10e034400f4b912f8123f851b1",
          {
            method: "POST",
            body: formData,
          }
        ).then((res) => res.json());
      });

      const results = await Promise.all(uploadPromises);

      const uploadedUrls = results
        .filter((result) => result.success)
        .map((result) => result.data.url);

      handleInputChange({
        target: {
          name: "images",
          value: [...formData.images, ...uploadedUrls],
        },
      });
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute min-h-screen inset-0 top-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white pt-20 rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <h3 className="text-xl font-bold mb-2">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h3>
        <form className="mt-[20px]" onSubmit={onSubmit}>
          {Object.keys(formData)?.map((key,index) => {
            if (key === "category") {
              return (
                <div key={index} className="mb-2">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Category
                  </label>
                  <select
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
            if (key === "images") {
              return (
                <div key={key} className="mb-2">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".jpg, .jpeg, .png, .gif"
                    onChange={handleImageUpload}
                    className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
                  />
                  {uploading && <p className="text-blue-500">Uploading images...</p>}
                  {formData.images && formData.images.length > 0 && (
                    <ul className="mt-2 list-disc list-inside">
                      {formData.images?.map((image, index) => (
                        <li key={index} className="text-blue-500">
                          <a href={image} target="_blank" rel="noopener noreferrer">
                            {image}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            }
            if (key === "attributes" || key === "stock" || key === "sizeLength" || key === 'CreatedAt') {
              return null;
            }
            if (key === "subcategory") {
              return (
                <div key={key} className="mb-2">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Subcategory
                  </label>
                  <select
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
                    required
                  >
                    <option value="">Select a subcategory</option>
                    {subcategories?.map((subcategory) => (
                      <option key={subcategory._id} value={subcategory._id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
            
            return (
              <div key={key} className="mb-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type={key === "price" || key === "discount" ? "number" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
                  required={key !== "image"}
                />
              </div>
            );
          })}
          
          <label className="block text-gray-700">Sizes</label>
        <div className="mb-2 mt-2 items-center flex gap-5">
          <div>
            <label className="block text-gray-700">Size</label>
            <input
              onChange={(e) => setSize(e.target.value)}
              type="text"
              value={size}
              className="w-full border rounded p-2"
              placeholder="Key"
            />
          </div>
          <div>
            <label className="block text-gray-700">Stock</label>
            <input
              onChange={(e) => setStock(e.target.value)}
              type="text"
              value={stock}
              className="w-full border rounded p-2"
              placeholder="value"
            />
          </div>
          <div className="text-white">add</div>
          <button
            onClick={handleSize}
            type="button"
            className="px-3 h-10 text-white bg-blue-500"
          >
            Add
          </button>
        </div>
        
        {Object.keys(sizes)?.map((key) => (
          <div key={key} className="mb-2 mt-2 w-full items-center flex gap-5">
            <p className="border px-3 w-1/2 py-2">{key}</p>
            <p className="border px-3 w-1/2 py-2">{sizes[key]}</p>
            {/* <button
              onClick={() => removeSize(key)}
              className="px-3 h-10 text-white bg-red-500"
              type="button"
            >
              Remove
            </button> */}
          </div>
        ))}
            <label className="block text-gray-700">Specifications</label>
        <div className="mb-2 mt-2 items-center flex gap-5">
          <div>
            <label className="block text-gray-700">Key</label>
            <input
              onChange={(e) => setKey(e.target.value)}
              type="text"
              value={key}
              className="w-full border rounded p-2"
              placeholder="Key"
            />
          </div>
          <div>
            <label className="block text-gray-700">Value</label>
            <input
              onChange={(e) => setValue(e.target.value)}
              type="text"
              value={value}
              className="w-full border rounded p-2"
              placeholder="value"
            />
          </div>
          <div className="text-white">Add</div>
          <button
            onClick={handleAttribute}
            type="button"
            className="px-3 h-10 text-white bg-blue-500"
          >
            Add
          </button>
        </div>
        
        {Object.keys(attributes)?.map((key) => (
          <div key={key} className="mb-2 mt-2 w-full items-center flex gap-5">
            <p className="border px-3 w-1/2 py-2">{key}</p>
            <p className="border px-3 w-1/2 py-2">{attributes[key]}</p>
            {/* <button
              onClick={() => handleRemoveAttribute(key)}
              className="px-3 h-10 text-white bg-red-500"
              type="button"
            >
              Remove
            </button> */}
          </div>
        ))}
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
            >
              {isEditing ? "Update Product" : "Save Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    price: "",
    discount:"",
    images: [],
    description: "",
    attributes:{},
    sizeLength:{},
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sizeArr,setSizeArr] = useState([]);
  useEffect(() => {
    const getAllProducts = async () => {
      const data = await getProducts();
      setProducts(data.products);
    };
    getAllProducts();
  }, []);
 useEffect(() => {
   
 }, [formData,sizeArr])
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name === 'attributes'){
      setFormData((prevFormData) => ({ ...prevFormData, attributes: { ...prevFormData.attributes , ...value } }));
      return;
    }
    if(name === 'sizes'){
      setSizeArr((prevState) => [
        ...prevState,
        {
          size: Object.keys(value)[0],
          stock: Object.values(value)[0], 
        },
      ]);
      return;
    }
   
    setFormData({ ...formData, [name]: value });
  };
  console.log("Outside",sizeArr)
  const addOrUpdateProduct = async(e) => {
    e.preventDefault();
    console.log(formData);
    if (editingProduct) {
     
    } else {
      console.log({...formData,"sizes":sizeArr})
      const url ="https://stile-backend-gnqp.vercel.app/admin/create/product";
      const method = "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...formData,"sizes":sizeArr}),
      });
      const data = await res.json();
      console.log(data);
    
    }

    setFormData({
      name: "",
      category: "",
      subcategory: "",
      price: "",
      images: [],
      description: "",
      discount:"",
      attributes:{},
      sizes:{}
    });
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    delete product.createdAt;
    delete product.updatedAt;
    delete product.__v
    console.log(product);
    setFormData(product);
    setEditingProduct(product);
    setIsModalOpen(true);
  };
 console.dir(editingProduct);
  const deleteProduct = async(id) => {
    try{
    const res = await fetch(`https://stile-backend-gnqp.vercel.app/admin/delete/product`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id:id })
  })
  if(res.status === 200){
    window.location.reload();
}
    }
catch(err){
  console.log(err);
}
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-bold text-center mb-8">Product Dashboard</h2>

      <div className="flex justify-between mb-2">
        <h3 className="text-xl font-semibold">Products</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-200"
        >
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {products?.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={product.images[0] || "https://via.placeholder.com/300"}
              alt={product.name}
              className="w-full h-48 object-contain rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-700">₹{product.price}</p>
              <p className="text-gray-600">{product.description}</p>
              <div className="flex justify-between gap-3">
                
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEdit(product)}
                  className="mt-4 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-200"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding/Editing Product */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
          setFormData({
            name: "",
            category: "",
            subcategory: "",
            price: "",
            stock: "",
            images: [],
            description: "",
            attributes:{}

          });
        }}
        onSubmit={addOrUpdateProduct}
        formData={formData}
        handleInputChange={handleInputChange}
        isEditing={!!editingProduct}
      />
    </div>
  );
};

export default ProductPage;
