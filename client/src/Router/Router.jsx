import React from "react";
import { BrowserRouter , Route, Routes} from "react-router-dom";
import Login from "../Pages/Login.jsx";
import Signup from "../Pages/Signup.jsx";
import SetPassword from "../components/SetPassword.jsx";
import App from "../App";
import Home from "../Pages/Home.jsx";
import CreateRoom from "../components/CreateRoom.jsx";
import HomeSubPage from "../Pages/HomeSubPage.jsx";
import AddQuestions from "../Pages/AddQuestions.jsx";
import Alldates from "../Pages/Alldates.jsx";
import Allquestack from "../Pages/Allquestack.jsx";
import Admins from "../Pages/Admins.jsx";
import Admindates from "../Pages/Admindates.jsx";
import Questack from "../Pages/Questack.jsx";
import Protectedquestack from "../Pages/Protectedquestack.jsx";
import EnterRoom from "../Pages/EnterRoom.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}>
          <Route path="/" element={<Home/>} />
         <Route path='/sign-up' element={<Signup/>}/>
          <Route path="/login" element={<Login/>} />
          <Route path="/set-password" element={<SetPassword/>} />
          <Route path="/create-room" element={<CreateRoom/>} />
          <Route path='/enter-room/:roomCode' element={<HomeSubPage/>} />
          <Route path='/add-question/:roomCode' element={<AddQuestions/>} />
          <Route path="/browse-questions/:roomCode" element={<Alldates />} />
          <Route path="/Alldates/:date/:roomCode" element={<Allquestack />} />
          <Route path='/browse-questions/all-friends/:roomCode' element={<Admins/>} />
          <Route path="/friends/:roomCode/:userId?/:firstName?"element={<Admindates />}/>
          <Route path="/friends/:userId/dates/:date/:firstName/:roomCode" element={<Questack />} />
          <Route path="dates/:date/:roomCode" element={<Protectedquestack />} />
          <Route path='join-room' element={<EnterRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
