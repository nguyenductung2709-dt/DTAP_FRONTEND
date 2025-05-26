import axios from 'axios';
import { baseUrl, baseUrl2 } from '../../src/data/config';


const createInitialData = async (data: any): Promise<any> => {
    const response = await axios.post(`${baseUrl}/datapoints`, data);
    return response.data;
};
const getById = async (id: string): Promise<any> => {
    const response = await axios.get(`${baseUrl}/datapoints/${id}`);
    return response.data;
};

const startProcess = async(id: string, ipAddress: string): Promise<any> => {
    console.log("Starting process for device:", id, "at IP address:", ipAddress);
    const response = await axios.post(`${baseUrl2}/start`, { deviceId: id });
    return response.data;
}

export default {
    createInitialData,
    getById,
    startProcess,
}