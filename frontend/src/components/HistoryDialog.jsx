import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { deleteFlow, userScheduleHistory } from "../api/api";
import { socket } from "../websocket/socketIO";

function HistoryDialog({ isOpen, onClose, logedUser }) {
  const [history, setHistory] = useState([]);
  const [liveTaskCount, setLiveTaskCount] = useState({}); // Track live task count for each flow
  const isSocketInitialized = useRef(false); // Track socket listener initialization

  // Fetching user scheduled email or flow by userId
  const fetchHistory = async () => {
    try {
      const { data } = await userScheduleHistory(logedUser._id);
      setHistory(data?.data);
    } catch (error) {
      console.error("Error fetching history:", error?.message);
    }
  };

  // Get filtered task count excluding leadSource and wait
  const getFilteredTaskCount = (flow) => {
    return flow.nodes.filter(
      (node) => node.type !== "leadSource" && node.type !== "wait"
    ).length;
  };

  useEffect(() => {
    if (isSocketInitialized.current) return; // Prevent multiple listeners

    const handleTaskCount = (data) => {
      console.log("Live Task Count Data:", data);

      // Update the task count for the flow
      setLiveTaskCount((prevState) => ({
        ...prevState,
        [data.flowId]: data.taskCompleted, // Store the live count for each flow
      }));
    };

    socket.on("taskCount", handleTaskCount);

    isSocketInitialized.current = true;

    return () => {
      socket.off("taskCount", handleTaskCount);
      isSocketInitialized.current = false;
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  // Deleting whole flow
  const handleDelete = async (flowId) => {
    try {
      await deleteFlow(flowId);
      setHistory((prev) => prev.filter((flow) => flow._id !== flowId));
    } catch (error) {
      console.error("Error deleting flow:", error?.message);
      alert("Failed to delete flow.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl p-6 relative">
        <h2 className="text-2xl font-semibold mb-4">Execution History</h2>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          ✕
        </button>

        {history.map((flow, idx) => {
          const totalTask = getFilteredTaskCount(flow);
          const completedFromHistory = flow.taskCompleted || 0;
          const liveCount = liveTaskCount[flow._id];

          // Prefer live count if available, otherwise use stored history
          const tasksCompleted =
            liveCount !== undefined ? liveCount : completedFromHistory;

          return (
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
                      tasksCompleted === totalTask
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {`${tasksCompleted} / ${totalTask} Tasks Completed`}
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
          );
        })}
      </div>
    </div>
  );
}

export default HistoryDialog;
