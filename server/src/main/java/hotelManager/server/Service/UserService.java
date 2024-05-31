package hotelManager.server.Service;


import com.fasterxml.jackson.annotation.JsonRootName;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import hotelManager.server.Config.Utility.JwtTokenUtility;
import hotelManager.server.Dto.RegisterDto;
import hotelManager.server.Dto.UserDto;
import hotelManager.server.Entity.Register;
import hotelManager.server.Entity.ResetPassword;
import hotelManager.server.Entity.User;
import hotelManager.server.Repository.RegisterRepo;
import hotelManager.server.Repository.ResetPasswordRepo;
import hotelManager.server.Repository.UserRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.http.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class UserService {

    @Autowired
    private final UserRepo userRepo;

    @Autowired
    private final RegisterRepo registerRepo;

    @Autowired
    private final ResetPasswordRepo resetPasswordRepo;

    @Autowired
    JavaMailSender javaMailSender;

    @Autowired
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private final TaskExecutor taskExecutor;

    @Autowired
    private final JwtTokenUtility jwtTokenUtility;

    @Autowired
    private RestTemplate restTemplate;

    //static attributes
    public static long base = 500000;
    public static int expirationInterval = 60;
    private static final String GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo?access_token=";


    @Value("${cdn.apikey}")
    private String cdnApiKey;


    //constructor
    public UserService(UserRepo userRepo, RegisterRepo registerRepo, ResetPasswordRepo resetPasswordRepo, BCryptPasswordEncoder bCryptPasswordEncoder, TaskExecutor taskExecutor, JwtTokenUtility jwtTokenUtility) {
        this.userRepo = userRepo;
        this.registerRepo = registerRepo;
        this.resetPasswordRepo = resetPasswordRepo;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.taskExecutor = taskExecutor;
        this.jwtTokenUtility = jwtTokenUtility;
    }


    //static methods
    public static String getExpirationTime() {
        LocalDateTime currentDateTime = LocalDateTime.now().plusMinutes(expirationInterval);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return currentDateTime.format(formatter);
    }

    public static boolean isExpired(String dateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime parsedDateTime = LocalDateTime.parse(dateString, formatter);
        LocalDateTime currentDateTime = LocalDateTime.now();
        return parsedDateTime.isBefore(currentDateTime);
    }

    public void sendTheMail(String token, String email, String role, HttpServletRequest req) throws Exception {
        String hostname = req.getServerName();
        String pathname1 = "/register/";
        String pathname2 = "/reset/";

        String url;
        if (Objects.equals(role, "")) {
            url = req.getProtocol() + "://" + hostname + pathname2 + "form/" + email + "/" + token;
        } else {
            url = req.getProtocol() + "://" + hostname + pathname1 + "form/" + email + "/" + token + "/" + role;
        }


        javaMailSender.send(mimeMessage -> {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);
            mimeMessageHelper.setTo(email);
            mimeMessageHelper.setSubject("Registration Link");
            mimeMessageHelper.setText(url);
        });
    }


    public Register registerUser(RegisterDto registerDto, HttpServletRequest req) throws Exception {

        Optional<User> isUserExist = userRepo.findByEmail(registerDto.getEmail());
        if (isUserExist.isPresent()) {
            throw new Exception("User already exist");
        }

        //generate token
        String token = UUID.randomUUID().toString();

        //create thread to send the email
        taskExecutor.execute(() -> {
                    try {
                        sendTheMail(token, registerDto.getEmail(), registerDto.getRole(), req);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }
        );

        //create Register entity
        Register registerUser = new Register();
        registerUser.setEmail(registerDto.getEmail());
        registerUser.setRole(registerDto.getRole());
        registerUser.setToken(token);
        registerUser.setExpirationDate(getExpirationTime());

        //save the Register entity
        return registerRepo.save(registerUser);
    }


    public void createUser(UserDto userDto, String profilePicUrl) throws Exception {

        //check if email id exist
        Optional<Register> userExist = registerRepo.findByEmail(userDto.getEmail());
        if (userExist.isEmpty()) {
            throw new Exception("email id does n't exist");
        }

        //check if token is matching
        if (!Objects.equals(userExist.get().getToken(), userDto.getToken())) {
            throw new Exception("token is false");
        }

        //check if token is not expired
        if (isExpired(userExist.get().getExpirationDate())) {
            throw new Exception("token is expired");
        }


        //create a employeeNo
        long totalEmployee = userRepo.count();
        Long employeeNo = base + totalEmployee;

        //create a user Entity
        User user = new User();
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        user.setRole(userDto.getRole());
        user.setDepartment(!Objects.equals(user.getRole(), "User") ? userDto.getDepartment() : "");
        user.setEmployeeNo(employeeNo);
        user.setProfilePic(profilePicUrl);


        //save the user Entity object
        userRepo.save(user);
        taskExecutor.execute(() -> {
            registerRepo.deleteById(userExist.get().getId());
        });
    }

    public String uploadProfilePic(MultipartFile profilePic) throws Exception {
        if (profilePic.isEmpty()) {
            throw new Exception("no image provided");
        }

        String url = "https://api.imgbb.com/1/upload?key=" + cdnApiKey;

        // Convert MultipartFile to Base64
        byte[] imageBytes = profilePic.getBytes();
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);


        // Prepare the headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);


        // Prepare the body
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("image", base64Image);

        // Combine headers and body into an HttpEntity
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

        // Make the POST request
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(response.getBody());
        JsonNode dataNode = rootNode.get("data");
        return dataNode.get("url").asText();

    }

    public User loginUser(String email, String password, HttpServletRequest req, HttpServletResponse res) throws Exception {

        //check if email id exist
        Optional<User> user = userRepo.findByEmail(email);

        if (user.isEmpty()) {
            throw new Exception("First Register Please");
        }

        boolean isMatch = bCryptPasswordEncoder.matches(password, user.get().getPassword());

        if (!isMatch) {
            throw new Exception("password did not match");
        }

        //create jwtToken
        String jwtToken = jwtTokenUtility.generateToken(user.get().getEmployeeNo().toString());
        jwtTokenUtility.setTokenCookie(res, jwtToken);

        //return the user Data
        return user.get();
    }

    public User loadUser(HttpServletResponse res, HttpServletRequest req) throws Exception {
        //check if jwt token is valid or not
        String token = jwtTokenUtility.getTokenFromCookie(req);
        if (!jwtTokenUtility.validateToken(token)) {
            throw new Exception("please login again");
        }

        //find the employee No from token and the related user data
        Long employeeNo = Long.valueOf(jwtTokenUtility.getEmployeeNoFromToken(token));
        Optional<User> user = userRepo.findByEmployeeNo(employeeNo);
        if (user.isEmpty()) {
            throw new Exception("fake token");
        }

        return user.get();
    }

    public void updateUser(Long id, String password, HttpServletRequest req) throws Exception {
        //check if jwt token is valid or not
        String token = jwtTokenUtility.getTokenFromCookie(req);
        if (!jwtTokenUtility.validateToken(token)) {
            throw new Exception("please login again");
        }

        Optional<User> user = userRepo.findById(id);

        if (user.isEmpty()) {
            throw new Exception("No such user Exist");
        }

        user.get().setPassword(bCryptPasswordEncoder.encode(password));

        userRepo.save(user.get());
    }

    public User getEmployee(HttpServletResponse res, HttpServletRequest req, Long employeeNo) throws Exception {
        //check if jwt token is valid or not
        String token = jwtTokenUtility.getTokenFromCookie(req);
        if (!jwtTokenUtility.validateToken(token)) {
            throw new Exception("please login again");
        }


        Optional<User> user = userRepo.findByEmployeeNo(employeeNo);
        if (user.isEmpty()) {
            throw new Exception("user does n't exist");
        }

        return user.get();
    }

    public List<User> getEmployeeSuggestions(HttpServletResponse res, HttpServletRequest req, Long employeeNo) throws Exception {
        //check if jwt token is valid or not
        String token = jwtTokenUtility.getTokenFromCookie(req);
        if (!jwtTokenUtility.validateToken(token)) {
            throw new Exception("please login again");
        }

        StringBuilder temp = new StringBuilder(employeeNo.toString());
        while (temp.length() < 6) {
            temp.append('_');
        }

        String pattern = temp.toString();
        return userRepo.getEmployeeSuggestions(pattern);
    }

    public void forgotPassword(String email, HttpServletRequest req) throws Exception {
        Optional<User> user = userRepo.findByEmail(email);

        if (user.isEmpty()) {
            throw new Exception("email is not registered");
        }

        //generate token
        String token = UUID.randomUUID().toString();

        //create thread to send the email
        taskExecutor.execute(() -> {
                    try {
                        sendTheMail(token, email, "", req);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }
        );

        //check if email id already exist in table
        Optional<ResetPassword> targetUser = resetPasswordRepo.findByEmail(email);
        if (targetUser.isPresent()) {
            targetUser.get().setToken(token);
            targetUser.get().setExpiration(getExpirationTime());
            resetPasswordRepo.save(targetUser.get());
            return;
        }

        ResetPassword resetPassword = new ResetPassword();
        resetPassword.setEmail(email);
        resetPassword.setToken(token);
        resetPassword.setExpiration(getExpirationTime());

        resetPasswordRepo.save(resetPassword);

    }

    public void resetPassword(String email, String token, String password) throws Exception {
        //check if token is valid or not
        Optional<ResetPassword> targetUser = resetPasswordRepo.findByEmail(email);
        if (targetUser.isEmpty() || !Objects.equals(targetUser.get().getToken(), token)) {
            throw new Exception("link is expired");
        }

        //check if link is expired
        if (UserService.isExpired(targetUser.get().getExpiration())) {
            throw new Exception("link is expired");
        }

        Optional<User> user = userRepo.findByEmail(email);
        if (user.isEmpty()) {
            throw new Exception("link is expired");
        }


        user.get().setPassword(bCryptPasswordEncoder.encode(password));
        userRepo.save(user.get());

        //delete the reset token
        taskExecutor.execute(() -> {
                    resetPasswordRepo.deleteById(targetUser.get().getId());
                }
        );

    }


    public void checkGoogleLogin(String token, HttpServletResponse res) throws Exception {
        System.out.println(token);
        String url = GOOGLE_TOKEN_INFO_URL + token;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(response.getBody());
        JsonNode dataNode = rootNode.get("email");
        Optional<User> user = userRepo.findByEmail(dataNode.asText());
        if (user.isEmpty()) {
            throw new Exception("user does n't exist");
        }

        //create jwtToken
        String jwtToken = jwtTokenUtility.generateToken(user.get().getEmployeeNo().toString());
        jwtTokenUtility.setTokenCookie(res, jwtToken);

        return;
    }
}
