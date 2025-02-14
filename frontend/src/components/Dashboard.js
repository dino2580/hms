import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faUsers,
  faSadTear,
  faFileAlt,
  faUsersCog,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import ComplaintForm from "./ComplaintForm";

import Sidebardashboard from "./sidebardashboard";

function Dashboard() {
  const { hostel_no } = useParams();
  const [loading, setLoading] = useState(true);
  const [showComponent, setShowComponent] = useState(false);
  const [hostelData, setHostelData] = useState([]);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchHostelData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/gethostel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hostel_no }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setHostelData(data);
          setLoading(false);
        } else {
          console.error("Failed to fetch hostel data");
        }
      } catch (error) {
        console.error("Error fetching hostel data:", error);
      }
    };

    const fetchComplaints = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/getcomplaint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hostel_no }),
        });
        if (response.ok) {
          const data = await response.json();
          setComplaints(data);
          console.log(complaints)
        } else {
          console.error("Failed to fetch complaints");
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchHostelData();
    fetchComplaints();
  }, [hostel_no]);

  const calculateComplaintStats = (complaints) => {
    let total = 0;
    let solved = 0;
    let unsolved = 0;
  
    complaints.forEach(complaint => {
      console.log("complaint_status"+complaint.complaint_status)
      total++;
      if (complaint.complaint_status) {
        solved++;
      } else {
        unsolved++;
      }
    });
  
    return { total, solved, unsolved };
  };
  let { total, solved, unsolved } = calculateComplaintStats(complaints);
  
  console.log(total+"j"+solved+"d"+unsolved)
  const calculateOccupancyPercentage = (occupiedRooms, total_rooms) => {
    return ((occupiedRooms / total_rooms) * 100).toFixed(2);
};
console.log("hostelData")
console.log(hostelData)

const occupancyData = {
    name: hostelData.hostel_name,
    hostel_no:hostelData.hostel_no,
    percentage: calculateOccupancyPercentage(hostelData.occupied_rooms, hostelData.total_rooms),
    emptyPercentage: (100 - (hostelData.occupied_rooms / hostelData.total_rooms) * 100).toFixed(2),
  };
// const occupancyData=[];

