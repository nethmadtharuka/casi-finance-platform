package com.casi.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private static final String AUTH_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader(AUTH_HEADER);

        if (header != null && header.startsWith(BEARER_PREFIX)) {
            String token = header.substring(BEARER_PREFIX.length());

            if (jwtService.isTokenValid(token)) {
                UUID userId = jwtService.extractUserId(token);

                // Principal is the user's UUID directly - CurrentUserProvider reads it
                // back out of the SecurityContext. No roles/authorities at MVP (Part 12).
                var authentication = new UsernamePasswordAuthenticationToken(
                        userId, null, List.of());

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            // Invalid/expired token: leave context unauthenticated: SecurityConfig
            // will reject with 401/403 for any endpoint that requires auth.
        }

        filterChain.doFilter(request, response);
    }
}
