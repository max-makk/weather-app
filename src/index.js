import "./style.css";

const page = `
    <header>
      <h1>Weather App</h1>
      <div class="search-wrapper">
        <input type="text" name="location" id="location" />
        <button>&#128269;</button>
      </div>
    </header>
    <main>
      <section>
        <h2 class="city">London</h2>
        <p class="temp">9.8C</p>
        <p class="descr">Few Clouds</p>
        <p class="humidity">Humidity 58%</p>
      </section>
      <div id="loading"></div>
    </main>
    <footer>
      <button></button>
    </footer>
`
document.body.innerHTML = page

async function getWeather(searchInput) {
  displayLoading()
  let city = searchInput;
  try {
    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&id=524901&appid=a70725eb07ee7f95ac13054e2f08ed4d",
      { mode: "cors" }
    );
    if (!response.ok) {
      throw new Error(`${city} not found`);
    }
    const getData = await response.json();
    hideLoading()
    displayTemp(getData);
  } catch (error) {
    alert(error);
  }
}

function displayTemp(data) {
  const btn = document.querySelector("footer button");
  const search = document.querySelector("header button");
  const temp = data.main.temp;
  btn.textContent = "C";
  const m = btn.textContent;

  document.querySelector(".temp").setAttribute("data-temp", temp);
  document.querySelector(".temp").textContent = convert(temp, m);
  document.querySelector(".city").textContent = data.name;
  document.querySelector(".humidity").textContent =
    "Humidity " + data.main.humidity + "%";

  document.querySelector(".descr").textContent = capitalize(
    data.weather[0].description
  );
  btn.addEventListener("click", toggleMeasurements);
  const city = document.querySelector("input");
  window.addEventListener("keypress", (e) => {
    city.focus();
    if (e.key === "Enter") {
      if (city.value !== "") {
        getWeather(city.value);
      }
    }
  });
  search.addEventListener("click", () => {
    if (city.value !== "") {
      getWeather(city.value);
    }
  });
  if (m === "C") {
    btn.textContent = "F";
  } else {
    btn.textContent = "C";
  }
}

function toggleMeasurements() {
  let m = document.querySelector("footer button");
  const temp = document.querySelector(".temp").getAttribute("data-temp");
  document.querySelector(".temp").textContent = convert(temp, m.textContent);
  if (m.textContent === "C") {
    m.textContent = "F";
  } else {
    m.textContent = "C";
  }
}

function capitalize(str) {
  const words = str.split(" ");
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ");
}

function convert(temp, m) {
  if (m === "C") {
    return (+temp - 273.15).toFixed(1) + "C";
  } else {
    return ((+temp - 273.15) * 1.8 + 32).toFixed(1) + "F";
  }
}

function displayLoading() {
  document.querySelector('section').style.display = 'none'
  document.querySelector('#loading').classList.add('display')
}

function hideLoading() {
  document.querySelector('section').style.display = 'flex'
  document.querySelector('#loading').classList.remove('display')
}

getWeather("London");