console.log('Occupancy Data:', occupancyData);

  const getColorForPercentage = (percentage) => {
    if (percentage < 50) {
      return '#4fd1c5';
    } else if (percentage < 80) {
      return '#fde047';
    } else {
      return '#e53e3e';
    }
  };

  const toggleComplaintForm = () => {
    setShowComponent(!showComponent);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    // <div>hey</div>
    <div className="h-100vh p-4 bg-back">
      <div className="container mx-auto">
        <div className="flex justify-center items-start gap-8 mt-2">
          <Sidebardashboard hostel_no={hostel_no}/>
          <div className="w-full md:w-5/6 bg-white p-8 rounded-xl bg-opacity-60">
            <div className="flex justify-center">
              <h1 className="text-black text-2xl font-bold item-center mb-4 mt-0">
                Welcome back to {hostelData.hostel_no} !!
              </h1>
            </div>
            <div className="bg-white p-4 rounded-xl">
              <h2 className="text-black text-xl font-semibold item-center mb-4 mt-0">
                Quick Insights{" "}
              </h2>
              <div className="bg-white px-7">
                <div className="grid grid-cols-3 md:grid-cols-3 gap-6 cursor-pointer">
                  {/* Occupancy Rate */}
                  <div className="bg-admin p-6 rounded-lg hover:shadow-2xl hover:bg-teal-300 transition ease-in-out duration-800 flex flex-col">
                    <h2 className="text-xl font-semibold mb-4 text-black mx-auto">
                      Occupancy Rate
                    </h2>
                    <div className="flex items-center justify-center">
                      <div className="w-32 h-32">
                        <CircularProgressbar
                          value={occupancyData.percentage}
                          text={`${occupancyData.percentage}%`}
                          styles={buildStyles({
                            pathColor: "#4fd1c5",
                            textColor: "black",
                            trailColor: "#333",
                            strokeWidth: 10,
                          })}
                          strokeWidth={10}
                        />
                      </div>
                    </div>
                    
                    
                    <p className="text-md text-black mt-2 mx-auto ">
                      Occupied rooms:{hostelData.occupied_rooms}
                
                    </p>
                  </div>
                  {/* Present Students */}
                  <div className="bg-admin p-6 rounded-lg hover:shadow-2xl hover:bg-teal-300 transition ease-in-out duration-800 flex flex-col">
                    <h2 className="text-xl text-black font-semibold mb-4 mx-auto ">
                      Present Students
                    </h2>
                    <div className="flex items-center justify-center">
                      <div className="w-32 h-32">
                        <CircularProgressbar
                          value={Math.min((hostelData.students_present / hostelData.student_capacity) * 100, 100)}
                          text={`${((hostelData.students_present / hostelData.student_capacity) * 100-13.67).toFixed(2)}%`}
                          styles={buildStyles({
                            pathColor: "#fde047",
                            textColor: "black",
                            trailColor: "#333",
                            strokeWidth: 10,
                            fontWeight: "bold",
                          })}
                          strokeWidth={10}
                        />
                      </div>
                    </div>
                    <p className="text-md text-black mt-2 mx-auto">
                      Students present:{hostelData.students_present}
                    </p>
                  </div>
                  {/* Additional Quick Insights */}
                  {/* <div className="bg-admin p-6 rounded-lg hover:shadow-2xl hover:bg-teal-300 transition ease-in-out duration-800 flex flex-col">
                    <h2 className="text-xl text-black font-semibold mb-4 mx-auto ">
                      Additional Quick Insights
                    </h2>
                    <div className="flex items-center justify-center">
                      Content Here
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="mt-8 bg-white rounded-xl p-4">
              <h2 className="text-xl text-black font-semibold mb-4">
                Complaints
              </h2>
              <div className="grid grid-cols-3 gap-6">
                {/* Total Complaints */}
                <div className="bg-blue-300 p-6 rounded-lg hover:shadow-2xl hover:bg-teal-300 transition ease-in-out duration-800 flex flex-col">
                  <h3 className="text-lg text-black font-semibold mb-2">
                    Total Complaints:
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-semibold text-black">
                      {total}
                    </p>
                    <span className="text-sm text-black">
                      +10% from last month
                    </span>
                  </div>
                </div>
                {/* Solved Complaints */}
                <div className="bg-green-300 p-6 rounded-lg hover:shadow-2xl hover:bg-teal-300 transition ease-in-out duration-800 flex flex-col">
                  <h3 className="text-lg font-semibold mb-2 text-black">
                    Solved Complaints
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-semibold text-black">
                      {solved}
                    </p>
                    <span className="text-sm text-black">
                      -5% from last month
                    </span>
                  </div>
                </div>
                {/* Pending Complaints */}
                <div className="bg-red-400 p-6 rounded-lg hover:shadow-2xl hover:bg-teal-300 transition ease-in-out duration-800 flex flex-col">
                  <h3 className="text-lg font-semibold mb-2 text-black">
                    Pending Complaints
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-semibold text-black">
                      {unsolved}
                    </p>
                    <span className="text-sm text-black">
                      +20% from last month
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 bg-white rounded-xl p-4 ">
              <h2 className="text-xl text-black font-semibold mb-4">
                Fee Details
              </h2>
              <div className="flex items-center space-x-40 px-10">
                {/* Expected Fee */}
                <div className="w-32 h-32 relative">
                  <CircularProgressbar
                    value={
                      (hostelData.collectedFee / hostelData.expectedFee) * 100
                    }
                    text={`${Math.floor(
                      (hostelData.collectedFee / hostelData.expectedFee) * 100
                    )}%`}
                    styles={buildStyles({
                      pathColor: "#fde047",
                      textColor: "black",
                      trailColor: "#333",
                      strokeWidth: 10,
                    })}
                    strokeWidth={10}
                  />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <i className="fas fa-coins fa-lg text-yellow-500"></i>
                  </div>
                </div>
                {/* Fee Details */}
                <div className="flex space-x-8">
                  <div className="flex flex-col bg-blue-300 px-4 py-2 rounded-xl hover:shadow-2xl hover:bg-teal-300 transition ease-in-out duration-800">
                    <h3 className="text-lg text-black font-semibold mb-2">
                      Expected Fee
                    </h3>
                    <p className="text-center">{hostelData.expectedFee}</p>
                  </div>
                  <div className="flex flex-col bg-green-300 px-4 py-2 rounded-xl hover:shadow-2xl hover:bg-teal-300 transition ease-in-out duration-800">
                    <h3 className="text-lg text-black font-semibold mb-2">
                      Collected Fee
                    </h3>
                    <p className="text-center">{hostelData.collectedFee}</p>
                  </div>
                  <div className="flex flex-col bg-red-400 px-4 py-2 rounded-xl hover:shadow-2xl hover:bg-teal-300 transition ease-in-out duration-800">
                    <h3 className="text-lg text-black font-semibold mb-2">
                      Remaining Fee
                    </h3>
                    <p className="text-center">{hostelData.remainingFee}</p>
                  </div>
                </div>
              </div>
              <div className="fixed bottom-8 left-8">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-black py-2 px-4 rounded-full transition duration-300"
                  onClick={toggleComplaintForm}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  {showComponent
                    ? "Close Complaint Form"
                    : "Register New Complaint"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {showComponent && <ComplaintForm />}
      </div>
    </div>
  );
}

export default Dashboard;
