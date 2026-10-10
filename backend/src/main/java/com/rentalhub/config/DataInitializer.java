package com.rentalhub.config;

import com.rentalhub.entity.Property;
import com.rentalhub.entity.User;
import com.rentalhub.repository.PropertyRepository;
import com.rentalhub.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner init(PropertyRepository properties, UserRepository users, PasswordEncoder encoder) {
        return args -> {
            if (properties.count() == 0) {
                properties.save(frontendProperty("2BHK Apartment", "Apartment", "Hyderabad", 15000.0,
                        "Modern 2BHK apartment with parking.", "Suresh Kumar", "9876543210"));
                properties.save(frontendProperty("1BHK Flat", "Flat", "Secunderabad", 10000.0,
                        "Affordable 1BHK flat near transport.", "Anita Reddy", "9123456780"));
                properties.save(frontendProperty("3BHK Family Home", "House", "Madhapur", 28000.0,
                        "Spacious family home with modern facilities.", "Ramesh Rao", "9988776655"));
            }

            // Copy the legacy property columns into the fields consumed by the frontend.
            properties.findAll().forEach(property -> {
                if (property.getPropertyAddress() == null || property.getPropertyAddress().isBlank()) {
                    property.setPropertyAddress(property.getLocation());
                }
                if (property.getPropertyType() == null || property.getPropertyType().isBlank()) {
                    String title = property.getTitle() == null ? "" : property.getTitle().toLowerCase();
                    property.setPropertyType(title.contains("apartment") ? "Apartment"
                            : title.contains("flat") ? "Flat" : title.contains("home") ? "House" : "House");
                }
                if (property.getPropertyAdType() == null || property.getPropertyAdType().isBlank()) {
                    property.setPropertyAdType("Rent");
                }
                if (property.getPropertyAmount() == null) property.setPropertyAmount(property.getPrice());
                if (property.getOwnerContact() == null || property.getOwnerContact().isBlank()) {
                    property.setOwnerContact(property.getOwnerPhone());
                }
                if (property.getAdditionalDetails() == null || property.getAdditionalDetails().isBlank()) {
                    property.setAdditionalDetails(property.getDescription());
                }
                if (property.getAvailability() == null) property.setAvailability(true);
                if (property.getOwnerName() == null || property.getOwnerName().isBlank()) property.setOwnerName("Property Owner");
                if (property.getOwnerEmail() == null || property.getOwnerEmail().isBlank()) property.setOwnerEmail("owner@example.com");
                if (property.getOwnerPhone() == null || property.getOwnerPhone().isBlank()) property.setOwnerPhone("9000000000");
                properties.save(property);
            });

            if (users.findByEmail("admin@rentalhub.com").isEmpty())
                users.save(new User(null, "Rental Hub Admin", "admin@rentalhub.com", encoder.encode("admin123"), "ADMIN"));
            if (users.findByEmail("user@rentalhub.com").isEmpty())
                users.save(new User(null, "Demo User", "user@rentalhub.com", encoder.encode("user123"), "USER"));

            users.findAll().forEach(user -> {
                if (user.getType() == null || user.getType().isBlank()) {
                    user.setType("ADMIN".equalsIgnoreCase(user.getRole()) ? "Admin"
                            : "OWNER".equalsIgnoreCase(user.getRole()) ? "Owner" : "Renter");
                }
                if (user.getPermissionStatus() == null || user.getPermissionStatus().isBlank()) {
                    user.setPermissionStatus("OWNER".equalsIgnoreCase(user.getRole()) ? "Ungrant" : "Granted");
                }
                users.save(user);
            });
        };
    }

    private Property frontendProperty(
            String title, String type, String address, Double amount, String description, String ownerName, String contact) {
        Property property = new Property(null, title, address, amount, description, ownerName, null, contact);
        property.setPropertyType(type);
        property.setPropertyAdType("Rent");
        property.setPropertyAddress(address);
        property.setOwnerContact(contact);
        property.setPropertyAmount(amount);
        property.setAvailability(true);
        property.setAdditionalDetails(description);
        return property;
    }
}
