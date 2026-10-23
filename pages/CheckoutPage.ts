import { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async fillCustomerInformation(firstName: string, lastName: string, postalCode: string) {
    await this.page.getByLabel('First Name').fill(firstName);
    await this.page.getByLabel('Last Name').fill(lastName);
    await this.page.getByLabel('Zip/Postal Code').fill(postalCode);
  }

  async continue() {
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async finish() {
    await this.page.getByRole('button', { name: 'Finish' }).click();
  }
}
