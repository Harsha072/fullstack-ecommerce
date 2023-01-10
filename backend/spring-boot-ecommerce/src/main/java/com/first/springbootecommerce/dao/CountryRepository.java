package com.first.springbootecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.first.springbootecommerce.Entities.Country;



@RepositoryRestResource(collectionResourceRel = "country" , path = "country")
public interface CountryRepository extends JpaRepository<Country, Integer> {

}
