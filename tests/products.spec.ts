import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test('inventory page displays products with prices and add-to-cart buttons', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory\.html/);

  await expect(productsPage.products).toHaveCount(6);

  for (let index = 0; index < await productsPage.products.count(); index++) {
    const product = productsPage.products.nth(index);

    await expect(product.locator('.inventory_item_name')).toBeVisible();
    await expect(product.locator('.inventory_item_price')).toBeVisible();
    await expect(product.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  }
});

test('inventory products can be sorted by name and price', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(productsPage.products).toHaveCount(6);
  const originalNames = await productsPage.productNames.allTextContents();
  const originalPrices = await productsPage.productPrices.allTextContents();

  await productsPage.sortBy('za');
  await expect(productsPage.productNames).toHaveText(
    [...originalNames].sort((first, second) => second.localeCompare(first)),
  );

  await productsPage.sortBy('lohi');
  await expect(productsPage.productPrices).toHaveText(
    [...originalPrices].sort(
      (first, second) => Number.parseFloat(first.slice(1)) - Number.parseFloat(second.slice(1)),
    ),
  );

  await productsPage.sortBy('hilo');
  await expect(productsPage.productPrices).toHaveText(
    [...originalPrices].sort(
      (first, second) => Number.parseFloat(second.slice(1)) - Number.parseFloat(first.slice(1)),
    ),
  );
});

test('user can open a product and return to the inventory page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  const productName = await productsPage.openFirstProduct();

  await expect(page).toHaveURL(/inventory-item\.html\?id=/);
  await expect(page.locator('.inventory_details_name')).toHaveText(productName ?? '');
  await expect(page.getByRole('button', { name: 'Back to products' })).toBeVisible();

  await productsPage.backToProducts();
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByText('Products')).toBeVisible();
});
