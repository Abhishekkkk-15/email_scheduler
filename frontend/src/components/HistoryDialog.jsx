import axios from "axios";
import React, { useEffect, useState } from "react";
import { deleteFlow, userScheduleHistory } from "../api/api";

function HistoryDialog({ isOpen, onClose,logedUser }) {
  const [history, setHistory] = useState([]);
//Fetching user scheduled email or flow by userId
  const fetchHistory = async () => {
    try {
      const { data } = await userScheduleHistory(logedUser._id)
      setHistory(data?.data);
    } catch (error) {
      console.error("Error fetching history:", error?.message);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);
//Deleting whole flow
  const handleDelete = async (flowId) => {
    try {
      await deleteFlow(flowId)
      setHistory((prev) => prev.filter((flow) => flow._id !== flowId));
    } catch (error) {
      console.error("Error deleting flow:", error?.message);
      alert("Failed to delete flow.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl p-6 relative">
        <h2 className="text-2xl font-semibold mb-4">Execution History</h2>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          ✕
        </button>

        {history.length === 0 ? (
          <p className="text-gray-600">No history found.</p>
        ) : (
          <div className="space-y-6">
            {history.map((flow, idx) => (
              <div
                key={idx}
                className="border border-gray-200 p-5 rounded-md bg-gray-50 shadow"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Flow ID:</strong> {flow._id}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {new Date(flow.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm px-3 py-1 rounded-full font-medium ${
                        flow.completed
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {flow.completed ? "✅ Completed" : "❌ Incomplete"}
                    </span>

                  
                    <button
                      onClick={() => handleDelete(flow._id)}
                      className="text-red-600 hover:text-red-800 text-sm underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  {flow.nodes?.map((node, index) => (
                    <div key={node.id}>
                      <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium min-w-[100px] text-center">
                          {node.type.toUpperCase()}
                        </div>
                        {index < flow.nodes.length - 1 && (
                          <span className="text-xl text-gray-400">→</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryDialog;
