import { test } from '@playwright/test';
import { PageManager } from '../page-objects/page-manager';

test.beforeEach(async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com/')
})

test('Navigating to every page', async ({ page }) => {
    const pom = new PageManager(page)
    await pom.navigateTo.formLayoutsPage()
    await pom.navigateTo.datePickerPage()
    await pom.navigateTo.dialogPage()
    await pom.navigateTo.smartTablePage()
})