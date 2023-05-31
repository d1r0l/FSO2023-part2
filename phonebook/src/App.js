import { useState, useEffect } from 'react'
import axios from 'axios'

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

const Persons = ({ persons, searchWord }) => {
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchWord.toLowerCase()) ||
    person.number.toLowerCase().includes(searchWord.toLowerCase())
  )

  return (
    <div>
      {filteredPersons.map(person => (
        <div key={person.id}>{person.name} {person.number}</div>
      ))}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchWord, setSearch ] = useState('')
  
  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {setPersons(response.data)})
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
    
    if (nameExists) {
      alert(`${newName} is already added to phonebook`)
    } else if (numberExists) {
      alert(`Number ${newNumber} is already added to phonebook`)
    }
    else {
      const newPerson = { name: newName, number: newNumber, id: (persons.length) + 1 }
      //setPersons(persons.concat(newPerson))
      axios
        .post('http://localhost:3001/persons', newPerson)
        .then(response => {setPersons(persons.concat(response.data))})
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
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
      />
    </div>
  )
}

export default App