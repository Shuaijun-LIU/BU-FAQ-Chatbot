# BU-FAQ-Chatbot

This project is designed to help BU students ask and get answers to their questions efficiently. The system supports both **NLP-based** and **GPT-based** question answering. Users can register, log in, and start asking questions right away.

### 👍 Advisor
| **Prof. Alex Elentukh** |
|-------------------------|

## 🎨 Project Structure

```
BU-FAQ-Chatbot/
│
├── controllers/
│   └── authController.js
│
├── data/
│   ├── BU_FAQs.csv
│   └── BU_FAQs.json
│
├── models/
│   ├── Question.js
│   └── User.js
│
├── node_modules/
│
├── public/
│   ├── css/
│   │   ├── admin.css
│   │   ├── chat.css
│   │   ├── faq-management.css
│   │   ├── home.css
│   │   ├── register.css
│   │   ├── upload.css
│   │   └── gpt-chat.css
│   │
│   ├── images/
│   │
│   ├── js/
│   │   ├── admin.js
│   │   ├── app.js
│   │   ├── common.js
│   │   ├── faq-management.js
│   │   ├── register.js
│   │   ├── upload.js
│   │   └── gpt-chat.js
│   │
│   ├── admin.html
│   ├── chat.html
│   ├── faq-management.html
│   ├── index.html
│   ├── register.html
│   ├── upload.html
│   └── gpt-chat.html
│
├── routes/
│   ├── auth.js
│   ├── pages.js
│   ├── questions.js
│   └── openai.js
│
├── uploads/
│   └── 1723309227575.png
│
├── .env
├── .gitignore
├── scheduler.js
├── server.js
├── package-lock.json
├── package.json
├── README.md
└── crawler.py
```

### 📝 File Descriptions

- **`node_modules/`**: Contains the Node.js modules required by the project. Automatically generated by the `npm install` command.
- **`.gitignore`**: Specifies files and directories that should be ignored by Git.
- **`.env`**: Stores environment variables such as database connection strings and JWT secrets.
- **`package.json`**: Lists project dependencies and scripts. Defines the Node.js modules required and scripts that can be run.
- **`server.js`**: Main server file that sets up the Express application, connects to the MongoDB database, and defines routes.
- **`README.md`**: Project documentation file.
- **`public/`**: Contains static files for the front-end, including HTML, CSS, images, and JavaScript files.
  - **`css/`**: Directory for CSS files.
    - **`admin.css`**: Styles specific to the admin dashboard.
    - **`chat.css`**: Styles specific to the chat page.
    - **`faq-management.css`**: Styles specific to the FAQ management page.
    - **`home.css`**: Styles specific to the home page.
    - **`register.css`**: Styles specific to the registration page.
    - **`upload.css`**: Styles specific to the upload page.
    - **`gpt-chat.css`**: Styles specific to the GPT chat page.
  - **`images/`**: Directory for image files.
  - **`js/`**: Directory for JavaScript files.
    - **`admin.js`**: JavaScript logic for the admin dashboard.
    - **`app.js`**: Main JavaScript file for handling front-end logic, including form submission and page interactions.
    - **`common.js`**: Contains shared JavaScript functions used across different pages.
    - **`faq-management.js`**: JavaScript logic for FAQ management.
    - **`register.js`**: JavaScript logic for user registration.
    - **`upload.js`**: JavaScript logic for the file upload page.
    - **`gpt-chat.js`**: JavaScript logic for the GPT chat page.
  - **`admin.html`**: HTML file for the admin dashboard.
  - **`chat.html`**: HTML file for the chat page.
  - **`faq-management.html`**: HTML file for managing FAQs.
  - **`index.html`**: HTML file for the home page.
  - **`register.html`**: HTML file for the registration page.
  - **`upload.html`**: HTML file for the upload page.
  - **`gpt-chat.html`**: HTML file for the GPT chat page.
- **`routes/`**: Contains route definition files for the Express application.
  - **`auth.js`**: Defines routes for user authentication, including registration and login.
  - **`pages.js`**: Defines routes for serving HTML pages.
  - **`questions.js`**: Defines routes for handling Q&A functionality.
  - **`openai.js`**: Defines routes for handling GPT chat functionality.
- **`controllers/`**: Contains controller files that handle the logic for various routes.
  - **`authController.js`**: Handles logic related to user authentication.
- **`models/`**: Contains data models for the application.
  - **`Question.js`**: Defines the schema and methods for the Question model.
  - **`User.js`**: Defines the schema and methods for the User model, including password hashing and comparison.
- **`data/`**: Contains data files used by the application.
  - **`BU_MET_FAQs_big.json`**: JSON file containing a larger set of frequently asked questions and answers.
  - **`BU_MET_FAQs.json`**: JSON file containing frequently asked questions and answers.
- **`uploads/`**: Contains uploaded files such as user profile images.
- **`scheduler.js`**: Script to run automatically once a week and call `crawler.py` to crawl data.
- **`crawler.py`**: Script to obtain Q&A data from the BU official website.


## 🌐 Project Pages

1. **Home Page (`/`)**: The landing page with a brief introduction about the project.
2. **NLP-Chat Page (`/chat`)**: Page where users can ask and get answers to their questions Based on NLP.
3. **GPT-Chat Page (`/gpt-chat`)**: Page where users can ask and get answers to their questions Based on GPT-4o.
4. **FAQ Management Page (`/faq-management`)**: Page for admins to manage frequently asked questions and their answers.
5. **Admin Dashboard (`/admin`)**: Dashboard for admins to manage profiles and site settings.
6. **Registration Page (`/register`)**: Page where new users can register.
7. **Upload Page (`/upload`)**: Page for uploading files related to the project.


## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14.x or higher)
- **npm** (v6.x or higher)
- **MongoDB** (for user authentication)

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/
    cd my_project
    ```

2. **Install the dependencies:**
    ```sh
    npm install
    ```

3. **Install `nodemon` as a dev dependency to automatically restart the server on changes:**
    ```sh
    npm install --save-dev nodemon
    ```

### Configuration

1. **Ensure MongoDB is running on your system.** The default configuration assumes MongoDB is running on `mongodb://localhost:27017/qawebapp`. You can adjust this in the `.env` file.

2. **Create a `.env` file in the project root and add the following configurations:**
    ```plaintext
    MONGO_URI=mongodb://localhost:27017/qawebapp
    JWT_SECRET=693519
    ```

### Running the Project

**Start the server using `nodemon`:**
```sh
npx nodemon server.js
```

**Alternatively, you can start the server directly with `node`:**
```sh
node server.js
```

### Accessing the Application

Once the server is running, open your web browser and navigate to:

```
http://localhost:3000
```

You will see the home page of the FAQ Project. From here, you can navigate to different pages using the navigation bar.

## 🤝 Contributing

1. **Fork the repository.**
2. **Create a new branch (`git checkout -b feature-branch`).**
3. **Make your changes.**
4. **Commit your changes (`git commit -am 'Add new feature'`).**
5. **Push to the branch (`git push origin feature-branch`).**
6. **Create a new Pull Request.**

## 📜 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.

## 🙏 Acknowledgements

- **Boston University**
