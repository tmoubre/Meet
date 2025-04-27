# Meet App

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-4.0-purple?logo=vite)
![PWA](https://img.shields.io/badge/PWA-Progressive%20Web%20App-orange?logo=googlechrome)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-blue?style=for-the-badge&logo=vercel)](https://meet-rouge.vercel.app/)


**Meet** is a social app where users can view events happening all around them and where they can look at event details and determine which events they want to attend.

## Table of Contents

- [About the App](#about-the-app)
- [User Stories](#user-stories)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [License](#license)

## About the App

Meet is a progressive web application (PWA) that provides users with a list of events happening in various cities. Users can filter events, view more details, set the number of events displayed, and even access the app offline.

## User Stories

- **Filter Events by Cities**  
  *As a user, I should be able to filter events by city, so that I can quickly find events happening in my preferred location.*

- **Show/Hide Event Details**  
  *As a user, I should be able to show or hide event details, so that I can view more information only when needed and keep the interface clean and organized.*

- **Specify Number of Events**  
  *As a user, I should be able to specify the number of events displayed, so that I can control the amount of information shown based on my preference.*

- **Use the App Offline**  
  *As a user, I should be able to use the app while offline, so that I can access event information even without an internet connection.*

- **Add an App Shortcut to the Home Screen**  
  *As a user, I should be able to add the app as a shortcut to my home screen, so that I can quickly access it like a native mobile app.*

- **Display Charts Visualizing Event Details**  
  *As a user, I should be able to view charts that visualize event data, so that I can better understand event trends and statistics at a glance.*

## Features

- Filter events by city
- Show/hide event details
- Set the number of events displayed
- Work offline with cached event data
- Add the app to the home screen
- Visualize event data with interactive charts

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tmoubre/Meet.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Meet
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm run dev
   ```

## Usage

- Open the app to view a list of upcoming events.
- Filter events by selecting a city from the search bar.
- Click on an event to show or hide its details.
- Adjust the number of events displayed using the settings input.
- Add the app to your home screen for easy access.
- Visualize event data trends through charts.

## Technologies Used

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Recharts](https://recharts.org/) (for data visualizations)
- [Google Calendar API](https://developers.google.com/calendar)
- [Jest](https://jestjs.io/) & [Puppeteer](https://pptr.dev/) (for testing)
- [Workbox](https://developer.chrome.com/docs/workbox/) (for offline functionality)
- [Progressive Web App (PWA)](https://web.dev/progressive-web-apps/)

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
