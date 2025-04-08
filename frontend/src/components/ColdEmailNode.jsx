import { Handle, Position } from "reactflow";
import { MdEmail } from "react-icons/md";

export default function ColdEmailNode({ data }) {
  return (
    <div className="bg-yellow-100 border border-gray-400 rounded-xl shadow-sm w-[250px] h-[160px] p-3 text-sm text-gray-800 relative">
      <div className="flex items-center justify-between mb-2">
        <div className="bg-yellow-300 rounded-full p-1">
          <MdEmail size={22} className="text-gray-700" />
        </div>
        <span className="font-semibold text-[16px]">Cold Email</span>
      </div>

      <div className="mt-2 space-y-1">
        <div className="text-[13px]">
          <span className="font-medium">Type: </span>
          {data?.emailType || "N/A"}
        </div>
        <div className="text-[13px]">
          <span className="font-medium">To: </span>
          {data?.to || "Not set"}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-gray-600"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-gray-600"
      />
    </div>
  );
}
