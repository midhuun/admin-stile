export const getProducts = async() =>{
    try {
        const res = await fetch('https://stile-backend.vercel.app/products');
        const data = await res.json();
        return data;
    }
    catch(err){
            console.log(err);
            return err;
    }
}