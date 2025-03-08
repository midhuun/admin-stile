import React, { useEffect, useState } from 'react'
import { getProducts } from './fetchProducts';

const AddProduct = () => {
    const [categories, setCategories] = useState([]);
    const sizes = ["XS","S","M","L","XL","XXL","XXXL"];
    const [subcategories, setSubcategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [addedSize,setaddedSize] = useState([]);
    const [stock,setstock] = useState(0);
    const [formData,setFormData] = useState({ 
        name: "",
        category: "",
        subcategory: "",
        price: "",
        discount:"",
        images: [],
        description: "",
        attributes:{},
        sizeLength:[],})
    const [modal,setModal] = useState(false);
      useEffect(() => {
        async function getData() {
          const data = await getProducts();
          console.log(data);
          setCategories(data.categories || []);
          setSubcategories(data.subCategories || []);
          setProducts(data.products || []);
        }
        getData();
      }, [])
    function handleData(e){
        e.preventDefault();
        const {name,value} = e.target;
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]:value
                }
                });
    }
    console.log(addedSize);
    function handleSize(e){
      e.preventDefault();
      const value = e.target.value
      setaddedSize((prev)=>{
        return [...prev,{[value]:stock}]
      }
      )
    }


  return (
   <>
   <div className="container">
     {modal &&
     <div className='inset-0 absolute bg-black bg-opacity-50'>
     <div className='p-4 absolute top-5 left-[30%] min-w-[300px] md:min-w-[450px] z-[100] bg-white min-h-screen'>
        <h1 className='py-2 px-3 font-semibold text-lg md:text-xl text-center'>Add Product</h1>
        <form className='space-y-3' action="">
            <input name='name' onChange={handleData} type="text" placeholder='Enter Product Name' className='border p-2 w-full'  id="" />
            <input  type="number" onChange={handleData} placeholder='Price' className='border p-2 w-full' name="price" id="" />
            <input type="number" onChange={handleData} placeholder='Discount Percentage' className='border p-2 w-full' name="discount" id="" />
            <select onChange={handleData} className='w-full px-3 py-2 border'  name="category" id="">
                <option value="">Select Category</option>
                {categories.map((category)=>
                <option key={category._id} value={category._id}>{category.name}</option>
                )}
            </select>
            <select onChange={handleData} className='w-full px-3 py-2 border'  name="subcategory" id="">
                <option value="">Select SubCategory</option>
                {subcategories.map((subcategory)=>
                <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
                )}
            </select>
            <input onChange={handleData} type="file" multiple placeholder='Select Product Images' className='border p-2 w-full' name="" id="" />
            <input onChange={handleData} type="text"  placeholder='Description' className='border p-2 w-full' name="description" id="" />
            <div className="flex items-center gap-3 justify-between">
            <select onChange={(e)=>handleSize(e)} className='w-full px-3 py-2 border'  name="" id="">
                <option  value="">Select Size</option>
                {sizes.map((size)=>
                <option  key={size} value={size}>{size}</option>
                )}
            </select>
            {addedSize}
            <input type="text" onChange={(e)=>setstock(e.target.value)}  placeholder='Stock' className='border p-2 w-full' name="" id="" />
            <button onClick={handleSize} type='button'  className='px-3 py-2 bg-blue-500 text-white'>Add</button>
            </div>
        </form>
        </div>
        </div>
        }
     <div onClick={()=>setModal(true)} className="absolute top-5 bg-blue-500 border cursor-pointer select-none text-white font-semibold p-3 right-5">Add  Product</div>
      {products.length >0 &&
      <div className='flex flex-wrap md:gap-3 gap-1'>
        {products.map((product) =>
             <div key={product._id} className='p-5 grid place-items-center w-[350px]'>
                <img src={product.images[0]} alt={product.name} className='md:w-[300px] border md:h-[350px] h-[150px] object-cover' />
                <h2 className='text-lg px-4 font-bold'>{product.name}</h2>
                <p className='text-sm'>{product.price}</p>
                <div className='flex w-full justify-between'>
                    <button className='bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-3 rounded-lg'>Edit</button>
                    <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg'>Delete</button>
                </div>
             </div>
            )}
      </div>
      }
   </div>
   </>
  )
}

export default AddProduct;