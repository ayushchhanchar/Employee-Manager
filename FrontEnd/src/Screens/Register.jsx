import React, { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { TiVendorMicrosoft } from "react-icons/ti";
import { FaApple } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
            console.log('User registered successfully');
            navigate('/login'); // Redirect to login page
            
        } catch (error) {
            console.error('Registration error:', error.response.data.msg);
            alert('User already exists');
        }
    };

    return (
        <div className='h-screen w-screen bg-white flex items-center justify-center '>
            <div className=' w-[25%] flex-col flex items-center'>
                <h1 className=' font-bold mb-5 text-2xl'>Create an Account</h1>
                <input
                    className='border border-w-1 border-black rounded-md py-2 pr-28 pl-4 w-[90%]'
                    placeholder='Enter Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className='border border-w-1 border-black rounded-md py-2 pr-28 pl-4 w-[90%]'
                    placeholder='Enter Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className='border border-w-1 border-black rounded-md py-2 pr-28 pl-4 w-[90%]'
                    type="password"
                    placeholder='Enter Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleRegister} className='bg-green-500 py-2 px-2 w-full text-white rounded-md'>Continue</button>
                <p>Already have an account? <Link to='/login' className='text-green-400'>Login</Link></p>
            </div>
        </div>
    );
};

export default Register;
