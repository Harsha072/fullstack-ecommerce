package com.first.springbootecommerce.config;

import com.first.springbootecommerce.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import com.first.springbootecommerce.service.CustomerServiceImpl;
import com.first.springbootecommerce.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;



//@Configuration
//public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
//
//	@Override
//	protected void configure(HttpSecurity http) throws Exception {
////protect endpoint for backend /api/orders
//		http.authorizeRequests()
//		.antMatchers("/api/orders/**")
//		.authenticated()
//		.and()
//		.oauth2ResourceServer()
//		.jwt();
//
//		//add cors filters
//		http.cors();
//
//		//force a non-empty response body for access denied to make the response more firendly
//
//
//
//		//disable session tracking since we are not using cookies
//		http.csrf().disable();
//
//	}
//
//
//
//
//}


@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

	private final CustomerServiceImpl userService;
	private

	final JwtUtils jwtUtils;

	@Autowired
	public SecurityConfiguration(CustomerServiceImpl userService, JwtUtils jwtUtils) {
		this.userService = userService;
		this.jwtUtils = jwtUtils;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.cors() // Enable CORS
				.and()
				.csrf(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests(auth -> auth
						.antMatchers("/api/**").permitAll()
						.antMatchers("/api/orders/**").authenticated()
				)
				.sessionManagement(session -> session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				)
	.addFilterBefore(new JwtAuthenticationFilter(userService, jwtUtils), UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Autowired
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userService).passwordEncoder(passwordEncoder());
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		System.out.println("hiiiii");
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
		return http.getSharedObject(AuthenticationManagerBuilder.class).build();
	}
}