import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import (
    NoSuchElementException,
    StaleElementReferenceException,
)
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

GREEN = "\033[92m"
RED = "\033[91m"
RESET = "\033[0m"

driver = webdriver.Chrome()
driver.maximize_window()

try:
    # --- Step 1: Login ---
    print("Step 1: Logging in as Vet...")
    driver.get("http://localhost:5223/Identity/Account/Login")
    driver.find_element(By.NAME, "Input.Email").send_keys("vet5@gmail.com")
    driver.find_element(By.NAME, "Input.Password").send_keys("MuMVq5u2zXs@DQ3")
    driver.find_element(By.ID, "login-submit").click()
    print(f"{GREEN}✓ Vet login submitted{RESET}")

    # --- Step 2: Wait for dashboard to load ---
    dashboard_header = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located(
            (By.XPATH, "//h2[contains(text(), 'Vet Dashboard')]")
        )
    )
    print(f"{GREEN}✓ Vet Dashboard loaded successfully{RESET}")

    # --- Step 3: Wait for SOS table ---
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "sosTableBody"))
    )

    # --- Step 4: Look for first pending SOS ---
    pending_row = None
    rows = driver.find_elements(By.CSS_SELECTOR, "#sosTableBody tr")
    for row in rows:
        try:
            status = row.find_element(By.CLASS_NAME, "status").text.strip()
            if status.lower() != "contacted":
                pending_row = row
                break
        except (NoSuchElementException, StaleElementReferenceException):
            continue

    if not pending_row:
        print(f"{RED}ℹ No pending SOS requests to mark as Contacted{RESET}")
    else:
        # --- Step 5: Click button ---
        mark_btn = pending_row.find_element(By.CSS_SELECTOR, "button.btn-success")
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", mark_btn)
        driver.execute_script("arguments[0].click();", mark_btn)

        # --- Step 6: Wait until status changes ---
        WebDriverWait(driver, 5).until(
            lambda d: pending_row.find_element(By.CLASS_NAME, "status").text.strip().lower() == "contacted"
        )
        print(f"{GREEN}✅ SOS request marked as Contacted{RESET}")

    print(f"{GREEN}✅ Vet Dashboard Mark as Contacted test finished successfully{RESET}")

except Exception as e:
    print(f"{RED}❌ Test failed: {e}{RESET}")
    driver.save_screenshot("vet_dashboard_failed.png")

finally:
    driver.quit()
