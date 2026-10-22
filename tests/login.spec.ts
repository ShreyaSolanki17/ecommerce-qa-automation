import { test, expect } from '@playwright/test';

test('standard user can log in successfully', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByText('Products')).toBeVisible();
});

test('invalid credentials display an authentication error', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Username').fill('invalid_user');
  await page.getByLabel('Password').fill('invalid_password');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible();
});

test('empty credentials display a required username error', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Epic sadface: Username is required')).toBeVisible();
});

test('standard user can log out successfully', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory\.html/);

  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('button', { name: 'Logout' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByLabel('Username')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
});
