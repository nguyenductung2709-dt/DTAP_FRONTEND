import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import devicesService from "../../services/devices";

interface DeviceDetailProps {
  darkTheme: boolean;
}

const DeviceDetail: React.FC<DeviceDetailProps> = ({ darkTheme }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState<any>(null);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const fetchedDevice = await devicesService.getDeviceById(id!);
        setDevice({ ...fetchedDevice, status: "online" }); // Simulated status
      } catch (error) {
        console.error("Error fetching device:", error);
      }
    };

    fetchDevice();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete device "${id}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      await devicesService.deleteDeviceById(id!);
      alert(`Device "${id}" deleted successfully!`);
      navigate("/devices");
    } catch (error) {
      console.error("Error deleting device:", error);
      alert("Failed to delete device. Please try again.");
    }
  };

  if (!device) {
    return <p>Loading...</p>;
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen w-screen ${
        darkTheme ? "bg-primary_dark text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`flex flex-col items-center p-6 md:p-10 rounded-xl shadow-lg w-full max-w-lg mx-auto ${
          darkTheme ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-300"
        }`}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Device Details</h1>
        <div className="flex flex-col items-center w-full gap-3">
          <p className="text-base md:text-lg mb-1 text-center">
            <strong>Device ID:</strong> {device.deviceId}
          </p>
          <p className="text-base md:text-lg mb-1 text-center">
            <strong>Status:</strong>{" "}
            <span
              className={`font-medium ${
                device.status === "online" ? "text-green-500" : "text-red-500"
              }`}
            >
              {device.status}
            </span>
          </p>
          <p className="text-base md:text-lg mb-1 text-center">
            <strong>Paired:</strong> {device.paired ? "Yes" : "No"}
          </p>
          {/* Battery Level Display */}
          {typeof device.batteryLevel === "number" && (
            <div className="mb-2 w-full flex flex-col items-center">
              <strong className="mb-1">Battery:</strong>
              <div className="flex items-center gap-3">
                <div className="relative flex items-center">
                  <svg width="32" height="16" viewBox="0 0 32 16" className="mr-2">
                    <rect x="1" y="3" width="28" height="10" rx="3" fill="#e5e7eb" />
                    <rect
                      x="1.5"
                      y="3.5"
                      width={`${Math.max(0.5, (device.batteryLevel / 100) * 27)}`}
                      height="9"
                      rx="2"
                      fill={
                        device.batteryLevel > 60
                          ? "#22c55e"
                          : device.batteryLevel > 30
                          ? "#facc15"
                          : "#ef4444"
                      }
                    />
                    <rect x="29.5" y="6" width="2" height="4" rx="1" fill="#a3a3a3" />
                  </svg>
                </div>
                <span
                  className={`text-base font-mono font-semibold ${
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
              <div className="w-3/4 h-2 mt-2 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
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
            </div>
          )}
          {/* End Battery Level Display */}
          <p className="text-base md:text-lg mb-2 text-center">
            <strong>Last Activity:</strong> {device.lastActivity || "N/A"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full justify-center">
          <button
            className="px-4 md:px-6 py-2 rounded-lg bg-blue-400 text-black font-base hover:bg-blue-500 transition-all"
            onClick={() => alert("Pairing functionality coming soon!")}
          >
            Pair Device
          </button>
          <button
            onClick={handleDelete}
            className="px-4 md:px-6 py-2 rounded-lg bg-red-400 text-black font-base hover:bg-red-500 transition-all"
          >
            Delete Device
          </button>
        </div>
        <div className="mt-8 text-center w-full">
          <Link
            to="/devices"
            className="px-4 md:px-6 py-2 rounded-lg bg-gray-400 text-black font-base hover:bg-gray-500 transition-all inline-block"
          >
            Back to Devices
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;