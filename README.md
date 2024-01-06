
# Quizzer

Quizzer is an Express application. It allows users to take quizzes, answer questions, and receive analysis on their performance. It is designed to be user-friendly, secure, and intuitive.


## Features

- Log in to your profile and start attempting the quiz assigned to you.
- User friendly interface. Start the quiz when ready. Mark your answers and finish in the given time or earlier!
- Analyse your performance after completion.
- Persistent user sessions across multiple visits. Support for afterwards analysis.
- Incorporate mathematical equations seamlessly into the questions, employing recognized mathematical notation and ensuring a clear and structured presentation.
- Manage users and all of the user data.
- Capability to oversee both user and their recorded responses for each question within the database.





## Technologies Utilized
- **Express.js**: The core technology for building the backend of the application, handling routing, middleware, and server-side logic.
- **Node.js**: Runtime environment for executing the JS on server.
- Express **middleware** for handling form data.
- Front end using **HTML** **CSS** and client side **Javascipt**. Static files served using express.
- Database **MySQL**.
- Version control using **git**.


## Getting Started

### Prerequisites
- Node.js - Make sure you have Node.js installed. https://nodejs.org/en/download/
- MySQL: This application uses MySQL as the database. You will need basic MySQL queries. Oracle MySQL https://www.mysql.com/downloads/
 - Configuration: During the installation, you'll be asked to set a root password for MySQL. Remember this password, as you'll need it later. Also, make note of the host (usually localhost) and port used by MySQL.

- Start MySQL Server: After installation, start the MySQL server using the provided command or by starting the MySQL service.
- Navigate to project directory.


### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_URI`


### Installation
- Download this repository or clone in your local system.


    ```
    cd Quiz
    ```
- Create Database: Once MySQL is up and running, you need to create a database for the application. You can use MySQL's command-line tool or a graphical tool like MySQL Workbench.
    ```sql
    CREATE DATABASE quizdb;
    ```
    ```sql
    USE quizdb;
    ```
- Update Configuration: In your project's ./database.js file, update the database configuration section with your MySQL credentials:
    ```javascript
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'your_mysql_username',
        password: 'your_mysql_password',
        database: 'quizdb'
        //Port number may be needed to changed here if not  using default MySQL port
    });
    ```
    - Replace 'your_mysql_username' and 'your_mysql_password' with the MySQL credentials you set during installation.
- Install the required dependencies:
    ```
    npm install
    ```
- Finally:
    ```
    npm start
    ```
    should fire the server.
---
- Open your web browser and navigate to http://localhost:3000 to access the application. 

### Notes
- The application may require additional configuration depending on your setup and requirements. (To change port number, do so in app.js). 
 
## Anticipated Developments
- Additions to the server security during the quiz.
- Addition of features such as user generated content addition interface for adding questions, options etc.
- Difficulty levels and question categories.
- Social sharing and email notifications.
- Admin controls and profile. 
- Leaderboard and user-feedback.

More contributions are most welcome.




## Authors
- Abhinav Deshpande
    [Abhinav-gh](https://github.com/Abhinav-gh/)

## Acknowledgements

- Web Development with Node and Express: book by Ethan Brown.
- Chatgpt
- Stack overflow

