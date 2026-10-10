package com.rentalhub.repository;

import com.rentalhub.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Booking> findByPropertyOwnerIdOrderByCreatedAtDesc(Long ownerId);
    List<Booking> findAllByOrderByCreatedAtDesc();
    boolean existsByPropertyIdAndBookingStatusIn(Long propertyId, List<String> statuses);
}
