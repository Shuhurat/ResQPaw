from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# --- Chrome options to ignore SSL issues ---
chrome_options = Options()
chrome_options.add_argument("--ignore-certificate-errors")
chrome_options.add_argument("--ignore-ssl-errors")
chrome_options.add_argument("--allow-insecure-localhost")
chrome_options.add_argument("--disable-web-security")

# --- Start driver for Vet ---
vet_driver = webdriver.Chrome(options=chrome_options)
vet_driver.maximize_window()
vet_driver.get("https://localhost:5223/Identity/Account/Login")

# --- Login as Vet ---
WebDriverWait(vet_driver, 10).until(
    EC.presence_of_element_located((By.ID, "Input_Email"))
).send_keys("vet5@example.com")
vet_driver.find_element(By.ID, "Input_Password").send_keys("MuMVq5u2zXs@DQ3")
vet_driver.find_element(By.ID, "login-submit").click()

# --- Wait for dashboard to load ---
WebDriverWait(vet_driver, 10).until(
    EC.presence_of_element_located((By.ID, "vetDashboardLink"))
)
print("✅ Vet logged in and waiting for SOS...")

# Get initial notification count
try:
    initial_count = int(vet_driver.find_element(By.ID, "notificationCount").text.strip())
except:
    initial_count = 0

# --- Start driver for Customer ---
cust_driver = webdriver.Chrome(options=chrome_options)
cust_driver.maximize_window()
cust_driver.get("https://localhost:5223/Identity/Account/Login")

# --- Login as Customer ---
WebDriverWait(cust_driver, 10).until(
    EC.presence_of_element_located((By.ID, "Input_Email"))
).send_keys("user26@gmail.com")
cust_driver.find_element(By.ID, "Input_Password").send_keys("Ria6!sWXvufz8fc!")
cust_driver.find_element(By.ID, "login-submit").click()

# --- Navigate to SOS Send page ---
WebDriverWait(cust_driver, 10).until(
    EC.presence_of_element_located((By.LINK_TEXT, "SOS Alert"))
).click()

# --- Fill and send SOS form ---
WebDriverWait(cust_driver, 10).until(
    EC.presence_of_element_located((By.ID, "Location"))
).send_keys("Dhaka, Bangladesh")
cust_driver.find_element(By.ID, "Description").send_keys("Pet injured on road")
cust_driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

print("🚨 Customer sent SOS alert!")

# --- Switch to Vet tab and check notification ---
time.sleep(5)  # wait for SignalR to deliver message

try:
    WebDriverWait(vet_driver, 15).until(
        EC.text_to_be_present_in_element(
            (By.ID, "notificationCount"), str(initial_count + 1)
        )
    )
    print("✅ Vet received notification (badge updated)")
except:
    print("❌ Notification not received automatically")

# --- Optional: Check toast appeared ---
toasts = vet_driver.find_elements(By.CLASS_NAME, "toast-body")
if any("sent an SOS" in t.text for t in toasts):
    print("✅ Toast appeared successfully!")
else:
    print("⚠️ No toast found")

# --- Cleanup ---
time.sleep(3)
cust_driver.quit()
vet_driver.quit()
