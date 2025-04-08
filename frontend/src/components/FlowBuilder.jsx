import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";


export default function FlowBuilder({nodes,setNodes,onNodesChange,edges,setEdges,showSelect,onEdgesChange,initialNodes,initialEdges,onConnect,nodeTypes}) {

  return (
    <div style={{ height: "100vh" , width:"100%"}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        // fitView
        nodeTypes={nodeTypes}
      >
        {/* <MiniMap /> */}
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
