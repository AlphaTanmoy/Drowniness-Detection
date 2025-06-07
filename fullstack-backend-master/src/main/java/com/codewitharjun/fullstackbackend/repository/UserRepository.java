package com.codewitharjun.fullstackbackend.repository;

import com.codewitharjun.fullstackbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,String> {

    @Query(
            value = "Select * FROM users " +
                    "WHERE product_key = :productKey " +
                    "AND is_verified = true "
            , nativeQuery = true
    )
    Optional<User> findByProductKey(
        @Param("productKey") String productKey
    );

}
