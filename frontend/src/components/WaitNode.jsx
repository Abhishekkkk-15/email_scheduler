import { Handle, Position } from "reactflow";
import { MdTimer } from "react-icons/md";

export default function WaitNode({ data }) {
  return (
    <div className="bg-blue-50 border border-blue-300 rounded-xl shadow-md w-[180px] h-[120px] p-4 text-gray-800 relative">
      <div className="flex items-center justify-between mb-2">
        <div className="bg-blue-200 p-1 rounded-full">
          <MdTimer size={22} className="text-blue-700" />
        </div>
        <span className="font-semibold text-[16px]">Wait</span>
      </div>

      <div className="mt-4 text-center">
        <div className="text-[14px] font-medium">Delay:</div>
        <div className="text-[14px]">
          {data?.seconds ? `${data.seconds} sec` : "Not Set"}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-blue-600"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-blue-600"
      />
    </div>
  );
}
