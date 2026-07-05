package com.casi.common.exception;

import java.time.Instant;
import java.util.Map;

public record ValidationErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        Map<String, String> fieldErrors
) {
    public static ValidationErrorResponse of(String path, Map<String, String> fieldErrors) {
        return new ValidationErrorResponse(
                Instant.now(),
                400,
                "Bad Request",
                "Validation failed",
                path,
                fieldErrors
        );
    }
}
