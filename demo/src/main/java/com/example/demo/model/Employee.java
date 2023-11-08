package com.example.demo.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Document(collection = "employees")
public class Employee {
    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId employeeId;
    private String avatar;
    private String name;
    private LocalDateTime dob;
    private String phone;
    private String email;
    private String role;
    private int numOfOvtHours;
    private int numOfErrors;
    private int baseSalary;
}
