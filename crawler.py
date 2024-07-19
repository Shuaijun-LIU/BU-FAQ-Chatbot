from bs4 import BeautifulSoup
import requests
import json


def fetch_url_content(url):
    """
    Fetch the main content from a given URL.
    Returns the text content of the main part of the webpage or an error message if the request fails.
    """
    try:
        print(f"Fetching content from URL: {url}")
        response = requests.get(url)
        response.raise_for_status()  # Check if the request was successful
        soup = BeautifulSoup(response.content, 'html.parser')

        # Try to find the main content of the webpage (adjust selectors based on actual webpage structure)
        main_content = soup.find('main')
        if not main_content:
            main_content = soup.find('div', class_='main-content')  # Example of another common selector
        if not main_content:
            main_content = soup.body  # Fallback to body if no specific main content is found

        return main_content.get_text(separator='\n', strip=True)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL {url}: {e}")
        return "Error fetching content"


def fetch_and_parse_faq(url):
    """
    Fetch and parse the FAQ page from the given URL.
    Extracts modules, questions, answers, and URLs from the page and saves them to a JSON file.
    """
    print("Fetching the FAQ page...")
    response = requests.get(url)
    html_content = response.content
    print("Page fetched successfully.")

    print("Parsing the HTML content...")
    soup = BeautifulSoup(html_content, 'html.parser')
    print("Parsing completed.")

    # Container for all FAQ data
    faq_data = []

    # Define the selectors for the first module '#home' and subsequent modules '#menu1' to '#menu7'
    module_selectors = ['#home'] + [f'#menu{i}' for i in range(2, 9)]
    module_names = [
        "Programs", "Admissions", "Program Prerequisites", "Registration",
        "Program Requirements", "Program Completion", "International Students", "Other"
    ]

    # Iterate over each module
    for selector, name in zip(module_selectors, module_names):
        print("\n")
        print(f"*** Processing module: {name}")
        module = soup.select_one(f'{selector} > h4')
        module_name = module.text.strip() if module else name

        # Extract questions and answers
        questions = soup.select(f'{selector} > div > h3')
        answers = soup.select(f'{selector} > div > div')

        # Iterate over each question-answer pair and create a dictionary for each
        for question, answer in zip(questions, answers):
            answer_text = answer.text.strip()
            print(f"Processing question: {question.text.strip()}")

            # Find all links in the answer
            links = answer.find_all('a')
            link_data = []
            for link in links:
                link_url = link['href']
                link_text = link.text.strip()
                print(f"Found link: {link_text} -> {link_url}")
                if 'mailto:' in link_url:
                    answer_text += f" {link_text} ({link_url})"
                else:
                    link_content = fetch_url_content(link_url)
                    link_data.append({
                        "text": link_text,
                        "url": link_url,
                        "content": link_content
                    })

            faq_data.append({
                "module": module_name,
                "question": question.text.strip(),
                "answer": answer_text,
                "urls": link_data
            })

    # Save the data as a JSON file
    json_file_path = './faq_data/BU_MET_FAQs.json'
    with open(json_file_path, 'w') as json_file:
        json.dump(faq_data, json_file, indent=4)
    print("\n")
    print("----------------------- OVER ------------------------")

    return f"FAQ data has been saved to {json_file_path}"


# URL of the FAQ page
url = 'https://www.bu.edu/csmet/students/faq/'

# Call the function with the URL
result_message = fetch_and_parse_faq(url)
print(result_message)