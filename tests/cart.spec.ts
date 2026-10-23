import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test('user can add a product and verify its cart details', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  const product = productsPage.productByName('Sauce Labs Backpack');
  const productName = await product.locator('.inventory_item_name').textContent();
  const productPrice = await product.locator('.inventory_item_price').textContent();

  await productsPage.addProduct('Sauce Labs Backpack');
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

  await productsPage.openCart();
  await expect(page).toHaveURL(/cart\.html/);

  await expect(cartPage.items).toHaveCount(1);
  await expect(cartPage.items.locator('.inventory_item_name')).toHaveText(productName ?? '');
  await expect(cartPage.items.locator('.inventory_item_price')).toHaveText(productPrice ?? '');
  await expect(cartPage.items.locator('.cart_quantity')).toHaveText('1');
});

test('cart contents persist when navigating back to products', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await productsPage.addProduct('Sauce Labs Bike Light');
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

  await productsPage.openCart();
  await cartPage.continueShopping();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  await expect(
    productsPage.productByName('Sauce Labs Bike Light')
      .getByRole('button', { name: 'Remove' }),
  ).toBeVisible();
});

test('user can remove a product from the cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await productsPage.addProduct('Sauce Labs Onesie');
  await productsPage.openCart();

  await cartPage.removeFirstProduct();

  await expect(cartPage.items).toHaveCount(0);
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
});

test('empty cart displays no cart items', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await productsPage.openCart();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(cartPage.items).toHaveCount(0);
  await expect(page.getByText('Your Cart')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
});
