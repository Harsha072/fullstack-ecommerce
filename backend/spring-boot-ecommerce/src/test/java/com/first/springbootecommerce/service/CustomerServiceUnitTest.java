package com.first.springbootecommerce.service;

import com.first.springbootecommerce.Entities.Customer;
import com.first.springbootecommerce.dao.CustomerRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class) // Use Spring's test runner
@SpringBootTest // Load the complete Spring application context
public class CustomerServiceUnitTest {

    @Mock
    private CustomerRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private CustomerServiceImpl customerService;


    private Customer user;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        customerService = new CustomerServiceImpl(userRepository);
        user = new Customer();
        user.setFirstName("harsha");
        user.setLastName("swamy");
        user.setEmail("test@example.com");
        user.setPassword("password123");
    }
    @Test
    @DisplayName("when customer is present")
    public void testSaveUser() {
        when(passwordEncoder.encode(user.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(Customer.class))).thenReturn(user);

        Customer savedUser = customerService.saveUser(user);
        System.out.println(savedUser.getFirstName());
        // Assert
        assertEquals(user.getEmail(), savedUser.getEmail());
    }
    @Test(expected = IllegalArgumentException.class)
    @DisplayName("when customer is null")
    public void testSaveUserWithNullCustomer() {
        // Act
        customerService.saveUser(null);

        // Assert is handled by the expected exception
    }


}