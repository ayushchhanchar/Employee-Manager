import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil';
import { profileAtom } from '../atom/Collapsed';
import { IoClose } from "react-icons/io5";
import { PiSignOutBold } from "react-icons/pi";
import axios from 'axios'
import UserAtom from '../atom/User';


const Profile = () => {
    const [isprofile, setIsprofile] = useRecoilState(profileAtom);
    const [user, setUser] = useRecoilState(UserAtom);


    useEffect(() => {
        const fetchUserProfile = async () => {
          const token = localStorage.getItem('token');
          try {
            const response = await axios.get('http://localhost:5000/api/auth/profile', {
              withCredentials: true,
              headers: {
                Authorization: token ? `Bearer ${token}` : '',
              },
            });
    
            if (response.data) {
              localStorage.setItem('user', JSON.stringify(response.data));
              setUser(response.data);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error.response);  // Error handling
          }
        };
    
        fetchUserProfile();
      }, []);

   
    const handleLogout = () => {
        alert('Logging out...');
        localStorage.removeItem('token');
        window.location.href = '/';
      };

    
    return (
        <div className={`transition-transform duration-500 rounded-lg ease-in-out transform ${isprofile ? "translate-x-8" : "translate-x-[130%]"} fixed h-64 w-56 top-16 right-12 z-50  bg-slate-300 shadow-lg`} >
            <div className="flex justify-between items-center gap-4 border-b-2 border-slate-100 font-semibold p-3">
                <h2 className="text-slate-900">Profile</h2>
                <IoClose  onClick={() => setIsprofile(!isprofile)} className="text-slate-900  cursor-pointer text-2xl" />
            </div>
            <div className="flex flex-col items-start justify-center gap-4 p-4">
                <h3>
                    {user.username}
                </h3>
                <h3>
                    {user.email}
                </h3>
                <div  className=' cursor-pointer flex gap-2  flex-row text-md  w-full mt-6 justify-center items-center text-red-500'>
                    <PiSignOutBold  />
                    <h5 onClick={handleLogout} className='cursor-pointer'>Logout</h5>
                </div>
            </div>
        </div>
    )
}

export default Profile