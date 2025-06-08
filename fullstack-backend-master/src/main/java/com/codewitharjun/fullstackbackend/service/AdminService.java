package com.codewitharjun.fullstackbackend.service;

import com.codewitharjun.fullstackbackend.exception.UnAuthorizeAccessException;
import com.codewitharjun.fullstackbackend.model.Admin;
import com.codewitharjun.fullstackbackend.repository.AdminRepository;
import com.codewitharjun.fullstackbackend.utils.EmailService;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Objects;
import java.util.Optional;

import static com.codewitharjun.fullstackbackend.constants.KeywordsAndConstants.ADMIN_EMAIL;
import static com.codewitharjun.fullstackbackend.constants.KeywordsAndConstants.ADMIN_NAME;

@Component
public class AdminService {

    private final AdminRepository adminRepository;
    private final EmailService emailService;

    public AdminService(AdminRepository adminRepository,EmailService emailService) {
        this.adminRepository = adminRepository;
        this.emailService = emailService;
    }

    public void sendOtp(){
        int otp = (int)(Math.random() * 900000) + 100000;
        emailService.sendOtpEmail(ADMIN_EMAIL, ADMIN_NAME, String.valueOf(otp));
        Optional<Admin> findAdmin = adminRepository.findByEmailId(ADMIN_EMAIL);
        findAdmin.get().setOtp(String.valueOf(otp));
        adminRepository.save(findAdmin.get());
    }

    public String login(String email, String otp){
        Optional<Admin> findAdmin = adminRepository.findByEmailId(email);
        if(findAdmin.isEmpty()) throw new UnAuthorizeAccessException("Not a valid Admin");
        else {
            Admin admin = findAdmin.get();

            if(Objects.equals(admin.getOtp(), otp)){
                return Base64.getEncoder().encodeToString(admin.getId().getBytes(StandardCharsets.UTF_8));
            }

            else throw new UnAuthorizeAccessException("Invalid Otp");
        }
    }
}
