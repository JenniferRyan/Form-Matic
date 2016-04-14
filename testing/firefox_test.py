# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re


class FirefoxTestCase(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "http://glasnost.itcarlow.ie"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_ide(self):
        driver = self.driver
        driver.get(self.base_url + "/~jen/test_form.html")
        driver.find_element_by_id("name").clear()
        driver.find_element_by_id("name").send_keys("Jennifer")
        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("jen@gmail.com")
        driver.find_element_by_id("phone").clear()
        driver.find_element_by_id("phone").send_keys("0862222289")
        driver.find_element_by_id("website").clear()
        driver.find_element_by_id("website").send_keys("http://test.com")
        driver.find_element_by_id("subject").clear()
        driver.find_element_by_id("subject").send_keys("Testing Form")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("14567")
        driver.find_element_by_id("confirm_passwd").clear()
        driver.find_element_by_id("confirm_passwd").send_keys("1425")
        driver.find_element_by_css_selector("input[type=\"submit\"]").click()
    
    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True
    
    def is_alert_present(self):
        try: self.driver.switch_to_alert()
        except NoAlertPresentException as e: return False
        return True
    
    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True
    
    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
