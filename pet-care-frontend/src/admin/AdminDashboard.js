import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("all"); // "all", "dog", "cat", "bird", etc.

  // Pet types for filtering
  const petTypes = [
    { value: "all", label: "All Pets" },
    { value: "dog", label: "Dogs" },
    { value: "cat", label: "Cats" },
    { value: "bird", label: "Birds" },
    { value: "rabbit", label: "Rabbits" },
    { value: "fish", label: "Fish" },
    { value: "other", label: "Other" }
  ];

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    filterPets();
  }, [pets, selectedType]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/pets");
      setPets(response.data);
    } catch (err) {
      console.error("Error fetching pets:", err);
      setError("Failed to load pets");
    } finally {
      setLoading(false);
    }
  };

  const filterPets = () => {
    if (selectedType === "all") {
      setFilteredPets(pets);
    } else {
      const filtered = pets.filter(pet => 
        pet.type.toLowerCase() === selectedType.toLowerCase()
      );
      setFilteredPets(filtered);
    }
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
  };

  const handleEdit = (petId) => {
  console.log("Editing pet with ID:", petId); // For debugging
  navigate(`/admin/pets/edit/${petId}`);
};
  const handleDelete = async (petId) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      try {
        await axios.delete(`http://localhost:8080/api/pets/${petId}`);
        alert("Pet deleted successfully!");
        fetchPets(); // Refresh the list
      } catch (err) {
        console.error("Error deleting pet:", err);
        alert("Failed to delete pet");
      }
    }
  };

  const getPetCountByType = (type) => {
    if (type === "all") return pets.length;
    return pets.filter(pet => pet.type.toLowerCase() === type.toLowerCase()).length;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading pets...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Admin Dashboard</h1>
        <button 
          onClick={() => navigate("/admin/pets/add")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Add New Pet
        </button>
      </div>

      {error && (
        <div style={{ 
          color: "red", 
          backgroundColor: "#ffe6e6", 
          padding: "15px", 
          borderRadius: "5px", 
          marginBottom: "20px",
          border: "1px solid red"
        }}>
          {error}
        </div>
      )}

      {/* Filter Buttons */}
      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ marginBottom: "15px" }}>Filter by Pet Type</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {petTypes.map(type => (
            <button
              key={type.value}
              onClick={() => handleTypeFilter(type.value)}
              style={{
                padding: "10px 20px",
                backgroundColor: selectedType === type.value ? "#007bff" : "#f8f9fa",
                color: selectedType === type.value ? "white" : "#333",
                border: "1px solid #ddd",
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.3s"
              }}
            >
              {type.label} ({getPetCountByType(type.value)})
            </button>
          ))}
        </div>
      </div>

      {/* Pets Grid */}
      <div>
        <h3 style={{ marginBottom: "20px" }}>
          {selectedType === "all" ? "All Pets" : `${petTypes.find(t => t.value === selectedType)?.label}`} 
          ({filteredPets.length})
        </h3>
        
        {filteredPets.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "50px", 
            backgroundColor: "#f8f9fa", 
            borderRadius: "10px",
            border: "2px dashed #ddd"
          }}>
            <h4>No pets found</h4>
            <p>No {selectedType !== "all" ? petTypes.find(t => t.value === selectedType)?.label.toLowerCase() : "pets"} available.</p>
            <button 
  onClick={() => navigate("/admin/pets/add")}
  style={{
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px"
  }}
>
  Add New Pet
</button>

          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: "20px" 
          }}>
            {filteredPets.map(pet => (
              <div 
                key={pet.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: "white",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ height: "200px", overflow: "hidden" }}>
                  <img 
                    src={pet.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"} 
                    alt={pet.name}
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover" 
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Image+Error";
                    }}
                  />
                </div>
                
                <div style={{ padding: "15px" }}>
                  <h4 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>{pet.name}</h4>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "14px" }}>
                    <div>
                      <strong>Type:</strong> {pet.type}
                    </div>
                    <div>
                      <strong>Age:</strong> {pet.age} years
                    </div>
                    <div>
                      <strong>Breed:</strong> {pet.breed || "N/A"}
                    </div>
                    <div>
                      <strong>Owner:</strong> {pet.ownerName || "N/A"}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                    <button 
                      onClick={() => handleEdit(pet.id)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(pet.id)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;