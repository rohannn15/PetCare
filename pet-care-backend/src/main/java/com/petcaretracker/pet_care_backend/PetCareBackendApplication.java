package com.petcaretracker.pet_care_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PetCareBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PetCareBackendApplication.class, args);
		System.out.println("Pet Care Backend is running...");
	}

}
