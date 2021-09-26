package com.first.springbootecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import com.okta.spring.boot.oauth.Okta;

@Configuration
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	@Override
	protected void configure(HttpSecurity http) throws Exception {
//protect endpoint for backend /api/orders
		http.authorizeRequests()
		.antMatchers("/api/orders/**")
		.authenticated()
		.and()
		.oauth2ResourceServer()
		.jwt();
		
		//add cors filters
		http.cors();
		
		//force a non-empty response body for access denied to make the response more firendly
		
		Okta.configureResourceServer401ResponseBody(http);
		
		//disable session tracking since we are not using cookies
		http.csrf().disable();
	
	}
	
	
	

}
