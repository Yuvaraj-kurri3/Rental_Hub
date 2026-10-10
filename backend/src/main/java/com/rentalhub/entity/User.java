package com.rentalhub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    @Column(nullable = false)
    private String name;
    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;
    @NotBlank
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String role = "RENTER";
    @Column(nullable = false)
    private String type = "Renter";
    private String phoneNumber;
    @Column(nullable = false)
    private String permissionStatus = "Granted";

    public User() {}

    public User(Long id, String name, String email, String password, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.type = "ADMIN".equalsIgnoreCase(role) ? "Admin" : "Renter";
    }

    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getName(){return name;} public void setName(String name){this.name=name;}
    public String getEmail(){return email;} public void setEmail(String email){this.email=email;}
    public String getPassword(){return password;} public void setPassword(String password){this.password=password;}
    public String getRole(){return role;} public void setRole(String role){this.role=role;}
    public String getType(){return type;} public void setType(String type){this.type=type;}
    public String getPhoneNumber(){return phoneNumber;} public void setPhoneNumber(String phoneNumber){this.phoneNumber=phoneNumber;}
    public String getPermissionStatus(){return permissionStatus;} public void setPermissionStatus(String permissionStatus){this.permissionStatus=permissionStatus;}

    @Transient
    public Long get_id() { return id; }

    @JsonProperty("PermissionStatus")
    public String getPermissionStatusDisplay() { return permissionStatus; }

    @JsonProperty("PermissionStatus")
    public void setPermissionStatusDisplay(String permissionStatus) { this.permissionStatus = permissionStatus; }
 }
