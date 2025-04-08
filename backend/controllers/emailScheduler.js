import { Flow } from "../models/schema.js";
import { agenda } from "../agenda/agenda.js";

function getNextNode(nodeId, edges) {
  const edge = edges.find((e) => e.source === nodeId);
  return edge ? edge.target : null;
}

export const scheduleEmail = async (req, res) => {
  const { nodes, edges, userId } = req.body;
  console.log("Getting Called")
  try {
    const flow = await Flow.create({ userId, nodes, edges });
    const leadNode = nodes.find((n) => n.type === "leadSource");
    if(!leadNode) return res.status(404).json({message:"Lead source not provided"})
    let currentNodeId = getNextNode(leadNode.id, edges);
    let accumulatedDelay = 0;

    while (currentNodeId) {                                                                       
      const currentNode = nodes.find((n) => n.id === currentNodeId);

      if (currentNode.type === "coldEmail") {
        const { to, body ,emailType} = currentNode.data;
        const sendTime = new Date(Date.now() + accumulatedDelay * 1000);  
        await agenda.schedule(sendTime, "send email", { to, subject:emailType, body,id:flow._id });
      }

      if (currentNode.type === "wait") {
        accumulatedDelay += parseInt(currentNode.data.seconds);
      }
      currentNodeId = getNextNode(currentNodeId, edges);
    }
    res.status(200).json({ message: "Flow scheduled!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to schedule flow" });
  }
};

export const getHitory= async (req, res) => {
  const {userId} = req.query;
  console.log(userId)
  try {
   const history = await Flow.find({
      userId:userId
    })
    if(!history) return res.status(404).json({message:"Not Scheduled Emails"})
    return res.status(200).json({message:"success",data:history})
  } catch (error) {
    console.log(error)
  }
}

export const deleteFlow = async(req,res)=>{
  const {id} = req.query

  if(!id) return res.status(404).json({message:"Flow id not provided"})
 try {
   await Flow.findByIdAndDelete({_id:id})
   res.status(200).json({message:"Flow Deleted Successfully"})
 } catch (error) {
  console.log(error)
 }
}