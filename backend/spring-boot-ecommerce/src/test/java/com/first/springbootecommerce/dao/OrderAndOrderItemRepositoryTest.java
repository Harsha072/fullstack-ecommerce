package com.first.springbootecommerce.dao;

import com.first.springbootecommerce.Entities.Address;
import com.first.springbootecommerce.Entities.Customer;
import com.first.springbootecommerce.Entities.Order;
import com.first.springbootecommerce.Entities.OrderItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class OrderAndOrderItemRepositoryTest {



        @InjectMocks
        private Order order;

        @Mock
        private Customer customer;

        @Mock
        private Address shippingAddress;

        @Mock
        private Address billingAddress;

        @BeforeEach
        public void setUp() {
            // Initialize the mocks
            MockitoAnnotations.openMocks(this);

            // Set up sample data for the order
            order.setOrderTrackingNumber("123456789");
            order.setTotalQuantity(2);
            order.setTotalPrice(new BigDecimal("150.00"));
            order.setStatus("SHIPPED");
            order.setDateCreated(new Date());
            order.setLastUpdated(new Date());
            order.setCustomerId(customer);
            order.setShippingAddress(shippingAddress);
            order.setBillingAddress(billingAddress);
        }

        @Test
        public void testAddOrderItem() {
            // Create an order item
            OrderItem orderItem = new OrderItem();
            orderItem.setUnitPrice(new BigDecimal("50.00"));
            orderItem.setQuantity(1);

            // Add the order item to the order
            order.add(orderItem);

            // Verify that the order item is added to the order
            List<OrderItem> orderItems = order.getOrderItems();
            assertNotNull(orderItems);
            assertEquals(1, orderItems.size());
            assertTrue(orderItems.contains(orderItem));
            assertEquals(order, orderItem.getOrderId());
        }

        @Test
        public void testRemoveOrderItem() {
            // Create an order item
            OrderItem orderItem = new OrderItem();
            orderItem.setUnitPrice(new BigDecimal("50.00"));
            orderItem.setQuantity(1);

            // Add the order item to the order
            order.add(orderItem);

            // Remove the order item from the order
            order.getOrderItems().remove(orderItem);

            // Verify that the order item is removed from the order
            List<OrderItem> orderItems = order.getOrderItems();
            System.out.println(orderItems);
           assertNotNull(orderItems);
            assertEquals(0, orderItems.size());
            assertFalse(orderItems.contains(orderItem));
            assertTrue(orderItems.isEmpty());
        }
    }

