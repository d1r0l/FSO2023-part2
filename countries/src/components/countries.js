import axios from 'axios'

const dbUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () => {
  const request = axios.get(`${dbUrl}/all`)
  return(
    request.then(response => response.data)
  )
}

const countries = { getAll }

export default countries