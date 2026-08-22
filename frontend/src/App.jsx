import {
  Routes,
  Route,
} from "react-router-dom";


import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";

import UploadImage from "./pages/UploadImage";

import Result from "./pages/Result";

import History from "./pages/History";

import Loading from "./pages/Loading";

import Settings from "./pages/Settings";

import ThreatFeed from "./pages/ThreatFeed";

import FakeNews from "./pages/FakeNews";

import ForgotPassword from "./pages/ForgotPassword";

import ResetPassword from "./pages/ResetPassword";


function App() {

  return (

    <Routes>


      {/* ======================================
          AUTHENTICATION
      ====================================== */}

      <Route
        path="/"
        element={
          <Login />
        }
      />


      <Route
        path="/register"
        element={
          <Register />
        }
      />


      <Route
        path="/forgot-password"
        element={
          <ForgotPassword />
        }
      />


      <Route
        path="/reset-password/:token"
        element={
          <ResetPassword />
        }
      />



      {/* ======================================
          DASHBOARD
      ====================================== */}

      <Route
        path="/dashboard"
        element={
          <Dashboard />
        }
      />



      {/* ======================================
          IMAGE ANALYSIS
      ====================================== */}

      <Route
        path="/upload"
        element={
          <UploadImage />
        }
      />


      <Route
        path="/result"
        element={
          <Result />
        }
      />


      <Route
        path="/loading"
        element={
          <Loading />
        }
      />



      {/* ======================================
          FAKE NEWS
      ====================================== */}

      <Route
        path="/fake-news"
        element={
          <FakeNews />
        }
      />



      {/* ======================================
          HISTORY
      ====================================== */}

      <Route
        path="/history"
        element={
          <History />
        }
      />



      {/* ======================================
          THREAT FEED
      ====================================== */}

      <Route
        path="/threat-feed"
        element={
          <ThreatFeed />
        }
      />



      {/* ======================================
          SETTINGS
      ====================================== */}

      <Route
        path="/settings"
        element={
          <Settings />
        }
      />

    </Routes>

  );

}


export default App;