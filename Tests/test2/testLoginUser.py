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


def test_logout_user(driver):
    try:
        # --- Step 1: Open Login Page ---
        driver.get("http://localhost:5223/Identity/Account/Login")

        # --- Step 2: Login ---
        username = driver.find_element(By.NAME, "Input.Email")
        password = driver.find_element(By.NAME, "Input.Password")

        username.send_keys("user3@gmail.com")
        password.send_keys("mJebsbnAbpt6!v5")

        driver.find_element(By.ID, "login-submit").click()
        time.sleep(2)

        # --- Step 3: Verify Login Success ---
        assert "Dashboard" in driver.page_source or "Dashboard" in driver.current_url
        print("✅ User successfully logged in!")

        # --- Step 4: Find Logout Button ---
        logout_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//form[contains(@action, '/Account/Logout')]//button"))
        )
        print("✅ Logout button found!")

        # --- Step 5: Click Logout ---
        logout_button.click()

        # --- Step 6: Wait for redirect to login or home page ---
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//a[contains(@href, '/Account/Login')]"))
        )
        print("✅ Logout successful — Login button is visible again!")

        # --- Step 7: Final check ---
        assert "Login" in driver.page_source or "login" in driver.title

        print("🎯 User Logout Test Passed!")

    except (NoSuchElementException, TimeoutException) as e:
        print("❌ Logout Test Failed:", e)
        driver.save_screenshot("logout_test_error.png")
        pytest.fail("Logout test failed due to missing element or timeout")

    except AssertionError:
        print("❌ Logout did not complete correctly!")
        driver.save_screenshot("logout_test_assertion.png")
        pytest.fail("Logout test assertion failed")
