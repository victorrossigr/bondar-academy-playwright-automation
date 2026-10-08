import { test, expect } from '@playwright/test';
import { NavigationPage } from '../page-objects/navigation-page';

test.beforeEach(async ({ page }) => {
    const navigatoTo = new NavigationPage(page)
    await page.goto('https://playground.bondaracademy.com/')
    await navigatoTo.formLayoutsPage()
})

test('Inline form', async ({ page }) => {
    const inlineFormSection = page.getByText('Inline Form').locator('..')
    await page.getByPlaceholder('Jane Doe').fill('Victor Rossi')
    expect(page.getByPlaceholder('Jane Doe')).toHaveValue('Victor Rossi')

    await inlineFormSection.getByPlaceholder('Email').fill('email@test.com')
    expect(inlineFormSection.getByPlaceholder('Email')).toHaveValue('email@test.com')

    await inlineFormSection.getByRole('checkbox', { name: 'Remember me' }).check({ force: true })
    expect(inlineFormSection.getByRole('checkbox', { name: 'Remember me' })).toBeChecked()

    await inlineFormSection.getByRole('button').click()
    expect(inlineFormSection.locator('form')).toHaveClass(/ng-submitted/)
})

test('Using the grid', async ({ page }) => {
    const usingGridSection = page.locator('nb-card').filter({ hasText: 'Using the Grid' })

    await usingGridSection.getByPlaceholder('Email').fill('email@text.com')
    expect(usingGridSection.getByPlaceholder('Email')).toHaveValue('email@text.com')

    await usingGridSection.getByPlaceholder('Password').fill('senha_teste123')
    expect(usingGridSection.getByPlaceholder('Password')).toHaveValue('senha_teste123')

    // await usingGridSection.getByRole('radio', {name: 'Option 1'}).click({force: true})
    await usingGridSection.getByText('Option 1').click()
    expect(usingGridSection.getByText('Option 1')).toBeTruthy()

    expect(usingGridSection.locator('form')).toHaveClass('ng-untouched ng-pristine ng-valid')
    await usingGridSection.getByRole('button').click()
    expect(usingGridSection.locator('form')).toHaveClass(/ng-submitted/)
})

test('Basic form generated and clean', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email address' }).fill('email@test.com')
    await page.locator('#exampleInputPassword1').fill('senha_teste123')
    await page.locator('.form-group > .status-basic > .label > .custom-checkbox').click()
    await page.getByRole('checkbox', { name: 'Check me out' }).check()
    await page.locator('nb-card').filter({ hasText: 'Basic formEmail' }).getByRole('button').click()
})

test('Form wihtout labels generated and improved', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Recipients' }).fill('Recipient test')
    await expect(page.getByRole('textbox', { name: 'Recipients' })).toHaveValue('Recipient test')

    await page.getByRole('textbox', { name: 'Subject' }).fill('Subject test')
    await expect(page.getByRole('textbox', { name: 'Subject' })).toHaveValue('Subject test')

    await page.getByRole('textbox', { name: 'Message' }).fill('This is a test message')
    await expect(page.getByRole('textbox', { name: 'Message' })).toHaveValue('This is a test message')

    await page.getByRole('button', { name: 'Send' }).click()
    await expect(page.locator('nb-card').filter({ hasText: 'Form without labels' }).locator('form')).toHaveClass(/ng-submitted/)
    // await expect(page.locator('nb-card').filter({ hasText: 'Form without labels' }).locator('.ng-submitted')).toBeVisible()
})


