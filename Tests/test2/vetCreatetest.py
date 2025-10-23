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
   # --- Admin Login ---
    driver.get("http://localhost:5223/Identity/Account/Login")
    driver.find_element(By.NAME, "Input.Email").send_keys("admin@resqpaw.com")
    driver.find_element(By.NAME, "Input.Password").send_keys("Admin@123")
    driver.find_element(By.ID, "login-submit").click()


    # --- Wait for dashboard to load ---
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "adminDashboardLink"))
    )
    print("✅ Login successful!")

    # --- Navigate to Create Vet page ---
    driver.get("http://localhost:5223/Vet/Create")

    # --- Wait for form to load ---
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.ID, "saveButton"))
    )

    # --- Fill out the form ---
    driver.find_element(By.NAME, "Name").send_keys("Dr. Tania Rahman")
    driver.find_element(By.NAME, "Specialty").send_keys("Small Animal Surgery")
    driver.find_element(By.NAME, "Species").send_keys("Dogs, Cats")
    driver.find_element(By.NAME, "VetClinic").send_keys("Happy Paws Clinic")
    driver.find_element(By.NAME, "Location").send_keys("Gulshan, Dhaka")
    driver.find_element(By.NAME, "Availability").send_keys("Mon-Fri, 9AM-5PM")
    driver.find_element(By.NAME, "Phone").send_keys("01711222333")
    driver.find_element(By.NAME, "Email").send_keys("tania.rahman@happypaws.com")
    driver.find_element(By.NAME, "ExperienceYears").send_keys("5")
    driver.find_element(By.NAME, "Services").send_keys("Vaccination, Surgery, Checkups")
    driver.find_element(By.NAME, "Rating").send_keys("4.5")
    driver.find_element(By.NAME, "ProfilePhotoUrl").send_keys("https://example.com/photo.jpg")
    driver.find_element(By.NAME, "Website").send_keys("https://happypaws.com")
    driver.find_element(By.NAME, "LanguagesSpoken").send_keys("English, Bengali")

    time.sleep(1)  # Wait for any dynamic validation messages

    # --- Scroll to Save button and click via JavaScript ---
    save_button = driver.find_element(By.ID, "saveButton")
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", save_button)
    time.sleep(0.5)
    driver.execute_script("arguments[0].click();", save_button)

    # --- Wait for redirect to Vet index page ---
    WebDriverWait(driver, 10).until(lambda d: "/Vet" in d.current_url)
    print("✅ Vet creation successful!")

except (NoSuchElementException, TimeoutException) as e:
    print(f"❌ Create Vet Test Failed: {e}")
    driver.save_screenshot("create_vet_failed.png")

finally:
    driver.quit()
