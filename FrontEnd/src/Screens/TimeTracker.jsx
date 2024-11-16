import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { CollapsedAtom } from '../atom/Collapsed'
import SideBar from '../components/SideBar'
import DataCard from '../components/DataCard'
import HomeNavBar2 from '../NavigationBar/HomeNavBar2'
import TimeTrackerNavBar from '../NavigationBar/TimeTrackerNavBar'
import { VscDebugStart } from "react-icons/vsc";
import { PiPauseBold } from "react-icons/pi";
import { GrPowerReset } from "react-icons/gr";
import { ScaleLoader } from 'react-spinners';
import '../styles/loader.css'

import { useStopwatch, useTimer } from 'react-timer-hook'



const TimeTracker = () => {
    const isCollapsed = useRecoilValue(CollapsedAtom);

    const [selectedOption1, setSelectedOption1] = useState(""); // Initial state is empty
    const [selectedOption2, setSelectedOption2] = useState("");
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        // Simulate a delay (e.g., fetching data) before the page is fully loaded
        setTimeout(() => {
        setLoading(false);
        }, 600); // Adjust time as needed
    }, []);
 

    const handleChange1 = (e) => {
        setSelectedOption1(e.target.value); // Update state when dropdown value changes
    };
    const handleChange2 = (e) => {
        setSelectedOption2(e.target.value); // Update state when dropdown value changes
    };


    const startHandler = () => {
        isRunning ? pause() : start()
    }
    const Resethandler = () => {
        stop()
        reset()
    }


    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        isRunning,
        start,
        pause,
        reset,
    } = useStopwatch({ autoStart: true });

    


    return (


        <>
        {loading ? (
          <div className="loader-container">
            <ScaleLoader color="#3498db" loading={loading} height={50} width={6} radius={2} margin={2} />
          </div>
        ) : (
            <>
            <SideBar />
            <TimeTrackerNavBar />
            <HomeNavBar2 titles={["Timelogs"]} name={"mydata"} main={"timetracker"} />
            <div className={`${isCollapsed ? 'bg-slate-300  w-[95vw] float-end p-16 flex flex-wrap gap-10' : 'bg-slate-300 flex-wrap  w-[80%] float-end  px-28  py-14  flex gap-28'}`}>
                <div className='h-16 w-[95vw] rounded-lg bg-white flex items-center justify-between gap-9 px-14'>
                    <div className='flex justify-center items-center gap-4'>
                        <label>
                            <select className='border text-[15px] border-slate-300 rounded-md px-3 py-2' id="dropdown" value={selectedOption1} onChange={handleChange1}>
                                <option value="">Select Project</option>
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
                                <option value="option3">Option 3</option>
                            </select>
                        </label>
                        <label>
                            <select className='border  text-[15px] border-slate-300 rounded-md px-3 py-2' id="dropdown" value={selectedOption2} onChange={handleChange2}>
                                <option value="">Select Job</option>
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
                                <option value="option3">Option 3</option>
                            </select>
                        </label>
                        <label>
                            <input className='border  text-[15px] border-slate-300 rounded-md  pl-2 pr-5 py-2' name='Work' placeholder='what are you working on?' />
                        </label>
                    </div>
                    <div className={`${isCollapsed ? 'flex items-center justify-center gap-2 ' : 'flex items-center justify-center gap-2'}`}>
                        <div className={`${isCollapsed ? 'bg-green-400 text-[15px] px-6 py-2 rounded-lg ' : 'bg-green-400 text-[15px] px-6 py-2 rounded-lg'}`}>
                            <span>{hours.toString().padStart(2, '0')}</span>:
                            <span>{minutes.toString().padStart(2, '0')}</span>:
                            <span>{seconds.toString().padStart(2, '0')}</span>
                        </div>
                        <button onClick={startHandler} className={`${isCollapsed ? 'bg-red-600 text-white text-[15px] px-6 py-2 rounded-lg ' : 'bg-red-600 text-white text-[15px] px-6 py-2 rounded-lg'}`}>
                            {isRunning ? <div className='flex justify-center items-center gap-2 '><PiPauseBold className='text-xs' />Stop</div> : <div className='flex justify-center items-center gap-2'><VscDebugStart className='text-xs' /> Start</div>}
                        </button>
                        <button onClick={Resethandler} className={`${isCollapsed ? '  text-[15px] px-6 py-2 rounded-lg' : ' text-[15px] px-6 py-2 rounded-lg '}`}>
                            <div className='flex justify-center items-center gap-2'><GrPowerReset className='text-xs' />Restart</div>
                        </button>
                    </div>

                </div>
                <DataCard />

            </div>
        </>
        )}
      
    </>
    )
}

export default TimeTracker



// bg-green-400 text-[15px] px-6 py-2 rounded-md ml-32