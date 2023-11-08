package com.example.demo.service;

import com.example.demo.dto.EmployeeDTO;
import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    public List<Employee> getAllEmployees(){
        return employeeRepository.findAll();
    }
    public Employee createEmployee(EmployeeDTO employeeDTO, MultipartFile file) throws Exception {
        if(file.getSize()>10*1024*1024){
            throw new Exception("File is too large! Maximum size is 10Mb") ;
        }
        String contentType = file.getContentType();
        if(contentType == null || !contentType.startsWith("image/")) {
            throw new Exception("File must be an image") ;

        }
        // Lưu file và cập nhật thumbnail trong DTO
        String filename = storeFile(file);
        Employee employee = Employee.builder()
                .avatar(filename)
                .name(employeeDTO.getName())
                .phone(employeeDTO.getPhone())
                .email(employeeDTO.getEmail())
                .dob(employeeDTO.getDob())
                .role(employeeDTO.getRole())
                .baseSalary(employeeDTO.getBaseSalary())
                .build();
        if(employee.getRole().equals("coder")){
            employee.setNumOfOvtHours(employeeDTO.getNumOfOvtHours());
        }else {
            employee.setNumOfErrors(employeeDTO.getNumOfErrors());
        }
        return employeeRepository.save(employee);

    }
    public Employee updateEmployee(EmployeeDTO employeeDTO, MultipartFile file, String id) throws Exception {
        Optional<Employee> optEmployee = employeeRepository.findById(new ObjectId(id));
        if(optEmployee.isEmpty()){
            throw new Exception("Employee not exist") ;
        }

        Employee employee = optEmployee.get();
        if(file != null ){
            if(file.getSize()>10*1024*1024){
                throw new Exception("File is too large! Maximum size is 10Mb") ;
            }
            String contentType = file.getContentType();
            if(contentType == null || !contentType.startsWith("image/")) {
                throw new Exception("File must be an image") ;

            }
            // Lưu file và cập nhật thumbnail trong DTO
            String filename = storeFile(file);
            employee.setAvatar(filename);
        }
        employee.setAvatar(employeeDTO.getAvatar());
        employee.setName(employeeDTO.getName());
        employee.setPhone(employeeDTO.getPhone());
        employee.setEmail(employeeDTO.getEmail());
        employee.setDob(employeeDTO.getDob());
        employee.setRole(employeeDTO.getRole());
        employee.setBaseSalary(employeeDTO.getBaseSalary());
        if(employeeDTO.getRole().equals("coder")){
            employee.setNumOfOvtHours(employeeDTO.getNumOfOvtHours());
        }else {
            employee.setNumOfErrors(employeeDTO.getNumOfErrors());
        }
        return employeeRepository.save(employee);
    }
    public void deleteEmployee(String id){
        employeeRepository.deleteById(new ObjectId(id));
    }
    private String storeFile(MultipartFile file) throws IOException {

        String filename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        // Thêm UUID vào trước tên file để đảm bảo tên file là duy nhất
        String uniqueFilename = UUID.randomUUID().toString() + "_" + filename;
        // Đường dẫn đến thư mục mà bạn muốn lưu file
        java.nio.file.Path uploadDir = Paths.get("uploads");
        // Kiểm tra và tạo thư mục nếu nó không tồn tại
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }
        // Đường dẫn đầy đủ đến file
        java.nio.file.Path destination = Paths.get(uploadDir.toString(), uniqueFilename);
        // Sao chép file vào thư mục đích
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        return uniqueFilename;
    }
}
