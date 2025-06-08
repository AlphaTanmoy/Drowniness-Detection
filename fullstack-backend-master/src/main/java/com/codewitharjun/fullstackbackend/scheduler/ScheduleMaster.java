package com.codewitharjun.fullstackbackend.scheduler;

import com.codewitharjun.fullstackbackend.model.Admin;
import com.codewitharjun.fullstackbackend.model.User;
import com.codewitharjun.fullstackbackend.repository.AdminRepository;
import com.codewitharjun.fullstackbackend.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import static com.codewitharjun.fullstackbackend.constants.KeywordsAndConstants.ADMIN_EMAIL;
import static com.codewitharjun.fullstackbackend.constants.KeywordsAndConstants.OTP_EXPIRED_TIME;

@Component
public class ScheduleMaster {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    public ScheduleMaster(AdminRepository adminRepository, UserRepository userRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
    }

    @Scheduled(cron = "0 * * * * ?")
    public void runsEveryOneMinute(){
        Optional<Admin> findAdmin = adminRepository.findByEmailId(ADMIN_EMAIL);
        Admin admin = findAdmin.get();
        ZonedDateTime expiryTime = admin.getOtpSendTimeStamp().plusMinutes(OTP_EXPIRED_TIME);
        if (!expiryTime.isAfter(ZonedDateTime.now())) {
            admin.setOtp(null);
            adminRepository.save(admin);
            System.out.println("OTP removed from admin!");
        }
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void runsEveryMidNight() {
        int count = 0;
        List<User> expiredUsers = userRepository.findAllExpired();
        for (User user : expiredUsers) {
            user.setIsExpired(true);
            count++;
        }
        userRepository.saveAll(expiredUsers);
        System.out.println("Total "+count+" users set to expired");
    }

}
