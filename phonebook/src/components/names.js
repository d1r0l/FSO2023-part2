import axios from 'axios'

const dbUrl = 'http://localhost:3001/persons'

const getList = () => {
    const request = axios.get(dbUrl)
    return(
        request.then(response => response.data)
    )
}

const create = (newName) => {
    const request = axios.post(dbUrl, newName)
    return(
        request.then(response => response.data)
    )
}

const phonebookService = { getList, create }

export default phonebookService