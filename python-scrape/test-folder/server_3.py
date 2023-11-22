# Your goal is to look through the provided file for the appropriate CSS selector to write Python code that scrapes job postings' titles and locations. For example, one of the posting titles is "Software Intern (Spring-Summer/Summer-Fall" and the location is "Liverpool, NY". You must use the correct CSS selector that works with the provided file.

from bs4 import BeautifulSoup
import requests

# URL of the page to scrape (replace with the actual URL)
url = "https://www.linkedin.com/jobs/search?keywords=Software%20Engineering%20Intern&location=United%20States&geoId=103644278&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0"

# Make a request to the website
response = requests.get(url)
html = response.content

# Parse the HTML content
soup = BeautifulSoup(html, "html.parser")

# Extract job titles and locations
job_titles = soup.select(".base-search-card__title")
job_locations = soup.select(".job-search-card__location")

# Loop through the results and print them
for title, location in zip(job_titles, job_locations):
    print(f"Job Title: {title.text.strip()}")
    print(f"Location: {location.text.strip()}\n")
