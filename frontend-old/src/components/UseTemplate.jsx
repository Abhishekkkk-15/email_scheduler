import React, { useEffect, useState } from "react";
import { getuserTemplates } from "../api/templateApi";

export default function UseTemplate({ selectedType, onPreviewChange, setTemplateName }) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [variableValues, setVariableValues] = useState({});
  const [preview, setPreview] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getuserTemplates();
        setTemplates(data.data); 

        // Send available template names to parent if needed
        const templateNames = data?.data?.map((d) => d.title);
        setTemplateName(templateNames);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedType && templates.length > 0) {
      const template = templates.find((tpl) => tpl.title === selectedType);
      setSelectedTemplate(template);

      // Reset variable inputs
      const variables = extractVariables(template?.content || "");
      const initialValues = {};
      variables.forEach((v) => (initialValues[v] = ""));
      setVariableValues(initialValues);
    }
  }, [selectedType, templates]);

  const extractVariables = (html) => {
    const matches = html.match(/{{(.*?)}}/g);
    if (!matches) return [];
    return [...new Set(matches.map((m) => m.replace(/[{}]/g, "")))];
  };

  useEffect(() => {
    if (!selectedTemplate) return;

    let updated = selectedTemplate.content;
    Object.entries(variableValues).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      updated = updated.replace(regex, value);
    });

    setPreview(updated);
    onPreviewChange(updated, selectedTemplate.subject);
  }, [variableValues, selectedTemplate]);

  const handleVariableChange = (key, value) => {
    setVariableValues((prev) => ({ ...prev, [key]: value }));
  };

  if (!selectedTemplate) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
        No template selected.
      </div>
    );
  }

  return (
    <div className="flex p-8 gap-8 max-w-7xl mx-auto">
      {/* Left Panel - Fill Variables */}
      <div className="w-1/2 space-y-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Fill Variables</h2>
          <form className="space-y-4">
            {Object.keys(variableValues).map((key) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-medium capitalize mb-1">{key}</label>
                <input
                  type="text"
                  value={variableValues[key]}
                  onChange={(e) => handleVariableChange(key, e.target.value)}
                  className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </form>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="w-1/2 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Email Preview</h2>
        <p className="text-gray-600 mb-4">
          Subject: <strong>{selectedTemplate.subject}</strong>
        </p>
        <div
          className="prose max-w-none border-t pt-4"
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      </div>
    </div>
  );
}
