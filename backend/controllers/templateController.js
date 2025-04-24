import mongoose from "mongoose";
import Template from "../models/templateSchema.js";

export const templateCreater = async (req, res) => {
  try {
    const { subject, body, title } = req.body;
    if (!subject || !body || !title) {
      return res
        .status(404)
        .json({ message: "Template Data Not provided", success: false });
    }
    const userId = req?.user?.payload;
    await Template.create({
      subject,
      userId,
      title,
      content: body,
    });
    res
      .status(200)
      .json({ message: "Template Crated Successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internel Server Error", success: false });
  }
};

export const getUserTemplates = async (req, res) => {
  const userId = req?.user?.payload;
  try {
    const userTemplates = await Template.find({
      userId: userId,
    });
    console.log(userTemplates)
    if (!userTemplates) {
      return res
        .status(404)
        .json({ message: "No templates for this user", success: false });
    }
    res
      .status(200)
      .json({
        message: "Templates find for user",
        data: userTemplates,
        success: true,
      });
  } catch (error) {
    res.status(500).json({ message: "Internel Server Error", success: false });
  }
};
