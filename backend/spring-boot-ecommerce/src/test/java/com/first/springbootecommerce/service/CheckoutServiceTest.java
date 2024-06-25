package com.first.springbootecommerce.service;

import com.first.springbootecommerce.Entities.*;
import com.first.springbootecommerce.dao.CustomerRepository;
import com.first.springbootecommerce.dto.Purchase;
import com.first.springbootecommerce.dto.PurchaseResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;


@RunWith(SpringRunner.class)
@SpringBootTest
class CheckoutServiceTest {


    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CheckoutServiceImpl checkoutService;

    private Purchase purchase;
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        customer = new Customer();
        customer.setEmail("test@example.com");
        customer.setFirstName("John");
        customer.setLastName("Doe");

        shippingAddress = new Address();
        shippingAddress.setCity("City1");
        shippingAddress.setState("State1");

        billingAddress = new Address();
        billingAddress.setCity("City2");
        billingAddress.setState("State2");

        order = new Order();
        order.setTotalPrice(new BigDecimal("100.00"));
        order.setTotalQuantity(1);
        order.setDateCreated(new Date());
        order.setBillingAddress(billingAddress);
        order.setShippingAddress(shippingAddress);
        order.setCustomerId(customer);
        order.setOrderTrackingNumber("1234567");
        order.setLastUpdated(new Timestamp(System.currentTimeMillis()));
        order. setDateCreated(new Timestamp(System.currentTimeMillis()));
        order.setStatus("true");

        ProductCategory category = new ProductCategory();
        category.setId(11L);
        category.setCategory_name("Mobiles");


        Product prod = new Product();
        prod.setId(1);
        prod.setName("Samsung");
        prod.setCategory(category);
        prod.setSku("MobileSKU");
        prod.setUnitPrice(new BigDecimal("100.9"));
        prod.setImageUrl("www.google.com");
        prod.setUnits_in_stock(2);
        prod.setDate_created(new Timestamp(System.currentTimeMillis()));
        prod.setLast_updated(new Timestamp(System.currentTimeMillis()));
        prod.setDescription("A good mobile");
        prod.setActive(true);

        orderItems = new HashSet<>();
        OrderItem item = new OrderItem();
        item.setProductId(prod);
        item.setQuantity(1);
        item.setUnitPrice(new BigDecimal("50.00"));
        orderItems.add(item);

        order.setOrderItems(orderItems);

        purchase = new Purchase(customer, shippingAddress, billingAddress, order, orderItems);
    }

    @Test
    void testPlaceOrder_NewCustomer() {
        when(customerRepository.findByEmail(anyString())).thenReturn(null);

        PurchaseResponse response = checkoutService.placeOrder(purchase);



        assertNotNull(response);
        assertNotNull(response.getOrderTrackingNumber());
        assertEquals(order.getOrderTrackingNumber(), response.getOrderTrackingNumber());

        verify(customerRepository, times(1)).findByEmail(anyString());
        verify(customerRepository, times(1)).save(customer);
    }


    @Test
    void testPlaceOrder_ExistingCustomer() {
        when(customerRepository.findByEmail(anyString())).thenReturn(customer);

        PurchaseResponse response = checkoutService.placeOrder(purchase);

        assertNotNull(response);
        assertNotNull(response.getOrderTrackingNumber());
        assertEquals(order.getOrderTrackingNumber(), response.getOrderTrackingNumber());

        verify(customerRepository, times(1)).findByEmail(anyString());
        verify(customerRepository, times(1)).save(customer);
    }

}