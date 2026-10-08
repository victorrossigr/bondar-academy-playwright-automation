import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com/')
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Dialog').click()
})

test('Open dialog', async ({ page }) => {
    const dialogComponentHeader = page.locator('nb-card-header', { hasText: 'This is a title passed to the dialog component' })
    const friendlyReminderHeader = page.locator('nb-card-header', { hasText: 'Friendly reminder' })

    await page.getByRole('button', { name: 'Open Dialog with component' }).click()
    await expect(dialogComponentHeader).toBeVisible()
    await page.getByRole('button', { name: 'Dismiss Dialog' }).click()
    await expect(dialogComponentHeader).not.toBeVisible()

    await page.getByRole('button', { name: 'Open Dialog with template' }).click()
    await expect(friendlyReminderHeader).toBeVisible()
    await page.getByRole('button', { name: 'Ok' }).click()
    await expect(friendlyReminderHeader).not.toBeVisible()
})

test('Open dialog with delay generated and improved', async ({ page }) => {
    const dialogDelaySection = page.locator('nb-card', { hasText: 'Open Dialog With Delay' })
    const friendlyReminderHeader = page.locator('nb-card-header', { hasText: 'Friendly reminder' })
    const modalTenSecondsMessage = page.locator('nb-card-body', { hasText: 'Dialog opened after a 10 second API call' })

    await page.getByRole('button', { name: 'Open with delay 3 seconds' }).click()
    await expect(dialogDelaySection.getByText(/Loading/)).toBeVisible()
    await expect(friendlyReminderHeader).toBeVisible({ timeout: 4500 })
    await page.getByRole('button', { name: 'OK' }).click()
    await expect(friendlyReminderHeader).not.toBeVisible()

    await page.getByRole('button', { name: 'Open with delay 10 seconds' }).click()
    await expect(dialogDelaySection.getByText(/Loading/)).toBeVisible()
    await expect(modalTenSecondsMessage).toBeVisible({ timeout: 11500 })
    await page.getByRole('button', { name: 'OK' }).click()
    await expect(modalTenSecondsMessage).not.toBeVisible()
})