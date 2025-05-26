import React, { useState, useEffect } from "react";
import dataPointService from "../../services/datapoints";
import deviceService from "../../services/devices";
import { useUser } from "../../context/UserContext"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Dropdown from "../common-components/Dropdown";

// Define the WorkoutData interface for real data
interface WorkoutData {
  date: string;
  muscleGroup: string;
  beforeWorkout: number;
  afterWorkout: number;
}

interface DashboardProps {
  darkTheme: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ darkTheme }) => {
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7);
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
  const { user } = useUser();

  useEffect(() => {
    // Fetch real data from API
    const fetchData = async () => {
      try {
        if (!user.username) {
          throw new Error("User username is null");
        }
        // Get all devices for the user
        const devices = await deviceService.getByUsername(user.username);
        console.log("Devices:", devices);
        // Fetch datapoints for all devices and combine

        let allData: any[] = [];
        for (const device of devices) {
          const deviceData = await dataPointService.getById(device.deviceId);
          console.log(`Data for device ${device.deviceId}:`, deviceData);
          if (Array.isArray(deviceData)) {
            allData = allData.concat(deviceData);
          }
        }

        console.log("All Data:", allData);

        // Group by muscleType
        const groupedByMuscle: { [muscle: string]: { before: any[]; after: any[] } } = {};
        allData.forEach((item: any) => {
          const muscle = item.muscleType;
          if (!groupedByMuscle[muscle]) {
            groupedByMuscle[muscle] = { before: [], after: [] };
          }
          if (item.phaseTrack === "before") {
            groupedByMuscle[muscle].before.push(item);
          } else if (item.phaseTrack === "after") {
            groupedByMuscle[muscle].after.push(item);
          }
        });

        // For each muscle, pair before/after with closest higher dataPointId (greedy, one-to-one, forward only)
        const formatted: WorkoutData[] = [];
        Object.entries(groupedByMuscle).forEach(([muscle, { before, after }]) => {
          // Sort both arrays by dataPointId (ascending)
          before.sort((a, b) => (a.dataPointId ?? 0) - (b.dataPointId ?? 0));
          after.sort((a, b) => (a.dataPointId ?? 0) - (b.dataPointId ?? 0));

          const usedBefore = new Array(before.length).fill(false);
          const usedAfter = new Array(after.length).fill(false);

          // Greedy forward pairing: for each before, find the first after with dataPointId > before.dataPointId and not used
          before.forEach((b, bIdx) => {
            let found = false;
            for (let aIdx = 0; aIdx < after.length; aIdx++) {
              const a = after[aIdx];
              if (usedAfter[aIdx]) continue;
              if ((a.dataPointId ?? 0) > (b.dataPointId ?? 0)) {
                usedBefore[bIdx] = true;
                usedAfter[aIdx] = true;
                const date = new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
                  ? a.createdAt.split("T")[0]
                  : b.createdAt.split("T")[0];
                formatted.push({
                  date,
                  muscleGroup: muscle,
                  beforeWorkout: b.value,
                  afterWorkout: a.value,
                });
                found = true;
                break;
              }
            }
            if (!found) {
              // No after found, add before only
              formatted.push({
                date: b.createdAt.split("T")[0],
                muscleGroup: muscle,
                beforeWorkout: b.value,
                afterWorkout: 0,
              });
            }
          });

          // Add unmatched afters
          after.forEach((a, aIdx) => {
            if (!usedAfter[aIdx]) {
              formatted.push({
                date: a.createdAt.split("T")[0],
                muscleGroup: muscle,
                beforeWorkout: 0,
                afterWorkout: a.value,
              });
            }
          });
        });

        setWorkoutData(formatted);
      } catch (error) {
        console.error("Error fetching workout data:", error);
      }
    };
    // Only call fetchData if user.username exists
    if (user.username) {
      fetchData();
    }
  }, [user.username]); // Only depend on user.username

  const handleMuscleFilter = (muscle: string | null) => {
    if (!muscle || muscle === "Show All") {
      setSelectedMuscle(null);
    } else {
      setSelectedMuscle(muscle);
    }
  };

  // Only filter if a muscle is selected, otherwise show all
  const filteredData =
    selectedMuscle
      ? workoutData.filter((data) => data.muscleGroup === selectedMuscle)
      : [];

  const slicedData = filteredData.slice(0, selectedPeriod);

  const uniqueMuscleGroups = Array.from(
    new Set(workoutData.map((data) => data.muscleGroup))
  );

  return (
    <div
      className={`w-screen p-4 flex items-center flex-col justify-center h-screen ${
        darkTheme ? "bg-primary_dark text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-3xl md:text-5xl font-primary font-semibold mb-4 pt-20 text-center">Workout Metrics</h1>
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <Dropdown
          title="Select Muscle"
          optionList={[
            { name: "Select Muscle" },
            ...uniqueMuscleGroups.map(muscle => ({
              name: muscle,
            }))
          ]}
          darkTheme={darkTheme}
          onSelect={handleMuscleFilter}
          selectedValue={selectedMuscle}
        />
        <Dropdown
          title="Period"
          optionList={[{name:"7"},{name:"30"},{name:"All"}]}
          darkTheme={darkTheme}
          onSelect={(value) => setSelectedPeriod(value==="All"? Infinity:parseInt(value))}
          selectedValue={selectedPeriod === Infinity ? "All" : selectedPeriod.toString()}
        />
      </div>
      {selectedMuscle === null ? (
        <div className="flex flex-col items-center justify-center mt-12">
          <p className="text-lg md:text-2xl font-mono text-gray-400 mb-4">
            Please select a muscle group to view your workout metrics.
          </p>
          <div className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-blue-400 opacity-60 animate-pulse">
            <span className="text-4xl md:text-6xl text-blue-700 font-bold">💪</span>
          </div>
        </div>
      ) : filteredData.length > 0 ? (
        <>
          <div className="w-full max-w-2xl h-[300px] mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={slicedData}
                margin={{ top: 20, right: 50, left: 0, bottom: 5 }}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                  label={{ value: "Median Frequency (Hz)", angle: -90, position: "outsideLeft", offset: 50, fontFamily: "monospace", fontSize: 12 }}
                  tick={{ fontSize: 12 }} />
                <CartesianGrid strokeDasharray="5 5" />
                <Tooltip contentStyle={{ fontFamily: "monospace", fontSize: 13 }}
                  labelStyle={{ color: "black", fontWeight: "bold" }} />
                <Legend wrapperStyle={{ paddingTop: 30, display: 'flex', justifyContent: 'center', gap: 20, fontFamily: "monospace", fontSize: 12 }} />
                <Line type="monotone" dataKey="beforeWorkout" stroke="#ff5733" />
                <Line type="monotone" dataKey="afterWorkout" stroke="#3356ff" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full max-w-full md:max-w-4xl mb-8 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-left text-sm md:text-base">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-2 md:px-4 py-2 font-primary">Date Measured</th>
                  <th className="border border-gray-300 px-2 md:px-4 py-2 font-primary">Muscle Group</th>
                  <th className="border border-gray-300 px-2 md:px-4 py-2 font-primary">Before Workout</th>
                  <th className="border border-gray-300 px-2 md:px-4 py-2 font-primary">After Workout</th>
                </tr>
              </thead>
              <tbody>
                {slicedData.map((data, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-2 md:px-4 py-2 font-mono">{data.date}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2 font-mono">{data.muscleGroup}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2 font-mono">{data.beforeWorkout}</td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2 font-mono">{data.afterWorkout}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center mt-12">
          <p className="text-lg md:text-2xl font-mono text-gray-400 mb-4">
            No data available for this muscle group.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;