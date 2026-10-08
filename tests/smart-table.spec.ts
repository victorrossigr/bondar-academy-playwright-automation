import { test, expect } from '@playwright/test';
import { table } from 'console';

test.beforeEach(async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com/')
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()
})

test('Excluding a row', async ({ page }) => {
    const tableRowByEmail = page.getByRole('row', { name: 'snow@gmail.com' })
    // selecting a row by a visible text on the table

    page.on('dialog', nativeDialog => {
        expect(nativeDialog.message()).toEqual('Are you sure you want to delete?')
        nativeDialog.accept()
    })
    // this method allow playwright to accept the browser's native dialog

    await tableRowByEmail.locator('.nb-trash').click()
    await expect(tableRowByEmail).not.toBeVisible()
})

test('Editing a row', async ({ page }) => {
    const tableRowById = page.getByRole('row').filter({ has: page.getByRole('cell').nth(1).getByText('10') })
    // selecting a row by a column specific value

    await tableRowById.locator('.nb-edit').click()
    await page.locator('tbody').getByPlaceholder('E-mail').fill('email@test.com')
    await page.locator('tbody').locator('.nb-checkmark').click()
    await expect(tableRowById.locator('td').nth(5)).toHaveText('email@test.com')
})

test('Validating the table filter', async ({ page }) => {
    const ages = ['20', '30', '40', '200']

    for (let age of ages) {
        await page.locator('th').getByPlaceholder('Age').fill(age)
        if (age == '200') {
            await expect(page.locator('tbody')).toContainText('No data found')
        } else {
            await expect(page.locator('tbody tr').first().getByRole('cell').nth(6)).toHaveText(age)
            const allTableRows = await page.locator('tbody tr').all()
            for (let row of allTableRows) {
                await expect(row.locator('td').last()).toHaveText(age)
            }
        }
    }
})