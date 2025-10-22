import pytest
from selenium import webdriver
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException

@pytest.fixture
def driver():
    driver = webdriver.Chrome()
    driver.maximize_window()
    yield driver
    driver.quit()

def test_admin_edit_vet(driver: WebDriver):
    try:
        # --- Login as admin ---
        driver.get("http://localhost:5223/Identity/Account/Login")
        driver.find_element(By.NAME, "Input.Email").send_keys("admin@resqpaw.com")
        driver.find_element(By.NAME, "Input.Password").send_keys("Admin@123")
        driver.find_element(By.ID, "login-submit").click()

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "adminDashboardLink"))
        )
        print("✅ Login successful!")

        # --- Go to Vet Index page ---
        driver.get("http://localhost:5223/Vet/Index")

        # --- Wait for the vet list to load ---
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "table"))
        )

        # --- Click 'Edit' for the specific vet ---
        # Replace the XPath with the correct one for your edit button
        edit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//tr[td[contains(text(),'Dr. Tania Rahman')]]//a[text()='Edit']"))
        )
        edit_button.click()

        # --- Wait for Edit Vet form ---
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "Specialty"))
        )

        # --- Change some fields ---
        specialty_input = driver.find_element(By.NAME, "Specialty")
        specialty_input.clear()
        specialty_input.send_keys("Emergency & Small Animal Surgery")

        availability_input = driver.find_element(By.NAME, "Availability")
        availability_input.clear()
        availability_input.send_keys("Mon-Fri, 8AM-6PM")

        # --- Submit the form ---
        driver.find_element(By.ID, "saveButton").click()

        # --- Wait for redirect back to Vet Index ---
        WebDriverWait(driver, 10).until(lambda d: "/Vet" in d.current_url)

        # --- Verify changes are visible ---
        page_source = driver.page_source
        assert "Emergency & Small Animal Surgery" in page_source
        assert "Mon-Fri, 8AM-6PM" in page_source
        print("✅ Vet edited successfully and changes are visible!")

    except (NoSuchElementException, TimeoutException) as e:
        print(f"❌ Edit Vet Test Failed: {e}")
        driver.save_screenshot("edit_vet_failed.png")
        pytest.fail("Admin Edit Vet test failed due to missing element or timeout")

