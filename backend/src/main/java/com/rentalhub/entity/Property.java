package com.rentalhub.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ownerId;
    private String ownerName;
    private String propertyType;
    private String propertyAdType;
    @Column(length = 1000)
    private String propertyAddress;
    private String ownerContact;
    private Double propertyAmount;
    private Boolean availability = true;
    @Column(length = 2048)
    private String propertyImages;
    @Column(length = 2000)
    private String additionalDetails;

    // Retained for compatibility with the original /api/properties endpoints.
    private String title;
    private String location;
    private Double price;
    @Column(length = 1000)
    private String description;
    private String ownerEmail;
    private String ownerPhone;

    public Property() {
    }

    public Property(Long id, String title, String location, Double price, String description) {
        this(id, title, location, price, description, null, null, null);
    }

    public Property(Long id, String title, String location, Double price, String description, String ownerName, String ownerEmail, String ownerPhone) {
        this.id = id;
        this.title = title;
        this.location = location;
        this.price = price;
        this.description = description;
        this.ownerName = ownerName;
        this.ownerEmail = ownerEmail;
        this.ownerPhone = ownerPhone;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }
    public String getOwnerPhone() { return ownerPhone; }
    public void setOwnerPhone(String ownerPhone) { this.ownerPhone = ownerPhone; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
    public String getPropertyType() { return propertyType; }
    public void setPropertyType(String propertyType) { this.propertyType = propertyType; }
    public String getPropertyAdType() { return propertyAdType; }
    public void setPropertyAdType(String propertyAdType) { this.propertyAdType = propertyAdType; }
    public String getPropertyAddress() { return propertyAddress; }
    public void setPropertyAddress(String propertyAddress) { this.propertyAddress = propertyAddress; }
    public String getOwnerContact() { return ownerContact; }
    public void setOwnerContact(String ownerContact) { this.ownerContact = ownerContact; }
    public Double getPropertyAmount() { return propertyAmount != null ? propertyAmount : price; }
    public void setPropertyAmount(Double propertyAmount) { this.propertyAmount = propertyAmount; }
    public Boolean getAvailability() { return availability; }
    public void setAvailability(Boolean availability) { this.availability = availability; }
    public String getPropertyImages() { return propertyImages; }
    public void setPropertyImages(String propertyImages) { this.propertyImages = propertyImages; }
    public String getAdditionalDetails() { return additionalDetails; }
    public void setAdditionalDetails(String additionalDetails) { this.additionalDetails = additionalDetails; }

    @Transient
    public Long get_id() { return id; }

    @JsonProperty("OwnerName")
    public String getOwnerDisplayName() { return ownerName; }

    @JsonProperty("OwnerName")
    public void setOwnerDisplayName(String ownerName) { this.ownerName = ownerName; }
}
