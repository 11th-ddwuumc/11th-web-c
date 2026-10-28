package com.umc.study.controller;

import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public Map<String, String> createRental(
            @RequestBody Map<String, Object> body
    ) {
        rentalService.createRental(body);

        return Map.of(
                "message",
                "도서 대여가 완료되었습니다."
        );
    }

    @PatchMapping("/{rentalId}/return")
    public Map<String, String> returnRental(
            @PathVariable Long rentalId
    ) {
        rentalService.returnRental(rentalId);

        return Map.of(
                "message",
                "도서 반납이 완료되었습니다."
        );
    }
}