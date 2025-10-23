import pytest
import time
from selenium import webdriver
from selenium.webdriver.chrome.webdriver import WebDriver
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


def test_admin_create_vet(driver: WebDriver):
    try:
        # --- Go to login page ---
        driver.get("http://localhost:5223/Identity/Account/Login")

        # --- Admin Login ---
        driver.find_element(By.NAME, "Input.Email").send_keys("admin@resqpaw.com")
        driver.find_element(By.NAME, "Input.Password").send_keys("Admin@123")
        driver.find_element(By.ID, "login-submit").click()

        # --- Wait for dashboard to load ---
        WebDriverWait(driver, 2).until(
            EC.presence_of_element_located((By.ID, "adminDashboardLink"))
        )
        print("✅ Login successful!")

        # --- Go to Create Vet page ---
        driver.get("http://localhost:5223/Vet/Create")

        # --- Wait for form to load ---
        WebDriverWait(driver, 2).until(
            EC.presence_of_element_located((By.NAME, "Name"))
        )

        # --- Fill out Vet form ---
        driver.find_element(By.NAME, "Name").send_keys("Dr. Sania Rahman")
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
        
        time.sleep(5)

        # --- Submit form ---
       
        driver.find_element(By.ID, "saveButton").click()
        
        time.sleep(5)

        # --- Wait for redirect to Vet index page ---
        WebDriverWait(driver, 10).until(lambda d: "/Vet" in d.current_url)
        
        print("✅ Redirected to Vet Index page!")

        # --- Wait for the new vet name to appear in the page ---
        WebDriverWait(driver, 10).until(
        EC.text_to_be_present_in_element(
        (By.TAG_NAME, "body"),  
        "Dr. Tania Rahman"
    )
)
        print("✅ New vet is visible in the list!")

# --- Final Assertion ---
        assert "Dr. Tania Rahman" in driver.page_source
        print("✅ Vet creation test passed!")

    except (NoSuchElementException, TimeoutException) as e:
        print(f"❌ Test Failed: {e}")
        driver.save_screenshot("create_vet_failed.png")
        pytest.fail("Admin Create Vet test failed due to missing element or timeout")
