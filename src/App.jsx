import React, { useState, useEffect } from 'react';
import './App.css'; // Custom CSS file for styles

function App() {
  // States to store session and break length, and time left
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60); // Time left in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [timerLabel, setTimerLabel] = useState("Session");

  // Function to handle the start/stop button
  const handleStartStop = () => {
    setIsRunning(!isRunning);
  }

  const handleReset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel("Session");
    setIsRunning(false);

    // Stop the audio if it is playing and reset its position
    const beepSound = document.getElementById("beep");
    beepSound.pause();
    beepSound.currentTime = 0;
  };

  // Function to handle the session length
  const handleSessionLength = (e) => {
    if (!isRunning) {
      if (e.target.value === "-" && sessionLength > 1) {
        setSessionLength(sessionLength - 1);
        setTimeLeft((sessionLength - 1) * 60);
      } else if (e.target.value === "+" && sessionLength < 60) {
        setSessionLength(sessionLength + 1);
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  };

  // Function to handle the break length
  const handleBreakLength = (e) => {
    if (!isRunning) {
      if (e.target.value === "-" && breakLength > 1) {
        setBreakLength(breakLength - 1);
      } else if (e.target.value === "+" && breakLength < 60) {
        setBreakLength(breakLength + 1);
      }
    }
  };

  // Function to handle the countdown
  const handleCountdown = () => {
    if (isRunning) {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else if (timeLeft === 0) {
        const beepSound = document.getElementById("beep");
        beepSound.play();
        if (timerLabel === "Session") {
          setTimerLabel("Break");
          setTimeLeft(breakLength * 60);
        } else {
          setTimerLabel("Session");
          setTimeLeft(sessionLength * 60);
        }
      }
    }
  };

  // useEffect to handle the countdown
  useEffect(() => {
    const timer = setInterval(handleCountdown, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isRunning, timerLabel, breakLength, sessionLength]); // Added dependencies to avoid stale closures

  // Function to format the time left
  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // JSX code for the app
  return (
    <div className="app">
      <h1>Pomodoro Clock</h1>
      <div className="length-control">
        <div id="break-label">Break length</div>
        <button id="break-decrement" value="-" onClick={handleBreakLength}>-</button>
        <span id="break-length">{breakLength}</span>
        <button id="break-increment" value="+" onClick={handleBreakLength}>+</button>
      </div>

      <div className="length-control">
        <div id="session-label">Session length</div>
        <button id="session-decrement" value="-" onClick={handleSessionLength}>-</button>
        <span id="session-length">{sessionLength}</span>
        <button id="session-increment" value="+" onClick={handleSessionLength}>+</button>
      </div>

      <div id="timer-label">{timerLabel}</div>
      <div id="time-left">{formatTime(timeLeft)}</div>
      <button id="start_stop" onClick={handleStartStop}>{isRunning ? 'Stop' : 'Start'}</button>
      <button id="reset" onClick={handleReset}>Reset</button>

      {/* Audio element for beep sound */}
      <audio id="beep" src="https://www.soundjay.com/button/beep-07.wav" />
    </div>
  );
}

export default App;
