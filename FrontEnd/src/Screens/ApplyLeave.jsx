import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { leaveAtom } from "../atom/Collapsed";
import { useState } from "react";


const ApplyLeave = () => {
  const [isLeave,setIsleave] = useRecoilState(leaveAtom);
  const [selectedOption, setSelectedOption] = useState("");


  return (
    <div className="flex w-screen h-screen justify-center items-center bg-slate-300  bg-blend-normal	">
      <div className="h-4/5 w-1/2 p-4 bg-white border border-gray-200 rounded-lg shadow ">
        <form className="space-y-6" action="#">
          <h5 className="text-xl font-medium text-gray-900 ">Apply Leave</h5>
          <div>
            <label>
              <h4>
                Leave Type <sup className="text-lg text-red-600">*</sup>
              </h4>
              <select
                className="w-full border border-gray-400 mt-2 p-1 rounded-md"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="">Select Project</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              <h4>
                Date <sup className="text-lg text-red-600">*</sup>
              </h4>
              <div className="flex gap-4 justify-center items-center">
                <h6>From:</h6>
                <input
                  className="w-full border border-gray-400 mt-2 p-1 rounded-md"
                  type="date"
                />
                <h6>To:</h6>
                <input
                  className="w-full border border-gray-400 mt-2 p-1 rounded-md"
                  type="date"
                />
              </div>
            </label>
          </div>
          <div>
            <label>
              <h4>Team Email</h4>
              <input
                className="w-full border border-gray-400 mt-2 p-1 rounded-md"
                placeholder="Enter E-mail"
                type="email"
              />
            </label>
          </div>
          <div>
            <label>
              <h4>Reason fo leave</h4>
              <input
                className="w-full border border-gray-400 mt-2 p-1 rounded-md"
                type="text"
              />
            </label>
          </div>
          <div className="flex justify-center gap-10 p-10">
            <button
              type="submit"
              onClick={() => { setIsleave(false); }}
              className="w-1/3 text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            >
              Submit
            </button>
            <button
              type="submit"
              onClick={() => { setIsleave(false); }}
              className="w-1/3 text-black bg-white-700 border border-gray-400  hover:bg-gray-200  font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
