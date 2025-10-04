package com.petcaretracker.pet_care_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.petcaretracker.pet_care_backend.model.Pet;
import com.petcaretracker.pet_care_backend.repository.PetRepository;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "http://localhost:3000")
public class PetController {

    @Autowired
    private PetRepository petRepository;

    // Get all pets
    @GetMapping
    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    // Create new pet with image URL - IMPROVED ERROR HANDLING
    @PostMapping
    public ResponseEntity<?> createPet(@RequestBody Pet pet) {
        try {
            System.out.println("Creating pet: " + pet.getName());
            System.out.println("Image URL: " + pet.getImageUrl());
            
            // Validation
            if (pet.getName() == null || pet.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Pet name is required"));
            }
            
            if (pet.getType() == null || pet.getType().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Pet type is required"));
            }
            
            // Set default image if no URL provided or invalid
            if (pet.getImageUrl() == null || pet.getImageUrl().trim().isEmpty()) {
                pet.setImageUrl("https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop");
            }
            
            Pet savedPet = petRepository.save(pet);
            System.out.println("Pet saved with ID: " + savedPet.getId());
            
            return ResponseEntity.ok(savedPet);
            
        } catch (Exception e) {
            System.err.println("Error creating pet: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to create pet: " + e.getMessage()));
        }
    }

    

    // Update pet
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePet(@PathVariable Long id, @RequestBody Pet petDetails) {
        try {
            Pet pet = petRepository.findById(id).orElse(null);
            if (pet != null) {
                pet.setName(petDetails.getName());
                pet.setType(petDetails.getType());
                pet.setAge(petDetails.getAge());
                pet.setBreed(petDetails.getBreed());
                pet.setOwnerName(petDetails.getOwnerName());
                pet.setImageUrl(petDetails.getImageUrl());
                
                Pet updatedPet = petRepository.save(pet);
                return ResponseEntity.ok(updatedPet);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to update pet: " + e.getMessage()));
        }
    }

    // Delete pet
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePet(@PathVariable Long id) {
        try {
            if (petRepository.existsById(id)) {
                petRepository.deleteById(id);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to delete pet: " + e.getMessage()));
        }
    }

    // Get pet by ID
    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Long id) {
        Pet pet = petRepository.findById(id).orElse(null);
        if (pet != null) {
            return ResponseEntity.ok(pet);
        }
        return ResponseEntity.notFound().build();
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", message);
        errorResponse.put("timestamp", java.time.LocalDateTime.now().toString());
        return errorResponse;
    }

    // Add this method to your PetController
@PostMapping("/test")
public ResponseEntity<String> testEndpoint(@RequestBody Map<String, Object> testData) {
    try {
        System.out.println("=== TEST ENDPOINT HIT ===");
        System.out.println("Received data: " + testData);
        System.out.println("Data types:");
        testData.forEach((key, value) -> {
            System.out.println(key + ": " + value + " (type: " + (value != null ? value.getClass().getSimpleName() : "null") + ")");
        });
        return ResponseEntity.ok("Test successful! Backend is working.");
    } catch (Exception e) {
        System.err.println("Test error: " + e.getMessage());
        return ResponseEntity.badRequest().body("Test failed: " + e.getMessage());
    }
}

@GetMapping("/check-db")
public ResponseEntity<String> checkDatabase() {
    try {
        long count = petRepository.count();
        return ResponseEntity.ok("Database connected. Total pets: " + count);
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Database error: " + e.getMessage());
    }
}


}