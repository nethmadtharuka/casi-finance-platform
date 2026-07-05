package com.casi.auth.mapper;

import com.casi.auth.dto.AuthResponse;
import com.casi.auth.dto.RegisterResponse;
import com.casi.auth.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // MapStruct maps `user.id`, `user.name`, `user.email` by matching record
    // component names automatically; `token` is taken directly from the second argument.
    RegisterResponse toRegisterResponse(User user, String token);

    AuthResponse.UserSummary toUserSummary(User user);
}
