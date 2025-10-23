from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import time

# --- Initialize WebDriver ---
driver = webdriver.Chrome()
driver.maximize_window()

try:
    # --- Go to login page ---
    driver.get("http://localhost:5223/Identity/Account/Login")

    # --- Admin Login ---
    driver.find_element(By.NAME, "Input.Email").send_keys("admin@resqpaw.com")
    driver.find_element(By.NAME, "Input.Password").send_keys("Admin@123")
    driver.find_element(By.ID, "login-submit").click()

    # --- Wait for dashboard to load ---
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "adminDashboardLink"))
    )
    print("✅ Login successful!")

    # --- Navigate to Vet List page ---
    driver.get("http://localhost:5223/Vet")

    # --- Wait for table to load ---
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "table"))
    )

    # --- Click Edit button for the specific vet ---
    edit_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//table//tr[td[contains(text(),'Dr. Tania Rahman')]]//a[contains(text(),'Edit')]"))
    )
    # Scroll into view and click
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", edit_button)
    time.sleep(1)
    edit_button.click()

    # --- Wait for edit form to load ---
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "Phone"))
    )

    # --- Edit fields ---
    phone_field = driver.find_element(By.NAME, "Phone")
    phone_field.clear()
    phone_field.send_keys("01899887766")

    availability_field = driver.find_element(By.NAME, "Availability")
    availability_field.clear()
    availability_field.send_keys("Mon-Fri, 10AM-6PM")

    time.sleep(2)

    # --- Instead of normal click ---
    save_button = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, "saveButton"))
    )

# Scroll to the button just to be safe
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", save_button)
    time.sleep(1)

# Use JavaScript click to avoid interception
    driver.execute_script("arguments[0].click();", save_button)


    # --- Wait for redirect to Vet index page ---
    WebDriverWait(driver, 10).until(lambda d: "/Vet" in d.current_url)
    print("✅ Redirected to Vet Index page!")

    # --- Verify updated information ---
    WebDriverWait(driver, 10).until(
        EC.text_to_be_present_in_element((By.TAG_NAME, "body"), "01899887766")
    )
    print("✅ Vet edit test passed! Updated phone number is visible.")

except (NoSuchElementException, TimeoutException) as e:
    print(f"❌ Test Failed: {e}")
    driver.save_screenshot("edit_vet_failed.png")

finally:
    driver.quit()
