import { memo } from "react";
import { Handle, Position } from "reactflow";
import { Mail, Clock, Globe, CheckCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const LeadSourceNode = memo(({ data }: any) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-2 border-blue-300 dark:border-blue-700 rounded-xl shadow-lg min-w-[180px]">
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white"
      />

      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-blue-500 rounded-lg">
            <Globe className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-sm text-blue-900 dark:text-blue-100">
            {data.label}
          </span>
        </div>
        <p className="text-xs text-blue-700 dark:text-blue-300 ml-8">
          {data.subtitle || "Entry Point"}
        </p>
      </div>

      <motion.div
        className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
});

LeadSourceNode.displayName = "LeadSourceNode";

export const WaitNode = memo(({ data }: any) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border-2 border-amber-300 dark:border-amber-700 rounded-xl shadow-lg min-w-[180px]">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-amber-500 !w-3 !h-3 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-amber-500 !w-3 !h-3 !border-2 !border-white"
      />

      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-amber-500 rounded-lg">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-sm text-amber-900 dark:text-amber-100">
            {data.label}
          </span>
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-300 ml-8">
          {data.subtitle || "Delay"}
        </p>
      </div>

      <motion.div
        className="absolute inset-0 border-2 border-amber-400 rounded-xl"
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
});

WaitNode.displayName = "WaitNode";

export const EmailNode = memo(({ data }: any) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-2 border-purple-300 dark:border-purple-700 rounded-xl shadow-lg min-w-[180px]">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-purple-500 !w-3 !h-3 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-purple-500 !w-3 !h-3 !border-2 !border-white"
      />

      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-purple-500 rounded-lg">
            <Mail className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-sm text-purple-900 dark:text-purple-100">
            {data.label}
          </span>
        </div>
        <p className="text-xs text-purple-700 dark:text-purple-300 ml-8">
          {data.subtitle || "Email Template"}
        </p>
      </div>

      {data.status === "active" && (
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1, repeat: Infinity }}>
          <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        </motion.div>
      )}
    </motion.div>
  );
});

EmailNode.displayName = "EmailNode";

export const SuccessNode = memo(({ data }: any) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-2 border-green-300 dark:border-green-700 rounded-xl shadow-lg min-w-[180px]">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-green-500 !w-3 !h-3 !border-2 !border-white"
      />

      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-green-500 rounded-lg">
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-sm text-green-900 dark:text-green-100">
            {data.label}
          </span>
        </div>
        <p className="text-xs text-green-700 dark:text-green-300 ml-8">
          {data.subtitle || "Completed"}
        </p>
      </div>

      <motion.div
        className="absolute inset-0 bg-green-400/20 rounded-xl"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
});

SuccessNode.displayName = "SuccessNode";
