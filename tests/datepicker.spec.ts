import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/page-manager';

test.beforeEach(async ({ page }) => {
    const pom = new PageManager(page)
    await page.goto('https://playground.bondaracademy.com/')
    await pom.navigateTo.datePickerPage()
})

test('Selecting dates with parametrized page objects methods', async ({ page }) => {
    const pom = new PageManager(page)
    await pom.datepickerPage.selectCommonDatepickerDateFromToday(5)
    await pom.datepickerPage.selectDatepickerWithRangeFromToday(8, 14)
})

test('Simple datepicker', async ({ page }) => {
    const calendarField = page.getByPlaceholder('Form Picker')
    await calendarField.click()

    const date = new Date()
    date.setDate(date.getDate() + 50)
    const expectedDay = date.getDate().toString()
    const expectedMonth = date.toLocaleString('En-US', { month: 'short' })
    const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' })
    const expectedYear = date.getFullYear()
    const expectedDate = `${expectedMonth} ${expectedDay}, ${expectedYear}`

    let currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`

    while (!currentMonthAndYear?.includes(expectedMonthAndYear)) {
        await page.locator('.next-month').click()
        currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('.day-cell:not(.bounding-month)').getByText(expectedDay, { exact: true }).click()
    await expect(calendarField).toHaveValue(expectedDate)
})

test('Range datepicker AI improved', async ({ page }) => {
    const dateField = page.getByPlaceholder('Range Picker')
    await dateField.click()

    const date1 = new Date()
    date1.setDate(date1.getDate() + 20)
    const date2 = new Date()
    date2.setDate(date2.getDate() + 35)

    const formatShort = (d: Date) =>
        `${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}`
    const formatLongMonthYear = (d: Date) =>
        `${d.toLocaleString('en-US', { month: 'long' })} ${d.getFullYear()}`

    const expectedDate = `${formatShort(date1)} - ${formatShort(date2)}`

    const selectDay = async (date: Date) => {
        const monthAndYear = page.locator('nb-calendar-view-mode')
        const expectedMonthAndYear = formatLongMonthYear(date)

        while (!(await monthAndYear.textContent())?.includes(expectedMonthAndYear)) {
            await page.locator('.next-month').click()
        }

        await page
            .locator('.day-cell:not(.bounding-month)')
            .getByText(date.getDate().toString(), { exact: true })
            .click()
    }

    await selectDay(date1)
    await selectDay(date2)

    await expect(dateField).toHaveValue(expectedDate)
})