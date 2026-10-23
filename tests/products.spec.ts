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

test('inventory products can be sorted by name and price', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  const sort = page.getByRole('combobox', { name: 'Sort' });
  const productNames = page.locator('.inventory_item_name');
  const productPrices = page.locator('.inventory_item_price');
  await expect(page.locator('.inventory_item')).toHaveCount(6);
  const originalNames = await productNames.allTextContents();
  const originalPrices = await productPrices.allTextContents();

  await sort.selectOption('za');
  await expect(productNames).toHaveText([...originalNames].sort((first, second) => second.localeCompare(first)));

  await sort.selectOption('lohi');
  await expect(productPrices).toHaveText(
    [...originalPrices].sort(
      (first, second) => Number.parseFloat(first.slice(1)) - Number.parseFloat(second.slice(1)),
    ),
  );

  await sort.selectOption('hilo');
  await expect(productPrices).toHaveText(
    [...originalPrices].sort(
      (first, second) => Number.parseFloat(second.slice(1)) - Number.parseFloat(first.slice(1)),
    ),
  );
});

test('user can open a product and return to the inventory page', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  const firstProduct = page.locator('.inventory_item').first();
  const productName = await firstProduct.locator('.inventory_item_name').textContent();
  await firstProduct.locator('.inventory_item_name').click();

  await expect(page).toHaveURL(/inventory-item\.html\?id=/);
  await expect(page.locator('.inventory_details_name')).toHaveText(productName ?? '');
  await expect(page.getByRole('button', { name: 'Back to products' })).toBeVisible();

  await page.getByRole('button', { name: 'Back to products' }).click();
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByText('Products')).toBeVisible();
});
