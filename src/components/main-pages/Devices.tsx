import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import devicesService from "../../services/devices";
import { useUser } from "../../context/UserContext";
import { useDevice } from "../../context/DeviceContext";


interface Device {
  deviceId: string;
  paired: boolean;
  ipAddress?: string; // Optional IP address
  macAddress?: string; // Optional MAC address
  deviceStatus: "active" | "inactive"; // Simulated status
  batteryLevel?: number; // Add batteryLevel property
}

interface DevicesProps {
  darkTheme: boolean;
}

const Devices: React.FC<DevicesProps> = ({ darkTheme }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [macAddress, setMacAddress] = useState<string>(""); // State for MAC address input
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { user } = useUser();
  const { setSelectedDevice } = useDevice();
  const navigate = useNavigate();

  
  const handleSelectDevice = (device: Device) => {
    setSelectedDevice({
      ...device,
      ipAddress: device.ipAddress ?? "",
    });
    alert(`Device "${device.deviceId}" selected for measurement!`);
    navigate("/measure"); // Redirect to the Measure page
  }; 
/*
  const handleDeleteDevice = async (deviceId: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete device "${deviceId}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      if (user.token) {
        devicesService.setToken(user.token);
      } else {
        return;
      }
      await devicesService.deleteDeviceById(deviceId);
      setDevices(devices.filter((device) => device.deviceId !== deviceId));
      alert(`Device "${deviceId}" deleted successfully!`);
    } catch (error) {
      console.error("Error deleting device:", error);
      alert("Failed to delete device. Please try again.");
    }
  }; */

  const handleAddDevice = async () => {
    if (!macAddress.trim()) {
      alert("Please enter a valid MAC address.");
      return;
    } 

    try {
      if (user.token) {
        devicesService.setToken(user.token);
      } else {
        return;
      }
      const newDevice = await devicesService.createDevice(macAddress);
      setDevices([
        ...devices,
        { ...newDevice, paired: false, status: "offline" }, // Default status
      ]);
      setMacAddress(""); // Clear the input field
      alert(`Device "${macAddress}" added successfully!`);
    } catch (error) {
      console.error("Error adding device:", error);
      alert("Failed to add device. Please try again.");
    }
  };

  useEffect(() => {
    const fetchDevices = async () => {
      
      try {
        if (user.token) {
          devicesService.setToken(user.token);
        } else {
          return;
        }

        if (!user.username) {
          throw new Error("User username is null");
        }
        const fetchedDevices = await devicesService.getByUsername(user.username);

        const devicesWithDetails = fetchedDevices.map((device: Device) => ({
          ...device,
          paired: false,
          status: Math.random() > 0.5 ? "online" : "offline", // Simulated status
        }));
        setDevices(devicesWithDetails);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, [user.token]);

  const filteredDevices = devices.filter((device) =>
    String(device.deviceId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen w-screen ${
        darkTheme ? "bg-primary_dark text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-3xl md:text-5xl font-primary font-bold mb-8 text-center">Devices</h1>
      <div
        className={`p-4 md:p-6 rounded-lg shadow-md w-11/12 md:w-2/3 max-w-lg ${
          darkTheme ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-300"
        }`}
      >
        {/* Add Device Form */}
        <div className="mb-6">
          <label htmlFor="macAddress" className="block text-left text-base md:text-lg font-mono font-medium mb-2">
            MAC Address
          </label>
          <input
            type="text"
            id="macAddress"
            value={macAddress}
            onChange={(e) => setMacAddress(e.target.value)}
            className={`w-full px-3 md:px-4 py-2 rounded-lg border placeholder:font-mono ${
              darkTheme ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"
            }`}
            placeholder="Enter MAC address"
          />
          <button
            onClick={handleAddDevice}
            className="mt-4 px-4 md:px-6 py-2 md:py-3 w-full rounded-lg bg-blue-500 text-white font-mono font-medium hover:bg-blue-600"
          >
            Add Device
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-3 md:px-4 py-2 rounded-lg border placeholder:font-mono ${
              darkTheme ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"
            }`}
            placeholder="Search devices by ID"
          />
        </div>

        {/* Device List */}
        <div>
          <h2 className="text-xl md:text-2xl font-mono font-semibold mb-4">Device List</h2>
          {filteredDevices.length === 0 ? (
            <p className="text-sm md:text-base font-mono text-gray-500">No devices found.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredDevices.map((device) => (
                <li
                  key={device.deviceId}
                  /*onClick={()=> navigate(`/devices/${device.deviceId}`)} */ 
                  className={`p-3 md:p-4 rounded-lg shadow-md ${
                    darkTheme ? "bg-gray-700" : "bg-gray-100"
                  } font-mono`}
                >
                  <div className="flex justify-between items-center ">
                    <span className="text-sm md:text-lg font-medium">{device.deviceId}</span>
                    <span
                      className={`text-xs md:text-sm font-medium ${
                        device.deviceStatus === "active" ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {device.deviceStatus}
                    </span>
                  </div>
                  {/* Battery Level Display */}
                  {typeof device.batteryLevel === "number" && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono">Battery:</span>
                        <div className="relative w-24 h-3 bg-gray-300 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all`}
                            style={{
                              width: `${device.batteryLevel}%`,
                              background:
                                device.batteryLevel > 60
                                  ? "#22c55e"
                                  : device.batteryLevel > 30
                                  ? "#facc15"
                                  : "#ef4444",
                            }}
                          ></div>
                        </div>
                        <span
                          className={`text-xs font-mono ${
                            device.batteryLevel > 60
                              ? "text-green-500"
                              : device.batteryLevel > 30
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {device.batteryLevel}%
                        </span>
                      </div>
                    </div>
                  )}
                  {/* End Battery Level Display */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <button
                      onClick={() => handleSelectDevice(device)}
                      className="px-3 md:px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all"
                    >
                      Select
                    </button>
                    {/*
                    <button
                      onClick={() => handleDeleteDevice(device.deviceId)}
                      className="px-3 md:px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button> 
                  </div> 

                  <div className="mt-4">
                    <Link
                      to={`/devices/${device.deviceId}`}
                      className="text-blue-500 hover:underline text-sm md:text-base"
                    >
                      View Details
                    </Link> */}
                  </div> 
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Devices;