import React from 'react'
import { useRecoilState } from 'recoil'
import { holidayAtom } from '../atom/Collapsed'

const AddHoliday = () => {
    const setIsaddholiday = useRecoilState(holidayAtom)
    return (
        <>
            <form className='w-[100vw] h-[100vh] flex  justify-center  items-center' action="">
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl">Add Holiday</h1>
                    <div className="flex flex-col gap-4">
                        <label>
                            <h3>Holiday Name</h3>
                            <input type="text" className="border border-gray-300 p-2 rounded-md" />
                        </label>
                        <label>
                            <h3>Date</h3>
                            <input type="date" className="border border-gray-300 p-2 rounded-md" />
                        </label>
                        <label>
                            <h3>Day</h3>
                            <input type="text" className="border border-gray-300 p-2 rounded-md" />
                        </label>
                        <label>
                            <h3>Month</h3>
                            <input type="text" className="border border-gray-300 p-2 rounded-md" />
                        </label>
                        <label>
                            <h3>Year</h3>
                            <input type="text" className="border border-gray-300 p-2 rounded-md" />
                        </label>
                    </div>
                    <div className='flex gap-2'>
                        <button className="bg-[#0088FF] py-2 border rounded-md text-white px-5 mt-2">Add Holiday</button>
                        <button onClick={() => setIsaddholiday(true)} className="bg-[#0088FF] py-2 border rounded-md text-white px-5 mt-2">Cancel</button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default AddHoliday