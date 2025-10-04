package com.petcaretracker.pet_care_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.petcaretracker.pet_care_backend.model.Pet;

public interface PetRepository extends JpaRepository<Pet, Long> {
}
