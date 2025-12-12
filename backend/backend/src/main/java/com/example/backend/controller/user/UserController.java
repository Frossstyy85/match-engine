package com.example.backend.controller.user;

import com.example.backend.api.ApiResponse;
import com.example.backend.api.ResponseFactory;
import com.example.backend.entity.User;
import com.example.backend.security.CustomUserDetail;
import com.example.backend.service.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(path = "/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @PatchMapping("/update")
    public ResponseEntity<ApiResponse<User>> updateUser(@AuthenticationPrincipal CustomUserDetail userDetail,
                                                        @RequestBody UserUpdateDto userUpdateDto,
                                                        HttpServletRequest request) {
        User updated = userService.updateUser(userUpdateDto, userDetail.id());
        return ResponseFactory.ok(updated, request);
    }


}
