package com.casi.common.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Every service method that needs "whose data is this" calls this rather than
 * trusting anything from the request body - the core defense against IDOR.
 */
@Component
public class CurrentUserProvider {

    public UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof UUID userId)) {
            throw new IllegalStateException("No authenticated user found in security context");
        }

        return userId;
    }
}
