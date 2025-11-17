from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import time

# --- Setup Chrome driver ---
driver = webdriver.Chrome()
driver.maximize_window()

try:
    print("Step 1: Opening login page...")
    driver.get("http://localhost:5223/Identity/Account/Login")

    # --- Step 2: Login ---
    username = driver.find_element(By.NAME, "Input.Email")
    password = driver.find_element(By.NAME, "Input.Password")

    username.send_keys("user3@gmail.com")
    password.send_keys("mJebsbnAbpt6!v5")

    driver.find_element(By.ID, "login-submit").click()
    time.sleep(2)

    # --- Step 3: Check login success ---
    if "Dashboard" in driver.page_source or "Dashboard" in driver.current_url:
        print("✅ Logged in successfully!")
    else:
        raise Exception("❌ Login failed!")

    # --- Step 4: Find Logout button ---
    print("Step 4: Searching for Logout button...")
    logout_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//form[contains(@action, '/Account/Logout')]//button"))
    )
    print("✅ Logout button found!")

    # --- Step 5: Click Logout ---
    logout_button.click()
    print("➡ Clicked Logout button...")

    # --- Step 6: Wait for redirect to Login page ---
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//a[contains(@href, '/Account/Login')]"))
    )

    # --- Step 7: Confirm logout success ---
    if "Login" in driver.page_source or "login" in driver.title:
        print("🎯 Logout successful — back on Login page!")
    else:
        raise Exception("❌ Logout did not complete properly!")

except (NoSuchElementException, TimeoutException) as e:
    print("❌ Test failed due to element not found or timeout:", e)
    driver.save_screenshot("logout_error.png")

except Exception as e:
    print(e)
    driver.save_screenshot("logout_failed.png")

finally:
    driver.quit()
    print("🔒 Browser closed.")
