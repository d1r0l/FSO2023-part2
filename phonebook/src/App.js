import { useState, useEffect } from 'react'
import phonebookService from "./components/phonebookService";

const Filter = ({ text, handleChange }) => {
  return (
    <div>
      {text}<input onChange={handleChange}></input>
    </div>
  )
}

const PersonForm = ({ handleNameChange, handleNumberChange, handleClick}) => {
  return (
    <form>
      <div>Name: <input onChange={handleNameChange} /></div>
      <div>Number: <input onChange={handleNumberChange} /></div>
      <div><button onClick={handleClick} type="submit">add</button></div>
    </form>
  )
}

const Persons = ({ persons, searchWord, handleClickDelete }) => {
  const filteredPersons = persons.filter((person) => {
    const name = person.name?.toLowerCase()
    const number = person.number?.toLowerCase()
    return (
      name?.includes(searchWord.toLowerCase()) ||
      number?.includes(searchWord.toLowerCase())
    )
  })

  return (
    <div>
      {filteredPersons.map(person => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleClickDelete(person.id, person.name, persons)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

const Notification = ({ message, color }) => {
  const errorStyle = {
    color: color ,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (message === null) {
    return null
  }

  return (
    <div className='error' style={errorStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchWord, setSearch ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ color, setColor ] = useState('green')
  
  const showNotification = (color, message) => {
    setColor(color)
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 3000)
  }

  useEffect(() => {
      phonebookService
      .getList()
      .then(response => setPersons(response))
      .catch(() => showNotification('red', `An error occured connecting to server`))
  }, [])

  const handleNameInputChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberInputChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchInputChange = (event) => {
    setSearch(event.target.value)
  }

  const handleClick = (event) => {
    event.preventDefault()
    const nameExists = persons.some(person => person.name === newName)
    const numberExists = persons.some(person => person.number === newNumber)
    
    if (numberExists) {
      alert(`Number ${newNumber} is already added to phonebook`)
    } else if (nameExists) {
      if (window.confirm(`${newName} is already in phonebook, replace the old number to a new one?`)) {
        const selectedPerson = persons.find(person => person.name === newName)
        const updatedPerson = {...selectedPerson, number: newNumber}

        phonebookService
          .changeNumber(updatedPerson)
          .then(updatedPerson => {
            setPersons(persons.map(person => {
              if (updatedPerson.id === person.id) 
                {return(updatedPerson)} 
              else {return(person)}          
            }))
            showNotification('green', `"${newName}" was updated`)
          })
          .catch((error) => showNotification('red', error.response.data.error))
      }
    }
    else {
      const newPerson = { name: newName, number: newNumber}
      phonebookService
        .createPerson(newPerson)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          showNotification('green', `"${newName}" was added`)
        })
        .catch((error) => showNotification('red', error.response.data.error))
    }
  }
  
  const handleClickDelete = (id, name) => {
    if (window.confirm(`Do you really want to delete ${name}?`)) {
      phonebookService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          showNotification('green', `"${name}" was removed`)
        })
        .catch((error) => {
          if (error.response.status === 404) {
            showNotification('red', `Information of "${name}" have been already removed from server or changed`)
          }
          else {
            showNotification('red', error.response.data.error)
          }
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} color={color}/>
      <Filter 
        handleChange={handleSearchInputChange} 
        text='Filter shown with:' 
      />
      <h2>Add a new</h2>
      <PersonForm 
        handleNameChange={handleNameInputChange}
        handleNumberChange={handleNumberInputChange}
        handleClick={handleClick} 
      />
      <h2>Numbers</h2>
      <Persons 
        persons={persons} 
        searchWord={searchWord}
        handleClickDelete={handleClickDelete} 
      />
    </div>
  )
}

export default App