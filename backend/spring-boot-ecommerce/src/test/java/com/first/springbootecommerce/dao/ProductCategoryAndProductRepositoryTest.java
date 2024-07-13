package com.first.springbootecommerce.dao;

import com.first.springbootecommerce.Entities.Product;
import com.first.springbootecommerce.Entities.ProductCategory;


import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
public class ProductCategoryAndProductRepositoryTest {

    @Autowired
    private ProductCategoryRepository productCategoryRepository;


    @Autowired
    private ProductRepository productRepository;

    @Test
    @DisplayName("save and retrive product category")
    public void testSaveProductCategoryAndFindById() {
        // Create a ProductCategory entity
        ProductCategory category = new ProductCategory();
        category.setCategory_name("Books");

        // Save the entity
        ProductCategory savedCategory = productCategoryRepository.save(category);

        // Retrieve the entity by ID
        Optional<ProductCategory> retrievedCategory = productCategoryRepository.findById(savedCategory.getId());

        // Assert that the entity is found
        assertTrue(retrievedCategory.isPresent());
        assertEquals("Books", retrievedCategory.get().getCategory_name());
    }
    @Test
    @DisplayName("Check first if prodcut category is present and then save product")
    public void testSaveProductAndFindById() {
        // Create a ProductCategory entity
        ProductCategory category = new ProductCategory();
        category.setCategory_name("Books");

        // Save the ProductCategory entity
        ProductCategory savedCategory = productCategoryRepository.save(category);

        // Create a Product entity and associate it with the saved ProductCategory
        Product product = new Product();
        product.setName("Exploring Javascript");
        product.setSku("JS_BOOK_001");
        product.setDescription("A book on JavaScript programming");
        product.setUnitPrice(new BigDecimal("39.99"));
        product.setImageUrl("https://example.com/book.jpg");
        product.setActive(true);
        product.setUnits_in_stock(10);
        product.setDate_created(new Date());
        product.setLast_updated(new Date());
        product.setCategory(savedCategory);

        // Save the Product entity
        Product savedProduct = productRepository.save(product);

        // Assert that the saved Product has a non-null ID
        assertNotNull(savedProduct.getId(), "Product ID should not be null after saving");

        // Assert that the saved Product matches the original data
        assertEquals("Exploring Javascript", savedProduct.getName());
        assertEquals("JS_BOOK_001", savedProduct.getSku());
        assertEquals("A book on JavaScript programming", savedProduct.getDescription());
        assertEquals(new BigDecimal("39.99"), savedProduct.getUnitPrice());
        assertEquals("https://example.com/book.jpg", savedProduct.getImageUrl());
        assertEquals(true, savedProduct.isActive());
        assertEquals(10, savedProduct.getUnits_in_stock());
        assertEquals(savedCategory.getId(), savedProduct.getCategory().getId(),
                "Product should be associated with the saved ProductCategory");
    }

    @Test
    @Transactional
    public void testSaveProductWithoutCategory() {
        // Create a Product entity without associating it with a ProductCategory
        Product product = new Product();
        product.setName("Exploring Javascript");
        product.setSku("JS_BOOK_001");
        product.setDescription("A book on JavaScript programming");
        product.setUnitPrice(new BigDecimal("39.99"));
        product.setImageUrl("https://example.com/book.jpg");
        product.setActive(true);
        product.setUnits_in_stock(10);
        product.setDate_created(new Date());
        product.setLast_updated(new Date());

        // Attempt to save the Product without associating it with a ProductCategory
        Exception exception = assertThrows(DataIntegrityViolationException.class, () -> {
            productRepository.save(product);
        });
        // Assert that a DataIntegrityViolationException is thrown, indicating that saving the Product failed


        assertTrue(exception instanceof DataIntegrityViolationException);
    }

}
