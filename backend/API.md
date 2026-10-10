# Rental Hub API

The Spring Boot API listens on port `8081` by default. Local Vite development uses `http://localhost:8081`; requests that require authentication use `Authorization: Bearer <token>`.

## Authentication

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/users/register` | Public |
| POST | `/api/users/login` | Public |

Registration accepts `name`, `email`, `password`, `phoneNumber`, and `type` (`Owner` or `Renter`). Login returns `token` and `resUser`; owner registrations require administrator permission before listing properties.

## Properties and owners

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/properties/properties/all` | Public |
| GET | `/api/owner/ownerDetails/{userId}` | Account owner or administrator |
| GET | `/api/owner/myProperties/{userId}` | Owner or administrator |
| POST | `/api/owner/newProperty` | Permission-granted owner |
| PUT | `/api/owner/updateProperty/{propertyId}` | Property owner or administrator |
| DELETE | `/api/owner/deleteProperty/{propertyId}` | Property owner or administrator |

Property data persists `ownerId`, `OwnerName`, `propertyType`, `propertyAdType`, `propertyAddress`, `ownerContact`, `propertyAmount`, `availability`, and `additionalDetails`. Property images are not uploaded or required.

## Bookings

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/booking/properties/book/{propertyId}/{userId}` | Authenticated renter |
| GET | `/api/booking/user-bookings/{userId}` | Account owner or administrator |
| DELETE | `/api/booking/bookings/cancelbooking/{bookingId}` | Booking owner or administrator |
| GET | `/api/booking/owner-bookings/{ownerId}` | Owner or administrator |
| PUT | `/api/owner/bookings/status/{bookingId}` | Property owner or administrator |

Bookings persist property and renter references, booking status (`pending`, `confirmed`, `rejected`, or `cancelled`), renter phone number, and creation time.

## Administration

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/admin/getallusers` | Administrator |
| DELETE | `/api/admin/user/deleteUser/{userId}` | Administrator |
| PUT | `/api/admin/user/updatePermissionStatus` | Administrator |
| GET | `/api/admin/properties/getAllProperties` | Administrator |
| GET | `/api/admin/bookings` | Administrator |

## Database

Spring Data JPA creates and updates the `users`, `properties`, and `bookings` tables from the entity fields on startup (`spring.jpa.hibernate.ddl-auto=update`). It also retains the legacy application tables and routes. Schema updates are non-destructive; they do not drop existing records. Configure the MySQL URL, username, and password with `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` before starting the backend.
