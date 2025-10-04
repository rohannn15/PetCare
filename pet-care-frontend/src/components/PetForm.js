import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PetForm({ existingPet, onSave }) {
  const navigate = useNavigate();
  
  // Initialize form with existingPet data or empty values
  const [form, setForm] = useState({
    name: "",
    type: "",
    age: "",
    breed: "",
    ownerName: "",
    imageUrl: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // Update form when existingPet changes
  useEffect(() => {
    console.log("PetForm received existingPet:", existingPet); // Debug log
    
    if (existingPet) {
      setForm({
        name: existingPet.name || "",
        type: existingPet.type || "",
        age: existingPet.age || "",
        breed: existingPet.breed || "",
        ownerName: existingPet.ownerName || "",
        imageUrl: existingPet.imageUrl || ""
      });
      setImagePreview(existingPet.imageUrl || "");
    } else {
      // Reset form if no existingPet (for add mode)
      setForm({
        name: "",
        type: "",
        age: "",
        breed: "",
        ownerName: "",
        imageUrl: ""
      });
      setImagePreview("");
    }
  }, [existingPet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Update image preview when URL changes
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

    // Validate age
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

      let response;
      if (existingPet && existingPet.id) {
        // Update existing pet
        console.log("Updating pet with ID:", existingPet.id);
        response = await axios.put(`http://localhost:8080/api/pets/${existingPet.id}`, petData);
      } else {
        // Create new pet
        console.log("Creating new pet");
        response = await axios.post("http://localhost:8080/api/pets", petData);
      }

      alert("Pet saved successfully!");
      
      if (onSave) {
        onSave();
      } else {
        navigate("/admin/pets");
      }
      
    } catch (err) {
      console.error("Save error:", err);
      let errorMessage = "Failed to save pet.";
      
      if (err.response) {
        if (err.response.data && err.response.data.error) {
          errorMessage = `Server error: ${err.response.data.error}`;
        } else {
          errorMessage = `Server error: ${err.response.status} - ${err.response.statusText}`;
        }
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
    if (onSave) {
      onSave();
    } else {
      navigate("/admin/pets");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ color: "#007bff", marginBottom: "20px" }}>
        {existingPet ? `Editing: ${existingPet.name}` : "Add New Pet"}
      </h2>
      
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
                Enter a direct image URL. Leave empty for default image.
              </small>
            </div>
            
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  flex: 1,
                  padding: "12px", 
                  backgroundColor: loading ? "#6c757d" : "#007bff", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "5px",
                  fontSize: "16px",
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Saving..." : (existingPet ? "Update Pet" : "Save Pet")}
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
          <h3 style={{ marginBottom: "15px" }}>Image Preview</h3>
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
                  alt="Preview" 
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
                  Preview of selected image
                </p>
              </>
            ) : (
              <div>
                <p style={{ color: "#666", marginBottom: "10px" }}>No image selected</p>
                <p style={{ color: "#999", fontSize: "14px" }}>
                  Enter an image URL to see preview
                </p>
              </div>
            )}
          </div>

          {/* Current Pet Info (only show when editing) */}
          {existingPet && (
            <div style={{ 
              marginTop: "20px", 
              padding: "15px", 
              backgroundColor: "#e7f3ff", 
              borderRadius: "8px",
              border: "1px solid #b3d9ff"
            }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#007bff" }}>Current Pet Information</h4>
              <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
                <p><strong>ID:</strong> {existingPet.id}</p>
                <p><strong>Name:</strong> {existingPet.name}</p>
                <p><strong>Type:</strong> {existingPet.type}</p>
                <p><strong>Age:</strong> {existingPet.age} years</p>
                <p><strong>Breed:</strong> {existingPet.breed || "Not specified"}</p>
                <p><strong>Owner:</strong> {existingPet.ownerName || "Not specified"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PetForm;