package com.first.springbootecommerce.controller;
//import com.example.jwtauth.model.User;
//import com.example.jwtauth.service.UserService;
//import com.example.jwtauth.util.JwtUtils;


import com.first.springbootecommerce.Entities.Customer;
import com.first.springbootecommerce.dto.JwtResponse;
import com.first.springbootecommerce.service.CustomerServiceImpl;
import com.first.springbootecommerce.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomerServiceImpl userService;
    private final JwtUtils jwtUtils;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, CustomerServiceImpl userService, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Customer user) {
        if (userService.findByUsername(user.getFirstName()).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }
        System.out.println("got user "+user.getFirstName());
        userService.saveUser(user);
        return ResponseEntity.ok().body("{\"message\": \"User registered successfully\"}");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Customer user) {
        System.out.println(user.getEmail()+"  "+user.getPassword());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtils.generateToken(userDetails);
            return ResponseEntity.ok().body(new JwtResponse(jwt));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid username or passwordrtdyhfhg");
        }
    }
}
