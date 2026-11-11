package com.umc.movie.controller;

import com.umc.movie.annotation.LoginMember;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.MemberInfoResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.MemberUpdateRequest;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.service.MemberService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    // 7주차: 내 정보 조회
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
            @LoginMember Long memberId
    ) {
        MemberInfoResponse response =
                memberService.getMyInfo(memberId);

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "회원 정보를 조회했습니다.",
                        response
                )
        );
    }

    // 7주차: 내 정보 수정
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            @LoginMember Long memberId,
            @RequestBody @Valid MemberUpdateRequest request
    ) {
        MemberInfoResponse response =
                memberService.updateMyInfo(
                        memberId,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "회원 정보를 수정했습니다.",
                        response
                )
        );
    }

    // 5주차: 닉네임 중복 확인
    @GetMapping("/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(
            @PathVariable String nickname
    ) {
        return memberService.checkNickname(nickname);
    }

    // 5주차: 이메일 중복 확인
    @GetMapping("/email/{email}")
    public EmailCheckResponse checkEmail(
            @PathVariable String email
    ) {
        return memberService.checkEmail(email);
    }

    // 6주차: 회원가입
    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @RequestBody @Valid SignUpRequest request
    ) {
        MemberResponse response =
                memberService.signUp(request);

        return ResponseEntity
                .status(201)
                .body(
                        ApiResponse.created(
                                "회원가입에 성공했습니다.",
                                response
                        )
                );
    }
}