package com.example.backend.service;

import com.example.backend.controller.security.RegisterRequest;
import com.example.backend.controller.user.UserUpdateDto;
import com.example.backend.entity.User;
import com.example.backend.exception.NotFoundException;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.AuthenticatedUser;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.function.Consumer;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticatedUser authenticatedUser;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticatedUser authenticatedUser) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticatedUser = authenticatedUser;
    }

    private static <T> void applyIfNonNull(T value, Consumer<T> setter) {
        if (value != null) {
            setter.accept(value);
        }
    }

    public void registerUser(RegisterRequest request) {
        save(
                User.defaultUser(request.name(), request.email(), passwordEncoder.encode(request.password()))
        );
    }

    private User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("User not found"));
    }

    private User save(User user) {
        return userRepository.save(user);
    }


    public User updateUser(UserUpdateDto userDto) {
        User currentUser = authenticatedUser.get();

        applyIfNonNull(userDto.name(), currentUser::setName);
        applyIfNonNull(userDto.email(), currentUser::setEmail);
        if (userDto.password() != null && !userDto.password().isBlank()) {
            currentUser.setPassword(passwordEncoder.encode(userDto.password()));
        }

        save(currentUser);


        return currentUser;
    }


}
