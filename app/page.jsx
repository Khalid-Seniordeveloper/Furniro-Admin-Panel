"use client"
import { useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../app/Firebas/config.js'; 
import { useRouter } from 'next/navigation.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  
  const router = useRouter(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError('');      

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check the user's email and assign role
      if (user.email === "manager@gmail.com") {
        router.push('/DashBoard'); // Admin Dashboard
      } else if (user.email === "productsmanager@gmail.com") {
        router.push('/DashBoard'); // Add Product Dashboard
      } else if (user.email === "salesmanager123@gmail.com") {
        router.push('/DashBoard'); // Sale Dashboard (Only Orders)
      } else {
        setError('Invalid user role'); // Handle unknown users
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);  
    }
  };

  return (
    <div className="flex w-[100%] justify-center items-center min-h-screen bg-[#F9F1E7]">
      <div className="w-[30%] login-container p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-xl">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-2xl font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="w-full mt-2 px-4 text-[1.2rem] py-[1.2rem] border border-gray-300 rounded-md"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-2xl font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="w-full mt-2 px-4 text-[1.2rem] py-[1.2rem] border border-gray-300 rounded-md"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className={`w-full py-3 text-[1.6rem] ${loading ? 'bg-[#F9F1E7] text-[#B88E2F] font-bold ' : 'bg-[#F9F1E7] font-bold'} text-[#B88E2F] rounded-md hover:bg-[#F9F1E7]`} 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
    
      </div>
    </div>
  );
};

export default Login;
