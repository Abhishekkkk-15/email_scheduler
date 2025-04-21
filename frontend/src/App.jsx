import React, { useCallback, useEffect, useState } from "react";
import "reactflow/dist/style.css";
import FlowPage from "./pages/FlowPage";
import AuthPage from "./pages/AuthPage";
import axios from "axios";
import { getLogedUserInfo } from "./api/api";

function App() {
  const [logedUser, setLogedUser] = useState();
  useEffect(() => {
    (async () => {
      try {
        const {data} = await getLogedUserInfo()
        if (data) {
          setLogedUser(data?.userInfo);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    < div className=" bg-transparent overflow-x-hidden" >
      {/* {logedUser ? (
        <FlowPage logedUser={logedUser} setLogedUser={setLogedUser}  />
      ) : (
        <AuthPage logedUser={logedUser} setLogedUser={setLogedUser} />
      )} */}
                <FlowPage logedUser={logedUser} setLogedUser={setLogedUser}  />


    </div>
  );
}

export default App;
