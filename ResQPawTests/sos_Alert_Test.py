from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException

import time


driver = webdriver.Chrome()  
driver.maximize_window()

try:

    driver.get("http://localhost:5223/Identity/Account/Login")
    
    username = driver.find_element(By.NAME, "Input.Email")
    password = driver.find_element(By.NAME, "Input.Password")

    
    username.send_keys("user25@gmail.com")
    password.send_keys("h2ZKZPbd35m@kkH")

   
    driver.find_element(By.ID, "login-submit").click()

    
    time.sleep(3)

   
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "customerDashboardLink"))  
    )
    print("✅ Login successful!")








   

    driver.find_element(By.ID, "sosBtn").click()

    driver.find_element(By.ID, "callEmergency").click()


    

    WebDriverWait(driver, 5).until(
        EC.url_to_be("http://localhost:5223/SOS/Send")
    )


        
  
    driver.find_element(By.NAME, "EmergencyType").send_keys("Injury")         # Emergency Type
    driver.find_element(By.NAME, "AnimalType").send_keys("Dog")              # Animal Type
    driver.find_element(By.NAME, "AnimalCondition").send_keys("Bleeding")    # Animal Condition
    driver.find_element(By.NAME, "Description").send_keys("Leg injured, needs urgent care") # Description
    driver.find_element(By.NAME, "Address").send_keys("Banani, Dhaka")       # Location Found
    driver.find_element(By.NAME, "ReporterName").send_keys("John Doe")       # Reporter Name
    driver.find_element(By.NAME, "ReporterPhone").send_keys("01712345678")   # Reporter Phone
    driver.find_element(By.NAME, "ReporterEmail").send_keys("johndoe@gmail.com") # Reporter Email

  

   # file_input = driver.find_element(By.NAME, "MediaFiles")
    # Provide the full path to your test image/video


  

    print("submitted all form fields.")

 
    driver.find_element(By.ID, "submitBtn").click()  

  
    
    WebDriverWait(driver, 15).until(
        EC.url_contains("/SOS/Status")
    )
    print(" Redirected to /SOS/Status page!")

    try:
        success_message = WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.ID, "statusSuccessMessage"))
        )
        print(" SOS Alert submitted successfully!")
        print("Message:", success_message.text)
    except TimeoutException:
        print(" Success message not found. Submission may have failed.")
        driver.save_screenshot("sos_submission_failed.png")

    
except NoSuchElementException as e:
    print(" Element not found:", e)
    driver.save_screenshot("sos_error.png")

finally:
    
    driver.quit()
