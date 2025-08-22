import React, { useState, useEffect } from "react";
import Flatpickr from "react-flatpickr";
import 'flatpickr/dist/flatpickr.min.css';
import "tailwindcss/tailwind.css"; // Import Tailwind CSS

const InterviewScheduler = () => {
  const [joinEarly, setJoinEarly] = useState(false);
  const [joinOption, setJoinOption] = useState("onTime");
  const [timeWindow, setTimeWindow] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Update button text when a date is selected
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
      }) +
        " at " +
        selectedDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      document.getElementById("confirmBtn").textContent = "Confirm for " + formattedDate;
    }
  }, [selectedDate]);

  const handleConfirm = () => {
    console.log({
      joinEarly: joinEarly,
      joinOption: joinOption,
      timeWindow: joinOption === "timeWindow" ? timeWindow : null,
    });
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-xl font-semibold mb-4">Schedule Interview</h1>
        <p className="mb-4">Please select a suitable time slot for the candidate's interview:</p>

        <Flatpickr
          className="flatpickr inline-block w-full"
          value={selectedDate}
          options={{
            enableTime: true,
            dateFormat: "D M d Y h:i K",
            minDate: "today",
            maxDate: new Date().fp_incr(60), // 60 days from today
            minTime: "11:00 AM",
            maxTime: "5:00 PM",
            time_24hr: false,
            disableMobile: true,
            inline: true,
          }}
          onChange={([date]) => setSelectedDate(date)}
        />

        <div className="mt-4">
          <label className="block mb-2">
            <input
              type="checkbox"
              id="joinEarly"
              className="mr-2"
              checked={joinEarly}
              onChange={() => setJoinEarly(!joinEarly)}
            />
            Allow candidate to join 10 minutes before scheduled time
          </label>
        </div>

        <div className="mt-4">
          <label className="block mb-2">Select Join Options:</label>
          <select
            id="joinOptions"
            className="w-full p-2 border rounded"
            value={joinOption}
            onChange={(e) => setJoinOption(e.target.value)}
          >
            <option value="onTime">Candidate can join only at the scheduled time</option>
            <option value="anytime">Candidate can join anytime</option>
            <option value="timeWindow">Specify time window</option>
          </select>
        </div>

        {joinOption === "timeWindow" && (
          <div className="mt-4">
            <label className="block mb-2">Allow joining within:</label>
            <input
              type="number"
              id="timeWindow"
              className="w-full p-2 border rounded"
              placeholder="Minutes after scheduled time"
              value={timeWindow || ""}
              onChange={(e) => setTimeWindow(e.target.value)}
            />
          </div>
        )}

        <button
          id="confirmBtn"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          onClick={handleConfirm}
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};

export default InterviewScheduler;
