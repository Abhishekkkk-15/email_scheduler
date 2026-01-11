import axios from "axios";

type Paylaod = {
  subject: string;
  title: string;
  html: any;
};

export const saveTemplate = async (paylaod: Paylaod) =>
  await axios.post(
    "/api/template",
    {
      subject: paylaod.subject,
      title: paylaod.title,
      body: paylaod.html,
    },
    {
      withCredentials: true,
    }
  );
export const getuserTemplates = async () =>
  axios.get("/api/template", { withCredentials: true });
