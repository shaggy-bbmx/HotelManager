package hotelManager.server.Service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import hotelManager.server.Config.Utility.JwtTokenUtility;
import hotelManager.server.Dto.TicketDto;
import hotelManager.server.Entity.Ticket;
import hotelManager.server.Entity.User;
import hotelManager.server.Repository.TicketRepo;
import hotelManager.server.Repository.UserRepo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class TicketService {

    @Autowired
    TicketRepo ticketRepo;

    @Autowired
    private final JwtTokenUtility jwtTokenUtility;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RestTemplate restTemplate;

    public static int size = 13;

    @Value("${cdn.apikey}")
    private String cdnApiKey;

    //Constructor
    public TicketService(JwtTokenUtility jwtTokenUtility) {
        this.jwtTokenUtility = jwtTokenUtility;
    }


    public Ticket createTicket(TicketDto ticketDto, HttpServletRequest req, List<String> urls) throws Exception {

        //check if jwt token is valid or not
        String token = jwtTokenUtility.getTokenFromCookie(req);
        if (!jwtTokenUtility.validateToken(token)) {
            throw new Exception("please login again");
        }

        //find the role from token
        String role = extractRoleAndDepartmentFromToken(token).get(0);

        if (Objects.equals(role, "Technician")) {
            throw new Exception("you are not authorized to create ticket");
        }

        Ticket ticket = new Ticket();
        ticket.setDepartment(ticketDto.getDepartment());
        ticket.setDescription(ticketDto.getDescription());
        ticket.setRoomNo(ticketDto.getRoomNo());
        ticket.setTitle(ticketDto.getTitle());
        ticket.setStatus(ticketDto.getStatus());
        ticket.setCreatedAt(ticketDto.getCreatedAt());
        ticket.setCreatedBy(ticketDto.getCreatedBy());
        ticket.setPictures(urls);
        //save ticket
        return ticketRepo.save(ticket);

    }


    public ArrayList<Ticket> getAllTickets(HttpServletRequest req, List<String> status, List<String> department, List<String> date, Long createdBy, List<String> initiateDate, Long initiatedBy, List<String> resolveDate, Long resolvedBy, List<String> closedDate, Long closedBy, int page) throws Exception {
        //check if jwt token is valid or not
        String token = jwtTokenUtility.getTokenFromCookie(req);
        if (!jwtTokenUtility.validateToken(token)) {
            throw new Exception("please login again");
        }

        //find the role & department from token
        List<String> list = extractRoleAndDepartmentFromToken(token);
        String role = list.get(0);
        String departmentOFUser = list.get(1);
        if (!Objects.equals(role, "User")) {
            department = List.of(departmentOFUser);
        }

        //format dates
        String startDate1 = date.get(0);
        String startDate2 = initiateDate.get(0);
        String startDate3 = resolveDate.get(0);
        String startDate4 = closedDate.get(0);

        String endDate1 = date.get(1);
        String endDate2 = initiateDate.get(1);
        String endDate3 = resolveDate.get(1);
        String endDate4 = closedDate.get(1);


        //format CreatedBy,initiatedBy,resolvedBy,closedBy
        String createdByPattern = createdBy == 0 ? "5%" : createdBy.toString();
        String initiatedByPattern = initiatedBy == 0 ? "5%" : initiatedBy.toString();
        String resolvedByPattern = resolvedBy == 0 ? "5%" : resolvedBy.toString();
        String closedByPattern = closedBy == 0 ? "5%" : closedBy.toString();


        Pageable pageable = PageRequest.of(page - 1, TicketService.size);


        return ticketRepo.findByAllFilters(status, department,
                startDate1, endDate1, createdByPattern,
                startDate2, endDate2, initiatedByPattern,
                startDate3, endDate3, resolvedByPattern,
                startDate4, endDate4, closedByPattern,
                pageable);

    }


    public int getAllTicketsCount(HttpServletRequest req, List<String> status, List<String> department, List<String> date, Long createdBy, List<String> initiateDate, Long initiatedBy, List<String> resolveDate, Long resolvedBy, List<String> closedDate, Long closedBy) throws Exception {
        //check if jwt token is valid or not
        String token = jwtTokenUtility.getTokenFromCookie(req);
        if (!jwtTokenUtility.validateToken(token)) {
            throw new Exception("please login again");
        }

        //find the role & department from token
        List<String> list = extractRoleAndDepartmentFromToken(token);
        String role = list.get(0);
        String departmentOFUser = list.get(1);
        if (!Objects.equals(role, "User")) {
            department = List.of(departmentOFUser);
        }


        //format dates
        String startDate1 = date.get(0);
        String startDate2 = initiateDate.get(0);
        String startDate3 = resolveDate.get(0);
        String startDate4 = closedDate.get(0);

        String endDate1 = date.get(1);
        String endDate2 = initiateDate.get(1);
        String endDate3 = resolveDate.get(1);
        String endDate4 = closedDate.get(1);


        //format CreatedBy,initiatedBy,resolvedBy,closedBy
        String createdByPattern = createdBy == 0 ? "5%" : createdBy.toString();
        String initiatedByPattern = initiatedBy == 0 ? "5%" : initiatedBy.toString();
        String resolvedByPattern = resolvedBy == 0 ? "5%" : resolvedBy.toString();
        String closedByPattern = closedBy == 0 ? "5%" : closedBy.toString();

        int result = ticketRepo.findByAllFiltersCount(status, department,
                startDate1, endDate1, createdByPattern,
                startDate2, endDate2, initiatedByPattern,
                startDate3, endDate3, resolvedByPattern,
                startDate4, endDate4, closedByPattern);

        int size = TicketService.size;
        return (result % size == 0) ? (result / size) : (result / size) + 1;
    }

    public Ticket getTicketDetail(Long id, HttpServletRequest req) throws Exception {
        //check if jwt token is valid or not
        String token = jwtTokenUtility.getTokenFromCookie(req);
        if (!jwtTokenUtility.validateToken(token)) {
            throw new Exception("please login again");
        }

        //find the role & department from token
        List<String> list = extractRoleAndDepartmentFromToken(token);
        String role = list.get(0);
        String department = list.get(1);

        //find ticket
        Optional<Ticket> ticketDetail = ticketRepo.findById(id);
        if (ticketDetail.isEmpty()) {
            throw new Exception("no such exist");
        }


        if (Objects.equals(role, "Technician") && !Objects.equals(ticketDetail.get().getDepartment(), department)) {
            throw new Exception("you are not authorized to view this ticket");
        }

        return ticketDetail.get();

    }

    public Ticket updateTicket(TicketDto ticketDto, HttpServletRequest req, Long id) throws Exception {
        //check if jwt token is valid or not
        String token = jwtTokenUtility.getTokenFromCookie(req);
        if (!jwtTokenUtility.validateToken(token)) {
            throw new Exception("please login again");
        }

        Optional<Ticket> updatedTicket = ticketRepo.findById(id);
        if (updatedTicket.isEmpty()) {
            throw new Exception("No such ticket exist");
        }

        updatedTicket.get().setDepartment(ticketDto.getDepartment());
        updatedTicket.get().setTitle(ticketDto.getTitle());
        updatedTicket.get().setDescription(ticketDto.getDescription());
        updatedTicket.get().setRoomNo(ticketDto.getRoomNo());
        updatedTicket.get().setStatus(ticketDto.getStatus());
        updatedTicket.get().setCreatedBy(ticketDto.getCreatedBy());
        updatedTicket.get().setCreatedAt(ticketDto.getCreatedAt());
        updatedTicket.get().setInitiatedBy(ticketDto.getInitiatedBy());
        updatedTicket.get().setInitiatedAt(ticketDto.getInitiatedAt());
        updatedTicket.get().setResolvedAt(ticketDto.getResolvedAt());
        updatedTicket.get().setResolvedBy(ticketDto.getResolvedBy());
        updatedTicket.get().setClosedAt(ticketDto.getClosedAt());
        updatedTicket.get().setClosedBy(ticketDto.getClosedBy());


        //save
        return ticketRepo.save(updatedTicket.get());
    }


    private List<String> extractRoleAndDepartmentFromToken(String token) throws Exception {
        List<String> list = new ArrayList<>();

        Long employeeNo = Long.valueOf(jwtTokenUtility.getEmployeeNoFromToken(token));
        Optional<User> user = userRepo.findByEmployeeNo(employeeNo);
        if (user.isEmpty()) {
            throw new Exception("fake token provided");
        }
        list.add(user.get().getRole());
        list.add(user.get().getDepartment());
        return list;
    }


    public List<String> uploadPictures(List<MultipartFile> pictures) throws Exception {
        if (pictures == null || pictures.isEmpty()) {
            return new ArrayList<>();
        }


        List<String> urlsOfPicture = new ArrayList<>();

        for (MultipartFile picture : pictures) {
            String url = "https://api.imgbb.com/1/upload?key=" + cdnApiKey;
            // Convert MultipartFile to Base64
            byte[] imageBytes = picture.getBytes();
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
            urlsOfPicture.add(dataNode.get("url").asText());

        }

        return urlsOfPicture;
    }
}
