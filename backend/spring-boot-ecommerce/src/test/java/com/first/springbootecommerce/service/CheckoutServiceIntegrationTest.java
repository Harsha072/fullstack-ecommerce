package com.first.springbootecommerce.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.first.springbootecommerce.Entities.*;
import com.first.springbootecommerce.Entities.Order;
import com.first.springbootecommerce.dao.CustomerRepository;
import com.first.springbootecommerce.dao.OrderRepository;
import com.first.springbootecommerce.dao.ProductCategoryRepository;
import com.first.springbootecommerce.dao.ProductRepository;
import com.first.springbootecommerce.dto.Purchase;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@Transactional
public class CheckoutServiceIntegrationTest {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    private Purchase purchase;
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Product prod;
    private ProductCategory category;
    private Set<OrderItem> orderItems;

    @BeforeEach
    public void setUp() {
        category = new ProductCategory();
        category.setId(1L);
        category.setCategory_name("Books");
        category = productCategoryRepository.saveAndFlush(category); // Ensure ID is generated and committed

        prod = new Product();
        prod.setId(3L);
        prod.setName("Exploring javascript");
        prod.setCategory(category);
        prod.setSku("MobileSKU");
        prod.setUnitPrice(new BigDecimal("100.9"));
        prod.setImageUrl("www.google.com");
        prod.setUnits_in_stock(2);
        prod.setDate_created(new Timestamp(System.currentTimeMillis()));
        prod.setLast_updated(new Timestamp(System.currentTimeMillis()));
        prod.setDescription("A good mobile");
        prod.setActive(true);

        prod = productRepository.saveAndFlush(prod);

        customer = new Customer();
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setEmail("john.doe@example.com");
        customerRepository.saveAndFlush(customer);

    }

    @Test
    public void testDatabaseConnection() {
        try (Connection connection = dataSource.getConnection()) {
            assertNotNull(connection, "Database connection successful");
            java.sql.DatabaseMetaData metaData = connection.getMetaData();
            System.out.println("Connected to database: " + metaData.getDatabaseProductName());
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }



    @Test
    public void checkIfProductAndProductCategoryIsPresent() {
        // Retrieve Product from database
        Product savedProduct = productRepository.findById(prod.getId()).orElse(null);
        assertNotNull(savedProduct, "Product should not be null");
        assertEquals(prod.getName(), savedProduct.getName(), "Product name should match");

        // Retrieve ProductCategory from database
        ProductCategory savedCategory = productCategoryRepository.findById(category.getId()).orElse(null);
        assertNotNull(savedCategory, "ProductCategory should not be null");
        assertEquals(category.getCategory_name(), savedCategory.getCategory_name(), "ProductCategory name should match");
    }


    @Test
    public void checkoutServiceTest() throws Exception {

        shippingAddress = new Address();
        shippingAddress.setCity("New York");
        shippingAddress.setCountry("USA");
        shippingAddress.setState("NY");
        shippingAddress.setStreet("123 5th Ave");
        shippingAddress.setZipcode("10001");

        billingAddress = new Address();
        billingAddress.setCity("New York");
        billingAddress.setCountry("USA");
        billingAddress.setState("NY");
        billingAddress.setStreet("123 5th Ave");
        billingAddress.setZipcode("10001");




        order = new Order();
        order.setOrderTrackingNumber("123456789");
        order.setTotalQuantity(2);
        order.setTotalPrice(new BigDecimal("150.00"));
        order.setStatus("SHIPPED");
        order.setCustomerId(customer);
        order.setShippingAddress(shippingAddress);
        order.setBillingAddress(billingAddress);


        OrderItem orderItem1 = new OrderItem();

        orderItem1.setImageUrl("http://example.com/product1.jpg");
        orderItem1.setUnitPrice(new BigDecimal("50.00"));
        orderItem1.setQuantity(1);
        orderItem1.setOrderId(order);
        orderItem1.setProductId(prod.getId());



        purchase = new Purchase(customer, shippingAddress, billingAddress, order, Set.of(orderItem1));
        MvcResult result = mockMvc.perform(post("/api/checkout/purchase")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(purchase)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        String orderTrackingNumber = JsonPath.parse(jsonResponse).read("$.orderTrackingNumber");

        assertNotNull(orderTrackingNumber);
        assertFalse(orderTrackingNumber.isEmpty());


    }
    @Test
    public void checkoutServiceTestWhenPurchaseIsEmpty() throws Exception {


        shippingAddress = new Address();
        shippingAddress.setCity("New York");
        shippingAddress.setCountry("USA");
        shippingAddress.setState("NY");
        shippingAddress.setStreet("123 5th Ave");
        shippingAddress.setZipcode("10001");

        billingAddress = new Address();
        billingAddress.setCity("New York");
        billingAddress.setCountry("USA");
        billingAddress.setState("NY");
        billingAddress.setStreet("123 5th Ave");
        billingAddress.setZipcode("10001");




        order = new Order();
        order.setOrderTrackingNumber("123456789");
        order.setTotalQuantity(2);
        order.setTotalPrice(new BigDecimal("150.00"));
        order.setStatus("SHIPPED");
        order.setCustomerId(customer);
        order.setShippingAddress(shippingAddress);
        order.setBillingAddress(billingAddress);


        OrderItem orderItem1 = new OrderItem();

        orderItem1.setImageUrl("http://example.com/product1.jpg");
        orderItem1.setUnitPrice(new BigDecimal("50.00"));
        orderItem1.setQuantity(1);
        orderItem1.setOrderId(order);
        orderItem1.setProductId(prod.getId());



        Purchase emptyPurchase = new Purchase(customer, shippingAddress, billingAddress, order, Collections.emptySet());

        MvcResult result = mockMvc.perform(post("/api/checkout/purchase")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(emptyPurchase)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        String orderTrackingNumber = JsonPath.parse(jsonResponse).read("$.orderTrackingNumber");

        assertNotNull(orderTrackingNumber);
        assertFalse(orderTrackingNumber.isEmpty());


    }
}
