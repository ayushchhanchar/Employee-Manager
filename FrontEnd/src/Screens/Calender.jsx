import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { CollapsedAtom } from '../atom/Collapsed'
import Calendar from 'react-calendar'
import '../styles/Calender.css';
import SideBar from '../components/SideBar'
import HomeNavBar from '../NavigationBar/HomeNavBar';
import HomeNavBar2 from '../NavigationBar/HomeNavBar2';



const Calender = () => {
  const isCollapsed = useRecoilValue(CollapsedAtom);

  const [value, setValue] = useState(new Date());

  return (
    <>
      <SideBar />
      <HomeNavBar />
      <HomeNavBar2 titles={["Overview", "Dashboard", "Calender"]} name={"myspace"} main={"home"} />
      <div className={`${isCollapsed ? 'bg-slate-300 h-[95vh] w-[95vw] float-end p-16 ' : 'bg-slate-300  h-[95vh] w-[80%] float-end  px-28  py-14  gap-28'}`}>
        <Calendar onChange={setValue} value={value} />
      </div>
    </>

  )
}

export default Calender