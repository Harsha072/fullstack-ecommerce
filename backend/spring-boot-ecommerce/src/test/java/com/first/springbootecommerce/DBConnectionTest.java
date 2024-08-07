package com.first.springbootecommerce;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;



import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.assertNotNull;


@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class DBConnectionTest {
    @Autowired
    private DataSource dataSource;

    @Test
    public void testDatabaseConnection() {
        System.out.println("connected to: " + dataSource.getClass().getName());
        try (Connection connection = dataSource.getConnection()) {
            assertNotNull(connection, "Database connection successful");
            java.sql.DatabaseMetaData metaData = connection.getMetaData();
            String dbName = metaData.getDatabaseProductName();

            System.out.println("Connected to database: " + metaData.getUserName());
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}