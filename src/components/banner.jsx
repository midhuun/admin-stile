import { useEffect, useState } from "react"

const Banner = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFormOpen, setisFormOpen] = useState(false );
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setimageUrl] = useState("");
    const [title, setTitle] = useState("");
    async function getBanner() {
        setIsLoading(true);
        const res = await fetch("http://localhost:3000/banner");
        const data = await res.json();
        setData(data);
        setIsLoading(false);
        console.log(data.length)
    }
  useEffect(()=>{
  getBanner()
  },[]);
  async function handleImageUpload(e) {
    setUploading(true);
    const file = e.target.files[0];
    if (!file) return;
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
         setimageUrl(data.data.url)
        } else {
          console.error("Image upload failed", data.error.message);
        }
      } catch (err) {
        console.error("Error uploading image:", err);
      } finally {
        setUploading(false);
      }
   
  }
  async function createBanner(){
     const res = await fetch("http://localhost:3000/banner/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name:title, image:imageUrl}),
        });
        const data = await res.json();
        console.log(data);
        window.location.reload();

  }
  async function deleteBanner(id) {
    try {
      await fetch(`http://localhost:3000/banner/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="banner">
    {isFormOpen &&
        <div className="absolute   inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white  rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              name="title"
              onChange={(e)=>setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Banner Image</label>
            <input
              type="file"
              name="name"
              onChange={handleImageUpload}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
              required
            />
            {uploading && <p>Uploading...</p>}
            {imageUrl && <p className="text-green-500">Uploaded</p>}
          </div>
          </form>
            <div className="flex justify-between">
                <button onClick={()=>createBanner()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
                <button  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={()=>setisFormOpen(false)}>Cancel</button>
            </div>    
        </div>

        </div>
}
        <div className="flex justify-between">

        <h1>Banner</h1>
        <button onClick={()=>setisFormOpen(true)} className="px-3 py-2 bg-green-500 text-white" >Create Banner</button>
        </div>
        
        <div className="banner-container flex md:flex-row flex-col justify-between flex-wrap">
            {isLoading && <p>Loading...</p>}
            {data.length>0 && data?.map((banner) => (
            <div key={banner._id} className="banner-card border p-1 md:w-1/2">
                <img src={banner.image} className="h-[300px]  object-contain" alt={banner.title} />
                 <div className="flex py-5 justify-between">
                <h3 className=" font-semibold uppercase">{banner.title}</h3>
                <button onClick={()=>deleteBanner(banner._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200">Delete</button>
                </div>
              
            </div>
            ))}
        </div>
    </div>
  )
}

export default Banner;