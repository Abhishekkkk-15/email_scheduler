import React, { useState } from "react";

function WaitDialog({ isOpen, onClose, addNewNode }) {
  const [delay, setDelay] = useState(0);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const parsedDelay = parseInt(delay);
    if (!isNaN(parsedDelay) && parsedDelay > 0) {
      console.log("Delay:", parsedDelay);
      addNewNode("wait", "parsedDelay",parsedDelay);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[350px] shadow-2xl text-black space-y-4">
        <h2 className="text-2xl font-semibold text-center">Wait Configuration</h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="delay" className="text-sm font-medium text-gray-700">
            Delay (in seconds)
          </label>
          <input
            type="number"
            id="delay"
            placeholder="Enter delay"
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
        </div>

        <div className="flex justify-between items-center pt-2">
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
            Add Wait Node
          </button>
        </div>
      </div>
    </div>
  );
}

export default WaitDialog;
