import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('standard user can log in successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByText('Products')).toBeVisible();
});

test('invalid credentials display an authentication error', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('invalid_user', 'invalid_password');

  await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible();
});

test('empty credentials display a required username error', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Epic sadface: Username is required')).toBeVisible();
});

test('standard user can log out successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory\.html/);

  await loginPage.logout();

  await expect(page).toHaveURL('/');
  await expect(page.getByLabel('Username')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
});
