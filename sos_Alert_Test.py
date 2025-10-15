# test_sos.py
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


def test_sos_submission(driver):
    try:
        # Login
        driver.get("http://localhost:5223/Identity/Account/Login")
        username = driver.find_element(By.NAME, "Input.Email")
        password = driver.find_element(By.NAME, "Input.Password")
        username.send_keys("user25@gmail.com")
        password.send_keys("h2ZKZPbd35m@kkH")
        driver.find_element(By.ID, "login-submit").click()

        time.sleep(3)  
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "customerDashboardLink"))
        )
        print(" Login successful!")

        # Open SOS form
        driver.find_element(By.ID, "sosBtn").click()
        driver.find_element(By.ID, "callEmergency").click()
        WebDriverWait(driver, 5).until(
            EC.url_to_be("http://localhost:5223/SOS/Send")
        )
        print(" Navigated to SOS form!")

      
        driver.find_element(By.NAME, "EmergencyType").send_keys("Injury")
        driver.find_element(By.NAME, "AnimalType").send_keys("Dog")
        driver.find_element(By.NAME, "AnimalCondition").send_keys("Bleeding")
        driver.find_element(By.NAME, "Description").send_keys("Leg injured, needs urgent care")
        driver.find_element(By.NAME, "Address").send_keys("Banani, Dhaka")
        driver.find_element(By.NAME, "ReporterName").send_keys("John Doe")
        driver.find_element(By.NAME, "ReporterPhone").send_keys("01712345678")
        driver.find_element(By.NAME, "ReporterEmail").send_keys("johndoe@gmail.com")
        print(" Submitted all form fields.")

       
        driver.find_element(By.ID, "submitBtn").click()
        WebDriverWait(driver, 15).until(
            EC.url_contains("/SOS/Status")
        )
        print(" Redirected to /SOS/Status page!")

        # Check success message
        success_message = WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.ID, "statusSuccessMessage"))
        )
        print(" SOS Alert submitted successfully!")
        print("Message:", success_message.text)
        assert "SOS alert sent successfully" in success_message.text

    except NoSuchElementException as e:
        driver.save_screenshot("login_error.png")
        pytest.fail(f" Element not found: {e}")

    except TimeoutException:
        driver.save_screenshot("sos_submission_failed.png")
        pytest.fail(" Success message not found. Submission may have failed.")
