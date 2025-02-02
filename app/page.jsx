'use client';

import { useState } from 'react';
import { auth } from '../app/Firebas/config.js'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation.js';
import Link from 'next/link.js';

const page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError(''); 
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/Login'); 
    } catch (err) {
      setLoading(false); 
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already exists! Please use a different email.');
      } else {
        setError('Email Already exists');
      }
    }
  };

  return (
    <div className="flex w-[100%] justify-center items-center min-h-screen bg-[#F9F1E7]">
      <div className="w-[30%] login-container  p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-center mb-6">Sign Up</h2>
        {error && <p className="text-red-500 text-xl">{error}</p>}
        <form onSubmit={handleSignup}>
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
            className={`w-full py-3 text-[1.5rem] ${loading ? 'bg-[#F9F1E7] text-[#B88E2F] font-bold' : 'bg-[#F9F1E7] font-bold'} text-[#B88E2F]  rounded-md hover:bg-[#F9F1E7]`} 
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-2xl">
          Already have an account?{' '}
          <Link href="/signin" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default page;
