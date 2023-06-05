import axios from "axios";

const getWeather = async (cityName, countryCode) => {
  console.log('weather call');
  const apiKey = process.env.REACT_APP_API_KEY;

  const getCoordinates = async (cityName, countryCode) => {
    const locationUrl =
      `http://api.openweathermap.org/geo/1.0/direct?` +
      `q=${cityName},${countryCode}&` +
      `limit=1&` +
      `appid=${apiKey}`;
    const request = await axios
      .get(locationUrl)
      .then((response) => response.data[0]);
    return request;
  };

  const coordinates = await getCoordinates(cityName, countryCode).then(
    (response) => ({ lat: response.lat, lon: response.lon })
  );
  const weatherUrl =
    `https://api.openweathermap.org/data/2.5/weather?` +
    `lat=${coordinates.lat}` +
    `&lon=${coordinates.lon}` +
    `&units=metric` +
    `&lang=en` +
    `&appid=${apiKey}`;
  const request = await axios.get(weatherUrl).then((response) => ({
    temp: response.data.main.temp,
    wind: response.data.wind.speed,
    icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@4x.png`,
  }));
  return request;
};

const getAll = () => {
  const dbUrl = "https://studies.cs.helsinki.fi/restcountries/api";
  const request = axios.get(`${dbUrl}/all`).then((response) => response.data);
  return request;
};

const countriesService = { getAll, getWeather };

export default countriesService;
