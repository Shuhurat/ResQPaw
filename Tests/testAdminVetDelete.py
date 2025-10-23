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


def test_admin_delete_vet(driver: WebDriver):
    try:
        # --- Go to login page ---
        driver.get("http://localhost:5223/Identity/Account/Login")

        # --- Admin Login ---
        driver.find_element(By.NAME, "Input.Email").send_keys("admin@resqpaw.com")
        driver.find_element(By.NAME, "Input.Password").send_keys("Admin@123")
        driver.find_element(By.ID, "login-submit").click()

        # --- Wait for Dashboard to load ---
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "adminDashboardLink"))
        )
        print("✅ Login successful!")

        # --- Go to Vet Index page ---
        driver.get("http://localhost:5223/Vet")

        # --- Wait for table to load dynamically ---
        vet_rows = WebDriverWait(driver, 20).until(
            lambda d: d.find_elements(By.XPATH, "//tr[td[contains(normalize-space(), 'Sania Rahman')]]")
        )

        if not vet_rows:
            pytest.fail("⚠️ Vet row not found! Cannot delete.")
        
        vet_row = vet_rows[0]

        # --- Click the Delete link in the table row ---
        delete_button = vet_row.find_element(By.XPATH, ".//a[contains(text(),'Delete')]")
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", delete_button)
        driver.execute_script("arguments[0].click();", delete_button)
        print("✅ Clicked Delete link successfully!")

# --- Now on Delete.cshtml page: click the single confirm button ---
        confirm_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, "confirmDeleteButton"))
)
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", confirm_button)
        driver.execute_script("arguments[0].click();", confirm_button)
        print("✅ Confirmed deletion!")


        # --- Wait for Vet table to reload ---
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.ID, "vetTable"))
        )
        time.sleep(1)  # small wait for DOM update

        # --- Verify the vet is no longer in the list ---
        assert "Tania Rahman" not in driver.page_source
        print("✅ Vet deleted successfully!")

    except (NoSuchElementException, TimeoutException) as e:
        print(f"❌ Test Failed: {e}")
        driver.save_screenshot("delete_vet_failed.png")
        pytest.fail("Admin Delete Vet test failed due to missing element or timeout")
