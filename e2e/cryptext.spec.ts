import { test, expect } from '@playwright/test'

test.describe('CrypText mode select', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/unscramble')
  })

  test('shows CRYPTEXT heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'CRYPTEXT' })).toBeVisible()
  })

  test('shows all three play modes', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^Daily/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /^Random/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /^Unlimited/ })).toBeVisible()
  })

  test('shows timed and untimed difficulty options', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^Timed/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /^Untimed/ })).toBeVisible()
  })

  test('All Games button navigates back to home', async ({ page }) => {
    await page.getByText('← All Games').click()
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: 'Mosaic Mind' })).toBeVisible()
  })

  test('selecting a mode highlights it', async ({ page }) => {
    await page.getByText('Random').click()
    const randomBtn = page.getByRole('button', { name: /Random/ })
    await expect(randomBtn).toHaveClass(/shadow-md/)
  })
})

test.describe('CrypText gameplay', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any saved progress so we always start fresh
    await page.goto('/unscramble')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/unscramble')
  })

  test('starts a random untimed game', async ({ page }) => {
    await page.getByText('Random').click()
    await page.getByText('Untimed').click()
    await page.getByText('Start Game').click()
    await expect(page.getByText(/^Word \d+ \//)).toBeVisible()
    await expect(page.getByText(/^Score/)).toBeVisible()
  })

  test('shows scrambled word tiles on game screen', async ({ page }) => {
    await page.getByText('Random').click()
    await page.getByText('Untimed').click()
    await page.getByText('Start Game').click()
    // Scrambled tiles should be visible
    const tiles = page.locator('.rounded-xl').first()
    await expect(tiles).toBeVisible()
  })

  test('Home button returns to mode select', async ({ page }) => {
    await page.getByText('Random').click()
    await page.getByText('Untimed').click()
    await page.getByText('Start Game').click()
    await page.getByText('⌂ Game Home').click()
    await expect(page.getByRole('heading', { name: 'CRYPTEXT' })).toBeVisible()
  })
})
