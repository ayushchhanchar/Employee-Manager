import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { useRecoilValue } from "recoil";
import { CollapsedAtom } from "../atom/Collapsed";
import BirthdayCard from "../components/BirthdayCard";
import UpcomingCard from "../components/UpcomingCard";
import SideBar from "../components/SideBar";
import HomeNavBar from "../NavigationBar/HomeNavBar";
import HomeNavBar2 from "../NavigationBar/HomeNavBar2";
import { ScaleLoader } from 'react-spinners';
import '../styles/loader.css'


export const Dashboard = () => {
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
      
          <SideBar />
          <HomeNavBar />
          <HomeNavBar2
            titles={["Overview", "Dashboard", "Calender"]}
            name={"myspace"}
            main={"home"}
          />
          <div
            className={`${
              isCollapsed
                ? "bg-slate-300  w-[95vw] float-end p-16 flex flex-wrap gap-10"
                : "bg-slate-300 flex-wrap  w-[80%] float-end  px-28  py-14  flex gap-28"
            }`}
          >
            <Card title={"Employees"} />
            <BirthdayCard />
            <UpcomingCard />
            <UpcomingCard />
          </div>

        </>

  );
};
