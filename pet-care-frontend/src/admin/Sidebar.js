
import React from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

function Sidebar() {
  return (
    <div className="sidebar" style={{ position: 'relative' }}>
      <h2>Admin Panel</h2>
      <Link to="/admin" className="sidebar-link">Dashboard</Link>
      <Link to="/admin/pets" className="sidebar-link">Manage Pets</Link>
      <Link to="/admin/reports" className="sidebar-link">Reports</Link>
      <Link
        to="/admin/pets/add"
        style={{ position: 'absolute', right: 10, top: 10 }}
        className="add-pet-btn"
      >
        Add Pet
      </Link>
    </div>
  );
}

export default Sidebar;
