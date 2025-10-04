import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

const API_URL = "http://localhost:8080/api/pets";

function AllPets() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await axios.get(API_URL);
        setPets(res.data);
      } catch (err) { 
        console.error("Error fetching pets:", err); 
      }
    };
    fetchPets();
  }, []);

  return (
    <div className="admin-content">
      <h1>All Pets</h1>
      
      {pets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ fontSize: "18px", color: "#666" }}>No pets found</p>
        </div>
      ) : (
        <div className="pet-grid">
          {pets.map(pet => (
            <div className="pet-card" key={pet.id}>
              <div className="pet-image-container">
                <img 
                  src={pet.imageUrl} 
                  alt={pet.name} 
                  className="pet-image"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop";
                  }}
                />
              </div>
              <div className="pet-details">
                <h3 className="pet-name">{pet.name}</h3>
                <div className="pet-info">
                  <div className="info-row">
                    <span className="info-label">Type:</span>
                    <span className="info-value">{pet.type}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Age:</span>
                    <span className="info-value">{pet.age} years</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Breed:</span>
                    <span className="info-value">{pet.breed || "Unknown"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Owner:</span>
                    <span className="info-value">{pet.ownerName || "Unknown"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllPets;