import React, { useEffect } from 'react'
import LoadingPage from './Loading';
import OrdersTable from './OrdersTable';

const Orders = () => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const fetchOrders = async () =>{
    setLoading(true);
    try{
     const res = await fetch("https://stile-backend.vercel.app/alluser/orders");
     const data = await res.json();
     console.log(data);
     setOrders(data);
     setLoading(false);
    }
    catch(err){
      console.log(err);
      }
  }
  useEffect(()=>{
     fetchOrders();
  },[])
  if(loading){
    return <LoadingPage/>;
  }
  return (
    <>
    <h2>Orders</h2>
    {orders?.length>0 &&  <OrdersTable orders={orders}  />}
    </>
  )
}

export default Orders