package hotelManager.server.Controller;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import hotelManager.server.Dto.RegisterDto;
import hotelManager.server.Dto.UserDto;
import hotelManager.server.Entity.Register;
import hotelManager.server.Entity.User;
import hotelManager.server.Service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/v1")
public class userController {

    @Autowired
    UserService userService;


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterDto registerDto, HttpServletRequest req) {
        try {
            Register registerUser = userService.registerUser(registerDto, req);
            return ResponseEntity.status(200).body(Collections.singletonMap("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/create/user")
    public ResponseEntity<?> createUser(@ModelAttribute UserDto userDto,
                                        @RequestParam("profilePic") MultipartFile profilePic) {

        try {
            String profilePicUrl = userService.uploadProfilePic(profilePic);
            userService.createUser(userDto, profilePicUrl);
            return ResponseEntity.status(200).body(Collections.singletonMap("success", "true"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody JsonNode requestBody, HttpServletRequest req, HttpServletResponse res) {
        String email = requestBody.get("email").asText();
        String password = requestBody.get("password").asText();
        try {
            User user = userService.loginUser(email, password, req, res);
            return ResponseEntity.status(200).body(user);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/load/user")
    public ResponseEntity<?> loadUser(HttpServletResponse res, HttpServletRequest req) {

        try {
            User user = userService.loadUser(res, req);
            return ResponseEntity.status(200).body(user);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest req, HttpServletResponse res) {
        Cookie cookie = new Cookie("jwtToken", "");
        cookie.setMaxAge(0); // Convert milliseconds to seconds
        cookie.setSecure(true); // Enable for HTTPS
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        res.addCookie(cookie);
        return ResponseEntity.status(200).body("Logout Done");
    }

    @PutMapping("/update/user")
    public ResponseEntity<?> updateUser(HttpServletResponse res, HttpServletRequest req, @RequestBody JsonNode requestBody) {
        try {
            Long id = requestBody.get("id").asLong();
            String password = requestBody.get("password").asText();
            userService.updateUser(id, password, req);
            return ResponseEntity.status(200).body("Password changed");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Password unable to change");
        }
    }


    @GetMapping("/employee/{employeeNo}")
    public ResponseEntity<?> getEmployee(HttpServletResponse res, HttpServletRequest req, @PathVariable Long employeeNo) {
        try {
            User user = userService.getEmployee(res, req, employeeNo);
            return ResponseEntity.status(200).body(user);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }

    }

    @GetMapping("/employee/suggestions/{employeeNo}")
    public ResponseEntity<?> getEmployeeSuggestions(HttpServletResponse res, HttpServletRequest req, @PathVariable Long employeeNo) {
        try {
            List<User> user = userService.getEmployeeSuggestions(res, req, employeeNo);
            return ResponseEntity.status(200).body(user);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/user/forgot/password")
    public ResponseEntity<?> forgotPassword(@RequestBody JsonNode requestbody, HttpServletRequest req) {
        String email = requestbody.get("email").asText();

        try {
            userService.forgotPassword(email, req);
            return ResponseEntity.status(200).body("success");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PutMapping("/user/reset/password/{email}/{token}")
    public ResponseEntity<?> resetPassword(@PathVariable("email") String email, @PathVariable("token") String token, @RequestBody JsonNode requestBody) {
        String password = requestBody.get("password").asText();
        try {
            userService.resetPassword(email, token, password);
            return ResponseEntity.status(200).body("success");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/user/google/{token}")
    public ResponseEntity<?> checkGoogleLogin(@PathVariable("token") String token, HttpServletResponse res) {
        try {
            userService.checkGoogleLogin(token, res);
            return ResponseEntity.status(200).body("success");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
