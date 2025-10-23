from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import time

def vet_add_visibility_test(email, password, expected_visible):
    driver = webdriver.Chrome()
    driver.maximize_window()

    try:
        # --- Login ---
        driver.get("http://localhost:5223/Identity/Account/Login")
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.NAME, "Input.Email"))
        ).send_keys(email)
        driver.find_element(By.NAME, "Input.Password").send_keys(password)
        driver.find_element(By.ID, "login-submit").click()

        # --- Navigate to Vet page ---
        WebDriverWait(driver, 5).until(lambda d: "/Dashboard" in d.current_url or "/Identity" not in d.current_url)
        driver.get("http://localhost:5223/Vet")
        time.sleep(1)

        try:
            add_button = driver.find_element(By.LINK_TEXT, "Add New Vet")
            visible = add_button.is_displayed()
        except NoSuchElementException:
            visible = False

        if visible == expected_visible:
            print(f"✅ Test Passed for {email}: 'Add New Vet' visibility is {visible}")
        else:
            print(f"❌ Test Failed for {email}: 'Add New Vet' visibility is {visible}, expected {expected_visible}")

    except TimeoutException as e:
        print(f"❌ Timeout/Error during test for {email}: {e}")

    finally:
        driver.quit()


# --- Run Tests ---
vet_add_visibility_test("admin@resqpaw.com", "Admin@123", expected_visible=True)
vet_add_visibility_test("user3@gmail.com", "mJebsbnAbpt6!v5", expected_visible=False)
