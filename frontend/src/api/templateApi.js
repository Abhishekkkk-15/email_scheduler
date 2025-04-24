import axios from "axios";

axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}api`;
axios.defaults.withCredentials = true;

export const saveTemplate = async (paylaod) =>
  await axios.post("/template/create_template", {
    subject: paylaod.subject,
    title: paylaod.title,
    body: paylaod.html,
  });
export const getuserTemplates = async () => axios.get("/template/user_templates");
