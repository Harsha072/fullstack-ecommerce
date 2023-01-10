package com.first.springbootecommerce.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.first.springbootecommerce.Entities.State;



@RepositoryRestResource(collectionResourceRel = "state" , path = "states")
public interface StatesRepository extends JpaRepository<State, Integer> {

	List<State>findByCountryCode(@Param("code")String code);
}
