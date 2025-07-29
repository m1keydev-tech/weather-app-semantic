// ***** CONFIG ****
const APP_ID = "cf26e7b2c25b5acd18ed5c3e836fb235";
const DEFAULT_VALUE = "--";

// ****** Query *****
const container = document.querySelector(".container");
const searchInput = document.querySelector("#search-input");
const cityName = document.querySelector(".city-name");
const weatherState = document.querySelector(".weather-state");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");

const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");
const humidity = document.querySelector(".humidity");
const windSpeed = document.querySelector(".wind-speed");

searchInput.addEventListener("change", (e) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${APP_ID}&units=metric&lang=en`
  ).then(async (res) => {
    const data = await res.json();
    console.log("[Search Input]", data);
    cityName.innerHTML = data.name || DEFAULT_VALUE;
    weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE;
    weatherIcon.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    );
    temperature.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE;

    sunrise.innerHTML =
      moment.unix(data.sys.sunrise).format("H:mm") || DEFAULT_VALUE;
    sunset.innerHTML =
      moment.unix(data.sys.sunset).format("H:mm") || DEFAULT_VALUE;
    humidity.innerHTML = data.main.humidity || DEFAULT_VALUE;
    windSpeed.innerHTML = (data.wind.speed * 3.6).toFixed(2) || DEFAULT_VALUE;
  });
});

// AI Assistant

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

const recognition = new SpeechRecognition();
const synth = window.speechSynthesis;

recognition.lang = "en-EN";
recognition.continuous = false;

const microphone = document.querySelector(".microphone");

const speak = (text) => {
  if (synth.speaking) {
    console.error("Busy... Speaking...");
    return;
  }

  const utter = new SpeechSynthesisUtterance(text);

  utter.onend = (event) => {
    console.log("SpeechSynthesisUtterance.onend", event);
  };

  utter.onerror = (event) => {
    console.log("SpeechSynthesisUtterance.onerror", event);
  };

  synth.speak(utter);
};

microphone.addEventListener("click", (event) => {
  event.preventDefault();

  recognition.start();

  microphone.classList.add("recording");
});

recognition.onspeechend = () => {
  recognition.stop();
  microphone.classList.remove("recording");
};

recognition.onerror = (err) => {
  console.error(err);
  microphone.classList.remove("recording");
};

const handleVoice = (text) => {
  const handleText = text.toLowerCase();

  if (handleText.includes("weather at")) {
    const location = handleText.split("weather at")[1].trim();
    console.log("location", location);
    searchInput.value = location;
    const changeEvent = new Event("change");
    searchInput.dispatchEvent(changeEvent);
    return;
  }

  if (handleText.includes("change background to")) {
    const color = handleText.split("background to")[1].trim();
    console.log(color);
    container.style.background = color;
    return;
  }

  if (handleText.includes("default background")) {
    container.style.background = "";
    return;
  }

  if (handleText.includes("what time is it")) {
    const time = `${moment().hours()} hours ${moment().minutes()} minutes`;
    speak(time);
  }

  speak("Try again buddy");
};

recognition.onresult = (event) => {
  console.log("result", event);

  handleVoice(event.results[0][0].transcript);
};
