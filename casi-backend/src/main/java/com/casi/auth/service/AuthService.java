package com.casi.auth.service;

import com.casi.auth.dto.AuthResponse;
import com.casi.auth.dto.LoginRequest;
import com.casi.auth.dto.RegisterRequest;
import com.casi.auth.dto.RegisterResponse;
import com.casi.auth.entity.User;
import com.casi.auth.mapper.UserMapper;
import com.casi.auth.repository.UserRepository;
import com.casi.common.exception.EmailAlreadyExistsException;
import com.casi.common.exception.InvalidCredentialsException;
import com.casi.common.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(
                    "An account with email " + request.email() + " already exists");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .build();

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getId(), saved.getEmail());

        return userMapper.toRegisterResponse(saved, token);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            // Deliberately the same exception/message as "no such user" above -
            // never reveal whether the email exists via a different error message.
            throw new InvalidCredentialsException();
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail());
        AuthResponse.UserSummary summary = userMapper.toUserSummary(user);

        return new AuthResponse(token, summary);
    }
}
