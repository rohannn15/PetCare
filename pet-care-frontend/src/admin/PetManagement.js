import React, { useState, useEffect } from "react";
import axios from "axios";
import PetForm from "../components/PetForm";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const API_URL = "http://localhost:8080/api/pets";

function PetManagement() {
  const [pets, setPets] = useState([]);
  const [editPet, setEditPet] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchPets = async () => {
    try {
      const res = await axios.get(API_URL);
      setPets(res.data);
    } catch (err) {
      console.error("Error fetching pets:", err);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const getImageUrl = (imageUrl) => {
    console.log("Management Image URL:", imageUrl); // Debug log
    
    if (!imageUrl) {
      return "https://via.placeholder.com/50?text=No+Image";
    }
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:8080${imageUrl}`;
    }
    
    return `http://localhost:8080/uploads/${imageUrl}`;
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchPets();
        alert("Pet deleted successfully!");
      } catch (err) {
        console.error("Error deleting pet:", err);
        alert("Failed to delete pet.");
      }
    }
  };

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (pet.ownerName && pet.ownerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-content">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Manage Pets</h1>
        <button className="add-btn" onClick={() => navigate("/admin/pets/add")}>
          + Add New Pet
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by Name, Type, Breed, Owner..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          margin: "20px 0",
          padding: "8px 12px",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "5px",
          border: "1px solid #ccc"
        }}
      />

      {editPet && (
        <div style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "5px" }}>
          <h2>Edit Pet: {editPet.name}</h2>
          <PetForm
            existingPet={editPet}
            onSave={() => {
              setEditPet(null);
              fetchPets();
            }}
          />
          <button 
            onClick={() => setEditPet(null)}
            style={{ marginTop: "10px", padding: "5px 10px" }}
          >
            Cancel Edit
          </button>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Age</th>
            <th>Breed</th>
            <th>Owner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPets.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>No pets found</td>
            </tr>
          ) : (
            filteredPets.map((pet) => (
              <tr key={pet.id}>
                <td>
                  <img 
                    src={getImageUrl(pet.imageUrl)} 
                    alt={pet.name} 
                    style={{ 
                      width: "50px", 
                      height: "50px", 
                      objectFit: "cover", 
                      borderRadius: "5px" 
                    }} 
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/50?text=No+Image";
                    }}
                  />
                </td>
                <td>{pet.id}</td>
                <td>{pet.name}</td>
                <td>{pet.type}</td>
                <td>{pet.age}</td>
                <td>{pet.breed || "Unknown"}</td>
                <td>{pet.ownerName || "Unknown"}</td>
                <td>
                  <button className="edit-btn" onClick={() => setEditPet(pet)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(pet.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PetManagement;