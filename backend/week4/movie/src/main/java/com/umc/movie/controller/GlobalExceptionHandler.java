package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.exception.ApiException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 7주차: 직접 정의한 API 예외
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Void>> handleApiException(
            ApiException exception
    ) {
        return ResponseEntity.status(exception.getStatus())
                .body(
                        ApiResponse.failure(
                                exception.getCode(),
                                exception.getMessage()
                        )
                );
    }

    // Bean Validation 실패
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(
            MethodArgumentNotValidException exception
    ) {
        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("입력값을 확인해주세요.");

        return ResponseEntity.badRequest()
                .body(
                        ApiResponse.failure(
                                "COMMON4001",
                                message
                        )
                );
    }

    // DB 제약 조건 위반
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(
            DataIntegrityViolationException exception
    ) {
        return ResponseEntity.status(409)
                .body(
                        ApiResponse.failure(
                                "COMMON4091",
                                "이미 존재하거나 데이터 제약 조건을 위반했습니다."
                        )
                );
    }

    // 기존 일반 중복 처리
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(
            IllegalArgumentException exception
    ) {
        return ResponseEntity.status(409)
                .body(
                        ApiResponse.failure(
                                "COMMON4092",
                                exception.getMessage()
                        )
                );
    }

    // 기존 HTTP 상태 예외
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatus(
            ResponseStatusException exception
    ) {
        int status = exception.getStatusCode().value();

        return ResponseEntity.status(status)
                .body(
                        ApiResponse.failure(
                                "COMMON" + status,
                                exception.getReason()
                        )
                );
    }
}