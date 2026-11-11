package com.umc.movie.controller;

import com.umc.movie.annotation.LoginMember;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.service.RatingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // 5주차: 특정 회원이 작성한 평점 목록 조회
    // 공개 API이므로 로그인 토큰 없이 접근 가능
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(
            @PathVariable Long memberId
    ) {
        return ratingService.getRatingsByMember(memberId);
    }

    // 7주차: 로그인한 회원의 평점 등록
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @LoginMember Long memberId,
            @RequestBody @Valid CreateRatingRequest request
    ) {
        RatingResponse response =
                ratingService.create(
                        memberId,
                        request
                );

        return ResponseEntity
                .status(201)
                .body(
                        ApiResponse.created(
                                "평점을 등록했습니다.",
                                response
                        )
                );
    }

    // 7주차: 로그인한 회원의 평점 수정
    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @LoginMember Long memberId,
            @PathVariable Long ratingId,
            @RequestBody @Valid UpdateRatingRequest request
    ) {
        RatingResponse response =
                ratingService.update(
                        memberId,
                        ratingId,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "평점을 수정했습니다.",
                        response
                )
        );
    }

    // 7주차: 로그인한 회원의 평점 삭제
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @LoginMember Long memberId,
            @PathVariable Long ratingId
    ) {
        ratingService.delete(
                memberId,
                ratingId
        );

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "평점을 삭제했습니다.",
                        null
                )
        );
    }
}