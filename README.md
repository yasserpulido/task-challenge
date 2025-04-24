# Frontend Challenge

This repository contains a simple task management application that needs several improvements and migrations. Your challenge is to implement these changes while maintaining and enhancing the application's functionality.

## Current Application

The application is a simple task manager that allows users to:

- View a list of tasks
- Add new tasks
- Edit existing tasks
- Delete tasks

The data is fetched from JSONPlaceholder API.

## Challenge Requirements

Your task is to improve this application by implementing the following requirements:

1. **Replace react-scripts with Webpack**

   - Configure Webpack from scratch
   - Include necessary loaders and plugins
   - Configure development and production builds

2. **Migrate to TypeScript**

   - Convert all JavaScript files to TypeScript
   - Add proper type definitions
   - Configure TypeScript compiler options

3. **Implement Material UI**

   - Replace current styling with Material UI components
   - Create a cohesive, user-friendly interface
   - Implement responsive design

4. **Integrate React Query**

   - Replace current Axios implementations with React Query
   - Implement proper caching strategies
   - Handle loading and error states

5. **Improve Logic and UI**

   - Enhance the overall user experience
   - Optimize performance where possible
   - Add any features you think would improve the application

6. **Add Unit Tests**
   - Write unit tests for components
   - Ensure proper test coverage
   - Implement testing best practices

## Evaluation Criteria

Your submission will be evaluated based on:

- Code quality and organization
- Implementation of all requirements
- Performance optimizations
- UI/UX improvements
- Test coverage

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the current application:
   ```
   npm start
   ```

## Submission Guidelines

1. Create a new repository with your implementation
2. Make your repository public
3. Include a README with:
   - Instructions on how to run the application
   - Explanation of your approach
   - Any decisions or trade-offs you made
   - Further improvements you would make with more time
4. Send the repository URL by email with the subject "Frontend Challenge Submission - [Your Name]"
5. Please complete the challenge within 7 days of receiving it

## Bonus Points

- Adding a state management solution
- Implementing form validation
- Adding authentication
- Implementing a dark/light theme toggle
- Dockerizing the application

Good luck!

## Instructions on how to run the application

1. Clone the repository:

   ```
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Run the application:

   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

5. To run tests, use the following command:

   ```
   npm test
   ```

6. To build the application for production, use the following command:

   ```
   npm run build
   ```

7. To run the application in production mode, use the following command:

   ```
   npm install -g serve
   serve -s dist
   ```

## Explanation of your approach

- I started by analyzing the existing codebase and identifying areas for improvement.
- I set up Webpack from scratch, configuring loaders for TypeScript and CSS, and plugins for HTML generation and optimization.
- I migrated the JavaScript files to TypeScript, adding type definitions and configuring the TypeScript compiler options.
- I replaced the existing styling with Material UI components, ensuring a cohesive and responsive design.
- I integrated React Query for data fetching, replacing Axios and implementing caching strategies.
- I improved the overall user experience by optimizing performance and enhancing the UI/UX.
- I wrote unit tests for components, ensuring proper test coverage and following testing best practices.
- I added state management using Zustand for better state handling and performance optimization.
- I implemented form validation using React Hook Form for better user input handling.
- I added authentication prototype using Zustand.
- I implemented a dark/light theme toggle using Material UI's theming capabilities.
- I dockerized the application for easier deployment and scalability.

## Any decisions or trade-offs you made

- I chose Zustand for state management due to its simplicity and performance, avoiding the complexity of Redux.
- I used localStorage for caching data in the browser, which is a simple solution for persisting data across sessions.

## Further improvements you would make with more time

- Implement a more robust authentication system.
- Add more comprehensive error handling and user feedback mechanisms.
- Extract logic to make components more reusable and maintainable.

## Running the App with Docker

1. Build the Docker image:

   ```
   docker build -t react-challenge .
   ```

2. Run the Docker container:

   ```
   docker run -d -p 3000:80 react-challenge
   ```

3. Open your browser and navigate to `http://localhost:3000` to view the application.

4. To stop the Docker container, use the following command:

   ```
   docker ps # Get the container ID
   docker stop <container-id>
   ```

### Why Docker?

- Docker allows for easy deployment and scalability of the application.