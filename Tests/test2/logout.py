import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import time

@pytest.fixture
def driver():
    driver = webdriver.Chrome()
    driver.maximize_window()
    yield driver
    driver.quit()

def test_login_vet(driver):
    try:
        # --- Step 1: Open Login Page ---
        driver.get("http://localhost:5223/Identity/Account/Login")

        # --- Step 2: Enter Credentials ---
        username = driver.find_element(By.NAME, "Input.Email")
        password = driver.find_element(By.NAME, "Input.Password")

        username.send_keys("vet5@gmail.com")
        password.send_keys("MuMVq5u2zXs@DQ3")

        driver.find_element(By.ID, "login-submit").click()
        time.sleep(3)

        # --- Step 3: Verify Login ---
        assert (
            "Dashboard" in driver.title
            or "Dashboard" in driver.current_url
            or "dashboard" in driver.page_source
        )
        print("✅ Vet Login Test Passed!")

        # --- Step 4: Locate Logout Button ---
        print("🔎 Looking for Logout button...")
        logout_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//form[contains(@action, '/Account/Logout')]//button"))
        )

        # --- Step 5: Click Logout ---
        logout_button.click()
        print("➡ Clicked Logout button...")

        # --- Step 6: Wait for redirect to Login page ---
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//button[@id='login-submit']"))
        )

        # --- Step 7: Confirm Logout Success ---
        assert "Login" in driver.title or "Login" in driver.page_source
        print("🎯 Logout successful — back on Login page!")

    except (NoSuchElementException, TimeoutException) as e:
        print("❌ Test failed due to element not found or timeout:", e)
        driver.save_screenshot("vet_login_logout_error.png")
        pytest.fail("Element missing or timeout during login/logout test")

    except AssertionError:
        print("❌ Vet Login/Logout Test Failed!")
        driver.save_screenshot("vet_login_logout_failed.png")
        pytest.fail("Assertion failed during login/logout flow")
