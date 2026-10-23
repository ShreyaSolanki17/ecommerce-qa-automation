import { Locator, Page } from '@playwright/test';

export class ProductsPage {
  readonly products: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(private readonly page: Page) {
    this.products = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
  }

  productByName(name: string) {
    return this.products.filter({ hasText: name });
  }

  async addProduct(name: string) {
    await this.productByName(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async sortBy(value: 'za' | 'lohi' | 'hilo') {
    await this.page.getByRole('combobox', { name: 'Sort' }).selectOption(value);
  }

  async openFirstProduct() {
    const firstProduct = this.products.first();
    const name = await firstProduct.locator('.inventory_item_name').textContent();
    await firstProduct.locator('.inventory_item_name').click();
    return name;
  }

  async backToProducts() {
    await this.page.getByRole('button', { name: 'Back to products' }).click();
  }

  async openCart() {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
  }
}
