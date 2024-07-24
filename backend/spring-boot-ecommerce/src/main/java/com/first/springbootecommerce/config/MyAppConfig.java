package com.first.springbootecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//this configurations is for spring rest controller only
@Configuration
public class MyAppConfig implements WebMvcConfigurer {

	@Value("${allowed.origins}")
	private String[] theAllowedOrigin;

	@Value("${spring.data.rest.base-path}")
	private String basePath;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping(basePath + "/**")
				.allowedOrigins(theAllowedOrigin)
				.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
	}




}
