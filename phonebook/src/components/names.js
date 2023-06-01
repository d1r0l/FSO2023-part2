import axios from 'axios'

const dbUrl = 'http://localhost:3001/persons'

const getList = () => {
    const request = axios.get(dbUrl)
    return(
        request.then(response => response.data)
    )
}

const createName = (newName) => {
    const request = axios.post(dbUrl, newName)
    return(
        request.then(response => response.data)
    )
}

const deleteName = async (selectedName, namesList) => {
    for (let i = selectedName; i < namesList.length; i++) {
        await axios.patch(`${dbUrl}/${i}`, namesList[i])
    }
    await axios.delete(`${dbUrl}/${namesList.length}`)
    const request = axios.get(dbUrl)
    return(
        request.then(response => response.data)
    )
}

const changeNumber = (updatedPerson) => {
    const request = axios.put(`${dbUrl}/${updatedPerson.id}`, updatedPerson)
    return(
        request.then(response => response.data)
    )
}

const phonebookService = { getList, createName, deleteName, changeNumber }

export default phonebookService