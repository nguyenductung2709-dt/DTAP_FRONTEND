import axios from "axios";
import { baseUrl } from "../data/config";

let token: string | null = null;

const setToken = (newToken: string) => {
  token = `bearer ${newToken}`;
};

const getConfig = () => ({
  headers: { Authorization: token },
});

// Create a new device
const createDevice = async (macAddress: string) => {
  const response = await axios.post(
    `${baseUrl}/devices`,
    { macAddress },
    getConfig()
  );
  return response.data;
};

const getByUsername = async (username: string): Promise<any> => {
    const response = await axios.get(`${baseUrl}/api/devices/${username}`);
    return response.data;
}


// Get all devices
const getAllDevices = async () => {

  const response = await axios.get(`${baseUrl}/devices`, getConfig());
  return response.data;
};

// Get a device by ID
const getDeviceById = async (id: string) => {
  const response = await axios.get(`${baseUrl}/devices/${id}`, getConfig());
  return response.data;
};

// Update a device by ID
const updateDeviceById = async (
  id: string,
  updateData: { name?: string; type?: string; status?: string }
) => {
  const response = await axios.patch(
    `${baseUrl}/devices/${id}`,
    updateData,
    getConfig()
  );
  return response.data;
};

// Delete a device by ID
const deleteDeviceById = async (id: string) => {
  const response = await axios.delete(`${baseUrl}/devices/${id}`, getConfig());
  return response.data;
};

export default {
  setToken,
  createDevice,
  getByUsername,
  getAllDevices,
  getDeviceById,
  updateDeviceById,
  deleteDeviceById,
};