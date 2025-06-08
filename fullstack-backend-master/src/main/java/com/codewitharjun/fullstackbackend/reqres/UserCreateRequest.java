package com.codewitharjun.fullstackbackend.reqres;

import lombok.Data;

@Data
public class UserCreateRequest {
    private String adminId;
    private String fullName;
    private String email;
}
