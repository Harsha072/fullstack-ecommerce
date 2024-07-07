package com.first.springbootecommerce.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;


import org.junit.Test;
import org.junit.jupiter.api.BeforeAll;

import org.junit.runner.RunWith;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit4.SpringRunner;


@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class CheckoutServiceIntegrationTest {



    @Autowired
    private DataSource dataSource;

    @BeforeAll
    @Test
    public void testDBConnection() {
        assertNotNull(dataSource, "DataSource should not be null");

        try (Connection connection = dataSource.getConnection()) {
            assertNotNull(connection, "Database connection successful");
            System.out.println("Connected to: " + dataSource.getClass().getName());
            java.sql.DatabaseMetaData metaData = connection.getMetaData();
            String dbName = metaData.getDatabaseProductName();
            System.out.println(dbName);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    
}
