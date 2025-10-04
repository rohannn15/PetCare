import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import AdminDashboard from "./admin/AdminDashboard";
import PetManagement from "./admin/PetManagement";
import UserManagement from "./admin/UserManagement";
import Reports from "./admin/Reports";
import AddPetPage from "./admin/AddPet";
import AllPets from "./admin/AllPets"; 
import EditPet from "./admin/EditPet"; // Import the EditPet component

function App() {
  return (
    <Router>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <div style={{ width: 250, background: "#333", color: "white", padding: 20 }}>
          <h2>Admin Panel</h2>
          <Link to="/admin" style={{ display: "block", color: "white", margin: "10px 0" }}>Dashboard</Link>
          <Link to="/admin/pets" style={{ display: "block", color: "white", margin: "10px 0" }}>Manage Pets</Link>
          <Link to="/admin/users" style={{ display: "block", color: "white", margin: "10px 0" }}>Manage Users</Link>
          <Link to="/admin/reports" style={{ display: "block", color: "white", margin: "10px 0" }}>Reports</Link>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: 20 }}>
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/pets" element={<PetManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/pets/add" element={<AddPetPage />} />
            <Route path="/admin/pets/all" element={<AllPets />} />
            
            {/* ADD THIS EDIT ROUTE */}
            <Route path="/admin/pets/edit/:id" element={<EditPet />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;