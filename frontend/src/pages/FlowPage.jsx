import React, { useCallback, useState } from "react";
import FlowBuilder from "../components/FlowBuilder";
import { MdClear, MdHistory, MdOutlineMailOutline } from "react-icons/md";
import ReactFlow, { addEdge, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import ColdEmailNode from "../components/ColdEmailNode";
import LeadSourceDialog from "../components/LeadSourceDialog";
import LeadSourceNode from "../components/LeadSourceNode";
import WaitNode from "../components/WaitNode";
import ColdEmailDialog from "../components/ColdEmailDialog";
import WaitDialog from "../components/WaitDialog";
import HistoryDialog from "../components/HistoryDialog";
import { logoutUser, scheduleEmail } from "../api/api";
import { CiLogout, CiNoWaitingSign } from "react-icons/ci";
import { MdDataSaverOn,MdOutlineLeaderboard } from "react-icons/md";

const nodeTypes = {
  coldEmail: ColdEmailNode,
  wait: WaitNode,
  leadSource: LeadSourceNode,
};
function FlowPage({ logedUser, setLogedUser }) {
  const initialNodes = [];
  const initialEdges = [];
  const [showSelect, setShowSelect] = useState(false);

  const [showLeadDialog, setShowLeadDialog] = useState(false);
  const [showWaitDialog, setshowWaitDialog] = useState(false);
  const [showColdEmailDialog, setColdEmailDialog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const addNewNode = ({
    type,
    emailType = "",
    email = "",
    seconds = 0,
    body = "",
  }) => {
    const id = `${Date.now()}`;
    console.log(body);
    const newNode = {
      id,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: type,
        subject: "",
        body,
        delay: 2,
        emailType: emailType,
        to: email,
        seconds: seconds,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    console.log(nodes, edges);
  };
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const save = async () => {
    if (nodes.length == 0 || edges.length == 0) {
      return alert("Lead source or Cold Email not provided");
    }
    console.log(nodes, edges);

    const leadSourceAvailable = nodes.filter((n) => n.type == "leadSource");
    console.log(leadSourceAvailable);
    if (leadSourceAvailable.length == 0)
      return alert("Lead source or Cold/Email not provided");
    if (leadSourceAvailable.length > 1)
      return alert("One Email Schedule at a time");

    try {
      const { data } = scheduleEmail(logedUser._id, nodes, edges);
      alert("Email Scheduled");
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const handleLogout = async () => {
    let result = confirm("Are you sure want to logout");
    if (result) {
      try {
        await logoutUser();
        setLogedUser("");
        return;
      } catch (error) {
        alert("Error while loging out user");
        return;
      }
    }
    return;
  };

  const handleClear = () => {
    let result = confirm("Are you sure want to clear nodes");
    if (result) {
      setNodes([]);
      setEdges([]);
      return;
    }
    return;
  };

  return (
    <div className="bg-black h-full w-full ">
      <LeadSourceDialog
        isOpen={showLeadDialog}
        onClose={() => setShowLeadDialog()}
        addNewNode={(type, emailType) => addNewNode({ type, emailType })}
      />
      <ColdEmailDialog
        isOpen={showColdEmailDialog}
        onClose={() => setColdEmailDialog()}
        addNewNode={(type, emailType, to, body) =>
          addNewNode({ type, emailType, email: to, body })
        }
      />
      <WaitDialog
        isOpen={showWaitDialog}
        onClose={() => setshowWaitDialog()}
        addNewNode={(type, emailType, seconds) =>
          addNewNode({ type, emailType, seconds })
        }
      />
      <HistoryDialog
        isOpen={showHistory}
        onClose={() => setShowHistory(!showHistory)}
        logedUser={logedUser}
      />
      <div className="h-[50px] w-[100%] flex items-center justify-between pl-2 pr-2 rounded-2xl bg-transparent fixed ">
        <div className="flex flex-row gap-3 rounded-2xl items-center  bg-transparent h-full w-full">
          <button
            onClick={() => setShowLeadDialog(!showLeadDialog)}
            className="bg-gray-400 text-white h-[35px]  sm:w-[90px] sm:text-[12px] lg:text-[16px] lg:w-[150px] rounded-2xl"
          >
           <div className="hidden lg:block">Add Lead Source</div> 
            <div className="flex justify-center lg:hidden ">
              <MdOutlineLeaderboard size={22} />
            </div>
          </button>
          <button
            onClick={() => setColdEmailDialog(!showColdEmailDialog)}
            className="bg-gray-400 text-white h-[35px] sm:w-[90px] sm:text-[12px] lg:text-[16px] lg:w-[150px]  rounded-2xl"
          >
           <div className="hidden lg:block">Add Cold Email</div> 
            <div className="flex justify-center lg:hidden ">
              <MdOutlineMailOutline size={22} />
            </div>
          </button>
          <button
            onClick={() => setshowWaitDialog(!showWaitDialog)}
            className="bg-gray-400 text-white h-[35px] sm:w-[90px] sm:text-[12px] lg:text-[16px] lg:w-[150px] rounded-2xl"
          >
           <div className="hidden lg:block"> Add Wait</div>
            <div className="flex justify-center lg:hidden ">
              <CiNoWaitingSign size={22} />
            </div>
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-400 text-white  h-[35px] sm:w-[90px] sm:text-[12px] lg:text-[16px] lg:w-[150px]  rounded-2xl"
          >
            <div className="hidden lg:block">Clear</div>
            <div className="flex justify-center lg:hidden ">
              <MdClear size={22} />
            </div>
          </button>
        </div>
        <div className="flex flex-row gap-3">
          <button
            onClick={() => save()}
            className="bg-gray-400 text-white h-[35px] sm:w-[90px] sm:text-[12px] lg:text-[16px] lg:w-[150px] rounded-2xl"
          >
            <div className="hidden lg:block">Save</div>
            <div className="flex justify-center lg:hidden ">
              <MdDataSaverOn size={22} />
            </div>
          </button>
          <button onClick={() => setShowHistory(!showHistory)} className="">
            <MdHistory size={22} color="white" />
          </button>
          <button onClick={() => handleLogout()} className="">
            <CiLogout size={22} color="white" />
          </button>
        </div>
      </div>

      <div className=" bg-black ">
        <FlowBuilder
          nodes={nodes}
          setNodes={setNodes}
          onNodesChange={onNodesChange}
          edges={edges}
          setEdges={setEdges}
          onEdgesChange={onEdgesChange}
          initialNodes={initialNodes}
          initialEdges={initialEdges}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          showSelect={showSelect}
        />
      </div>
    </div>
  );
}

export default FlowPage;
