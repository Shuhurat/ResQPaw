# vetDelete_debug.py
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException, StaleElementReferenceException
import time
import sys
import pathlib

OUTDIR = pathlib.Path.cwd() / "selenium_debug"
OUTDIR.mkdir(exist_ok=True)

def save_debug(driver, name):
    ts = int(time.time())
    html_path = OUTDIR / f"{name}_{ts}.html"
    png_path = OUTDIR / f"{name}_{ts}.png"
    try:
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(driver.page_source)
    except Exception as e:
        print("Failed saving page_source:", e)
    try:
        driver.save_screenshot(str(png_path))
    except Exception as e:
        print("Failed saving screenshot:", e)
    print(f"Saved debug files: {html_path} , {png_path}")

def find_row_with_text(driver, text, timeout=5):
    """
    Try several XPath strategies to find a table row that contains the text.
    Returns the WebElement for the <tr> or raises TimeoutException.
    """
    # case-insensitive XPath using translate()
    xpath_case_insensitive = (
        f"//table//tr[.//text()[contains(translate(., '{text.upper()}', '{text.lower()}'), '{text.lower()}')]]"
    )
    # simpler contains (fallback)
    xpath_contains = f"//table//tr[td[contains(., '{text}')]]"
    xpaths = [xpath_case_insensitive, xpath_contains]
    end = time.time() + timeout
    while time.time() < end:
        for xp in xpaths:
            try:
                rows = driver.find_elements(By.XPATH, xp)
                if rows:
                    return rows[0]
            except StaleElementReferenceException:
                continue
        time.sleep(0.3)
    raise TimeoutException(f"Row containing '{text}' not found using XPaths: {xpaths}")

def main():
    driver = webdriver.Chrome()
    driver.maximize_window()
    vet_name = "Dr. Tania Rahman"   # change to the exact visible text if needed
    try:
        driver.get("http://localhost:5223/Identity/Account/Login")

        # login
        driver.find_element(By.NAME, "Input.Email").send_keys("admin@resqpaw.com")
        driver.find_element(By.NAME, "Input.Password").send_keys("Admin@123")
        driver.find_element(By.ID, "login-submit").click()

        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.ID, "adminDashboardLink"))
        )
        print("✅ Login successful!")

        # go to vet list
        driver.get("http://localhost:5223/Admin/Vets")
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.TAG_NAME, "table"))
        )
        print("✅ Vet list loaded")

        # find the row with the vet name (robust)
        try:
            row = find_row_with_text(driver, vet_name, timeout=8)
        except TimeoutException as e:
            print("❌ Could not find vet row:", e)
            save_debug(driver, "vet_row_not_found")
            raise

        # try to find a Delete link/button inside that row
        # allow different possibilities: <a> with text Delete, <button> with text Delete, or form/action
        delete_candidates = row.find_elements(By.XPATH, ".//a[contains(translate(., 'DELETE', 'delete'), 'delete')]|.//button[contains(translate(., 'DELETE', 'delete'), 'delete')]|.//input[@type='submit' and contains(translate(@value,'DELETE','delete'),'delete')]")
        if not delete_candidates:
            print("❌ No Delete link/button found in the row for:", vet_name)
            save_debug(driver, "delete_not_found_in_row")
            raise NoSuchElementException("Delete link/button not found inside row")

        delete_el = delete_candidates[0]
        # scroll to it and click via JS
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", delete_el)
        time.sleep(0.5)
        driver.execute_script("arguments[0].click();", delete_el)
        print("➡️ Clicked Delete link — waiting for Delete confirmation page...")

        # Wait for either the presence of confirm button or a URL change indicating we're on the delete page
        try:
            # prefer waiting for confirm button
            confirm = WebDriverWait(driver, 12).until(
                EC.presence_of_element_located((By.ID, "confirmDeleteButton"))
            )
        except TimeoutException:
            # fallback: wait for url change (Delete page often contains /Vet/Delete or /Vet/Delete/{id})
            print("⚠️ confirmDeleteButton not found quickly — trying to detect page navigation")
            WebDriverWait(driver, 10).until(lambda d: "/Vet/Delete" in d.current_url or "/Delete" in d.current_url)
            # try to find confirm now
            confirm = WebDriverWait(driver, 8).until(
                EC.presence_of_element_located((By.ID, "confirmDeleteButton"))
            )

        # click confirm (JS click)
        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", confirm)
        time.sleep(0.3)
        driver.execute_script("arguments[0].click();", confirm)
        print("✅ Confirm Delete clicked — waiting for row removal...")

        # after deletion we expect the row to be gone; wait by checking invisibility of the original row xpath
        # build xpath for that vet name again
        xpath_row = f"//table//tr[td[contains(., '{vet_name}')]]"
        WebDriverWait(driver, 15).until(EC.invisibility_of_element_located((By.XPATH, xpath_row)))
        print("✅ Vet row disappeared — deletion confirmed.")

    except Exception as exc:
        print("❌ Delete Vet Test Failed: Message:", exc)
        try:
            save_debug(driver, "delete_error")
        except Exception as e2:
            print("Failed to save debug:", e2)
        raise

    finally:
        driver.quit()

if __name__ == "__main__":
    main()
