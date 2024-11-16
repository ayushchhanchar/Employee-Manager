import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { CollapsedAtom } from '../atom/Collapsed'
import SideBar from '../components/SideBar'
import HomeNavBar from '../NavigationBar/HomeNavBar'
import HomeNavBar2 from '../NavigationBar/HomeNavBar2'
// import Calendar from 'react-calendar'
// import '../styles/Calender.css';
import { Calendar, Modal, Radio } from 'antd';
import 'antd/dist/reset.css';
import AttendenceNavBar from '../NavigationBar/attendenceNavBar'
import { ScaleLoader } from 'react-spinners';




const Attendence = ({titles,main}) => {
  const isCollapsed = useRecoilValue(CollapsedAtom);

  const [loading, setLoading] = useState(true);


    useEffect(() => {
        // Simulate a delay (e.g., fetching data) before the page is fully loaded
        setTimeout(() => {
        setLoading(false);
        }, 600); // Adjust time as needed
    }, []);
 

  // const [value, setValue] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('');

  const handleDateClick = (date) => {
    setSelectedDate(date.format('YYYY-MM-DD'));
    setStatus(attendance[date.format('YYYY-MM-DD')] || ''); // Set previous status if exists
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (selectedDate) {
      setAttendance({
        ...attendance,
        [selectedDate]: status, // Set status for the selected date
      });
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const dateCellRender = (value) => {
    const currentDate = value.format('YYYY-MM-DD');
    const dayStatus = attendance[currentDate];
    if (dayStatus) {
      return (
        <div
          className={`text-center p-1 rounded ${
            dayStatus === 'Present'
              ? 'bg-green-200 text-green-700'
              : dayStatus === 'Absent'
              ? 'bg-red-200 text-red-700'
              : 'bg-yellow-200 text-yellow-700'
          }`}
        >
          {dayStatus}
        </div>
      );
    }
    return null;
  };

  return (

    <>
    {loading ? (
      <div className="loader-container">
        <ScaleLoader color="#3498db" loading={loading} height={50} width={6} radius={2} margin={2} />
      </div>
    ) : (
    <>
      <SideBar />
      <AttendenceNavBar />
      {/* <HomeNavBar titles={["Myspace"]} /> */}
      <HomeNavBar2 titles={["Attendence Summary"]} name={"mydata"} main={"attendence"} />
      <div className={`${isCollapsed ? 'bg-slate-300 w-[95vw] h-[140vh] float-end p-10  flex flex-col items-center justify-center ' : ' bg-slate-300 h-[140vh] w-[80vw] float-end  px-28  py-14  gap-2  flex flex-col items-center justify-center p-4'}`}>
          {/* <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 p-4"> */}
          <h1 className="text-2xl font-bold my-10">Attendance Calendar</h1>
          
          <div className="w-[100vw] max-w-4xl bg-white rounded-lg shadow-lg p-6">
            {/* Ant Design Calendar */}
            <Calendar 
              dateCellRender={dateCellRender}
              onSelect={handleDateClick}
            />
          </div>

          {/* Ant Design Modal for marking attendance */}
          <Modal
            title={`Select Status for ${selectedDate}`}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            centered
          >
            <Radio.Group onChange={handleStatusChange} value={status}>
              <Radio value="Present">Present</Radio>
              <Radio value="Absent">Absent</Radio>
              <Radio value="Holiday">Holiday</Radio>
            </Radio.Group>
          </Modal>
        </div>
    {/* </div> */}

    </>
  )}
      
  </>
  )
}

export default Attendence