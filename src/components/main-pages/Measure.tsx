import { useState, useEffect } from "react";
import { format } from "date-fns";
import { io } from "socket.io-client";
import { MuscleList } from "../../data/muscle.ts";
import { GuideList } from "../../data/guides.ts";
import { useDevice } from "../../context/DeviceContext.tsx";
import { useNavigate } from "react-router-dom";
//Vy's
import Dropdown from "../common-components/Dropdown";
import Modal from "../common-components/Modal";
import instruction_biceps from '../../assets/instruction_biceps.jpg';
import dataPointsService from "../../services/datapoints.ts";

interface MeasureProps {
  darkTheme: boolean;
}

const Measure: React.FC<MeasureProps> = ({ darkTheme }) => {
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [workoutPhase, setWorkoutPhase] = useState<"before" | "after" | null>(null);
  const [realTimeData, setRealTimeData] = useState<{ time: string; value: number }[]>([]);
  const { selectedDevice, setSelectedDevice } = useDevice();
  //Vy's
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showStopConfirmModal, setShowStopConfirmModal] = useState(false);
 
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedDevice) {
      alert("Please pair a device before measuring.");
      navigate("/devices");
    }
  }, [selectedDevice, navigate]);

  useEffect(() => {
    const socket = io("https://lambda.proto.aalto.fi/");

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("dataPointUpdate", (dataPoint: { createdAt: string; value: number }) => {
      console.log("Received dataPoint:", dataPoint);
      const humanReadableTime = format(new Date(dataPoint.createdAt), "yyyy-MM-dd HH:mm:ss");
      console.log("Received new dataPoint:", { ...dataPoint, time: humanReadableTime });
      setRealTimeData((prevData) => [
        ...prevData,
        { time: humanReadableTime, value: dataPoint.value },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMuscleClick = (muscle: string) => {
    setSelectedMuscle((prev) => (prev === muscle ? null : muscle));
  };

  const getPlacementGuide = (muscle: string) => {
    const guide = GuideList.find((guide) => guide.muscles.includes(muscle));
    return guide?.image;
  };
  //Vy's
  const getmuscleImage = (muscle: string) => {
    const guide = MuscleList.find((guide) => guide.name === muscle);
    return guide?.image;
  };

  const handleStart = async () => {
    if (selectedMuscle && workoutPhase) {
      // Show placement guide first, don't start measuring yet
      setShowInstructionModal(true);
    } else {
      alert("Please select a muscle and a workout phase before starting the measurement.");
    }
  };
  // After clicking "Got it" in the placement guide modal
  const handleConfirmStart = async () => {
    setShowInstructionModal(false);
    // Actually start measuring and create initial data
    if (selectedMuscle && workoutPhase) {
      const selectedOption = workoutOptions.find(opt => opt.name === selectedMuscle);
      const muscleTypeApiName = selectedOption?.api_name || selectedMuscle;
      console.log("IP Address:", selectedDevice?.ipAddress);
      await dataPointsService.createInitialData(
        {
          deviceId: selectedDevice?.deviceId,
          muscleType: muscleTypeApiName,
          phaseTrack: workoutPhase,
          value: 0
        }
      ).then((response) => {
        console.log("Initial data created:", response);
        setIsMeasuring(true);
      }).catch((error) => {
        console.error("Error creating initial data:", error);
      });
    }
    if (selectedDevice?.deviceId) {
      await dataPointsService.startProcess(selectedDevice.deviceId, selectedDevice.ipAddress).then((response) => {
        console.log("Process started:", response);
      }).catch((error) => {
        console.error("Error starting process:", error);
      });
    } else {
      console.error("Device ID is undefined. Cannot start process.");
    }
  };

  const handleStop = () => {
    //setIsMeasuring(false);
    setShowStopConfirmModal(true);
  };

  //Vy's
  const handleConfirmStop = () => {
    setIsMeasuring(false);
    setShowStopConfirmModal(false);
  };

  const handleWorkoutPhase = (phase: "before" | "after") => {
    setWorkoutPhase(phase);
  };

  const handleBackToDevices = () => {
    setSelectedDevice(null); // Deselect the device
    navigate("/devices"); // Redirect to the Devices page
  };

  //Vy's
  const workoutOptions = [
    { name: "Arms", isCategory: true, api_name: "arms" },
    { name: "Left Bicep", category: "Arms", api_name: "left_bicep" },
    { name: "Right Bicep", category: "Arms", api_name: "right_bicep" },
    { name: "Legs", isCategory: true, api_name: "legs" },
    { name: "Left Calve", category: "Legs", api_name: "left_calve" },
    { name: "Right Calve", category: "Legs", api_name: "right_calve" },
  ];
  return (
    <div
      className={`flex flex-col items-center gap-6 md:gap-8 justify-center min-h-screen w-screen max-w-screen overflow-y-auto
pb-8 ${
        darkTheme ? "bg-primary_dark text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="font-primary text-3xl md:text-5xl pt-20 md:pt-28 font-bold text-center">Measure</h1>
      <div
        className={`p-4 md:p-6 rounded-lg shadow-md w-11/12 md:w-2/3 max-w-lg ${
          darkTheme ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-300"
        }`}
      >
      <h2 className="text-xl md:text-xl font-mono font-semibold text-center">
        Measuring with Device: <strong>{selectedDevice?.deviceId}</strong>
      </h2>

      <div className="flex flex-col items-center gap-3 mt-4 ">
        <p className={`text-sm md:text-base font-mono ${ darkTheme? "text-white/50" : "text-black/50" } font-medium text-left`}>
          Select a workout phase
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            className={`py-2 px-2 md:px-3 rounded-lg font-mono text-sm md:text-base ${
              workoutPhase === "before"
                ? "bg-blue-500 text-white"
                : darkTheme
                ? "bg-transparent border-2 border-solid border-white text-white"
                : "bg-transparent border-2 border-solid border-black text-black"
            } hover:bg-blue-600 cursor-pointer`}
            onClick={() => handleWorkoutPhase("before")}
          >
            Before Workout
          </button>
          
          <button
            className={`py-2 px-2 md:px-3 rounded-lg font-mono text-sm md:text-base ${
              workoutPhase === "after"
                ? "bg-blue-500 text-white" 
                : darkTheme
                ? "bg-transparent border-2 border-solid border-white text-white"
                : "bg-transparent border-2 border-solid border-black text-black"
            } hover:bg-blue-600 cursor-pointer`}
            onClick={() => handleWorkoutPhase("after")}
          >
            After Workout
          </button>
          
        </div>
        <p className={`text-sm md:text-base font-mono ${ darkTheme? "text-white/50" : "text-black/50" } font-medium text-left`}>
          Select a muscle group
        </p>
        {/*Dropdown list */}
        <div>
          <Dropdown title="Choose Muscle" optionList={workoutOptions} darkTheme={darkTheme} onSelect={handleMuscleClick} selectedValue={selectedMuscle}/>
        </div> 
      </div>

      {selectedMuscle && (
        <div className="mt-6 md:mt-8 text-center flex items-center flex-col">
          <p className="text-lg md:text-xl font-mono font-semibold">Selected Muscle: {selectedMuscle}</p>
          <img
            src={getmuscleImage(selectedMuscle) || ""}
            alt={`${selectedMuscle}`}
            className="mt-4 w-48 md:w-64 object-cover rounded-md"
          />
        </div>
      )} 
      {/*
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
        {MuscleList.map((muscle) => (
          <div
            key={muscle.name}
            className={`flex flex-col items-center p-3 md:p-4 border rounded-lg shadow-md cursor-pointer ${
              selectedMuscle === muscle.name
                ? "border-blue-500"
                : darkTheme
                ? "border-gray-700"
                : "border-gray-300"
            } hover:shadow-lg transition-all`}
            onClick={() => handleMuscleClick(muscle.name)}
          >
            <img
              src={muscle.image}
              alt={muscle.name}
              className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-md"
            />
            <p className="mt-2 md:mt-4 text-sm md:text-lg font-medium">{muscle.name}</p>
          </div>
        ))}
      </div> 

      {selectedMuscle && (
        <div className="mt-6 md:mt-8 text-center flex items-center flex-col">
          <p className="text-lg md:text-xl font-semibold">Selected Muscle: {selectedMuscle}</p>
          <p className="mt-2 text-sm md:text-lg">Please place the device as shown in the image below.</p>
          <img
            src={getPlacementGuide(selectedMuscle) || ""}
            alt={`Placement guide for ${selectedMuscle}`}
            className="mt-4 w-48 md:w-64 object-cover rounded-md"
          />
        </div>
      )}  */}

      <div className="mt-6 md:mt-8 flex flex-wrap gap-4 justify-center">
        <button
          className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-lg font-mono font-medium ${
            isMeasuring
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={handleStart}
          disabled={isMeasuring}
        >
          Start
        </button>
        <button
          className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-lg font-mono font-medium ${
            isMeasuring
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleStop}
          disabled={!isMeasuring}
        >
          Stop
        </button>
      </div>

      <button
        onClick={handleBackToDevices}
        className="text-xs md:text-sm text-blue-500 hover:underline mt-4"
      >
        Back to Devices
      </button>
    </div>
      {/*Modal */}
      <Modal isOpen={showInstructionModal} onClose={()=> setShowInstructionModal(false)}>
          <div className="text-center font-mono">
            <h4 className="text-lg font-semibold mb-2">Placement Guide</h4>
            <p className="text-sm mb-4"> Step 1: Thoroughly clean the intended area with rubbing alcohol to remove dirt and oil and allow to dry.</p>
            <p className="text-sm mb-4"> Step 2: Snap electrodes to the sensor’s three snap connectors.</p>
            <p className="text-sm mb-4"> Step 3: Place the device on your muscle as shown below.</p>

            <img
              src={instruction_biceps}
              alt="guide"
              className="max-w-full max-h-64 object-cover rounded-md mx-auto"/>
            <button
              onClick={handleConfirmStart}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Got it
            </button>
          </div>
      </Modal>
      
      <Modal isOpen={showStopConfirmModal} onClose={() => setShowStopConfirmModal(false)}>
        <div className="text-center font-mono">
          <h4 className="text-lg font-semibold mb-2">Stop Measurement</h4>
          <p className="text-sm mb-4">Are you sure you want to stop the measurement?</p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleConfirmStop}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Yes, Stop
            </button>
            <button
              onClick={() => setShowStopConfirmModal(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {isMeasuring && (
        <div className="mt-8 md:mt-12 w-full max-w-full md:max-w-4xl p-4 md:p-6 border rounded-lg shadow-md font-mono">
          <h3 className="text-lg md:text-2xl font-semibold mb-4">Real-Time EMF Data</h3>
          <table className="w-full border-collapse border border-gray-300 text-xs md:text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 md:px-4 py-2">Time (s)</th>
                <th className="border border-gray-300 px-2 md:px-4 py-2">EMF Value (mV)</th>
              </tr>
            </thead>
            <tbody>
              {realTimeData.map((dataPoint, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 md:px-4 py-2">{dataPoint.time}</td>
                  <td className="border border-gray-300 px-2 md:px-4 py-2">{dataPoint.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Measure;