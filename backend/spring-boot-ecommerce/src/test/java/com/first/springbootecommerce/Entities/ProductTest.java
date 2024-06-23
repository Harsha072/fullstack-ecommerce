package com.first.springbootecommerce.Entities;

import com.first.springbootecommerce.dao.ProductCategoryRepository;
import com.first.springbootecommerce.dao.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.math.BigDecimal;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;


@ExtendWith(SpringExtension.class)
@DataJpaTest
public class ProductTest {
    @Autowired
    private TestEntityManager entityManager;
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;


    @Test
    public void testProductCategoryAndProductMapping() {
        ProductCategory category = new ProductCategory();
        category.setCategory_name("Mobile");
      category.setId(2l);
        category = productCategoryRepository.save(category);

        System.out.println(category.getId());

      Product product1 = new Product();
        product1.setId(10);
        product1.setActive(true);
        product1.setDescription("samsun mobile");
        product1.setName("Samsung");
        product1.setImageUrl("assets/images/products/books/book-luv2code-1000.png");
        product1.setDate_created(new Timestamp(System.currentTimeMillis()));
        product1.setLast_updated(new Timestamp(System.currentTimeMillis()));

        product1.setUnitPrice(new BigDecimal("789.9"));
        product1.setUnits_in_stock(100);
        product1.setSku("Galaxy");
        product1.setCategory(category);
        System.out.println(product1.getCategory().getId());
        Product prod =productRepository.save(product1);
        Pageable pageable = PageRequest.of(0, 10);

        // Retrieve the paginated list of products by category ID
        Page<Product> productsPage = productRepository.findByCategoryId(category.getId(), pageable);



// Fetch the saved ProductCategory from the database
        assertNotNull(productsPage);
        assertEquals(1, productsPage.getTotalElements());
        Product savedProduct = productsPage.getContent().get(0);
        assertEquals("Samsung", savedProduct.getName());
        assertEquals(new BigDecimal("789.9"), savedProduct.getUnitPrice());
        assertNotNull(savedProduct.getCategory());
        assertEquals(category.getId(), savedProduct.getCategory().getId());
        assertEquals("Mobile", savedProduct.getCategory().getCategory_name());


    }
}