package com.first.springbootecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.first.springbootecommerce.dto.Purchase;
import com.first.springbootecommerce.dto.PurchaseResponse;
import com.first.springbootecommerce.service.CheckoutService;

//@CrossOrigin("http://localhost:4200")
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

	@GetMapping("/health")
	public ResponseEntity<String> checkHealth() {
		try {
			return new ResponseEntity<>("OK", HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(" failed", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
