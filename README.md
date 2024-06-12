# Discord Bot Application

## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Set up the environment variables:
   Create a `.env` file in the root directory and add the following:
   ```sh
   DISCORD_BOT_TOKEN=<your-discord-bot-token>
   DISCORD_CHANNEL_ID=<your-discord-channel-id>
   GIPHY_API_KEY=<your-giphy-api-key>
   ```

## Running the Application

1. Run database migrations
   ```sh
   npm run migrate:latest
   npm run gen:types
   ```
2. Run the bot:

   ```sh
   npm start

   ```

3. The bot should now be running and connected to the specified Discord channel. You should see a log message indicating the bot is logged in.

## Usage

### Interacting with the Application

The application has several Express routes for managing messages, templates, and sprints. Below are examples of how to interact with the API.

#### Managing Templates

- GET /templates - fetches all templates;
- GET /templates/:id - fetches template with specified id;
- POST /templates - creates new template.
  Request Body: `{"text":"your message template"}`
- PATCH /templates/:id patches the template with the specified ID.
  Request Body: `{"text":"your message template"}`
- DELETE /templates/:id deletes the template with the specified ID.

#### Managing Sprints

- GET /sprints - fetches all sprints;
- GET /sprints/:id - fetches sprints with specified id;
- POST /sprints - creates a new sprint.
  Request Body: `{"sprintsCode":"sprintCode1", "title":"Sprint title"}`
- PATCH /sprints/:id patches the sprint with the specified ID.
  Request Body: `{"sprintsCode":"sprintCode1", "title":"Sprint title"}`
- DELETE /sprints/:id deletes the sprint with the specified ID.

#### Managing Messages

- POST /messages - fetches random gif from Giphy, creates a message and sends to Discord channel.;
  Request Body: `{"name":"user123", sprintsCode:"sprintCode1"}`
- GET /messages - fetches all sent messages.
- GET /messages?username=user_name - fetches all sent messages with the specified user name.
- GET /messages?sprint=sprintCode1 - fetches all sent messages with the specified sprint.

# 3.2.4 task repository: https://github.com/Daliusj/ticket-booking.git
