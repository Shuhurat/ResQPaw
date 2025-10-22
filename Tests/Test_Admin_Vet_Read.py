# test_admin_read.py

import pytest
import time
from selenium import webdriver
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


def test_admin_read_vet_list(driver):
    driver.get("http://localhost:5223/Identity/Account/Login")

    try:
        # --- Admin Login ---
        driver.find_element(By.NAME, "Input.Email").send_keys("admin@resqpaw.com")
        driver.find_element(By.NAME, "Input.Password").send_keys("Admin@123")
        driver.find_element(By.ID, "login-submit").click()


        time.sleep(3)  
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "adminDashboardLink"))
        )
        print(" Login successful!")

       

        # --- Navigate to Vet List Page ---
        driver.get("http://localhost:5223/Vet")

        # Wait for the table or page heading to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "table"))
        )

        # --- Verify content ---
        page_source = driver.page_source
        assert "Vet List" in page_source or "Name" in page_source or "<table" in page_source

        print("✅ Admin Read Test Passed! Vet List loaded successfully.")

    except (NoSuchElementException, TimeoutException) as e:
        print(f"❌ Admin Read Test Failed: {e}")
        driver.save_screenshot("admin_read_failed.png")
        pytest.fail("Admin Read operation failed due to missing element or timeout")
