import { test, expect } from '@playwright/test';

test('inventory page displays products with prices and add-to-cart buttons', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/inventory\.html/);

  const products = page.locator('.inventory_item');
  await expect(products).toHaveCount(6);

  for (let index = 0; index < await products.count(); index++) {
    const product = products.nth(index);

    await expect(product.locator('.inventory_item_name')).toBeVisible();
    await expect(product.locator('.inventory_item_price')).toBeVisible();
    await expect(product.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  }
});
