package com.first.springbootecommerce.service;


import java.util.List;
import java.util.Set;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.first.springbootecommerce.Entities.Customer;
import com.first.springbootecommerce.Entities.Order;
import com.first.springbootecommerce.Entities.OrderItem;
import com.first.springbootecommerce.dao.CustomerRepository;
import com.first.springbootecommerce.dto.Purchase;
import com.first.springbootecommerce.dto.PurchaseResponse;

@Service
public class CheckoutServiceImpl implements CheckoutService {

	@Autowired
	private CustomerRepository customerRepository;

	@Override
	@Transactional
	public PurchaseResponse placeOrder(Purchase purchase) {

		//retrieve the order from dto
		Order order = purchase.getOrder();
		System.out.println(purchase.getOrderItems());
		System.out.println("incoming order "+order.getTotalPrice());
		//generate tracking number
		String orderTrackingnumber = generateOrderTrackingNumber();
		order.setOrderTrackingNumber(orderTrackingnumber);
		System.out.println("tracking number "+orderTrackingnumber);
		//populatde order with orderItems
		Set<OrderItem> orderItems = purchase.getOrderItems();

		orderItems.forEach(item->order.add(item));

		//populate order with billing address and shipping address
		order.setBillingAddress(purchase.getBillingAddress());
		System.out.println("type of billing address" + purchase.getBillingAddress().getState());
		order.setShippingAddress(purchase.getShippingAddress());
		//populate customer with order
		Customer customer = purchase.getCustomer();
		String email = customer.getEmail();
		//check if customer is already present based on email

		Customer customerFromDb = customerRepository.findByEmail(email);
		System.out.println(customerFromDb);
		if(customerFromDb !=null) {
			customer = customerFromDb;
		}

		customer.add(order);
		//save to the database
		customerRepository.save(customer);
//		return a response
		return new PurchaseResponse(order.getOrderTrackingNumber()) ;
	}

	private String generateOrderTrackingNumber() {
//genearate ramdom uuid
		return UUID.randomUUID().toString();
	}


}
