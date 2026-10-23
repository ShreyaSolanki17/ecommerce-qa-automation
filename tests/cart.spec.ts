import { test, expect } from '@playwright/test';

test('user can add a product and verify its cart details', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  const product = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
  const productName = await product.locator('.inventory_item_name').textContent();
  const productPrice = await product.locator('.inventory_item_price').textContent();

  await product.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/cart\.html/);

  const cartItem = page.locator('.cart_item');
  await expect(cartItem).toHaveCount(1);
  await expect(cartItem.locator('.inventory_item_name')).toHaveText(productName ?? '');
  await expect(cartItem.locator('.inventory_item_price')).toHaveText(productPrice ?? '');
  await expect(cartItem.locator('.cart_quantity')).toHaveText('1');
});

test('cart contents persist when navigating back to products', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Bike Light' })
    .getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.getByRole('button', { name: 'Continue Shopping' }).click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  await expect(
    page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Bike Light' })
      .getByRole('button', { name: 'Remove' }),
  ).toBeVisible();
});

test('user can remove a product from the cart', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Onesie' })
    .getByRole('button', { name: 'Add to cart' }).click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  await page.locator('.cart_item').getByRole('button', { name: 'Remove' }).click();

  await expect(page.locator('.cart_item')).toHaveCount(0);
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
});

test('empty cart displays no cart items', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(page.locator('.cart_item')).toHaveCount(0);
  await expect(page.getByText('Your Cart')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
});
