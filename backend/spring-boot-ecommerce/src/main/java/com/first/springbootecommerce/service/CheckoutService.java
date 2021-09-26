package com.first.springbootecommerce.service;

import com.first.springbootecommerce.dto.Purchase;
import com.first.springbootecommerce.dto.PurchaseResponse;

public interface CheckoutService {

	PurchaseResponse placeOrder(Purchase purchase);

}
