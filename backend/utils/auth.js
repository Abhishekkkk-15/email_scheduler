import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  console.log("first")
  const token = req.cookies.token;
  if (!token) {
   return res.status(404).json({message:" User not authenticated or Token expired"}) 
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET );
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(404).json({message:" User not authenticated or Token expired"}) 

  }
};

export default auth