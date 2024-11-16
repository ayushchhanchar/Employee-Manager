import React from 'react'

const UpcomingCard = () => {
    return (
        <div className='Card h-[50vh] w-[27vw] bg-slate-100 rounded-md'>
            <div className=' w-full h-[10vh] border-b-2 flex items-center justify-start px-[2vw] text-2xl '>
                <h1>Upcoming Holidays</h1>
            </div>
            <div className='w-full h-64 flex items-center justify-center '>
                <h3 className='text-slate-400'>No Data</h3>
            </div>
        </div>
    )
}

export default UpcomingCard