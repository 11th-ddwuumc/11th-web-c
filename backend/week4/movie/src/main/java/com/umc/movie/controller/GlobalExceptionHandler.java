
package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // DTO 검증 실패: 400
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

    // DB 무결성 제약 위반: 409
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

    // 중복 회원 또는 평점: 409
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

    // 403, 404 등의 HTTP 오류
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatus(
            ResponseStatusException exception
    ) {
        int status = exception.getStatusCode().value();

        return ResponseEntity.status(status)
                .body(
                        ApiResponse.failure(
                                "COMMON" + status,
                                exception.getReason() != null
                                        ? exception.getReason()
                                        : "요청을 처리할 수 없습니다."
                        )
                );
    }
}
