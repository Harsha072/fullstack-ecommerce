package com.first.springbootecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.first.springbootecommerce.Entities.Customer;


public interface CustomerRepository extends JpaRepository<Customer, Long> {
	
	Customer findByEmail(String theEmail);

}
