package com.first.springbootecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.first.springbootecommerce.dto.Purchase;
import com.first.springbootecommerce.dto.PurchaseResponse;
import com.first.springbootecommerce.service.CheckoutService;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

	@Autowired
	private CheckoutService checkoutService;
	
	@PostMapping("/purchase")
	public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
		System.out.println("coming from front end "+purchase.getCustomer().getFirstName());
		PurchaseResponse purchaseResponse =checkoutService.placeOrder(purchase);
		System.out.println("the response "+purchaseResponse.toString());
		return purchaseResponse;
	}
}
