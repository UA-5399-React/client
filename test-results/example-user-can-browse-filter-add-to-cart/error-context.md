# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: example.spec.ts >> user can browse, filter, add to cart
- Location: tests\e2e\example.spec.ts:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('combobox', { name: 'Categories' })

```

# Page snapshot

```yaml
- generic [ref=e2]:
    - generic [ref=e3]:
        - banner [ref=e4]:
            - generic [ref=e5]:
                - link "TechnoWorld" [ref=e6] [cursor=pointer]:
                    - /url: /
                    - img "TechnoWorld" [ref=e7]
                - navigation [ref=e8]:
                    - list [ref=e9]:
                        - listitem [ref=e10]:
                            - link "Home" [ref=e11] [cursor=pointer]:
                                - /url: /
                        - listitem [ref=e12]:
                            - link "Shop" [active] [ref=e13] [cursor=pointer]:
                                - /url: /shop
                        - listitem [ref=e14]:
                            - link "Product" [ref=e15] [cursor=pointer]:
                                - /url: /product/:id
                        - listitem [ref=e16]:
                            - link "Contact Us" [ref=e17] [cursor=pointer]:
                                - /url: /contact
                - generic [ref=e18]:
                    - generic [ref=e19]:
                        - generic [ref=e21]:
                            - img
                            - textbox "Search" [ref=e22]
                        - button "Search" [ref=e23] [cursor=pointer]:
                            - img [ref=e24]
                    - button "User" [ref=e27] [cursor=pointer]:
                        - img [ref=e28]
                    - button "Theme" [ref=e32] [cursor=pointer]:
                        - img [ref=e33]
                    - button "Cart" [ref=e35] [cursor=pointer]:
                        - img [ref=e36]
        - main [ref=e39]:
            - generic [ref=e40]: Something went wrong.
        - contentinfo [ref=e41]:
            - generic [ref=e42]:
                - generic [ref=e43]:
                    - link "TechnoWorld" [ref=e44] [cursor=pointer]:
                        - /url: /
                        - img "TechnoWorld" [ref=e45]
                    - generic [ref=e47]: Gift & Decoration Store
                - navigation [ref=e48]:
                    - list [ref=e49]:
                        - listitem [ref=e50]:
                            - link "Home" [ref=e51] [cursor=pointer]:
                                - /url: /
                        - listitem [ref=e52]:
                            - link "Shop" [ref=e53] [cursor=pointer]:
                                - /url: /shop
                        - listitem [ref=e54]:
                            - link "Product" [ref=e55] [cursor=pointer]:
                                - /url: /product/:id
                        - listitem [ref=e56]:
                            - link "Blog" [ref=e57] [cursor=pointer]:
                                - /url: /blog
                        - listitem [ref=e58]:
                            - link "Contact Us" [ref=e59] [cursor=pointer]:
                                - /url: /contact
            - generic [ref=e61]:
                - generic [ref=e62]:
                    - generic [ref=e63]: Copyright © 2026 TechnoWorld. All rights reserved
                    - generic [ref=e64]:
                        - link "Privacy Policy" [ref=e65] [cursor=pointer]:
                            - /url: /shop
                        - link "Terms of Use" [ref=e66] [cursor=pointer]:
                            - /url: /shop
                - generic [ref=e67]:
                    - link [ref=e68] [cursor=pointer]:
                        - /url: /shop
                        - img [ref=e69]
                    - link [ref=e72] [cursor=pointer]:
                        - /url: /shop
                        - img [ref=e73]
                    - link [ref=e75] [cursor=pointer]:
                        - /url: /shop
                        - img [ref=e76]
    - generic [ref=e79]:
        - img [ref=e81]
        - button "Open Tanstack query devtools" [ref=e129] [cursor=pointer]:
            - img [ref=e130]
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  |
  3  | test('user can browse, filter, add to cart', async ({ page }) => {
  4  |   await page.goto('http://localhost:5173/');
  5  |
  6  |   const firstProduct = page.getByRole('img').first();
  7  |   await expect(firstProduct).toBeVisible();
  8  |   await firstProduct.click();
  9  |
  10 |   await page.waitForLoadState('networkidle');
  11 |
  12 |   await page.getByRole('button').first().click();
  13 |
  14 |   await page.getByRole('banner').getByRole('link', { name: 'Shop' }).click();
  15 |   await expect(page).toHaveURL(/\/shop/);
  16 |
> 17 |   await page.getByRole('combobox', { name: 'Categories' }).click();
     |                                                            ^ Error: locator.click: Test timeout of 30000ms exceeded.
  18 |   await page.getByText('Laptop', { exact: true }).click();
  19 |   await page.getByRole('combobox', { name: 'Price' }).click();
  20 |   await page.getByText('Under $').click();
  21 |   await expect(page.locator('text=Laptop')).toBeVisible();
  22 |
  23 |   await page.getByRole('button', { name: 'Add to Cart' }).first().click();
  24 |   await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
  25 | });
  26 |
  27 | test('user can login', async ({ page }) => {
  28 |   await page.goto('http://localhost:5173/');
  29 |   await expect(page.getByRole('banner')).toBeVisible();
  30 |   await page.getByRole('button', { name: 'User' }).click();
  31 |   await expect(page).toHaveURL(/\/login/);
  32 |   await expect(page.locator('div').nth(4)).toBeVisible();
  33 |   await expect(
  34 |     page.getByRole('img', { name: 'TechnoWorld STORE Logo' }),
  35 |   ).toBeVisible();
  36 |   await page.getByRole('textbox', { name: 'Your email address' }).click();
  37 |   await page
  38 |     .getByRole('textbox', { name: 'Your email address' })
  39 |     .fill('customer@test.com');
  40 |   await page.getByRole('textbox', { name: 'Password' }).click();
  41 |   await page.getByRole('textbox', { name: 'Password' }).fill('customer123');
  42 |   await page.getByRole('button', { name: 'Show password' }).click();
  43 |   await expect(
  44 |     page.getByRole('textbox', { name: 'Your email address' }),
  45 |   ).toHaveValue('customer@test.com');
  46 |   await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue(
  47 |     'customer123',
  48 |   );
  49 |   await page.getByRole('button', { name: 'Sign In' }).click();
  50 |   //await expect(page).toHaveURL(/\/shop/);
  51 | });
  52 |
```
