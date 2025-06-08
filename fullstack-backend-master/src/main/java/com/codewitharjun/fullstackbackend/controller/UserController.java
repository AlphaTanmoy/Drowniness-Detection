package com.codewitharjun.fullstackbackend.controller;

import com.codewitharjun.fullstackbackend.exception.UnAuthorizeAccessException;
import com.codewitharjun.fullstackbackend.exception.UserNotFoundException;
import com.codewitharjun.fullstackbackend.model.User;
import com.codewitharjun.fullstackbackend.service.UserService;
import com.codewitharjun.fullstackbackend.utils.VerifyAdminAccess;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final VerifyAdminAccess verifyAdminAccess;

    public UserController(UserService userService, VerifyAdminAccess verifyAdminAccess) {
        this.userService = userService;
        this.verifyAdminAccess = verifyAdminAccess;
    }

    @PostMapping("/user")
    User newUser(
            @RequestParam String adminId,
            @RequestBody User newUser
    ) {
        if (adminId.isEmpty()) throw new UnAuthorizeAccessException("Provide Id to validate");
        if (verifyAdminAccess.verifyAdmin(adminId)) throw new UnAuthorizeAccessException("You don't have access!");
        return userService.save(newUser);
    }

    @GetMapping("/users")
    List<User> getAllUsers(
            @RequestParam String adminId
    ) {
        if (adminId.isEmpty()) throw new UnAuthorizeAccessException("Provide Id to validate");
        if (verifyAdminAccess.verifyAdmin(adminId)) throw new UnAuthorizeAccessException("You don't have access!");
        return userService.findAll();
    }

    @GetMapping("/user/{id}")
    User getUserById(
            @RequestParam String adminId,
            @PathVariable String id) {
        if (adminId.isEmpty()) throw new UnAuthorizeAccessException("Provide Id to validate");
        if (verifyAdminAccess.verifyAdmin(adminId)) throw new UnAuthorizeAccessException("You don't have access!");
        return userService.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @PutMapping("/user/{id}")
    User updateUser(
            @RequestParam String adminId,
            @RequestBody User newUser,
            @PathVariable String id) {
        if (adminId.isEmpty()) throw new UnAuthorizeAccessException("Provide Id to validate");
        if (verifyAdminAccess.verifyAdmin(adminId)) throw new UnAuthorizeAccessException("You don't have access!");
        return userService.findById(id)
                .map(user -> {
                    user.setFullName(newUser.getFullName());
                    user.setEmail(newUser.getEmail());
                    return userService.save(user);
                }).orElseThrow(() -> new UserNotFoundException(id));
    }

    @DeleteMapping("/user/{id}")
    String deleteUser(
            @RequestParam String adminId,
            @PathVariable String id
    ) {
        if (adminId.isEmpty()) throw new UnAuthorizeAccessException("Provide Id to validate");
        if (verifyAdminAccess.verifyAdmin(adminId)) throw new UnAuthorizeAccessException("You don't have access!");
        if (!userService.existsById(id)) {
            throw new UserNotFoundException(id);
        }
        userService.deleteById(id);
        return "User with id " + id + " has been deleted success.";
    }


    @GetMapping("/verify")
    Boolean verifyPurchase(
            @RequestParam String adminId,
            @RequestParam("productKey") String productKey,
            @RequestParam("mac") String mac
    ) {
        if (adminId.isEmpty()) throw new UnAuthorizeAccessException("Provide Id to validate");
        if (verifyAdminAccess.verifyAdmin(adminId)) throw new UnAuthorizeAccessException("You don't have access!");
        if (productKey == null) throw new RuntimeException("Provide product key");
        if (mac == null) throw new RuntimeException("Provide MAC Address");

        return userService.verifyPurchase(productKey, mac);
    }

}
