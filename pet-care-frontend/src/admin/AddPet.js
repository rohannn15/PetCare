import React from "react";
import { useNavigate } from "react-router-dom";
import PetForm from "../components/PetForm";
import "./Admin.css";

function AddPet() {
  const navigate = useNavigate();

  return (
    <div className="admin-content">
      <h1>Add New Pet</h1>
      <PetForm onSave={() => navigate("/admin/pets")} />
    </div>
  );
}

export default AddPet;
