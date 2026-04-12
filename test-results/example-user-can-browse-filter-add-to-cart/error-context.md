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
  - waiting for getByRole('combobox', { name: 'Price' })
    - locator resolved to <button tabindex="0" type="button" role="combobox" id="base-ui-_r_7_" data-border="true" data-placeholder="" aria-expanded="false" aria-haspopup="listbox" class="_Select_f99ej_49" aria-labelledby="base-ui-_r_8_">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div role="presentation" data-base-ui-inert=""></div> from <div id="_r_h_" data-base-ui-portal="">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div role="presentation" data-base-ui-inert=""></div> from <div id="_r_h_" data-base-ui-portal="">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    26 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div role="presentation" data-base-ui-inert=""></div> from <div id="_r_h_" data-base-ui-portal="">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

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
                            - link "Shop" [ref=e13] [cursor=pointer]:
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
            - generic [ref=e40]:
                - img "Shop Banner Background" [ref=e42]
                - generic [ref=e43]:
                    - generic [ref=e45]:
                        - generic [ref=e46]:
                            - generic [ref=e47]: Categories
                            - combobox "Categories" [expanded] [ref=e48]:
                                - generic [ref=e49]: Laptop
                                - img [ref=e51]
                            - listbox [ref=e55]:
                                - option "Laptop" [active] [selected] [ref=e56]:
                                    - generic [ref=e57]: Laptop
                                    - img [ref=e59]
                                - option "Smartphone" [ref=e61]:
                                    - generic [ref=e62]: Smartphone
                                - option "Audio" [ref=e63]:
                                    - generic [ref=e64]: Audio
                                - option "Accessories" [ref=e65]:
                                    - generic [ref=e66]: Accessories
                                - option "Gaming" [ref=e67]:
                                    - generic [ref=e68]: Gaming
                                - option "Apple" [ref=e69]:
                                    - generic [ref=e70]: Apple
                                - option "Samsungbvjhv" [ref=e71]:
                                    - generic [ref=e72]: Samsungbvjhv
                                - option "Gaming Laptops" [ref=e73]:
                                    - generic [ref=e74]: Gaming Laptops
                                - option "Ultrabooks" [ref=e75]:
                                    - generic [ref=e76]: Ultrabooks
                                - option "Business Laptops" [ref=e77]:
                                    - generic [ref=e78]: Business Laptops
                                - option "2-in-1 Laptops" [ref=e79]:
                                    - generic [ref=e80]: 2-in-1 Laptops
                                - option "Android Phones" [ref=e81]:
                                    - generic [ref=e82]: Android Phones
                                - option "iPhones" [ref=e83]:
                                    - generic [ref=e84]: iPhones
                                - option "Budget Phones" [ref=e85]:
                                    - generic [ref=e86]: Budget Phones
                                - option "Foldable Phones" [ref=e87]:
                                    - generic [ref=e88]: Foldable Phones
                                - option "Over-Ear Headphones" [ref=e89]:
                                    - generic [ref=e90]: Over-Ear Headphones
                                - option "In-Ear Headphones" [ref=e91]:
                                    - generic [ref=e92]: In-Ear Headphones
                                - option "Bluetooth Speakers" [ref=e93]:
                                    - generic [ref=e94]: Bluetooth Speakers
                                - option "Soundbars" [ref=e95]:
                                    - generic [ref=e96]: Soundbars
                                - option "Chargers & Cables" [ref=e97]:
                                    - generic [ref=e98]: Chargers & Cables
                                - option "Phone Cases" [ref=e99]:
                                    - generic [ref=e100]: Phone Cases
                                - option "Screen Protectors" [ref=e101]:
                                    - generic [ref=e102]: Screen Protectors
                                - option "Laptop Bags" [ref=e103]:
                                    - generic [ref=e104]: Laptop Bags
                                - option "Consoles" [ref=e105]:
                                    - generic [ref=e106]: Consoles
                                - option "Gaming Mice" [ref=e107]:
                                    - generic [ref=e108]: Gaming Mice
                                - option "Mechanical Keyboards" [ref=e109]:
                                    - generic [ref=e110]: Mechanical Keyboards
                                - option "Gaming Headsets" [ref=e111]:
                                    - generic [ref=e112]: Gaming Headsets
                                - option "iPhone" [ref=e113]:
                                    - generic [ref=e114]: iPhone
                                - option "MacBook" [ref=e115]:
                                    - generic [ref=e116]: MacBook
                                - option "iPad" [ref=e117]:
                                    - generic [ref=e118]: iPad
                                - option "Apple Watch" [ref=e119]:
                                    - generic [ref=e120]: Apple Watch
                                - option "Galaxy S Series" [ref=e121]:
                                    - generic [ref=e122]: Galaxy S Series
                                - option "Galaxy A Series" [ref=e123]:
                                    - generic [ref=e124]: Galaxy A Series
                                - option "bvcgfc" [ref=e125]:
                                    - generic [ref=e126]: bvcgfc
                            - textbox [ref=e129]: '["69bac23ba14eeb49cb2ed80b"]'
                        - generic [ref=e130]:
                            - generic [ref=e131]: Price
                            - combobox "Price" [ref=e132]:
                                - generic [ref=e133]: All Price
                                - img [ref=e135]
                            - textbox [ref=e137]
                    - generic [ref=e138]:
                        - generic [ref=e140]:
                            - combobox [ref=e141]:
                                - generic [ref=e142]: Sort by title
                                - img [ref=e144]
                            - textbox [ref=e146]
                        - generic [ref=e147]:
                            - generic "grid-5" [ref=e148]:
                                - img [ref=e149]
                            - generic "grid-4" [ref=e151]:
                                - img [ref=e152]
                - generic [ref=e154]:
                    - generic [ref=e156]:
                        - link "Frozen Steel Table" [ref=e157] [cursor=pointer]:
                            - /url: /product/69bac23ba14eeb49cb2ed843
                            - img "Frozen Steel Table" [ref=e158]
                            - button "Add to Cart" [ref=e160]
                            - button "Add to wishlist" [ref=e161]:
                                - img [ref=e162]
                        - generic [ref=e164]:
                            - heading "Frozen Steel Table" [level=3] [ref=e165]
                            - generic [ref=e166]: $183.79
                    - generic [ref=e168]:
                        - link "Modern Aluminum Shirt" [ref=e169] [cursor=pointer]:
                            - /url: /product/69bac23ba14eeb49cb2ed83f
                            - img "Modern Aluminum Shirt" [ref=e170]
                            - button "Add to Cart" [ref=e172]
                            - button "Add to wishlist" [ref=e173]:
                                - img [ref=e174]
                        - generic [ref=e176]:
                            - heading "Modern Aluminum Shirt" [level=3] [ref=e177]
                            - generic [ref=e178]: $640.95
                    - generic [ref=e180]:
                        - link "Refined Wooden Cheese" [ref=e181] [cursor=pointer]:
                            - /url: /product/69bac23ba14eeb49cb2ed849
                            - img "Refined Wooden Cheese" [ref=e182]
                            - button "Add to Cart" [ref=e184]
                            - button "Add to wishlist" [ref=e185]:
                                - img [ref=e186]
                        - generic [ref=e188]:
                            - heading "Refined Wooden Cheese" [level=3] [ref=e189]
                            - generic [ref=e190]: $246.15
                - generic [ref=e191]:
                    - button [disabled] [ref=e192]:
                        - img [ref=e193]
                    - button "1" [ref=e195] [cursor=pointer]
                    - button [disabled] [ref=e196]:
                        - img [ref=e197]
        - contentinfo [ref=e199]:
            - generic [ref=e200]:
                - generic [ref=e201]:
                    - link "TechnoWorld" [ref=e202] [cursor=pointer]:
                        - /url: /
                        - img "TechnoWorld" [ref=e203]
                    - generic [ref=e205]: Gift & Decoration Store
                - navigation [ref=e206]:
                    - list [ref=e207]:
                        - listitem [ref=e208]:
                            - link "Home" [ref=e209] [cursor=pointer]:
                                - /url: /
                        - listitem [ref=e210]:
                            - link "Shop" [ref=e211] [cursor=pointer]:
                                - /url: /shop
                        - listitem [ref=e212]:
                            - link "Product" [ref=e213] [cursor=pointer]:
                                - /url: /product/:id
                        - listitem [ref=e214]:
                            - link "Blog" [ref=e215] [cursor=pointer]:
                                - /url: /blog
                        - listitem [ref=e216]:
                            - link "Contact Us" [ref=e217] [cursor=pointer]:
                                - /url: /contact
            - generic [ref=e219]:
                - generic [ref=e220]:
                    - generic [ref=e221]: Copyright © 2026 TechnoWorld. All rights reserved
                    - generic [ref=e222]:
                        - link "Privacy Policy" [ref=e223] [cursor=pointer]:
                            - /url: /shop
                        - link "Terms of Use" [ref=e224] [cursor=pointer]:
                            - /url: /shop
                - generic [ref=e225]:
                    - link [ref=e226] [cursor=pointer]:
                        - /url: /shop
                        - img [ref=e227]
                    - link [ref=e230] [cursor=pointer]:
                        - /url: /shop
                        - img [ref=e231]
                    - link [ref=e233] [cursor=pointer]:
                        - /url: /shop
                        - img [ref=e234]
    - generic [ref=e237]:
        - img [ref=e239]
        - button "Open Tanstack query devtools" [ref=e287] [cursor=pointer]:
            - img [ref=e288]
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  |
  3  | test('user can browse, filter, add to cart', async ({ page }) => {
  4  |   await page.goto('/');
  5  |
  6  |   const firstProduct = page.getByRole('img').first();
  7  |   await expect(firstProduct).toBeVisible();
  8  |   await firstProduct.click();
  9  |
  10 |   await page.waitForLoadState('networkidle');
  11 |   await page.getByRole('button').first().click();
  12 |
  13 |   await page.getByRole('banner').getByRole('link', { name: 'Shop' }).click();
  14 |   await expect(page).toHaveURL(/\/shop/);
  15 |
  16 |   await page.getByRole('combobox', { name: 'Categories' }).click();
  17 |   await page.getByText('Laptop', { exact: true }).click();
  18 |   //await page.getByRole('combobox', { name: 'Categories' }).click();
  19 |
> 20 |   await page.getByRole('combobox', { name: 'Price' }).click();
     |                                                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
  21 |   await page.getByText('Under $').click();
  22 |   //await page.getByRole('combobox', { name: 'Price' }).click();
  23 |
  24 |   await page.getByRole('button', { name: 'Add to Cart' }).first().click();
  25 |   await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
  26 | });
  27 |
  28 | test('user can login', async ({ page }) => {
  29 |   await page.goto('/');
  30 |   await expect(page.getByRole('banner')).toBeVisible();
  31 |   await page.getByRole('button', { name: 'User' }).click();
  32 |   await expect(page).toHaveURL(/\/login/);
  33 |   await expect(
  34 |     page.getByRole('img', { name: 'TechnoWorld STORE Logo' }),
  35 |   ).toBeVisible();
  36 |
  37 |   await page
  38 |     .getByRole('textbox', { name: 'Your email address' })
  39 |     .fill('customer@test.com');
  40 |   await page.getByRole('textbox', { name: 'Password' }).fill('customer123');
  41 |   await page.getByRole('button', { name: 'Show password' }).click();
  42 |
  43 |   await expect(
  44 |     page.getByRole('textbox', { name: 'Your email address' }),
  45 |   ).toHaveValue('customer@test.com');
  46 |   await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue(
  47 |     'customer123',
  48 |   );
  49 |
  50 |   await page.getByRole('button', { name: 'Sign In' }).click();
  51 |   await expect(page).toHaveURL(/\/shop/); // ← re-enabled, mock always succeeds
  52 | });
  53 |
```
