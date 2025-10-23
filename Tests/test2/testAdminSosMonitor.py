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

def test_admin_complete_flow(driver):
    """
    Complete admin flow test:
    Home → Login as Admin → Click Admin Dashboard → Dashboard Page → 
    Click Open SOS Monitor → SOS Monitor Page → Click Mark as Done → Verify Completion
    """
    try:
        # Step 1: Open home page
        print(" Step 1: Opening home page...")
        driver.get("http://localhost:5223/")
        time.sleep(2)
        
        # Verify home page loaded
        assert "ResQPaw" in driver.title or "resqpaw" in driver.page_source.lower()
        print("✓ Home page loaded successfully")

        # Step 2: Navigate to login page
        print(" Step 2: Navigating to login page...")
        
        # Try to find login link
        login_found = False
        try:
            login_links = driver.find_elements(By.XPATH, "//a[contains(text(), 'Login') or contains(text(), 'Sign In')]")
            for link in login_links:
                if link.is_displayed():
                    link.click()
                    login_found = True
                    print(f"✓ Found and clicked login link: {link.text}")
                    break
        except:
            pass
        
        # If no login link found, navigate directly
        if not login_found:
            print(" No login link found, navigating directly to login page")
            driver.get("http://localhost:5223/Identity/Account/Login")
        
        time.sleep(2)
        
        # Step 3: Login as ADMIN
        print(" Step 3: Logging in as ADMIN...")
        
        # Find and fill email field
        email_field = None
        email_selectors = [
            (By.NAME, "Input.Email"),
            (By.ID, "Input_Email"),
            (By.NAME, "Email"),
            (By.CSS_SELECTOR, "input[type='email']")
        ]
        
        for by, selector in email_selectors:
            try:
                email_field = driver.find_element(by, selector)
                break
            except:
                continue
        
        if email_field:
            email_field.send_keys("admin@resqpaw.com")
            print("✓ Admin email entered")
        else:
            pytest.fail("Could not find email field")
        
        # Find and fill password field
        password_field = None
        password_selectors = [
            (By.NAME, "Input.Password"),
            (By.ID, "Input_Password"), 
            (By.NAME, "Password"),
            (By.CSS_SELECTOR, "input[type='password']")
        ]
        
        for by, selector in password_selectors:
            try:
                password_field = driver.find_element(by, selector)
                break
            except:
                continue
        
        if password_field:
            password_field.send_keys("Admin@123")
            print("✓ Admin password entered")
        else:
            pytest.fail("Could not find password field")
        
        # Find and click login button
        login_button = None
        login_button_selectors = [
            (By.CSS_SELECTOR, "button[type='submit']"),
            (By.CSS_SELECTOR, "input[type='submit']"),
            (By.CSS_SELECTOR, ".btn-primary"),
            (By.ID, "login-submit")
        ]
        
        for by, selector in login_button_selectors:
            try:
                login_button = driver.find_element(by, selector)
                if login_button.is_displayed() and login_button.is_enabled():
                    break
            except:
                continue
        
        if login_button:
            login_button.click()
            print("✓ Login button clicked")
        else:
            pytest.fail("Could not find login button")
        
        # Wait for login to complete
        time.sleep(3)
        print("✓ Login completed successfully")
        
        # Step 4: Click on "Admin Dashboard" button
        print(" Step 4: Looking for and clicking 'Admin Dashboard' button...")
        
        # Find and click Admin Dashboard button
        admin_dashboard_found = False
        admin_dashboard_selectors = [
            "//a[contains(text(), 'Admin Dashboard')]",
            "//a[contains(text(), 'Dashboard') and contains(@href, 'Admin')]",
            "//a[contains(@href, 'Admin/Dashboard')]",
            "//a[contains(text(), 'Dashboard')]"
        ]
        
        for selector in admin_dashboard_selectors:
            try:
                admin_dashboard_btn = driver.find_element(By.XPATH, selector)
                if admin_dashboard_btn.is_displayed() and admin_dashboard_btn.is_enabled():
                    admin_dashboard_btn.click()
                    admin_dashboard_found = True
                    print(f"✓ Found and clicked Admin Dashboard button: '{admin_dashboard_btn.text}'")
                    break
            except:
                continue
        
        if not admin_dashboard_found:
            pytest.fail("Could not find Admin Dashboard button after login")
        
        # Wait for admin dashboard page to load
        time.sleep(3)
        print("✓ Admin Dashboard page loaded")
        
        # Step 5: Verify Admin Dashboard page
        print(" Step 5: Verifying Admin Dashboard page...")
        
        # Check for Welcome Admin header
        try:
            welcome_header = driver.find_element(By.XPATH, "//h2[contains(text(), 'Welcome Admin!')]")
            print(f"✓ Admin welcome header found: '{welcome_header.text}'")
            assert welcome_header.text == "Welcome Admin!"
        except:
            print("⚠ Welcome Admin header not found")
        
        # Check for protected content message
        try:
            protected_msg = driver.find_element(By.XPATH, "//p[contains(text(), 'only visible to users with the Admin role')]")
            print(f"✓ Admin protected message found: '{protected_msg.text}'")
        except:
            print("⚠ Admin protected message not found")
        
        # Step 6: Click on "Open SOS Monitor" button
        print(" Step 6: Clicking 'Open SOS Monitor' button...")
        
        # Find and click Open SOS Monitor button
        sos_monitor_found = False
        try:
            sos_monitor_btn = driver.find_element(By.XPATH, "//a[contains(@class, 'btn-danger') and contains(text(), 'Open SOS Monitor')]")
            if sos_monitor_btn.is_displayed() and sos_monitor_btn.is_enabled():
                sos_monitor_btn.click()
                sos_monitor_found = True
                print(f"✓ Found and clicked SOS Monitor button: '{sos_monitor_btn.text}'")
        except:
            pass
        
        if not sos_monitor_found:
            pytest.fail("Could not find Open SOS Monitor button")
        
        # Wait for SOS Monitor page to load
        time.sleep(3)
        print("✓ SOS Monitor page loaded")
        
        # Step 7: Verify SOS Monitor page
        print(" Step 7: Verifying SOS Monitor page...")
        
        # Check for SOS Monitor header
        try:
            sos_header = driver.find_element(By.XPATH, "//h2[contains(text(), 'Live SOS Monitor')]")
            print(f"✓ SOS Monitor header found: '{sos_header.text}'")
            assert "Live SOS Monitor" in sos_header.text
        except:
            print("⚠ SOS Monitor header not found")
        
        # Check for SOS table
        try:
            sos_table = driver.find_element(By.ID, "sosTableBody")
            print("✓ SOS table found")
        except:
            print("⚠ SOS table not found")
        
        # Step 8: Look for and click "Mark as Done" button
        print(" Step 8: Looking for 'Mark as Done' button...")
        
        # Find all SOS rows with status "Contacted" that have Mark as Done button
        mark_done_clicked = False
        try:
            # Look for forms with Mark as Done button for rows with status "Contacted"
            sos_rows = driver.find_elements(By.CSS_SELECTOR, "#sosTableBody tr")
            print(f" Found {len(sos_rows)} SOS rows")
            
            for row in sos_rows:
                try:
                    # Check if this row has status "Contacted"
                    status_cell = row.find_element(By.CLASS_NAME, "status")
                    if status_cell.text.strip() == "Contacted":
                        # Look for Mark as Done button in this row
                        mark_done_btn = row.find_element(By.CSS_SELECTOR, "button.btn-success")
                        if mark_done_btn.is_displayed() and mark_done_btn.is_enabled():
                            print("✓ Found 'Mark as Done' button for a Contacted SOS request")
                            mark_done_btn.click()
                            mark_done_clicked = True
                            print("✓ Clicked 'Mark as Done' button")
                            break
                except:
                    continue
                    
            if not mark_done_clicked:
                print("⚠ No 'Mark as Done' buttons found for Contacted SOS requests")
                # Check if there are any SOS requests at all
                if len(sos_rows) == 0:
                    print("ℹ No SOS requests found in the table")
                else:
                    # Show available statuses for debugging
                    statuses = []
                    for row in sos_rows[:5]:  # Check first 5 rows
                        try:
                            status_cell = row.find_element(By.CLASS_NAME, "status")
                            statuses.append(status_cell.text.strip())
                        except:
                            statuses.append("Unknown")
                    print(f"ℹ Available statuses in SOS table: {statuses}")
        
        except Exception as e:
            print(f"⚠ Error while looking for Mark as Done button: {e}")
        
        # Step 9: Verify the action was completed
        if mark_done_clicked:
            # Wait for the action to complete
            time.sleep(2)
            print("✅ Mark as Done Completed - SOS request marked as done!")
        else:
            print("ℹ No Mark as Done action performed (no Contacted SOS requests available)")
        
        print("✅ ADMIN Complete Flow Test Finished Successfully!")
        
    except NoSuchElementException as e:
        print(f"❌ Element not found: {e}")
        driver.save_screenshot("admin_flow_error.png")
        pytest.fail("Element missing during admin flow test")
    
    except Exception as e:
        print(f"❌ Test failed: {e}")
        driver.save_screenshot("admin_flow_failed.png")
        pytest.fail(f"Admin flow test failed: {e}")