package hotelManager.server.Controller;


import hotelManager.server.Dto.TicketDto;
import hotelManager.server.Entity.Ticket;
import hotelManager.server.Service.TicketService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Controller
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.PUT, RequestMethod.POST})
@RequestMapping("/api/v1")
public class TicketController {

    @Autowired
    TicketService ticketService;

    @PostMapping("/create/ticket")
    public ResponseEntity<?> createTicket(@ModelAttribute TicketDto ticketDto,
                                          @RequestParam(value = "picture",required = false) List<MultipartFile> pictures,
                                          HttpServletRequest req,
                                          HttpServletResponse res) {
        try {
            List<String> urls = ticketService.uploadPictures(pictures);
            Ticket ticket = ticketService.createTicket(ticketDto, req,urls);
            return ResponseEntity.status(200).body(ticket);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/tickets")
    public ResponseEntity<?> getAllTickets(HttpServletResponse res,
                                           HttpServletRequest req,
                                           @RequestParam List<String> status,
                                           @RequestParam List<String> department,
                                           @RequestParam List<String> date,
                                           @RequestParam Long createdBy,
                                           @RequestParam List<String> initiateDate,
                                           @RequestParam Long initiatedBy,
                                           @RequestParam List<String> resolveDate,
                                           @RequestParam Long resolvedBy,
                                           @RequestParam List<String> closedDate,
                                           @RequestParam Long closedBy,
                                           @RequestParam int page) {


        try {
            ArrayList<Ticket> allTickets = ticketService.getAllTickets(req, status, department, date, createdBy, initiateDate, initiatedBy, resolveDate, resolvedBy, closedDate, closedBy, page
            );
            return ResponseEntity.status(200).body(allTickets);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/ticket/count")
    public ResponseEntity<?> getAllTicketsCount(HttpServletResponse res,
                                                HttpServletRequest req,
                                                @RequestParam List<String> status,
                                                @RequestParam List<String> department,
                                                @RequestParam List<String> date,
                                                @RequestParam Long createdBy,
                                                @RequestParam List<String> initiateDate,
                                                @RequestParam Long initiatedBy,
                                                @RequestParam List<String> resolveDate,
                                                @RequestParam Long resolvedBy,
                                                @RequestParam List<String> closedDate,
                                                @RequestParam Long closedBy) {


        try {
            int count = ticketService.getAllTicketsCount(req, status, department, date, createdBy, initiateDate, initiatedBy, resolveDate, resolvedBy, closedDate, closedBy);
            return ResponseEntity.status(200).body(count);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }


    @GetMapping("/ticket/{id}")
    public ResponseEntity<?> getTicketDetail(HttpServletRequest res, HttpServletRequest req, @PathVariable Long id) {
        try {
            Ticket ticketDetail = ticketService.getTicketDetail(id, req);
            return ResponseEntity.status(200).body(ticketDetail);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PutMapping("/update/ticket/{id}")
    public ResponseEntity<?> updateTicket(@PathVariable Long id, HttpServletRequest req, HttpServletResponse res, @RequestBody TicketDto ticketDto) {
        System.out.println(id);
        try {
            Ticket updatedTicket = ticketService.updateTicket(ticketDto, req, id);
            return ResponseEntity.status(200).body(updatedTicket);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
