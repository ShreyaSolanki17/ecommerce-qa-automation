import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

async function addBackpackAndOpenCheckout(page: import('@playwright/test').Page) {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await productsPage.addProduct('Sauce Labs Backpack');
  await productsPage.openCart();
  await cartPage.checkout();

  await expect(page).toHaveURL(/checkout-step-one\.html/);
}

test('checkout requires customer information', async ({ page }) => {
  await addBackpackAndOpenCheckout(page);

  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByText('Error: First Name is required')).toBeVisible();
});

test('checkout displays the order summary and calculated totals', async ({ page }) => {
  await addBackpackAndOpenCheckout(page);

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillCustomerInformation('Test', 'Customer', '12345');
  await checkoutPage.continue();

  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.locator('.summary_subtotal_label')).toHaveText('Item total: $29.99');
  await expect(page.locator('.summary_tax_label')).toHaveText('Tax: $2.40');
  await expect(page.locator('.summary_total_label')).toHaveText('Total: $32.39');
});

test('user can complete checkout successfully', async ({ page }) => {
  await addBackpackAndOpenCheckout(page);

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillCustomerInformation('Test', 'Customer', '12345');
  await checkoutPage.continue();
  await checkoutPage.finish();

  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(page.getByText('Thank you for your order!')).toBeVisible();
});