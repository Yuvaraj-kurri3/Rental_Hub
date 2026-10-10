package com.rentalhub.controller;

import com.rentalhub.entity.Booking;
import com.rentalhub.entity.Property;
import com.rentalhub.entity.User;
import com.rentalhub.repository.ApplicationRepository;
import com.rentalhub.repository.BookingRepository;
import com.rentalhub.repository.PropertyRepository;
import com.rentalhub.repository.UserRepository;
import com.rentalhub.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class FrontendApiController {
    private final UserRepository users;
    private final PropertyRepository properties;
    private final BookingRepository bookings;
    private final ApplicationRepository applications;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public FrontendApiController(
            UserRepository users,
            PropertyRepository properties,
            BookingRepository bookings,
            ApplicationRepository applications,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.users = users;
        this.properties = properties;
        this.bookings = bookings;
        this.applications = applications;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/users/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        String name = text(body, "name");
        String email = text(body, "email").toLowerCase(Locale.ROOT);
        String password = text(body, "password");
        String phoneNumber = text(body, "phoneNumber");
        String type = text(body, "type");
        boolean adminRegistration = type.equalsIgnoreCase("Admin");
        if (name.isBlank() || email.isBlank() || password.length() < 6
                || phoneNumber.isBlank() || !(adminRegistration
                || type.equalsIgnoreCase("Owner") || type.equalsIgnoreCase("Renter"))) {
            return ResponseEntity.badRequest().body(message("Valid name, email, password (6+ characters), phone number, and Owner/Renter/Admin type are required"));
        }
        if (users.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(message("Email already registered"));
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setPhoneNumber(phoneNumber);
        user.setType(adminRegistration ? "Admin" : type.equalsIgnoreCase("Owner") ? "Owner" : "Renter");
        user.setRole(adminRegistration ? "ADMIN" : type.equalsIgnoreCase("Owner") ? "OWNER" : "RENTER");
        user.setPermissionStatus(type.equalsIgnoreCase("Owner") ? "Ungrant" : "Granted");
        User saved = users.save(user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("success", true, "message", "Registration successful", "user", userMap(saved)));
    }

    @PostMapping("/users/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> body) {
        String email = text(body, "email").toLowerCase(Locale.ROOT);
        String password = text(body, "password");
        Optional<User> found = users.findByEmail(email);
        if (email.isBlank() || password.isBlank() || found.isEmpty()
                || !passwordEncoder.matches(password, found.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(message("Invalid email or password"));
        }
        User user = found.get();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Login successful",
                "token", jwtUtil.generateToken(user.getEmail(), user.getRole()),
                "resUser", userMap(user)));
    }

    @GetMapping("/properties/properties/all")
    public Map<String, Object> allProperties() {
        return Map.of("properties", properties.findAll().stream().map(this::propertyMap).toList());
    }

    @GetMapping("/owner/ownerDetails/{userId}")
    public ResponseEntity<?> ownerDetails(@PathVariable Long userId, Authentication authentication) {
        User user = users.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        if (!isAdmin(authentication) && !isSelf(userId, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message("You can view only your own details"));
        }
        return ResponseEntity.ok(Map.of("owner", userMap(user)));
    }

    @GetMapping("/owner/myProperties/{userId}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<?> ownerProperties(@PathVariable Long userId, Authentication authentication) {
        if (!isAdmin(authentication) && !isSelf(userId, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message("You can view only your own properties"));
        }
        return ResponseEntity.ok(Map.of(
                "properties", properties.findByOwnerId(userId).stream().map(this::propertyMap).toList()));
    }

    @PostMapping("/owner/newProperty")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> createProperty(@RequestBody Map<String, Object> body, Authentication authentication) {
        User owner = authenticatedUser(authentication);
        if (owner == null || !"Granted".equalsIgnoreCase(owner.getPermissionStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message("Owner permission is required to list a property"));
        }
        String address = text(body, "propertyAddress");
        String type = text(body, "propertyType");
        String adType = text(body, "propertyAdType");
        Double amount = number(body.get("propertyAmount"));
        if (address.isBlank() || type.isBlank() || adType.isBlank() || amount == null || amount <= 0) {
            return ResponseEntity.badRequest().body(message("Property type, listing type, address, and a positive amount are required"));
        }
        Property property = new Property();
        property.setOwnerId(owner.getId());
        property.setOwnerName(text(body, "OwnerName").isBlank() ? owner.getName() : text(body, "OwnerName"));
        property.setPropertyType(type);
        property.setPropertyAdType(adType);
        property.setPropertyAddress(address);
        property.setOwnerContact(text(body, "ownerContact"));
        property.setPropertyAmount(amount);
        property.setPrice(amount);
        property.setLocation(address);
        property.setTitle(type + " - " + address);
        property.setDescription(text(body, "additionalDetails"));
        property.setAdditionalDetails(text(body, "additionalDetails"));
        property.setAvailability(booleanValue(body.get("availability"), true));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("success", true, "message", "Property created successfully",
                        "property", propertyMap(properties.save(property))));
    }

    @PutMapping("/owner/updateProperty/{propertyId}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<?> updateProperty(
            @PathVariable Long propertyId,
            @RequestBody Map<String, Object> body,
            Authentication authentication) {
        Property property = properties.findById(propertyId).orElse(null);
        if (property == null) return ResponseEntity.notFound().build();
        if (!isAdmin(authentication) && !isSelf(property.getOwnerId(), authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message("You can update only your own properties"));
        }
        if (body.containsKey("propertyType")) property.setPropertyType(text(body, "propertyType"));
        if (body.containsKey("propertyAdType")) property.setPropertyAdType(text(body, "propertyAdType"));
        if (body.containsKey("propertyAddress")) {
            property.setPropertyAddress(text(body, "propertyAddress"));
            property.setLocation(property.getPropertyAddress());
            property.setTitle(property.getPropertyType() + " - " + property.getPropertyAddress());
        }
        if (body.containsKey("ownerContact")) property.setOwnerContact(text(body, "ownerContact"));
        if (body.containsKey("propertyAmount")) {
            Double amount = number(body.get("propertyAmount"));
            if (amount == null || amount <= 0) return ResponseEntity.badRequest().body(message("Property amount must be greater than 0"));
            property.setPropertyAmount(amount);
            property.setPrice(amount);
        }
        if (body.containsKey("availability")) property.setAvailability(booleanValue(body.get("availability"), true));
        if (body.containsKey("additionalDetails")) {
            property.setAdditionalDetails(text(body, "additionalDetails"));
            property.setDescription(property.getAdditionalDetails());
        }
        return ResponseEntity.ok(Map.of("success", true, "property", propertyMap(properties.save(property))));
    }

    @DeleteMapping("/owner/deleteProperty/{propertyId}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<?> deleteProperty(@PathVariable Long propertyId, Authentication authentication) {
        Property property = properties.findById(propertyId).orElse(null);
        if (property == null) return ResponseEntity.notFound().build();
        if (!isAdmin(authentication) && !isSelf(property.getOwnerId(), authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message("You can delete only your own properties"));
        }
        bookings.deleteAll(bookings.findAll().stream()
                .filter(booking -> booking.getProperty().getId().equals(propertyId)).toList());
        properties.delete(property);
        return ResponseEntity.ok(Map.of("success", true, "message", "Property deleted successfully"));
    }

    @PostMapping("/booking/properties/book/{propertyId}/{userId}")
    @PreAuthorize("hasAnyRole('RENTER', 'USER')")
    public ResponseEntity<?> createBooking(
            @PathVariable Long propertyId,
            @PathVariable Long userId,
            Authentication authentication) {
        if (!isSelf(userId, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message("You can book a property only for your own account"));
        }
        Property property = properties.findById(propertyId).orElse(null);
        User renter = users.findById(userId).orElse(null);
        if (property == null || renter == null) return ResponseEntity.notFound().build();
        if (Boolean.FALSE.equals(property.getAvailability())) {
            return ResponseEntity.badRequest().body(message("This property is not available"));
        }
        if (bookings.existsByPropertyIdAndBookingStatusIn(
                propertyId, List.of("pending", "confirmed", "Pending", "Approved"))) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(message("This property already has an active booking"));
        }
        Booking booking = new Booking();
        booking.setProperty(property);
        booking.setUser(renter);
        booking.setPhoneNumber(renter.getPhoneNumber());
        bookings.save(booking);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("success", true, "message", "Booking request submitted"));
    }

    @GetMapping("/booking/user-bookings/{userId}")
    @PreAuthorize("hasAnyRole('RENTER', 'USER', 'ADMIN')")
    public ResponseEntity<?> userBookings(@PathVariable Long userId, Authentication authentication) {
        if (!isAdmin(authentication) && !isSelf(userId, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message("You can view only your own bookings"));
        }
        return ResponseEntity.ok(Map.of("bookings", bookings.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::bookingMap).toList()));
    }

    @DeleteMapping("/booking/bookings/cancelbooking/{bookingId}")
    @PreAuthorize("hasAnyRole('RENTER', 'USER', 'ADMIN')")
    public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId, Authentication authentication) {
        Booking booking = bookings.findById(bookingId).orElse(null);
        if (booking == null) return ResponseEntity.notFound().build();
        if (!isAdmin(authentication) && !isSelf(booking.getUser().getId(), authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message("You can cancel only your own bookings"));
        }
        if ("cancelled".equalsIgnoreCase(booking.getBookingStatus())
                || "rejected".equalsIgnoreCase(booking.getBookingStatus())) {
            return ResponseEntity.badRequest().body(message("This booking cannot be cancelled"));
        }
        booking.setBookingStatus("cancelled");
        booking.getProperty().setAvailability(true);
        properties.save(booking.getProperty());
        bookings.save(booking);
        return ResponseEntity.ok(Map.of("success", true, "message", "Booking cancelled successfully"));
    }

    @GetMapping("/booking/owner-bookings/{ownerId}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<?> ownerBookings(@PathVariable Long ownerId, Authentication authentication) {
        if (!isAdmin(authentication) && !isSelf(ownerId, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message("You can view only your own bookings"));
        }
        return ResponseEntity.ok(Map.of("bookings", bookings.findByPropertyOwnerIdOrderByCreatedAtDesc(ownerId)
                .stream().map(this::bookingMap).toList()));
    }

    @PutMapping("/owner/bookings/status/{bookingId}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestBody Map<String, Object> body,
            Authentication authentication) {
        Booking booking = bookings.findById(bookingId).orElse(null);
        if (booking == null) return ResponseEntity.notFound().build();
        Property property = booking.getProperty();
        if (!isAdmin(authentication) && !isSelf(property.getOwnerId(), authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message("You can update bookings only for your properties"));
        }
        String status = text(body, "bookingStatus").toLowerCase(Locale.ROOT);
        if (!List.of("pending", "confirmed", "rejected", "cancelled").contains(status)) {
            return ResponseEntity.badRequest().body(message("Unsupported booking status"));
        }
        booking.setBookingStatus(status);
        if ("confirmed".equals(status)) property.setAvailability(false);
        if ("rejected".equals(status) || "cancelled".equals(status) || "pending".equals(status)) {
            property.setAvailability(true);
        }
        properties.save(property);
        return ResponseEntity.ok(Map.of("success", true, "booking", bookingMap(bookings.save(booking))));
    }

    @GetMapping("/admin/getallusers")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> allUsers() {
        return Map.of("users", users.findAll().stream().map(this::userMap).toList());
    }

    @DeleteMapping("/admin/user/deleteUser/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        User user = users.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        if ("ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message("Admin accounts cannot be deleted"));
        }
        bookings.deleteAll(bookings.findAll().stream()
                .filter(booking -> booking.getUser().getId().equals(userId)
                        || Objects.equals(booking.getProperty().getOwnerId(), userId)).toList());
        applications.deleteAll(applications.findByUserId(userId));
        users.delete(user);
        return ResponseEntity.ok(Map.of("success", true, "message", "User deleted successfully"));
    }

    @PutMapping("/admin/user/updatePermissionStatus")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePermission(@RequestBody Map<String, Object> body) {
        Long userId = numberAsLong(body.get("userId"));
        String permissionStatus = text(body, "PermissionStatus");
        if (userId == null || !List.of("Granted", "Ungrant").contains(permissionStatus)) {
            return ResponseEntity.badRequest().body(message("A valid userId and permission status are required"));
        }
        User user = users.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        if (!"OWNER".equals(user.getRole())) {
            return ResponseEntity.badRequest().body(message("Permissions can be changed only for owner accounts"));
        }
        user.setPermissionStatus(permissionStatus);
        return ResponseEntity.ok(Map.of("success", true, "user", userMap(users.save(user))));
    }

    @GetMapping("/admin/properties/getAllProperties")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> adminProperties() {
        return Map.of("properties", properties.findAll().stream().map(this::propertyMap).toList());
    }

    @GetMapping("/admin/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> adminBookings() {
        List<Map<String, Object>> result = bookings.findAllByOrderByCreatedAtDesc().stream().map(booking -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("_id", booking.getId());
            item.put("ownerId", booking.getProperty().getOwnerId());
            item.put("propertyId", booking.getProperty().getId());
            item.put("userId", booking.getUser().getId());
            item.put("tenantName", booking.getUser().getName());
            item.put("phoneNumber", booking.getPhoneNumber());
            item.put("bookingStatus", booking.getBookingStatus());
            return item;
        }).toList();
        return Map.of("bookings", result);
    }

    private Map<String, Object> userMap(User user) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("_id", user.getId());
        result.put("id", user.getId());
        result.put("name", user.getName());
        result.put("email", user.getEmail());
        result.put("phoneNumber", user.getPhoneNumber());
        result.put("type", user.getType());
        result.put("role", user.getRole());
        result.put("PermissionStatus", user.getPermissionStatus());
        return result;
    }

    private Map<String, Object> propertyMap(Property property) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("_id", property.getId());
        result.put("id", property.getId());
        result.put("ownerId", property.getOwnerId());
        result.put("OwnerName", property.getOwnerName());
        result.put("propertyType", property.getPropertyType());
        result.put("propertyAdType", property.getPropertyAdType());
        result.put("propertyAddress", property.getPropertyAddress());
        result.put("ownerContact", property.getOwnerContact());
        result.put("propertyAmount", property.getPropertyAmount());
        result.put("availability", property.getAvailability());
        result.put("propertyImages", property.getPropertyImages());
        result.put("additionalDetails", property.getAdditionalDetails());
        return result;
    }

    private Map<String, Object> bookingMap(Booking booking) {
        Map<String, Object> property = propertyMap(booking.getProperty());
        Map<String, Object> user = userMap(booking.getUser());
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("_id", booking.getId());
        result.put("ownerId", booking.getProperty().getOwnerId());
        result.put("propertyId", property);
        result.put("userId", user);
        result.put("tenantName", booking.getUser().getName());
        result.put("phoneNumber", booking.getPhoneNumber());
        result.put("bookingStatus", booking.getBookingStatus());
        result.put("createdAt", booking.getCreatedAt());
        return result;
    }

    private User authenticatedUser(Authentication authentication) {
        return users.findByEmail(authentication.getName()).orElse(null);
    }

    private boolean isSelf(Long userId, Authentication authentication) {
        return userId != null && users.findByEmail(authentication.getName())
                .map(user -> user.getId().equals(userId)).orElse(false);
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
    }

    private static String text(Map<String, Object> values, String key) {
        Object value = values.get(key);
        return value == null ? "" : value.toString().trim();
    }

    private static Double number(Object value) {
        if (value instanceof Number numeric) return numeric.doubleValue();
        if (value instanceof String text) {
            try { return Double.parseDouble(text); }
            catch (NumberFormatException ignored) { return null; }
        }
        return null;
    }

    private static Long numberAsLong(Object value) {
        if (value instanceof Number numeric) return numeric.longValue();
        if (value instanceof String text) {
            try { return Long.parseLong(text); }
            catch (NumberFormatException ignored) { return null; }
        }
        return null;
    }

    private static boolean booleanValue(Object value, boolean defaultValue) {
        if (value instanceof Boolean bool) return bool;
        if (value instanceof String text) return Boolean.parseBoolean(text);
        return defaultValue;
    }

    private static Map<String, String> message(String message) {
        return Map.of("message", message);
    }
}
