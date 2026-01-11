import React, { useCallback, useEffect, useState } from "react";
import "reactflow/dist/style.css";
import FlowPage from "./pages/FlowPage";
import AuthPage from "./pages/AuthPage";
import axios from "axios";
import { getLogedUserInfo } from "./api/api";
import TemplateEditor from "./components/TemplateEditor";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UseTemplate from "./components/UseTemplate";
import { socket } from "./websocket/socketIO";

function App() {
  const [logedUser, setLogedUser] = useState();
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getLogedUserInfo();
        if (data) {
          setLogedUser(data?.userInfo);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  useEffect(() => {
    if (logedUser) {
      if (!socket.connected) {
        socket.auth = { userId: logedUser._id };
        console.log(logedUser._id);
        socket.connect();
      }
    }

    return () => {
      socket.disconnect();
    };
  }, [logedUser]);
  return (
    <BrowserRouter>
      <Routes>
        {/* <div className=" bg-transparent overflow-x-hidden"> */}
        <Route
          path="/"
          element={
            logedUser ? (
              <FlowPage logedUser={logedUser} setLogedUser={setLogedUser} />
            ) : (
              <AuthPage logedUser={logedUser} setLogedUser={setLogedUser} />
            )
          }
        />

        {/* </div> */}
        <Route path="/template" element={<UseTemplate />} />
        <Route path="/template/create_template" element={<TemplateEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
