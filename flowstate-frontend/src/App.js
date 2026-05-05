
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Welcome from './pages/Welcome';
import DevPage from './DevPage';
import UserSpace from './pages/UserSpace';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserIntroduction from './pages/UserIntroduction';
import AppIntroduction from './pages/AppIntroduction'
import HabitudesDuJour from './pages/HabitudesDuJour'; 
import HabitDetails from './pages/HabitDetails';
import ConfirmHabit from './pages/ConfirmHabit';
import HabitAdded from './pages/HabitAdded';
import SelectHabit from './pages/SelectHabit';
import  Focus  from './pages/Focus';
import Motivation from './pages/Motivation';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/ConfirmHabit" element={<ConfirmHabit />} />
        <Route path="/Focus" element={<Focus/>} />
        <Route path="/Motivation" element={<Motivation/>} />
        <Route path="/SelectHabit" element={<SelectHabit />} />
        <Route path="/HabitAdded" element={<HabitAdded/>} />
        <Route path="/HabitudesDuJour" element={<HabitudesDuJour />} />
        <Route path="/HabitDetails" element={<HabitDetails/>} />
        <Route path="/UserSpace" element={<UserSpace />} />
        <Route path="/userIntroduction" element={<UserIntroduction />} />
        <Route path="/AppIntroduction" element={<AppIntroduction />} />
        <Route path="/ForgotPassword" element={<ForgotPassword/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/dev' element={<DevPage/>}></Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
