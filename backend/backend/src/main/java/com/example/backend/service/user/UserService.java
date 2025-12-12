package com.example.backend.service.user;

import com.example.backend.controller.security.RegisterRequest;
import com.example.backend.controller.user.UserUpdateDto;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerUser(RegisterRequest request) {
        userRepository.save(
                User.defaultUser(request.name(), request.email(), passwordEncoder.encode(request.password()))
        );
    }

    public User findUser(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(UserUpdateDto userDto, Long id) {
        User currentUser = findUser(id);

        if (userDto.name() != null) {
            currentUser.setName(userDto.name());
        }

        if (userDto.name() != null) {
            currentUser.setEmail(userDto.name());
        }

        if (userDto.name() != null) {
            currentUser.setPassword(passwordEncoder.encode(userDto.name()));
        }

        return userRepository.save(currentUser);
    }


}
