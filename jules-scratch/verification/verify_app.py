from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Navigate to the home page and wait for data to load
    page.goto("http://localhost:8080/")
    page.wait_for_load_state("networkidle")
    page.screenshot(path="jules-scratch/verification/01_home_page.png")

    # Navigate to the first article
    page.locator('a:has-text("The Rise of Neural Interfaces")').click()
    page.wait_for_load_state("networkidle")
    page.screenshot(path="jules-scratch/verification/02_article_detail_page.png")

    # Navigate to the admin page
    page.goto("http://localhost:8080/admin")
    page.wait_for_load_state("networkidle")
    page.screenshot(path="jules-scratch/verification/03_admin_login_page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)