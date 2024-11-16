import React from 'react'
import { useRecoilValue } from 'recoil'
import { CollapsedAtom } from '../atom/Collapsed'
import SideBar from '../components/SideBar'
import HomeNavBar from '../NavigationBar/HomeNavBar'
import HomeNavBar2 from '../NavigationBar/HomeNavBar2'


const Announcement = () => {
    const isCollapsed = useRecoilValue(CollapsedAtom);
    return (
        <>
            <SideBar />
            <HomeNavBar />
            <HomeNavBar2 titles={["Overview", "Announcement"]} name={"Organization"} main={"home"}  />
            <div className={`${isCollapsed ? 'bg-slate-300 h-[95vh] w-[95vw] float-end p-16 ' : 'bg-slate-300  h-[95vh] w-[80%] float-end  px-28  py-14  gap-28'}`}>
                <h2>Announcement..</h2>
            </div>
        </>
    )
}

export default Announcement