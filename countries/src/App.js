import { useState, useEffect } from 'react'
import countries from './components/countries'

function App() {
  const [ filter, setFilter ] = useState('')
  const [ countriesAll, setCountriesAll ] = useState([])

  useEffect(() => {
    countries
      .getAll()
      .then(response => {
        setCountriesAll(response)
      })
      .catch(() => {
        alert('An error occured connecting to server')
      })
  }, [])

  const handleChangeFilter = (event) => {
    setFilter(event.target.value)
  }

  const countriesNamesConcatenated = countriesAll.map((country, index) => ({
    name: (
      country.altSpellings
        .concat(
          country.name.common, 
          country.name.official
        )
        .join(', ')
    ),
    filterName: country.name.common.toLowerCase(), 
    id: index,
    displayedName: country.name.common
  }))

  const filteredCountriesNames = countriesNamesConcatenated.filter(country => 
    country.name.toLowerCase().includes(filter.toLowerCase())
  )

  const CountryInfo = () => {
    if (countriesAll.length === 0 || filter === '') {
      return(null)
    }
    else {
      const filteredQty = filteredCountriesNames.length
      if (filteredQty === 0) {
        return(
          <div>Country not found, specify another filter.</div>
        )
      }
      else if (filteredQty === 1) {
        const country = countriesAll[filteredCountriesNames[0].id]
        const languages = Object.values(country.languages)
        return(
        <div>
          <h1>
            {country.name.common}
          </h1>
          <p>
            Capital: {country.capital}
            <br/>
            Area: {country.area}
          </p>
          <p>Spoken languages:</p>
          <ul>
            {languages.map(language =>
              <li key={language.index}>{language}</li>
            )
            }
          </ul>
          <img src={country.flags.png} alt="Country flag"></img>
        </div>
        )
      }
      else if (filteredQty > 1 & filteredQty <= 10) {
        return(
          filteredCountriesNames.map(country => 
            <div key={country.id}>
              {country.displayedName}
              <button onClick={() => setFilter(country.filterName)}>Show</button>
            </div>
          )
        )
      }
      else {
        return(<div>Too many matches, specify another filter.</div>)
      }
    }
  }

  return (
    <div>
      Find countries: <input onChange={handleChangeFilter} />
        <CountryInfo/>
    </div>
  )
}

export default App