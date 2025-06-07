package com.codewitharjun.fullstackbackend.controller;

import com.codewitharjun.fullstackbackend.exception.UserNotFoundException;
import com.codewitharjun.fullstackbackend.model.User;
import com.codewitharjun.fullstackbackend.repository.UserRepository;
import com.codewitharjun.fullstackbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/* Created by Arjun Gautam */
@RestController
@CrossOrigin("http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/user")
    User newUser(@RequestBody User newUser) {
        return userService.save(newUser);
    }

    @GetMapping("/users")
    List<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/user/{id}")
    User getUserById(@PathVariable String id) {
        return userService.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @PutMapping("/user/{id}")
    User updateUser(@RequestBody User newUser, @PathVariable String id) {
        return userService.findById(id)
                .map(user -> {
                    user.setFullName(newUser.getFullName());
                    user.setEmail(newUser.getEmail());
                    return userService.save(user);
                }).orElseThrow(() -> new UserNotFoundException(id));
    }

    @DeleteMapping("/user/{id}")
    String deleteUser(@PathVariable String id){
        if(!userService.existsById(id)){
            throw new UserNotFoundException(id);
        }
        userService.deleteById(id);
        return  "User with id "+id+" has been deleted success.";
    }


    @GetMapping("/verify")
    Boolean verifyPurchase(
            @RequestParam("productKey") String productKey,
            @RequestParam("mac") String mac
    ){

        if(productKey==null) throw new RuntimeException("Provide product key");
        if(mac==null) throw new RuntimeException("Provide MAC Address");

        return userService.verifyPurchase(productKey,mac);
    }

}
