import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { CollapsedAtom } from '../atom/Collapsed'
import SideBar from '../components/SideBar'
import HomeNavBar from '../NavigationBar/HomeNavBar'
import HomeNavBar2 from '../NavigationBar/HomeNavBar2'
import { ScaleLoader } from 'react-spinners';
import '../styles/loader.css'

export const Home = () => {
    const isCollapsed = useRecoilValue(CollapsedAtom);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate a delay (e.g., fetching data) before the page is fully loaded
        setTimeout(() => {
        setLoading(false);
        }, 600); // Adjust time as needed
    }, []);

    return (
        <>
            {loading ? (
        <div className="loader-container">
          <ScaleLoader color="#3498db" loading={loading} height={50} width={6} radius={2} margin={2} />
        </div>
      ) : (
        <>
            <SideBar />
            <HomeNavBar />
            <HomeNavBar2 titles={["Overview", "Dashboard", "Calender"]} name={"myspace"} main={"home"} />
            <div className={`${isCollapsed ? ' relative bg-slate-300 min-h-max  w-[95%] float-end   ' : ' bg-slate-300 relative h-[100vh] w-[80%] float-end '}`}>
                <div className='h-40 w-full relative bg-black' >
                    <img className='h-full w-full relative bg-contain bg-center' src="https://images.unsplash.com/photo-1718062455499-c362df48a68d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                </div>

                <div className=' relative h-fit w-fit '>
                    <div class=" absolute -top-8 left-14 w-72 bg-white border border-gray-200 rounded-lg shadow ">
                        <div class="flex mb-9 flex-col items-center">
                            <img class="w-24 h-24 mt-1  mb-3 rounded-xl bg-black" src="https://penguinui.s3.amazonaws.com/component-assets/avatar-8.webp" alt="Bonnie image" />
                            <h5 class="mb-1 text-xl font-medium text-gray-900 ">Bonnie Green</h5>
                            <span class=" mb-1 text-sm text-gray-500 ">Visual Designer</span>
                            <span class="text-sm text-gray-500 ">00:00:00</span>
                            <div class=" mt-4">
                                <a href="#" class="inline-flex items-center px-4 py-2 text-sm font-medium border  border-green-400 text-center text-green-500 bg-white rounded-lg hover:bg-green-800 hover:text-white  ">Check-In</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </>
      )}
    
    </>
    )
}


