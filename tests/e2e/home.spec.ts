import { test, expect } from '@playwright/test';

test.describe('home page', () => {
  test('renders hero, opens whoami modal, persists role selection', async ({ page }) => {
    await page.goto('/');

    // Hero text present
    await expect(page.getByRole('heading', { name: /hello/i })).toBeVisible({ timeout: 15000 });

    // WhoAmI modal should appear on first visit (cookie not set)
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Pick "recruiter"
    await page.getByRole('radio', { name: /recruiter/i }).check();
    await page.getByRole('button', { name: /continue|save|confirm/i }).click();

    // Modal closes
    await expect(modal).not.toBeVisible({ timeout: 5000 });

    // Section for recruiter should render (Career arc should be in the order)
    await expect(page.locator('section#career-arc')).toBeVisible({ timeout: 5000 });
  });

  test('navigates to a case study', async ({ page }) => {
    await page.goto('/work/agent-platform');
    await expect(page.getByRole('heading', { name: /enterprise agent platform/i })).toBeVisible({ timeout: 10000 });
  });

  test('404 page shows on bad route', async ({ page }) => {
    const res = await page.goto('/this-does-not-exist');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: /lost in the agent graph/i })).toBeVisible();
  });
});
