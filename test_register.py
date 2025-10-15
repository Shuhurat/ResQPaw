import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import random
import string

# Generate random email for testing
def random_email():
    return "testuser_" + "".join(random.choices(string.ascii_lowercase + string.digits, k=5)) + "@gmail.com"

@pytest.fixture
def driver():
    driver = webdriver.Chrome()
    driver.maximize_window()
    yield driver
    driver.quit()

def test_register_user(driver):
    driver.get("http://localhost:5223/Identity/Account/Register")

    email = random_email()
    password = "T8yjfmDcYT6!ucm"

    try:
        # Fill the registration form
        driver.find_element(By.NAME, "Input.Email").send_keys(email)
        driver.find_element(By.NAME, "Input.Password").send_keys(password)
        driver.find_element(By.NAME, "Input.ConfirmPassword").send_keys(password)

        # Select first available role
        role_dropdown = driver.find_element(By.NAME, "Input.Role")
        for option in role_dropdown.find_elements(By.TAG_NAME, "option"):
            if option.get_attribute("value") != "":
                option.click()
                break

        # Submit the form
        driver.find_element(By.ID, "registerSubmit").click()

        # Wait for Dashboard page to load
        WebDriverWait(driver, 10).until(
            lambda d: "Dashboard" in d.title or "Dashboard" in d.current_url or "dashboard" in d.page_source
        )

        # Assert registration success by checking Dashboard
        assert (
            "Dashboard" in driver.title
            or "Dashboard" in driver.current_url
            or "dashboard" in driver.page_source
        ), "Registration failed: Dashboard not found"

        print(f" Registration Test Passed! Registered email: {email}")

    except (NoSuchElementException, TimeoutException) as e:
        print(f" Registration Test Failed: {e}")
        driver.save_screenshot("registration_failed.png")
        pytest.fail("Registration failed due to missing element or timeout")
