import React, { useState } from "react";
import UseTemplate from "./UseTemplate"; // Adjust the import path as needed
import { Link, useNavigate } from "react-router-dom";

function ColdEmailDialog({ isOpen, onClose, addNewNode }) {
  const [email, setEmail] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");
  const [templateName, setTemplateName] = useState([]);
  const navigate = useNavigate()

  const handleConfirm = () => {
    if (selectedTemplate && email && body) {
      addNewNode("coldEmail", selectedTemplate, email, body);
      onClose();
    } else {
      alert("Please fill all the fields.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[90vw] max-w-4xl shadow-2xl text-black h-[85vh] overflow-hidden flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-center">Cold Email Setup</h2>

        {/* Email and Type */}
        <div className="flex gap-6">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Sender Email
            </label>
            <input
              type="email"
              placeholder="john@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Select Template
            </label>
            <select
              value={selectedTemplate || ""}
              onChange={(e) => {
                if (e.target.value === "__create__") {
               
                  navigate("/template/create_template"); // use useNavigate from react-router-dom
                } else {
                  setSelectedTemplate(e.target.value);
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                -- Choose Template --
              </option>
              {templateName.map((n, idx) => {
                return (
                  <option key={idx} value={n.title}>
                    {n}
                  </option>
                );
              })}

              <option value="__create__">➕ Create new template</option>
            </select>
          </div>
        </div>

        {/* UseTemplate */}
        <div className="flex-1 overflow-y-auto">
          <UseTemplate
            selectedType={selectedTemplate}
            onPreviewChange={(html, subjectLine) => {
              setBody(html);
              setSubject(subjectLine);
            }}
            setTemplateName={setTemplateName}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            Add Cold Email
          </button>
        </div>
      </div>
    </div>
  );
}

export default ColdEmailDialog;
