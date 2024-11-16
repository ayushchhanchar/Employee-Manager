import React from 'react'
import { CiMobile1 } from "react-icons/ci";
import { MdOutlineLocalPhone } from "react-icons/md";


const Card = ({title}) => {
  return (
        <div className='Card h-[50vh] w-[27vw] bg-slate-100 rounded-md'>
            <div className=' w-full h-[10vh] border-b-2 flex items-center justify-start px-[2vw] text-2xl '>
                <h1>{title}</h1>
            </div>
            <div className='w-full h-44  flex items-center justify-between border-b-2 '>
                <div className='h-full w-1/4 flex items-center justify-center '>
                    <div className='h-20 w-20 border-2 p-2 flex items-center justify-center rounded-md'>
                        <div className='h-16 w-16 bg-black rounded-md'></div>
                    </div>
                </div>
                <div className='h-full w-3/4 px-4 py-4'>
                    <h4 className='text-1xl bold mt-2'>Lilly Williams</h4>
                    <h4 className='text-1xl bold mt-2'>Administraion Manager</h4>
                    <h4 className=' text-1xl bold mt-2 flex items-center justify-start'><MdOutlineLocalPhone/>23</h4>
                    <h4 className='text-1xl bold mt-2 flex items-center justify-start'><CiMobile1/> Lilly Williams</h4>
                </div>
      </div>
    </div>
  )
}

export default Card
