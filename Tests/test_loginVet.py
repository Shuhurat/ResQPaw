import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import time

@pytest.fixture
def driver():
    driver = webdriver.Chrome()
    driver.maximize_window()
    yield driver
    driver.quit()

def test_login_vet(driver):
    
    try:
        driver.get("http://localhost:5223/Identity/Account/Login")

        username = driver.find_element(By.NAME, "Input.Email")
        password = driver.find_element(By.NAME, "Input.Password")

        username.send_keys("vet5@gmail.com")
        password.send_keys("MuMVq5u2zXs@DQ3")

        driver.find_element(By.ID, "login-submit").click()
        time.sleep(3)

        #  Assert login success
        assert (
            "Dashboard" in driver.title
            or "Dashboard" in driver.current_url
            or "dashboard" in driver.page_source
        )
        print(" Login Test Passed!")

    except NoSuchElementException as e:
        print(" Element not found:", e)
        driver.save_screenshot("login_error.png")
        pytest.fail("Element missing during login test")

    except AssertionError:
        print(" Login Test Failed!")
        driver.save_screenshot("login_failed.png")
        pytest.fail("Login test assertion failed")
