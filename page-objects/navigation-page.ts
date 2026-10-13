import { Locator, Page } from '@playwright/test'

export class NavigationPage {

    private readonly page: Page
    // readonly formLayoutsMenu: Locator

    constructor(page: Page) {
        this.page = page
        // this.formLayoutsMenu = page.getByText('Forms')
    }

    private async selectGroupMenuItem(groupMenuTitle : string){
        const groupMenuItem = this.page.getByTitle(groupMenuTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if (expandedState == 'false'){
            await groupMenuItem.click()
        }
    }

    async formLayoutsPage() {
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText('Form Layouts').click()
    }

    async smartTablePage() {
        await this.selectGroupMenuItem('Tables & Data')
        await this.page.getByText('Smart Table').click()
    }

    async dialogPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Dialog').click()
    }

    async datePickerPage() {
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText('Datepicker').click()
    }
}