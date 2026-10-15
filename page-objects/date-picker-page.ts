import { Page, expect } from '@playwright/test'
import { step } from '../helpers/test-step-decorator'

export class DatepickerPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    @step
    async selectCommonDatepickerDateFromToday(daysFromToday: number) {
        const calendarField = this.page.getByPlaceholder('Form Picker')
        await calendarField.click()
        const expectedDate = await this.selectDateOnTheCalendar(daysFromToday)
        await expect(calendarField).toHaveValue(expectedDate)
    }

    @step
    async selectDatepickerWithRangeFromToday(daysFromTodayStart: number, daysFromTodayEnd: number) {
        const calendarField = this.page.getByPlaceholder('Range Picker')
        await calendarField.click()
        const expectedDateStart = await this.selectDateOnTheCalendar(daysFromTodayStart)
        const expectedDateEnd = await this.selectDateOnTheCalendar(daysFromTodayEnd)
        const expectedDateRange = `${expectedDateStart} - ${expectedDateEnd}`
        await expect(calendarField).toHaveValue(expectedDateRange)
    }

    private async selectDateOnTheCalendar(daysFromToday: number) {
        const date = new Date()
        date.setDate(date.getDate() + daysFromToday)
        const expectedDay = date.getDate().toString()
        const expectedMonth = date.toLocaleString('En-US', { month: 'short' })
        const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' })
        const expectedYear = date.getFullYear()
        const expectedDate = `${expectedMonth} ${expectedDay}, ${expectedYear}`

        let currentMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`

        while (!currentMonthAndYear?.includes(expectedMonthAndYear)) {
            await this.page.locator('.next-month').click()
            currentMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
        await this.page.locator('.day-cell:not(.bounding-month)').getByText(expectedDay, { exact: true }).click()
        return expectedDate
    }
}