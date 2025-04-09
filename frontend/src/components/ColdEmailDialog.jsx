import React, { useState } from "react";

function ColdEmailDialog({ isOpen, onClose, addNewNode }) {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleConfirm = () => {
    if (selectedType && email && body) {
      addNewNode("coldEmail", selectedType, email, body);
      onClose();
    } else {
      alert("Please fill all the fields.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px] shadow-2xl text-black space-y-5">
        <h2 className="text-2xl font-semibold text-center">Cold Email Setup</h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Sender Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="jhon@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="emailType" className="text-sm font-medium text-gray-700">
            Email Type
          </label>
          <select
            id="emailType"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>-- Select Email Type --</option>
            <option value="welcomeEmail">Welcome Email</option>
            <option value="followUpEmail">Follow-up Email</option>
            <option value="salesEmail">Sales Pitch Email</option>
            <option value="nurtureEmail">Lead Nurture Email</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="body" className="text-sm font-medium text-gray-700">Email Body</label>
          <textarea
            id="body"
            rows="5"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your email content here..."
          ></textarea>
        </div>

        <div className="flex items-center justify-between pt-2">
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
