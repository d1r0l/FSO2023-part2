import { useState, useEffect } from "react";
import countriesService from "./components/countries";

const CountryNotFound = () => {
  <div>Country not found, specify another filter.</div>;
};

const OneCountryFound = ({ countriesAll, filteredCountriesNames }) => {
  const [weather, setWeather] = useState([]);
  const country = countriesAll[filteredCountriesNames[0].id];
  const languages = Object.values(country.languages);

  useEffect(() => {
    countriesService
      .getWeather(country.capital, country.cca2)
      .then((response) => setWeather(response))
      .catch(() => {
        alert("An error occured connecting to weather server");
      });
  }, [country]);
  
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>
        Capital: {country.capital}
        <br />
        Area: {country.area}
      </p>
      <p>Spoken languages:</p>
      <ul>
        {languages.map((language) => (
          <li key={languages.indexOf(language)}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt="Country flag"></img>
      <h2>Weather in {country.capital}</h2>
      <p>Temperature: {weather.temp} Celcius</p>
      <img src={weather.icon} alt="Weather pic"></img>
      <p>Wind: {weather.wind} m/s</p>
    </div>
  );
};

const SeveralCountriesFound = ({ filteredCountriesNames, buttonValue }) => {
  const handleClick = (filterName) => buttonValue(filterName);
  return filteredCountriesNames.map((country) => (
    <div key={country.id}>
      {country.displayedName}
      <button onClick={() => handleClick(country.filterName)}>Show</button>
    </div>
  ));
};

const ALotOfCountriesFound = () => {
  return <div>Too many matches, specify another filter.</div>;
};

const CountryInfo = ({ countriesAll, filteredCountriesNames, filter, buttonValue }) => {
  const Qty = filteredCountriesNames.length;
  if (countriesAll.length === 0 || filter === "") {
    return null;
  } else {
    if (Qty === 0) {
      return <CountryNotFound />;
    } else if (Qty === 1) {
      return (
        <OneCountryFound
          countriesAll={countriesAll}
          filteredCountriesNames={filteredCountriesNames}
        />
      );
    } else if (Qty > 1 && Qty <= 10) {
      const handleClick = (filterName) => buttonValue(filterName);
      return (
        <SeveralCountriesFound
          filteredCountriesNames={filteredCountriesNames}
          buttonValue={handleClick}
        />
      );
    } else {
      return <ALotOfCountriesFound />;
    }
  }
};

function App() {
  const [filter, setFilter] = useState("");
  const [countriesAll, setCountriesAll] = useState([]);

  useEffect(() => {
    countriesService
      .getAll()
      .then((response) => {
        setCountriesAll(response);
      })
      .catch(() => {
        alert("An error occured connecting to server");
      });
  }, []);

  const handleChangeFilter = (event) => {
    setFilter(event.target.value);
  };

  const handleClick = (filterName) => {
    setFilter(filterName);
  };

  const countriesNamesConcatenated = countriesAll.map((country, index) => ({
    name: country.altSpellings
      .concat(country.name.common, country.name.official)
      .join(", "),
    id: index,
    displayedName: country.name.common,
    filterName: country.name.common.toLowerCase(),
    cca2: country.cca2,
    capital: country.capital,
  }));

  const filteredCountriesNames = countriesNamesConcatenated.filter((country) =>
    country.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      Find countries: <input onChange={handleChangeFilter} />
      <CountryInfo
        countriesAll={countriesAll}
        filteredCountriesNames={filteredCountriesNames}
        filter={filter}
        buttonValue={handleClick}
      />
    </div>
  );
}

export default App;
