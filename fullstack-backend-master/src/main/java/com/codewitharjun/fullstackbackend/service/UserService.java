package com.codewitharjun.fullstackbackend.service;

import com.codewitharjun.fullstackbackend.model.Admin;
import com.codewitharjun.fullstackbackend.model.User;
import com.codewitharjun.fullstackbackend.repository.AdminRepository;
import com.codewitharjun.fullstackbackend.repository.UserRepository;
import com.codewitharjun.fullstackbackend.utils.EmailService;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Component
public class UserService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, AdminRepository adminRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.emailService = emailService;
    }

    public User createUser(String fullName, String email){
        User newUser = new User();
        newUser.setFullName(fullName);
        newUser.setEmail(email);
        userRepository.save(newUser);
        emailService.customerCreated(
                newUser.getEmail(),
                newUser.getFullName(),
                newUser.getProductKey()
        );
        return newUser;
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Boolean existsById(String id) {
        return userRepository.existsById(id);
    }

    public void deleteById(String id) {
        userRepository.deleteById(id);
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public Boolean verifyPurchase(String productKey, String mac) {

        Optional<User> findAssignedUserWithProductKey = userRepository.findByProductKey(productKey);

        if (findAssignedUserWithProductKey.isEmpty()) {
            return false;
        }

        if (findAssignedUserWithProductKey.get().getIsMacAssigned()) {
            return Objects.equals(findAssignedUserWithProductKey.get().getMacAddress(), mac);
        }
        ZonedDateTime time = ZonedDateTime.now();
        findAssignedUserWithProductKey.get().setMacAddress(mac);
        findAssignedUserWithProductKey.get().setIsMacAssigned(true);
        findAssignedUserWithProductKey.get().setExpiredOn(time);
        User savedUser = userRepository.save(findAssignedUserWithProductKey.get());
        emailService.customerMacAssigned(
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getProductKey(),
                mac,
                time.toString().split("T")[0]
        );
        return true;
    }

    public String verifyUser(String adminId, String userId, Boolean action) {
        Optional<Admin> findAdmin = adminRepository.findById(adminId);

        if (findAdmin.isEmpty()) throw new RuntimeException("No Valid Admin!");

        Optional<User> findValidUser = userRepository.findById(userId);
        if (findValidUser.isEmpty()) throw new RuntimeException("Not a valid User");

        if (findValidUser.get().getIsVerified() == action) {
            return "User verified staus is already " + action;
        } else {
            findValidUser.get().setIsVerified(action);
            return "User verified staus changed to " + action;
        }
    }
}

