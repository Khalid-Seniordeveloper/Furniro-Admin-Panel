'use client';

import React, { useState, useEffect } from 'react';
import createClient from '@sanity/client';



const sanity = createClient({
  projectId: 'tzca0taz',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: 'skJa484NUi5bdqsese9ddoXuZwjWRos63Rbnf1gWM9txJm5oNAR0vk4Yb9DwdHcYDmH5xKsWFX6vJRLsaS7HGThXFfsRGN8eE5Oz6WvM5iej9eZI0I1vHxT14NdYAk8MfVKvLB4KpWjA9VnMk6VqXRgybn3KymElHBtg3PI1USuc6uJ92C8h', // Direct token for testing
});
import { auth } from '../Firebas/config.js'; // Firebase Auth
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const sanityClient = createClient({
  projectId: "tzca0taz",
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
  token: "skFTF0aOQjpxsmony55U5j0nkski58RHOvqdLXvjHU5Dbhj7WYTmWZu7HxAvLgxGkbChXp69BFPlFClfF9gZxs89EMS5W7GIi0iTL5Oa7VNUpnbA8xmmZmVoU6LZXUWoNjcJhHKRUACQXYnLnc8TfFdkwKMV9BhZOPmhuTPUynasyaY1mF7H",
});


const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newImage, setNewImage] = useState(null);

 

  const [userRole, setUserRole] = useState('');
  const router = useRouter();








  
    useEffect(() => {
      fetchOrders();
      fetchProducts();
      fetchAnalyticsData();
    }, []);
    const graphData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Monthly labels
      datasets: [
        {
          label: 'Orders Received',
          data: [12, 19, 3, 5, 2, 3], // Number of orders each month
          fill: false,
          borderColor: '#B88E2F',
          tension: 0.1,
        },
      ],
    };
  
  
  

  
    const fetchAnalyticsData = async () => {
      try {
        const query = `*[_type == "order"] | order(orderDate desc) {
          orderDate, totalPrice
        }`;
        const data = await sanity.fetch(query);
        const groupedData = data.reduce((acc, order) => {
          const date = new Date(order.orderDate).toLocaleDateString();
          if (!acc[date]) acc[date] = 0;
          acc[date] += order.totalPrice;
          return acc;
        }, {});
        const chartData = Object.keys(groupedData).map(date => ({
          date,
          total: groupedData[date],
        }));
        setGraphData(chartData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };







 
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => `Orders: ${tooltipItem.raw}`,
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Months',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Number of Orders',
          },
        },
      },
    };





  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Assign role based on email
      if (user.email === "manager@gmail.com") {
        setUserRole('manager');
      } else if (user.email === "productsmanager@gmail.com") {
        setUserRole('productsmanager');
      } else if (user.email === "salesmanager123@gmail.com") {
        setUserRole('salesmanager123');
      } else {
        router.push('/Login'); // Redirect to login if not recognized
      }
    } else {
      router.push('/Login'); // If no user logged in, redirect to login
    }
  }, [router]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push('/Login');
    }).catch((err) => console.log('Logout error:', err));
  };




  const handleLogin = (e) => {
    e.preventDefault();
    if (username === validUsername && password === validPassword) {
      setIsAuthenticated(true); // Login successful
      setMessage('');
    } else {
      setMessage('Incorrect username or password.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setMessage('Please upload an image.');
      return;
    }
    setLoading(true);

    try {
      const uploadedImage = await sanity.assets.upload('image', image);
      const productData = {
        _type: 'product',
        title,
        description,
        price: parseFloat(price),
        discountPercentage: parseFloat(discountPercentage),
        tags: tags.split(','),
        productImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImage._id,
          },
        },
      };
      const response = await sanity.create(productData);
      if (response._id) {
        setMessage('Product added successfully!');
        fetchProducts();
      } else {
        setMessage('Failed to add product. Please try again.');
      }
    } catch (error) {
      setMessage('Failed to add product. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const query = `*[_type == "product"] | order(_createdAt desc) {
        _id,
        title,
        price,
        discountPercentage,
        "imageUrl": productImage.asset->url,
        description,
        "tags": tags
      }`;
      const data = await sanity.fetch(query); // Sanity client for products
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  

  const handleDelete = async (productId) => {
    try {
      await sanity.delete(productId);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewImage(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      _id: editingProduct._id,
      _type: 'product',
      title: editingProduct.title,
      description: editingProduct.description,
      price: editingProduct.price,
      discountPercentage: editingProduct.discountPercentage,
      tags: Array.isArray(editingProduct.tags) ? editingProduct.tags : editingProduct.tags.split(','),
    };

    if (newImage) {
      try {
        const uploadedImage = await sanity.assets.upload('image', newImage);
        updatedProduct.productImage = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImage._id,
          },
        };
      } catch (error) {
        console.error('Error uploading image:', error);
        setMessage('Failed to upload new image.');
        return;
      }
    } else if (editingProduct.productImage && editingProduct.productImage.asset) {
      updatedProduct.productImage = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: editingProduct.productImage.asset._ref,
        },
      };
    }

    try {
      const response = await sanity.patch(editingProduct._id).set(updatedProduct).commit();
      if (response._id) {
        setEditingProduct(null);
        setMessage('Product updated successfully!');
        fetchProducts();
      } else {
        setMessage('Failed to update product. Please try again.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage('Failed to update product. Please try again.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);












  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const query = `*[_type == "order"]{
        _id, email, totalPrice, status, orderDate, products[]->{title}
      }`;
      const result = await sanityClient.fetch(query); // SanityClient for orders
      setOrders(result);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');











  useEffect(() => {
    fetchOrders();
  }, []);


  const [showToast, setShowToast] = useState(false);
  
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Update status in the backend (Sanity client)
      const response = await sanityClient
        .patch(orderId) // specify the order document ID to update
        .set({ status: newStatus }) // set the new status
        .commit();
  
      console.log('Order status updated successfully:', response);
  
      // Show the success toast message
      setShowToast(true);
  
      // Refetch the orders to update the frontend (local state update)
      fetchOrders();
  
      // Hide the toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000); // 3 seconds timeout
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  
  // Function to fetch orders again (or you can keep a local copy and just update the status)

  
  // Fetch orders when the component mounts
  useEffect(() => {
    fetchOrders();
  }, []);
  

  return (

      <div>

  <div>
    {userRole === 'salesmanager123' && (
      <div className="p-4">
        <div className="bg-[#f9f1e7] min-h-screen p-10">
          <h1 className="text-4xl font-bold text-center text-white bg-[#B88E2F] py-6 rounded-lg">
            Sale Management
          </h1>
          <div className="overflow-x-auto mt-8">
            <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[#B88E2F] text-white text-lg">
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">User</th>
                  <th className="p-4 text-left">Products</th>
                  <th className="p-4 text-left">Total Price</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Order Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order._id}
                    className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                  >
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{order.email}</td>
                    <td className="p-4">{order.products?.map((p) => p.title).join(', ')}</td>
                    <td className="p-4 font-bold">Rs {order.totalPrice}</td>
                    <td className="p-4">
                      <select
                        className="p-2 border rounded-lg bg-white"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}

    {/* Toast message */}
    {showToast && (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-4 rounded-lg shadow-lg">
        <p className="text-center text-lg font-bold">Status Updated Successfully!</p>
      </div>
    )}
  </div>


    {/* Toast message */}
    {showToast && (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-4 rounded-lg shadow-lg">
        <p className="text-center text-lg font-bold">Status Updated Successfully!</p>
      </div>
    )}






    {userRole === 'productsmanager' && (
 <div>

<h1 className="text-4xl text-center font-bold mb-4">Product Manager</h1>
      {message && <p className="mb-4 text-center text-3xl text-green-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-[#f9f1e7] p-6 rounded">
  <h2 className="text-center text-3xl font-bold text-[#B88E2F]">Add Product</h2>

  <input
    type="text"
    placeholder="Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
    className="border border-[#B88E2F] rounded p-2 w-full"
  />
  
  <textarea
    placeholder="Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    required
    className="border border-[#B88E2F] rounded p-2 w-full"
  />
  
  <input
    type="number"
    placeholder="Price"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
    required
    className="border border-[#B88E2F] rounded p-2 w-full"
  />
  
  <input
    type="number"
    placeholder="Discount Percentage"
    value={discountPercentage}
    onChange={(e) => setDiscountPercentage(e.target.value)}
    className="border border-[#B88E2F] rounded p-2 w-full"
  />
  
  <input
    type="text"
    placeholder="Tags (comma separated)"
    value={tags}
    onChange={(e) => setTags(e.target.value)}
    className="border border-[#B88E2F] rounded p-2 w-full"
  />
  
  <input
    type="file"
    onChange={(e) => setImage(e.target.files[0])}
    className="border border-[#B88E2F] rounded p-2 w-full"
  />
  
  <button
    type="submit"
    className="bg-[#B88E2F] text-white p-2 rounded w-full"
    disabled={loading}
  >
    {loading ? 'Adding Product...' : 'Add Product'}
  </button>
</form>


      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
            <img src={product.imageUrl} alt={product.title} className="w-full h-40 object-cover rounded-md" />
            <h2 className="text-lg font-semibold">{product.title}</h2>
            <p>{product.description.slice(0, 40)}...</p>
            <p className="text-gray-500">Price: ${product.price}</p>
            <p className="text-gray-500">Discount: {product.discountPercentage}%</p>
            <p className="text-gray-500">Tags: {product.tags.join(', ')}</p>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
            </div>

            {editingProduct && editingProduct._id === product._id && (
              <div className="mt-4">
                <form onSubmit={handleUpdate} className="space-y-4">
                  <input
                    type="text"
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct((prev) => ({ ...prev, title: e.target.value }))}
                    className="border rounded p-2 w-full"
                  />
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct((prev) => ({ ...prev, description: e.target.value }))}
                    className="border rounded p-2 w-full"
                  />
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct((prev) => ({ ...prev, price: e.target.value }))}
                    className="border rounded p-2 w-full"
                  />
                  <input
                    type="number"
                    value={editingProduct.discountPercentage}
                    onChange={(e) => setEditingProduct((prev) => ({ ...prev, discountPercentage: e.target.value }))}
                    className="border rounded p-2 w-full"
                  />
                  <input
                    type="file"
                    onChange={(e) => setNewImage(e.target.files[0])}
                    className="border rounded p-2 w-full"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded w-full"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>



 </div>
)}







{userRole === 'manager' && (
  <div>
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Admin Dashboard</h1>

      {/* Orders Table */}
      <div className="overflow-x-auto mt-8">
        <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#B88E2F] text-white text-lg">
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Products</th>
              <th className="p-4 text-left">Total Price</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id} className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                <td className="p-4">{order._id}</td>
                <td className="p-4">{order.email}</td>
                <td className="p-4">{order.products?.map((p) => p.title).join(', ')}</td>
                <td className="p-4 font-bold">Rs {order.totalPrice}</td>
                <td className="p-4">{order.status}</td>
                <td className="p-4">{new Date(order.orderDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Products List with Search */}
      <div className="mt-10">
        <h2 className="text-4xl font-bold text-center mb-6">Your Company Products</h2>
        
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products by title..."
            className="w-full p-4 border rounded-lg"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products
            .filter(product => product.title.toLowerCase().includes(searchTerm.toLowerCase())) // Filter products based on search term
            .map((product) => (
              <div key={product._id} className="bg-white p-4 shadow-md rounded-lg">
                <img src={product.imageUrl} alt={product.title} className="w-full h-40 object-cover rounded-md" />
                <h3 className="text-xl font-semibold mt-2">{product.title}</h3>
                <p className="text-gray-500">{product.description}</p>
                <p className="font-bold mt-2">Rs {product.price}</p>
                <p className="text-sm text-gray-500">Tags: {product.tags.join(', ')}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Analytics Graph */}
      <div className="mt-10">
        <h2 className="text-4xl font-bold text-center mb-6">Company Analytics</h2>
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Order Overview</h3>
          <div className="h-[30rem] w-9/10 mx-auto">
            <Line data={graphData} options={options} />
          </div>
        </div>
      </div>
    </div>
  </div>
)}



    </div>
  );
};


export default AdminDashboard;


