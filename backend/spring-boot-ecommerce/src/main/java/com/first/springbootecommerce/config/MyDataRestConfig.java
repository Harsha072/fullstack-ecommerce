package com.first.springbootecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.core.mapping.HttpMethods;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.util.pattern.PathPattern;

import com.first.springbootecommerce.Entities.Country;
import com.first.springbootecommerce.Entities.Order;
import com.first.springbootecommerce.Entities.Product;
import com.first.springbootecommerce.Entities.ProductCategory;
import com.first.springbootecommerce.Entities.State;

/****this configuration is for respository rest data where we restrict certain http methods eg post put ****/
@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

	
	@Autowired
	private EntityManager entityManager;
	
	@Value("${allowed.origins}")
	private String[] allowedOrigin;
	
	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
		/****to expose id in the spring data rest we have to use entity manager to get all entites*****/

		
		HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE,HttpMethod.PATCH};
		
	/****disa le methods mention in array**/
		
		
		disableHttpMethods(config, theUnsupportedActions,ProductCategory.class);
		disableHttpMethods(config, theUnsupportedActions,Product.class);
		disableHttpMethods(config, theUnsupportedActions,Country.class);
		disableHttpMethods(config, theUnsupportedActions,State.class);
		disableHttpMethods(config, theUnsupportedActions,Order.class);

		//call an internal method to expose id

		exposeIds(config);
		
		//configure cors mapping so we dont need to use @crossOrigin
		cors.addMapping(config.getBasePath()+"/**").allowedOrigins(allowedOrigin);
	}

	private void disableHttpMethods(RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions,Class  theclass) {
		config.getExposureConfiguration()
		.forDomainType(theclass)
		.withItemExposure((metdata,httpMethods) ->httpMethods.disable(theUnsupportedActions))
		.withCollectionExposure((metdata,httpMethods)->httpMethods.disable(theUnsupportedActions));
	}

	private void exposeIds(RepositoryRestConfiguration config) {
	//get list of all entity classes from the entiuty manager
	Set<EntityType<?>> entites=entityManager.getMetamodel().getEntities();
	for (EntityType<?> entityType : entites) {
		System.out.println("all these entites"+entityType.getName());
	}
	
	List<Class> entityClass = new ArrayList<>();
	
	for (EntityType type : entites) {
		entityClass.add(type.getJavaType());

		
	}
	Class [] domainType = entityClass.toArray(new Class[0]);
	for (Class class1 : domainType) {

	}
	config.exposeIdsFor(domainType);
	
	
	
	
	
	
	
	
	
	}
	
	

}
