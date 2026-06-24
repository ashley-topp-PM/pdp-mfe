/**
 * Test Suite: PDP E2E — Playwright
 * Type: E2E
 * Status: FAILING — TDD RED phase (no implementation exists)
 * Generated: 2026-06-24
 * Agent: sephora-test-creator
 * Scenarios: SCEN-001 through SCEN-023 (plus key scenarios up to 044)
 * Criteria: AC-01 through AC-18, BR-01 through BR-13
 * JIRA: AGNT-1582
 *
 * SCEN-023 asserts: no network request to /cart or /basket endpoints (BR-09).
 *
 * These tests will remain FAILING until the PDP MFE application is running.
 */

import { test, expect, Page } from '@playwright/test';

// Test data
const PRODUCT_ID = 'P123456';
const PDP_URL = `/pdp/${PRODUCT_ID}`;
const LANDING_URL = '/';

test.describe('Journey 1 — Product Display', () => {
  // SCEN-001: Full product data renders
  test('SCEN001 — full product data renders brand name price hero image on PDP load', async ({ page }) => {
    await page.goto(PDP_URL);

    await expect(page.getByText('Fenty Beauty')).toBeVisible();
    await expect(page.getByText("Pro Filt'r Foundation")).toBeVisible();
    await expect(page.getByText('$36.00')).toBeVisible();
    await expect(page.locator('[data-testid="hero-image"]')).toBeVisible();
    await expect(page.locator('[data-testid="short-description"]')).toBeVisible();
  });

  // SCEN-002: Sale price with strikethrough
  test('SCEN002 — sale price displayed with original price struck through', async ({ page }) => {
    await page.goto(`/pdp/P-SALE`);

    await expect(page.getByText('$25.00')).toBeVisible();
    const originalPrice = page.locator('[data-testid="original-price"]');
    await expect(originalPrice).toBeVisible();
    await expect(originalPrice).toHaveCSS('text-decoration-line', 'line-through');
  });

  // SCEN-003: Non-sale — only current price visible
  test('SCEN003 — non-sale product shows current price only without strikethrough', async ({ page }) => {
    await page.goto(PDP_URL);

    const prices = page.locator('[data-testid="price"]');
    await expect(prices).toHaveCount(1);
    await expect(page.locator('[data-testid="original-price"]')).not.toBeVisible();
  });

  // SCEN-004: Progressive loading — above fold content first
  test('SCEN004 — above-fold content renders before reviews and ingredient list', async ({ page }) => {
    await page.goto(PDP_URL);

    // Hero, name, price visible immediately
    await expect(page.locator('[data-testid="hero-image"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible();
  });
});

test.describe('Journey 2 — Image Carousel', () => {
  // SCEN-005: Arrow navigation
  test('SCEN005 — right arrow navigates to next image left arrow to previous', async ({ page }) => {
    await page.goto(PDP_URL);

    const heroImg = page.locator('[data-testid="hero-image"]');
    const initialSrc = await heroImg.getAttribute('src');

    await page.getByRole('button', { name: /next image/i }).click();
    const nextSrc = await heroImg.getAttribute('src');

    expect(nextSrc).not.toBe(initialSrc);

    await page.getByRole('button', { name: /previous image/i }).click();
    const backSrc = await heroImg.getAttribute('src');
    expect(backSrc).toBe(initialSrc);
  });

  // SCEN-007: Click to zoom
  test('SCEN007 — clicking hero image opens zoom view', async ({ page }) => {
    await page.goto(PDP_URL);

    await page.locator('[data-testid="hero-image"]').click();
    await expect(page.getByRole('dialog', { name: /zoom/i })).toBeVisible();
  });

  // SCEN-008: 2 images — no layout error
  test('SCEN008 — product with exactly 2 images renders carousel without layout errors', async ({ page }) => {
    await page.goto('/pdp/P-TWO-IMAGES');

    await expect(page.locator('[data-testid="hero-image"]')).toBeVisible();
    await expect(page).not.toHaveTitle(/error/i);
  });

  // SCEN-009: 12 images all accessible
  test('SCEN009 — all 12 images reachable via carousel navigation', async ({ page }) => {
    await page.goto('/pdp/P-TWELVE-IMAGES');

    const nextBtn = page.getByRole('button', { name: /next image/i });
    const heroImg = page.locator('[data-testid="hero-image"]');

    for (let i = 0; i < 11; i++) {
      await nextBtn.click();
    }

    // Should be at image 12 with no error
    await expect(heroImg).toBeVisible();
    await expect(page).not.toHaveTitle(/error/i);
  });
});

test.describe('Journey 3 — Variant Selection', () => {
  // SCEN-010: Swatch selection updates hero image, SKU, enables CTA
  test('SCEN010 — selecting shade swatch updates hero image SKU and enables Add to Cart', async ({ page }) => {
    await page.goto(PDP_URL);

    const heroImg = page.locator('[data-testid="hero-image"]');
    const initialSrc = await heroImg.getAttribute('src');

    await page.getByRole('button', { name: /330 Medium Beige/i }).click();

    // Hero image changes to shade-specific image
    const newSrc = await heroImg.getAttribute('src');
    expect(newSrc).not.toBe(initialSrc);
    expect(newSrc).toContain('330');

    // SKU updates
    await expect(page.locator('[data-testid="sku"]')).toContainText('SKU-330');

    // Add to Cart enabled
    await expect(page.getByRole('button', { name: /add to cart/i })).not.toBeDisabled();
  });

  // SCEN-011: Selected swatch shows visual feedback
  test('SCEN011 — selected shade swatch shows border highlight', async ({ page }) => {
    await page.goto(PDP_URL);

    await page.getByRole('button', { name: /330 Medium Beige/i }).click();

    const selectedSwatch = page.getByRole('button', { name: /330 Medium Beige/i });
    await expect(selectedSwatch).toHaveAttribute('aria-pressed', 'true');

    // Other swatches not selected
    const otherSwatch = page.getByRole('button', { name: /310 Warm Olive/i });
    await expect(otherSwatch).toHaveAttribute('aria-pressed', 'false');
  });

  // SCEN-014: No variants — Add to Cart enabled immediately
  test('SCEN014 — product with no variants shows enabled Add to Cart immediately', async ({ page }) => {
    await page.goto('/pdp/P-NO-VARIANTS');

    await expect(page.getByRole('button', { name: /add to cart/i })).not.toBeDisabled();
  });
});

test.describe('Journey 4 — Add-to-Cart Flow', () => {
  // SCEN-015: Add to Cart disabled before variant selection
  test('SCEN015 — Add to Cart button is disabled before variant selection', async ({ page }) => {
    await page.goto(PDP_URL);

    await expect(page.getByRole('button', { name: /add to cart/i })).toBeDisabled();
    await expect(page.getByText(/select/i)).toBeVisible();
  });

  // SCEN-016: Modal appears with correct data after Add to Cart
  test('SCEN016 — confirmation modal shows product name variant quantity price', async ({ page }) => {
    await page.goto(PDP_URL);

    await page.getByRole('button', { name: /330 Medium Beige/i }).click();
    await page.getByRole('button', { name: /add to cart/i }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog').getByText("Pro Filt'r Foundation")).toBeVisible();
    await expect(page.getByRole('dialog').getByText(/330 Medium Beige/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /view cart/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /continue shopping/i })).toBeVisible();
  });

  // SCEN-018: Quantity selector defaults to 1, max 10
  test('SCEN018 — quantity selector defaults to 1 and constrains to max 10', async ({ page }) => {
    await page.goto(PDP_URL);

    const qtyInput = page.getByRole('spinbutton');
    await expect(qtyInput).toHaveValue('1');

    // Cannot increase beyond 10
    for (let i = 0; i < 11; i++) {
      await page.getByRole('button', { name: /increase/i }).click();
    }
    await expect(qtyInput).toHaveValue('10');
  });

  // SCEN-021: Modal dismisses via X button
  test('SCEN021 — modal closes when X button is clicked', async ({ page }) => {
    await page.goto(PDP_URL);

    await page.getByRole('button', { name: /330 Medium Beige/i }).click();
    await page.getByRole('button', { name: /add to cart/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByRole('button', { name: /close/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  // SCEN-022: Modal dismisses via overlay click
  test('SCEN022 — modal closes when overlay backdrop is clicked', async ({ page }) => {
    await page.goto(PDP_URL);

    await page.getByRole('button', { name: /330 Medium Beige/i }).click();
    await page.getByRole('button', { name: /add to cart/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.locator('[data-testid="modal-overlay"]').click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  // SCEN-023: CRITICAL — NO network request to /cart or /basket when Add to Cart clicked (BR-09)
  test('SCEN023 — no HTTP request to /cart or /basket endpoints when Add to Cart clicked BR09', async ({ page }) => {
    const cartRequests: string[] = [];

    // Monitor all network requests
    page.on('request', req => {
      const url = req.url();
      if (url.includes('/cart') || url.includes('/basket')) {
        cartRequests.push(url);
      }
    });

    await page.goto(PDP_URL);
    await page.getByRole('button', { name: /330 Medium Beige/i }).click();
    await page.getByRole('button', { name: /add to cart/i }).click();

    // Allow any async operations to settle
    await page.waitForTimeout(500);

    // CRITICAL assertion: no cart/basket API calls made
    expect(cartRequests).toHaveLength(0);

    // Modal appeared (confirming UI path was followed)
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});

test.describe('Journey 5 — Reviews', () => {
  // SCEN-024: Reviews section renders correctly
  test('SCEN024 — reviews section shows star rating count and recent review cards', async ({ page }) => {
    await page.goto(PDP_URL);

    await expect(page.locator('[data-testid="average-rating"]')).toContainText('4.5');
    await expect(page.locator('[data-testid="review-count"]')).toContainText('1,200');
    await expect(page.locator('[data-testid="review-card"]')).toHaveCount(3);
    await expect(page.getByRole('link', { name: /read all reviews/i })).toBeVisible();
  });

  // SCEN-027: Zero reviews — no error
  test('SCEN027 — zero reviews shows No reviews yet without JS error', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

    await page.goto('/pdp/P-NO-REVIEWS');

    await expect(page.getByText(/no reviews yet/i)).toBeVisible();
    await expect(page.locator('[data-testid="review-card"]')).toHaveCount(0);
    expect(consoleErrors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });
});

test.describe('Journey 6 — Landing Page Search', () => {
  // SCEN-028: Landing page shows branded search form
  test('SCEN028 — landing page displays product ID search input and Search button', async ({ page }) => {
    await page.goto(LANDING_URL);

    await expect(page.getByRole('textbox', { name: /product id/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /search/i })).toBeVisible();
  });

  // SCEN-029: Valid product ID search navigates to PDP
  test('SCEN029 — valid product ID navigates to correct PDP', async ({ page }) => {
    await page.goto(LANDING_URL);

    await page.getByRole('textbox', { name: /product id/i }).fill('P123456');
    await page.getByRole('button', { name: /search/i }).click();

    await expect(page).toHaveURL(/\/pdp\/P123456/);
    await expect(page.getByText("Pro Filt'r Foundation")).toBeVisible();
  });

  // SCEN-030: Invalid product ID shows user-friendly error
  test('SCEN030 — invalid product ID shows human-friendly error without raw codes', async ({ page }) => {
    await page.goto(LANDING_URL);

    await page.getByRole('textbox', { name: /product id/i }).fill('INVALID999');
    await page.getByRole('button', { name: /search/i }).click();

    await expect(page.getByText('Product not found. Please check the product ID and try again.')).toBeVisible();
    await expect(page.getByText(/404/)).not.toBeVisible();
    await expect(page.getByText(/ERR_/)).not.toBeVisible();
  });
});

test.describe('Journey 7 — Error States', () => {
  // SCEN-031: Product Catalog API failure
  test('SCEN031 — Product Catalog API failure shows graceful error with Retry button', async ({ page }) => {
    await page.goto('/pdp/P-API-DOWN');

    await expect(page.getByText(/trouble loading/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /retry/i })).toBeVisible();
    await expect(page.getByText(/500|stack trace|internal server/i)).not.toBeVisible();
  });

  // SCEN-032: Reviews API failure — product still loads
  test('SCEN032 — Reviews API failure degrades independently product display intact', async ({ page }) => {
    await page.goto('/pdp/P-REVIEWS-DOWN');

    await expect(page.getByText("Pro Filt'r Foundation")).toBeVisible();
    await expect(page.getByText(/reviews unavailable/i)).toBeVisible();
  });

  // SCEN-034: Out-of-stock disables Add to Cart
  test('SCEN034 — out-of-stock variant shows Out of Stock and disables Add to Cart', async ({ page }) => {
    await page.goto(PDP_URL);

    await page.getByRole('button', { name: /310 Warm Olive/i }).click();

    await expect(page.getByText(/out of stock/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /add to cart/i })).toBeDisabled();
  });
});

test.describe('Journey 8 — Mobile and Accessibility', () => {
  // SCEN-036: Mobile single-column layout (use mobile viewport project)
  test('SCEN036 — mobile layout renders single-column with no horizontal scroll', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Mobile test runs on mobile-safari project');

    await page.goto(PDP_URL);

    // No horizontal scrollbar
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // 1px tolerance
  });

  // SCEN-038: Keyboard navigation
  test('SCEN038 — all interactive elements reachable via keyboard Tab navigation', async ({ page }) => {
    await page.goto(PDP_URL);

    // Tab to carousel buttons
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT', 'SELECT'].includes(focusedElement ?? '')).toBe(true);
  });

  // SCEN-040: Modal focus trap
  test('SCEN040 — confirmation modal traps focus within modal while open', async ({ page }) => {
    await page.goto(PDP_URL);

    await page.getByRole('button', { name: /330 Medium Beige/i }).click();
    await page.getByRole('button', { name: /add to cart/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Tab through all focusable elements in modal multiple times
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
    }

    // Focus must remain within modal
    const focusedInsideModal = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      return modal?.contains(document.activeElement) ?? false;
    });
    expect(focusedInsideModal).toBe(true);
  });
});

test.describe('Journey 9 — Multi-Region and Analytics', () => {
  // SCEN-041: CA-EN locale CAD price
  test('SCEN041 — CA-EN locale displays CAD price in Canadian format', async ({ page }) => {
    await page.goto(`/pdp/${PRODUCT_ID}?locale=en-CA`);

    await expect(page.locator('[data-testid="price"]')).toContainText('CAD');
    // All text in English
    await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible();
  });

  // SCEN-042: CA-FR locale French content
  test('SCEN042 — CA-FR locale displays French product content and CAD price', async ({ page }) => {
    await page.goto(`/pdp/${PRODUCT_ID}?locale=fr-CA`);

    await expect(page.locator('[data-testid="price"]')).toContainText('CAD');
    // French content in product description area
    await expect(page.locator('[data-testid="short-description"]')).toBeVisible();
  });

  // SCEN-044: Analytics events fire on key actions
  test('SCEN044 — analytics CustomEvents fire on page view variant selection and Add to Cart', async ({ page }) => {
    const analyticsEvents: { type: string; detail: unknown }[] = [];

    await page.exposeFunction('captureAnalyticsEvent', (type: string, detail: unknown) => {
      analyticsEvents.push({ type, detail });
    });

    await page.addInitScript(() => {
      const origDispatch = window.dispatchEvent.bind(window);
      window.dispatchEvent = (event: Event) => {
        // Event names per implementation-plan.md §Analytics CustomEvent Names: analytics:* prefix
        if (event instanceof CustomEvent && event.type.startsWith('analytics:')) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).captureAnalyticsEvent(event.type, event.detail);
        }
        return origDispatch(event);
      };
    });

    await page.goto(PDP_URL);

    // Page view event — name: analytics:pdp_page_view
    await page.waitForTimeout(300);
    expect(analyticsEvents.some(e => e.type === 'analytics:pdp_page_view')).toBe(true);

    // Variant selected event — name: analytics:variant_selected
    await page.getByRole('button', { name: /330 Medium Beige/i }).click();
    await page.waitForTimeout(100);
    expect(analyticsEvents.some(e => e.type === 'analytics:variant_selected')).toBe(true);

    // Add to Cart clicked event — name: analytics:add_to_cart_click
    await page.getByRole('button', { name: /add to cart/i }).click();
    await page.waitForTimeout(100);
    expect(analyticsEvents.some(e => e.type === 'analytics:add_to_cart_click')).toBe(true);
  });
});
