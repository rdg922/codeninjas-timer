import { useState, useEffect } from "react";
import "./App.css";

const activities = {
  CODING: "CODING",
  TYPING: "TYPING",
  STEAM: "STEAM",
};

const nextActivities = {};
nextActivities[activities.CODING] = activities.TYPING;
nextActivities[activities.TYPING] = activities.STEAM;
nextActivities[activities.STEAM] = activities.CODING;

const activitiesTime = {}; // in minutes
activitiesTime[activities.CODING] = 1000 * 60 * 40;
activitiesTime[activities.TYPING] = 1000 * 60 * 10;
activitiesTime[activities.STEAM] = 1000 * 60 * 10;

const screens = {
  HOME: "HOME",
  TRANSITION: "TRANSITION",
  SETTINGS: "SETTINGS",
};

function App() {
  const [time, setTime] = useState(new Date().getTime());
  const [currentScreen, setCurrentScreen] = useState(screens.HOME);
  const [currentActivity, setCurrentActivity] = useState(activities.CODING);
  const [nextActivityTime, setNextActivityTime] = useState(
    getRoundedDownTime(new Date().getTime() + activitiesTime[currentActivity])
  );

  useEffect(() => {
    const timer = setInterval(() => {
      let newTime = new Date().getTime();
      setTime(newTime);
      if (newTime > nextActivityTime) {
        let nextActivity = nextActivities[currentActivity];
        setCurrentActivity(nextActivity);
        setNextActivityTime(
          getRoundedDownTime(nextActivityTime + activitiesTime[nextActivity])
        );
      }
    }, 1000);
    return () => {
      clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
    };
  }, [time, currentActivity, nextActivityTime]);

  return (
    <div className="App">
      <div className="bg">
        <div className="bg-ball-1" />
        <div className="bg-ball-2" />
        <div className="bg-ball-3" />
      </div>

      <button
        onClick={() => {
          if (currentScreen === screens.HOME) {
            setCurrentScreen(screens.SETTINGS);
          } else {
            setCurrentScreen(screens.HOME);
          }
        }}
        className="settings"
      >
        ⚙️
      </button>
      <div />
      <div className="time">
        <p>{timeToString(time, true)}</p>
      </div>

      <div className="frame">
        <div className="ocean">
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
        </div>
        <div className="ninjas ninja-1" />
        <div className="ninjas ninja-2" />
        <div className="ninjas ninja-3" />
        {currentScreen === screens.HOME ? (
          <>
            <p className="timer-text-top">
              We are on <br /> <span>{currentActivity}</span> time!
            </p>

            <p className="timer-text-bottom">
              <span>{getNextActivity()}</span> starts @{" "}
              {timeToString(nextActivityTime)}
            </p>
          </>
        ) : (
          <div className="settings-frame">
            <p>Next Activity</p>
            <div className="settings-frame-change">
              <p>{getNextActivity()}</p>
              <input
                type="text"
                placeholder={timeToString(nextActivityTime)}
                onKeyPress={onNextActivityTimeChange}
              />
            </div>
          </div>
        )}
      </div>

      <div className="credits">
        <p>By Sensei Ro</p>
      </div>
    </div>
  );

  function onNextActivityTimeChange(e) {
    if (e.code === "Enter") {
      e.preventDefault();
      let newTimeSplit = e.target.value.split(":");
      let newTime =
        Math.floor(new Date().getTime() / 1000 / 60 / 60 / 24) *
          (1000 * 60 * 60 * 24) +
        4 * 1000 * 60 * 60; // Only works in GMT4 time zone lol
      if (new Date(nextActivityTime).getHours() > 12) {
        newTime += 1000 * 60 * 60 * 12;
      }

      newTime += 1000 * 60 * 60 * parseInt(newTimeSplit[0]); // Add hours
      newTime += 1000 * 60 * parseInt(newTimeSplit[1]); // Add minutes

      setNextActivityTime(newTime);
      setCurrentScreen(screens.HOME);
    }
  }

  function timeToString(time, includeSuffix = false) {
    let activityHour = new Date(time).getHours() % 12;

    if (activityHour === 0) {
      activityHour = 12;
    }

    let activityMinutes = String(new Date(time).getMinutes()).padStart(2, "0");
    let output = activityHour + ":" + activityMinutes;
    if (includeSuffix) {
      output += " ";
      if (new Date(time).getHours() >= 12) {
        output += "PM";
      } else {
        output += "AM";
      }
    }
    return output;
  }

  function getNextActivity(capitalized = false) {
    if (capitalized) {
      return (
        nextActivities[currentActivity].charAt(0) +
        nextActivities[currentActivity].toLowerCase().slice(1)
      );
    } else {
      return nextActivities[currentActivity];
    }
  }

  // takes in UTC time in ms and rounds it down to seconds
  function getRoundedDownTime(time) {
    return Math.floor(time / 1000 / 60) * 1000 * 60;
  }
}

export default App;
