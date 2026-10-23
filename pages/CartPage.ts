import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly items: Locator;

  constructor(private readonly page: Page) {
    this.items = page.locator('.cart_item');
  }

  async continueShopping() {
    await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
  }

  async removeFirstProduct() {
    await this.items.first().getByRole('button', { name: 'Remove' }).click();
  }

  async checkout() {
    await this.page.getByRole('button', { name: 'Checkout' }).click();
  }
}
