import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test('shows Mosaic Mind heading', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Mosaic Mind' })).toBeVisible()
  })

  test('shows CrypText game tile', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'CrypText' })).toBeVisible()
  })

  test('shows coming soon tiles', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Wordle' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Crossword', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Sudoku', exact: true })).toBeVisible()
  })

  test('clicking CrypText tile navigates to game', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('heading', { name: 'CrypText' }).click()
    await expect(page).toHaveURL('/unscramble')
    await expect(page.getByRole('heading', { name: 'CRYPTEXT' })).toBeVisible()
  })
})
