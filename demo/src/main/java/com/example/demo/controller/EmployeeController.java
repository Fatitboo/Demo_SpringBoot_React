package com.example.demo.controller;

import com.example.demo.dto.EmployeeDTO;
import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RequiredArgsConstructor
@RestController
@RequestMapping( "/api/employees")
public class EmployeeController {
    private final EmployeeRepository employeeRepository;
    private final EmployeeService employeeService;
    @GetMapping("")
    public ResponseEntity<?> getAllEmployees(){
        HashMap<String, Object> response = new HashMap<>();
        try {
            List<Employee> employees = employeeService.getAllEmployees();
            response.put("message","Get all employees successfully");
            response.put("employees", employees);
            return ResponseEntity.ok(response);
        } catch (Exception e){
            response.put("message",e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    @PostMapping("/create")
    public ResponseEntity<?> createEmployee(
            @RequestParam("file") MultipartFile file, @RequestParam("name") String name,@RequestParam("dob") String dob,
            @RequestParam("phone") String phone, @RequestParam("email") String email, @RequestParam("role") String role,
            @RequestParam("baseSalary") String baseSalary, @RequestParam("numOfOvtHours") String numOfOvtHours,
            @RequestParam("numOfErrors") String numOfErrors
          ){
        HashMap<String, Object> response = new HashMap<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
        // Parse the string to LocalDateTime
        LocalDateTime Dob = LocalDateTime.parse(dob, formatter);

        EmployeeDTO employeeDTO = EmployeeDTO.builder()
                .name(name)
                .dob(Dob )
                .phone(phone)
                .email(email)
                .role(role)
                .baseSalary(Integer.parseInt(baseSalary))
                .numOfErrors(Integer.parseInt(numOfErrors))
                .numOfOvtHours(Integer.parseInt(numOfOvtHours))
                .build();

        try {
            Employee savedEmployee = employeeService.createEmployee(employeeDTO, file);
            response.put("message","Create new employee successfully");
            response.put("employees", savedEmployee);
            return ResponseEntity.ok(response);
        } catch (Exception e){
            response.put("message",e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<?> updateEmployee(
            @PathVariable String id,@RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("avatar") String avatar, @RequestParam("name") String name, @RequestParam("dob") String dob,
            @RequestParam("phone") String phone, @RequestParam("email") String email, @RequestParam("role") String role,
            @RequestParam("baseSalary") String baseSalary, @RequestParam("numOfOvtHours") String numOfOvtHours,
            @RequestParam("numOfErrors") String numOfErrors
    ){
        HashMap<String, Object> response = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

        // Parse the string to LocalDateTime
        LocalDateTime Dob = LocalDateTime.parse(dob, formatter);

        EmployeeDTO employeeDTO = EmployeeDTO.builder()
                .avatar(avatar)
                .name(name)
                .dob(Dob)
                .phone(phone)
                .email(email)
                .role(role)
                .baseSalary(Integer.parseInt(baseSalary))
                .numOfErrors(Integer.parseInt(numOfErrors))
                .numOfOvtHours(Integer.parseInt(numOfOvtHours))
                .build();

        try {
            Employee savedEmployee = employeeService.updateEmployee(employeeDTO, file, id);
            response.put("message","Update new employee successfully");
            response.put("employees", savedEmployee);
            return ResponseEntity.ok(response);
        } catch (Exception e){
            response.put("message",e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String id){
        HashMap<String, Object> response = new HashMap<>();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
        try {
            employeeService.deleteEmployee(id);
            response.put("message","Delete employee with id: "+id+" successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e){
            response.put("message",e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    @GetMapping("/images/{imageName}")
    public ResponseEntity<?> viewImage(@PathVariable String imageName) {
        try {
            java.nio.file.Path imagePath = Paths.get("uploads/"+imageName);
            UrlResource resource = new UrlResource(imagePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(new UrlResource(Paths.get("uploads/notfound.jpg").toUri()));
                //return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
