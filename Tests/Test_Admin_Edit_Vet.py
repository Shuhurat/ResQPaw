import pytest
import time
from selenium import webdriver
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException, ElementClickInterceptedException

@pytest.fixture
def driver():
    driver = webdriver.Chrome()
    driver.maximize_window()
    yield driver
    driver.quit()

def test_admin_edit_vet(driver: WebDriver):
    try:
        # --- Go to login page ---
        driver.get("http://localhost:5223/Identity/Account/Login")

        # --- Admin Login ---
        driver.find_element(By.NAME, "Input.Email").send_keys("admin@resqpaw.com")
        driver.find_element(By.NAME, "Input.Password").send_keys("Admin@123")
        driver.find_element(By.ID, "login-submit").click()

        # --- Wait for Dashboard to load ---
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "adminDashboardLink"))
        )
        print("✅ Login successful!")

        # --- Go to Vet Index page ---
        driver.get("http://localhost:5223/Vet")

        # --- Click 'Edit' for specific vet ---
        edit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable(
                (By.XPATH, "//tr[td[contains(text(),'Dr. Tania Rahman')]]//a[text()='Edit']")
            )
        )

        # Scroll and click using JS
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", edit_button)
        time.sleep(0.3)
        driver.execute_script("arguments[0].click();", edit_button)
        print("✅ Clicked Edit button successfully!")

        # --- Wait for Edit form ---
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "Name"))
        )
        print("✅ Edit form loaded successfully!")

        # --- Update fields ---
        name_field = driver.find_element(By.NAME, "Name")
        name_field.clear()
        name_field.send_keys("Dr. Tania Rahman (Updated)")

        location_field = driver.find_element(By.NAME, "Location")
        location_field.clear()
        location_field.send_keys("Banani, Dhaka")

        # --- Optional: update checkbox ---
        try:
            emergency_checkbox = driver.find_element(By.ID, "EmergencyService")
            driver.execute_script("arguments[0].scrollIntoView(true);", emergency_checkbox)
            if not emergency_checkbox.is_selected():
                driver.execute_script("arguments[0].click();", emergency_checkbox)
        except NoSuchElementException:
            print("⚠️ EmergencyService checkbox not found, skipping.")

        # --- Submit form safely ---
        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "saveButton"))
        )
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", submit_button)
        time.sleep(0.3)
        driver.execute_script("arguments[0].click();", submit_button)
        print("✅ Form submitted!")

        # --- Wait for Vet table on Index page ---
        vet_table = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "vetTable"))
        )
        print("✅ Vet table loaded after update!")

        # --- Verify updated vet name is visible ---
        WebDriverWait(driver, 10).until(
            EC.text_to_be_present_in_element((By.ID, "vetTable"), "Dr. Tania Rahman (Updated)")
        )
        assert "Dr. Tania Rahman (Updated)" in driver.page_source
        print("✅ Vet edit test passed successfully!")

        # --- Check session is still active ---
        if "Login" in driver.title or "/Identity/Account/Login" in driver.current_url:
            pytest.fail("⚠️ Logged out after submitting the form!")

    except (NoSuchElementException, TimeoutException, ElementClickInterceptedException) as e:
        print(f"❌ Test Failed: {e}")
        driver.save_screenshot("edit_vet_failed.png")
        pytest.fail("Admin Edit Vet test failed due to element issue or timeout")
