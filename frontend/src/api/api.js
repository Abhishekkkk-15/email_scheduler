import axios from "axios";

axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}/api`;
console.log( `${import.meta.env.VITE_API_URL}/api`)
axios.defaults.withCredentials = true;

export const getLogedUserInfo = async () => await axios.get("/auth/userInfo");

export const loginUser = async (email, password) =>
  await axios.post("/auth/login", {
    email,
    password,
  });
export const signUpUser = async (name, email, password) =>
  await axios.post("/auth/signup", {
    name,
    email,
    password,
  });
export const logoutUser = async () =>
  await axios.get("/auth/logout");

export const scheduleEmail = async (userId, nodes, edges) =>
  await axios.post("/flow", {
    userId,
    nodes,
    edges,
  });

export const userScheduleHistory = async (userId) =>
  await axios.get(`/flow/history?userId=${userId}`);

export const deleteFlow = async (flowId) =>
  await axios.delete(`/flow/delete?id=${flowId}`);
