package com.first.springbootecommerce.dto;

import java.util.List;
import java.util.Set;

import com.first.springbootecommerce.Entities.Address;
import com.first.springbootecommerce.Entities.Customer;
import com.first.springbootecommerce.Entities.Order;
import com.first.springbootecommerce.Entities.OrderItem;

public class Purchase {

	private Customer customer;
	private Address shippingAddress;
	private Address billingAddress;
	private Order order;
	private Set<OrderItem> orderItem;

	// Getters and setters

	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}

	public Address getShippingAddress() {
		return shippingAddress;
	}

	public void setShippingAddress(Address shippingAddress) {
		this.shippingAddress = shippingAddress;
	}

	public Address getBillingAddress() {
		return billingAddress;
	}

	public void setBillingAddress(Address billingAddress) {
		this.billingAddress = billingAddress;
	}

	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}

	public Set<OrderItem> getOrderItems() {
		return orderItem;
	}

	public void setOrderItems(Set<OrderItem> orderItem) {
		this.orderItem = orderItem;
	}

	public Purchase(Customer customer, Address shippingAddress, Address billingAddress, Order order,
					Set<OrderItem> orderItem) {
		super();
		this.customer = customer;
		this.shippingAddress = shippingAddress;
		this.billingAddress = billingAddress;
		this.order = order;
		this.orderItem = orderItem;
	}
}
