package com.example.backend.service.user;

import com.example.backend.controller.security.RegisterRequest;
import com.example.backend.controller.user.UserUpdateDto;
import com.example.backend.entity.User;
import com.example.backend.exception.NotFoundException;
import com.example.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.function.Consumer;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private static <T> void applyIfNonNull(T value, Consumer<T> setter) {
        if (value != null) {
            setter.accept(value);
        }
    }

    public void registerUser(RegisterRequest request) {
        userRepository.save(
                User.defaultUser(request.name(), request.email(), passwordEncoder.encode(request.password()))
        );
    }

    public User findUser(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));
    }

    @Transactional
    public User updateUser(UserUpdateDto userDto, Long id) {
        User currentUser = findUser(id);

        applyIfNonNull(userDto.name(), currentUser::setName);
        applyIfNonNull(userDto.email(), currentUser::setEmail);
        if (userDto.password() != null && !userDto.password().isBlank()) {
            currentUser.setPassword(passwordEncoder.encode(userDto.password()));
        }

        return userRepository.save(currentUser);
    }


}
