import React, { createContext, useContext, useState, ReactNode } from "react";

interface Device {
  deviceId: string;
  paired: boolean;
  ipAddress: string;
  deviceStatus: "active" | "inactive";
  batteryLevel?: number; 
}

interface DeviceContextType {
  selectedDevice: Device | null;
  setSelectedDevice: (device: Device | null) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  return (
    <DeviceContext.Provider value={{ selectedDevice, setSelectedDevice }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return context;
};