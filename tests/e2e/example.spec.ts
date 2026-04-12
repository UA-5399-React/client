import { expect, test } from '@playwright/test';

test('user can browse, filter, add to cart', async ({ page }) => {
  await page.goto('/');

  const firstProduct = page.getByRole('img').first();
  await expect(firstProduct).toBeVisible();
  await firstProduct.click();

  await page.waitForLoadState('networkidle');
  await page.getByRole('button').first().click();

  await page.getByRole('banner').getByRole('link', { name: 'Shop' }).click();
  await expect(page).toHaveURL(/\/shop/);

  await page.getByRole('combobox', { name: 'Categories' }).click();
  await page.getByText('Laptop', { exact: true }).click();
  //await page.getByRole('combobox', { name: 'Categories' }).click();

  await page.getByRole('combobox', { name: 'Price' }).click();
  await page.getByText('Under $').click();
  //await page.getByRole('combobox', { name: 'Price' }).click();

  await page.getByRole('button', { name: 'Add to Cart' }).first().click();
  await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
});

test('user can login', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('banner')).toBeVisible();
  await page.getByRole('button', { name: 'User' }).click();
  await expect(page).toHaveURL(/\/login/);
  await expect(
    page.getByRole('img', { name: 'TechnoWorld STORE Logo' }),
  ).toBeVisible();

  await page
    .getByRole('textbox', { name: 'Your email address' })
    .fill('customer@test.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('customer123');
  await page.getByRole('button', { name: 'Show password' }).click();

  await expect(
    page.getByRole('textbox', { name: 'Your email address' }),
  ).toHaveValue('customer@test.com');
  await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue(
    'customer123',
  );

  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/\/shop/); // ← re-enabled, mock always succeeds
});
