# Pomodoro Timer PWA

Pomodoro Timer is a Progressive Web App (PWA) designed to help users manage their time using the Pomodoro Technique. The app includes two web components for countdown and sound functionality, with configurable attributes. It also features global styles for a cohesive user experience.

## Features

- Pomodoro timer for focused work sessions
- Break timer for rest periods
- Countdown timer for general use
- Configurable timer values
- Customizable finish messages
- Responsive design
- Service Worker for offline capabilities

## Installation

### Prerequisites

- Node.js
- npm

### Steps

1. Clone the repository:

```bash
   git clone https://github.com/yourusername/pomodoro-timer-pwa.git
   cd pomodoro-timer-pwa
```

2. Install dependencies:

```bash
npm install
```

Build the project:

```bash
npm run build
```

3. Start the development server:

```bash
npm start
```

Usage
-----

### Web Components

A customizable timer component.

Attributes:

*   start: The start time of the timer in seconds.
    
*   finish-message: The message displayed when the timer finishes.
    
*   reverse: Boolean indicating if the timer counts down.
    

A component that controls the timer with play, pause, and reset buttons.

Attributes:

*   play-btn: Boolean to display the play button.
    
*   pause-btn: Boolean to display the pause button.
    
*   reset-btn: Boolean to display the reset button.
    
*   finish-message: The message displayed when the timer finishes.
    

A component to play a sound when the timer finishes.

Attributes:

*   src: The source URL of the sound file.
    

### App Component

The main app component combines these web components to create a functional Pomodoro timer.

#### Properties

*   timerValue: The current timer value.
    
*   finishMessage: The message displayed when the timer finishes.
    
*   \_isPomodoro: Boolean indicating if the Pomodoro mode is active.
    
*   \_isTimer: Boolean indicating if the countdown timer mode is active.
    
*   \_pomodoroTimer: Object containing the Pomodoro timer settings.
    
*   \_breakTimer: Object containing the break timer settings.
    

### Styles

Global styles are defined in global.scss. Key styles include:

*   .primary-button: Styles for primary buttons.
    
*   .pomodoro-container: Styles for the Pomodoro timer container.
    
*   .timer-container: Styles for the countdown timer container.
    

### Events

*   isFinished: Triggered when a timer finishes.
    
*   playEvent: Triggered when the timer starts.
    
*   pauseEvent: Triggered when the timer pauses.
    
*   resetEvent: Triggered when the timer resets.
    

Contributing
------------

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
    
2.  Create a new branch (git checkout -b feature-branch).
    
3.  Make your changes.
    
4.  Commit your changes (git commit -am 'Add new feature').
    
5.  Push to the branch (git push origin feature-branch).
    
6.  Create a new Pull Request.
    

License
-------

This project is licensed under the ISC License.

Acknowledgments
---------------

*   [LitElement](https://lit.dev/) for the web components framework.
    
*   [Netlify](https://www.netlify.com/) for deployment.