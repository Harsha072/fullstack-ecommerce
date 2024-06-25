package com.first.springbootecommerce;

import org.junit.jupiter.api.Test;
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
        try (Connection connection = dataSource.getConnection()) {
            assertNotNull(connection, "Database connection successfuli");
        } catch ( SQLException e) {
            e.printStackTrace();
        }
    }
}
