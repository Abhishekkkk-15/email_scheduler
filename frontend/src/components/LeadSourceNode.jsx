import React from "react";
import { Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import { MdLeaderboard } from "react-icons/md";

function LeadSourceNode({ data }) {
  return (
    <div className="bg-white rounded-lg border border-blue-500 p-4 shadow-md text-black w-64">
      <div className="flex items-center justify-between mb-2">
        <div className="bg-blue-200 p-1 rounded-full">
          <MdLeaderboard size={22} className="text-blue-700" />
        </div>
        <span className="font-semibold text-[16px]">Lead Source</span>
      </div>
      <div>{data.emailType}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        className="w-2 h-2 bg-blue-500"
      />
     
    </div>
  );
}

export default LeadSourceNode;
