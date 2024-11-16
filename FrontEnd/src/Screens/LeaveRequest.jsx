import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { CollapsedAtom, leaveAtom } from "../atom/Collapsed";
import SideBar from "../components/SideBar";
import HomeNavBar2 from "../NavigationBar/HomeNavBar2";
import LeaveTrackerNavBar from "../NavigationBar/LeaveTrackerNavBar";
import ApplyLeave from "./ApplyLeave";

const LeaveRequest = () => {
  const isCollapsed = useRecoilValue(CollapsedAtom);
  const [isLeave,setIsleave]=useRecoilState(leaveAtom)

  const LeaveRequestPage = () => {
    return (
        <>
        <SideBar />
             <LeaveTrackerNavBar />
      <HomeNavBar2
        titles={["Leave Summary", "Leave Balance", "Leave Request"]}
        name={"mydata"}
        main={"trackLeave"}
      />
      <div
        className={`${
          isCollapsed
            ? " h-[90vh] w-[95vw] float-end p-16 "
            : "  h-[90vh] w-[80%] float-end  px-28  py-14  gap-28"
        }`}
      >
        <div className="flex flex-col justify-center items-center">
          <img
            className="h-48 w-48 "
            src="https://static.zohocdn.com/zp5/people5/images/nodata/no_record.b8bf88a48edee681e9dc20e785deb816.svg"
            alt=""
          />
          <p>No Data Found</p>
          <button className=" bg-[#0088FF] py-2 border rounded-md text-white px-5 mt-2 " onClick={()=>setIsleave(true)}>Add Request</button>
        </div>
      </div>
        </>
    )
}
  return (
    <>
        {isLeave ? <ApplyLeave /> :<LeaveRequestPage />}

     
    </>
  );
};

export default LeaveRequest;
