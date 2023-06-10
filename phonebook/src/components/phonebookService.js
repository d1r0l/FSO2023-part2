import axios from 'axios'

const dbUrl = '/api/persons'

const getList = () => {
   const request = axios.get(dbUrl)
  return(request.then(response => response.data))
}

const createPerson = (newPerson) => {
  const request = axios.post(dbUrl, newPerson)
  return(request.then(response => response.data))
}

const deletePerson = (selectedPersonId) => {
  const request = axios.delete(`${dbUrl}/${selectedPersonId}`)
  return(request.then(response => response.data))
}

const changeNumber = (updatedPerson) => {
  const request = axios.put(`${dbUrl}/${updatedPerson.id}`, updatedPerson)
  return(request.then(response => response.data))
}

const phonebookService = { getList, createPerson, deletePerson, changeNumber }

export default phonebookService