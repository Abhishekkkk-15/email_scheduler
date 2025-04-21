import { Flow } from "../models/schema.js";
import { agenda } from "../agenda/agenda.js";

//Function to get next node by edge
function getNextNode(nodeId, edges) {
  const edge = edges.find((e) => e.source === nodeId);
  return edge ? edge.target : null;
}

export const scheduleEmail = async (req, res) => {
  const { nodes, edges, userId } = req.body;
  try {
    //Save nodes and edges in db
    const flow = await Flow.create({ userId, nodes, edges });
    const leadSource = nodes.find((n) => n.type === "leadSource");
    if(!leadSource) return res.status(404).json({message:"Lead source not provided"})
    //Getting next node id
    let currentNodeId = getNextNode(leadSource.id, edges);
    let delay = 0;
  //Iterating over every node
    while (currentNodeId) {       
      //getting current node by currentNode id from nodes                                                              
      const currentNode = nodes.find((n) => n.id === currentNodeId);

      if (currentNode.type === "coldEmail") {
        const { to, body ,emailType} = currentNode.data;
        const waitTime = new Date(Date.now() + delay * 1000);  
        await agenda.schedule(waitTime, "send email", { to, subject:emailType, body,id:flow._id });
      }

      if (currentNode.type === "wait") {
        //Adding Delay for next node/cold Email
        delay += parseInt(currentNode.data.seconds);
      }
      //Getting next node
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
    //user history by user id saved in db
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
  //deleting whole flow dockumentation from db
   await Flow.findByIdAndDelete({_id:id})
   res.status(200).json({message:"Flow Deleted Successfully"})
 } catch (error) {
  console.log(error)
 }
}