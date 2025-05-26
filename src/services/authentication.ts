import axios from "axios";
import { baseUrl } from "../data/config";

let token: string | null = null;

const setToken = (newToken: string) => {
  token = `bearer ${newToken}`;
};

const login = async (credentials: { username: string; password: string }) => {
  const loginUrl = `${baseUrl}/auth/login`;
  const response = await axios.post(loginUrl, credentials);
  return response.data;
};

const register = async (credentials: { username: string }) => {
  const registerUrl = `${baseUrl}/users`;
  const response = await axios.post(registerUrl, credentials);
  return response.data;
};

const logout = async () => {
  const config = {
    headers: { Authorization: token },
  };
  const logoutUrl = `${baseUrl}/auth/logout`;
  const response = await axios.post(logoutUrl, null, config);
  return response.data;
};

const validateToken = async (credentials: { username: string; token: string }) => {
  const validateTokenUrl = `${baseUrl}/auth/recover-check`;
  const response = await axios.post(validateTokenUrl, credentials);
  return response.data;
}

const recoverPassword = async (username: string) => {
  const recoverPasswordUrl = `${baseUrl}/auth/recover-password/${username}`;
  const response = await axios.put(recoverPasswordUrl);
  return response.data;
}

export default {
  setToken,
  login,
  register,
  logout,
  validateToken,
  recoverPassword,
};