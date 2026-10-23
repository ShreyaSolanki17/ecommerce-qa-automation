import { test, expect } from '@playwright/test';

async function addBackpackAndOpenCheckout(page: import('@playwright/test').Page) {
  await page.goto('/');

  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.locator('.inventory_item')
    .filter({ hasText: 'Sauce Labs Backpack' })
    .getByRole('button', { name: 'Add to cart' })
    .click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.getByRole('button', { name: 'Checkout' }).click();

  await expect(page).toHaveURL(/checkout-step-one\.html/);
}

test('checkout requires customer information', async ({ page }) => {
  await addBackpackAndOpenCheckout(page);

  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByText('Error: First Name is required')).toBeVisible();
});

test('checkout displays the order summary and calculated totals', async ({ page }) => {
  await addBackpackAndOpenCheckout(page);

  await page.getByLabel('First Name').fill('Test');
  await page.getByLabel('Last Name').fill('Customer');
  await page.getByLabel('Zip/Postal Code').fill('12345');
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.locator('.summary_subtotal_label')).toHaveText('Item total: $29.99');
  await expect(page.locator('.summary_tax_label')).toHaveText('Tax: $2.40');
  await expect(page.locator('.summary_total_label')).toHaveText('Total: $32.39');
});

test('user can complete checkout successfully', async ({ page }) => {
  await addBackpackAndOpenCheckout(page);

  await page.getByLabel('First Name').fill('Test');
  await page.getByLabel('Last Name').fill('Customer');
  await page.getByLabel('Zip/Postal Code').fill('12345');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Finish' }).click();

  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(page.getByText('Thank you for your order!')).toBeVisible();
});