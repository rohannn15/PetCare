import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditPet() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [form, setForm] = useState({
    name: "",
    type: "",
    age: "",
    breed: "",
    ownerName: "",
    imageUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // Fetch all pets and find the specific one to edit
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        setFetchLoading(true);
        console.log("Fetching all pets to find ID:", id);
        
        // Get all pets
        const response = await axios.get("http://localhost:8080/api/pets");
        const allPets = response.data;
        
        // Find the pet with matching ID
        const petToEdit = allPets.find(pet => pet.id == id); // Use == for loose comparison
        
        if (petToEdit) {
          console.log("Found pet to edit:", petToEdit);
          // Pre-fill the form with existing data
          setForm({
            name: petToEdit.name || "",
            type: petToEdit.type || "",
            age: petToEdit.age || "",
            breed: petToEdit.breed || "",
            ownerName: petToEdit.ownerName || "",
            imageUrl: petToEdit.imageUrl || ""
          });
          setImagePreview(petToEdit.imageUrl || "");
        } else {
          setError(`Pet with ID ${id} not found.`);
        }
      } catch (err) {
        console.error("Error fetching pets:", err);
        setError("Failed to load pet data. Please check if the server is running.");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchPetData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "imageUrl") {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!form.name.trim() || !form.type.trim() || !form.age) {
      setError("Please fill in all required fields (Name, Type, Age)");
      setLoading(false);
      return;
    }

    if (form.age < 0 || form.age > 50) {
      setError("Please enter a valid age (0-50)");
      setLoading(false);
      return;
    }

    try {
      // Prepare data for backend
      const petData = {
        name: String(form.name),
        type: String(form.type),
        age: parseInt(form.age, 10),
        breed: form.breed ? String(form.breed) : "",
        ownerName: form.ownerName ? String(form.ownerName) : "",
        imageUrl: form.imageUrl ? String(form.imageUrl) : "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop"
      };

      console.log("Updating pet with ID:", id);
      console.log("Updated pet data:", petData);

      // Update existing pet using PUT request
      await axios.put(`http://localhost:8080/api/pets/${id}`, petData);
      
      alert("Pet updated successfully!");
      navigate("/admin"); // Go back to dashboard
      
    } catch (err) {
      console.error("Update error:", err);
      let errorMessage = "Failed to update pet.";
      
      if (err.response) {
        errorMessage = `Server error: ${err.response.status} - ${err.response.data || err.response.statusText}`;
      } else if (err.request) {
        errorMessage = "No response from server. Please check if the backend is running.";
      } else {
        errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  if (fetchLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading pet information...</h2>
        <p>Please wait while we load the pet data.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto", padding: "20px" }}>
      <h1>Edit Pet: {form.name || "Unknown Pet"}</h1>
      
      <div style={{ 
        backgroundColor: "#e7f3ff", 
        padding: "15px", 
        borderRadius: "5px", 
        marginBottom: "20px",
        border: "1px solid #b3d9ff"
      }}>
        <p><strong>Note:</strong> Edit the fields you want to update. All fields are pre-filled with current data.</p>
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
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        {/* Form Section */}
        <div>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Pet Name *
              </label>
              <input 
                type="text"
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="Enter pet name"
                required
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  border: "1px solid #ccc", 
                  borderRadius: "5px",
                  fontSize: "16px"
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Type *
              </label>
              <select 
                name="type" 
                value={form.type} 
                onChange={handleChange} 
                required
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  border: "1px solid #ccc", 
                  borderRadius: "5px",
                  fontSize: "16px"
                }}
              >
                <option value="">Select pet type</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Fish">Fish</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Age * (years)
              </label>
              <input 
                type="number" 
                name="age" 
                value={form.age} 
                onChange={handleChange} 
                placeholder="Enter age in years"
                min="0"
                max="50"
                required
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  border: "1px solid #ccc", 
                  borderRadius: "5px",
                  fontSize: "16px"
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Breed
              </label>
              <input 
                type="text"
                name="breed" 
                value={form.breed} 
                onChange={handleChange} 
                placeholder="Enter breed"
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  border: "1px solid #ccc", 
                  borderRadius: "5px",
                  fontSize: "16px"
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Owner Name
              </label>
              <input 
                type="text"
                name="ownerName" 
                value={form.ownerName} 
                onChange={handleChange} 
                placeholder="Enter owner name"
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  border: "1px solid #ccc", 
                  borderRadius: "5px",
                  fontSize: "16px"
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Image URL
              </label>
              <input 
                type="url"
                name="imageUrl" 
                value={form.imageUrl} 
                onChange={handleChange} 
                placeholder="https://example.com/pet-image.jpg"
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  border: "1px solid #ccc", 
                  borderRadius: "5px",
                  fontSize: "16px"
                }}
              />
              <small style={{ color: "#666", display: "block", marginTop: "5px" }}>
                Enter a direct image URL
              </small>
            </div>
            
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  flex: 1,
                  padding: "12px", 
                  backgroundColor: loading ? "#6c757d" : "#28a745", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "5px",
                  fontSize: "16px",
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Updating..." : "Update Pet"}
              </button>
              
              <button 
                type="button"
                onClick={handleCancel}
                style={{ 
                  flex: 1,
                  padding: "12px", 
                  backgroundColor: "#6c757d", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "5px",
                  fontSize: "16px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div>
          <h3 style={{ marginBottom: "15px" }}>Current Image</h3>
          <div style={{ 
            border: "2px dashed #ccc", 
            borderRadius: "10px", 
            padding: "20px", 
            textAlign: "center",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f9f9f9"
          }}>
            {imagePreview ? (
              <>
                <img 
                  src={imagePreview} 
                  alt="Current pet" 
                  style={{ 
                    maxWidth: "100%", 
                    maxHeight: "250px",
                    borderRadius: "8px",
                    objectFit: "cover"
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Invalid+Image+URL";
                  }}
                />
                <p style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
                  Current pet image
                </p>
              </>
            ) : (
              <div>
                <p style={{ color: "#666", marginBottom: "10px" }}>No image available</p>
                <p style={{ color: "#999", fontSize: "14px" }}>
                  Add an image URL to see preview
                </p>
              </div>
            )}
          </div>

          {/* Current Pet Info Summary */}
          <div style={{ 
            marginTop: "20px", 
            padding: "15px", 
            backgroundColor: "#f8f9fa", 
            borderRadius: "8px",
            border: "1px solid #e9ecef"
          }}>
            <h4 style={{ margin: "0 0 10px 0" }}>Current Pet Information</h4>
            <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
              <p><strong>Name:</strong> {form.name || "Not set"}</p>
              <p><strong>Type:</strong> {form.type || "Not set"}</p>
              <p><strong>Age:</strong> {form.age || "Not set"} years</p>
              <p><strong>Breed:</strong> {form.breed || "Not set"}</p>
              <p><strong>Owner:</strong> {form.ownerName || "Not set"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPet;