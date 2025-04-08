import React from "react";

function LeadSourceDialog({ isOpen, onClose, addNewNode }) {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const selectedType = e.target.value;
    if (selectedType) {
      addNewNode("leadSource",selectedType);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg text-black">
        <h2 className="text-xl font-semibold mb-4">Select Lead Source Type</h2>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue=""
          onChange={handleChange}
        >
          <option value="" disabled>
            -- Select Lead Source --
          </option>
          <option value="google">Google Ads</option>
          <option value="linkedin">LinkedIn</option>
          <option value="manual">Manual Entry</option>
        </select>

        <button
          onClick={onClose}
          className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default LeadSourceDialog;
