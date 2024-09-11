import React, { useContext, useEffect } from "react";
import "./App.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import NotFound from "./components/NotFound/NotFound";
import MyJobs from "./components/Job/MyJobs";

const App = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context); // usecontext->  A hook to consume context values.//This hook is used to access the context values provided by Context.Provider// A React hook used to consume data from a context. It allows components to access the context values provided by the nearest Context.Provider.
  useEffect(() => { // useeffect ->This hook runs a side effect function when the component mounts or when the isAuthorized state changes.
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://job-junction-backend.onrender.com/api/v1/user/getuser",
          {
            withCredentials: true, // This option indicates that the request should include credentials, such as cookies or authentication headers.
          }
        );
        setUser(response.data.user);
        setIsAuthorized(true);
      }
      catch (error) {
        console.log("Error fetching user:", error.response ? error.response.data : error);
        setIsAuthorized(false);
      }
      
    };
    fetchUser();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/job/getall" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/application/:id" element={<Application />} />
          <Route path="/applications/me" element={<MyApplications />} />
          <Route path="/job/post" element={<PostJob />} />
          <Route path="/job/me" element={<MyJobs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;
