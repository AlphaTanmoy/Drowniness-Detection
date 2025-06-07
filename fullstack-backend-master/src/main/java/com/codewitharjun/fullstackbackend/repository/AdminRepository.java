package com.codewitharjun.fullstackbackend.repository;

import com.codewitharjun.fullstackbackend.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin,String> {
}
