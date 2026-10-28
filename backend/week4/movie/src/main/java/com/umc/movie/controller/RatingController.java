package com.umc.movie.controller;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.service.RatingService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class RatingController {
    private final RatingService ratingService;
    @GetMapping("/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(
            @PathVariable("memberId") @Positive Long memberId,
            @RequestParam(name = "page", required = false) @Min(0) Integer page,
            @RequestParam(name = "size", required = false) @Min(1) @Max(100) Integer size) {
        return ratingService.getRatingsByMember(memberId, page, size);
    }
}
