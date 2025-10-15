from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
import time


driver = webdriver.Chrome()  

try:
   
    driver.get("http://localhost:5223/Identity/Account/Login")

  
    username = driver.find_element(By.NAME, "Input.Email")
    password = driver.find_element(By.NAME, "Input.Password")

    
    username.send_keys("vet5@gmail.com")
    password.send_keys("MuMVq5u2zXs@DQ3")

   
    driver.find_element(By.ID, "login-submit").click()

    
    time.sleep(3)

   
    if "" in driver.title or "" in driver.current_url:
        print(" Login Test Passed!")
    else:
        print(" Login Test Failed!")
        driver.save_screenshot("login_error.png")

except NoSuchElementException as e:
    print(" Element not found:", e)
    driver.save_screenshot("login_error.png")

finally:
    driver.quit()
