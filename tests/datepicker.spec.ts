import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com/')
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()
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

test('Range datepicker', async ({ page }) => {
    const dateField = page.getByPlaceholder('Range Picker')
    await dateField.click()

    const date1 = new Date()
    date1.setDate(date1.getDate() + 5)
    const date2 = new Date()
    date2.setDate(date2.getDate() + 10)

    const incialDate = date1.getDate().toString()
    const expectedInicialMonth = date1.toLocaleString('En-US', { month: 'short' })
    const expectedLongInicialMonth = date1.toLocaleString('En-US', { month: 'long' })
    const expectedInicialYear = date1.getFullYear()

    let currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedInicialMonthAndYear = `${expectedLongInicialMonth} ${expectedInicialYear}`

    while (!currentMonthAndYear?.includes(expectedInicialMonthAndYear)) {
        await page.locator('.next-month').click()
        currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('.day-cell:not(.bounding-month)').getByText(incialDate, { exact: true }).click()

    const finalDate = date2.getDate().toString()
    const expectedFinalMonth = date2.toLocaleString('En-US', { month: 'short' })
    const expectedLongFinalMonth = date2.toLocaleString('En-US', { month: 'long' })
    const expectedFinalYear = date2.getFullYear()
    const expectedFinalMonthAndYear = `${expectedLongFinalMonth} ${expectedFinalYear}`

    while (!currentMonthAndYear?.includes(expectedFinalMonthAndYear)) {
        await page.locator('.next-month').click()
        currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    const expectedDate = `${expectedInicialMonth} ${incialDate}, ${expectedInicialYear} - ${expectedFinalMonth} ${finalDate}, ${expectedFinalYear}`

    await page.locator('.day-cell:not(.bounding-month)').getByText(finalDate, { exact: true }).click()
    await expect(dateField).toHaveValue(expectedDate)
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

        // navega até o mês desejado
        while (!(await monthAndYear.textContent())?.includes(expectedMonthAndYear)) {
            await page.locator('.next-month').click()
        }

        await page
            .locator('.day-cell:not(.bounding-month)')
            .getByText(date.getDate().toString(), { exact: true })
            .click()
    }

    await selectDay(date1)   // navega e clica no dia inicial
    await selectDay(date2)   // navega (se necessário) e clica no dia final

    await expect(dateField).toHaveValue(expectedDate)
})