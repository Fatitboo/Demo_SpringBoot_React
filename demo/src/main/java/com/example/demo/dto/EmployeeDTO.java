package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EmployeeDTO {

    private String avatar;
    @NotBlank(message = "Name is required not blank")
    @NotNull(message = "Name is required not null")
    private String name;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime dob;
    private String phone;
    @Email(message = "Email is not correct the format")
    private String email;
    @NotBlank(message = "Role is required not blank")
    @NotNull(message = "Role is required not null")
    private String role;
    private int baseSalary;
    private int numOfOvtHours;
    private int numOfErrors;
    private MultipartFile file;

}
