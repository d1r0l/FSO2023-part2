import { useState, useEffect } from 'react'
import phonebookService from "./components/names";

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
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchWord.toLowerCase()) ||
    person.number.toLowerCase().includes(searchWord.toLowerCase())
  )

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
  
  useEffect(() => {
    phonebookService
      .getList()
      .then(initialList => {
        setPersons(initialList)
      })
      .catch(() => {
        setColor('red')
        setErrorMessage(
          `An error occured connecting to server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 2000)
      })
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
          .then(newPerson => {
            setPersons(persons.map(person => {
              if (newPerson.id === person.id) 
                {return(newPerson)} 
              else {return(person)}          
            }))
            setColor('green')
            setErrorMessage(
              `"${newName}" was updated`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 2000)
          })
          .catch(() => {
            setColor('red')
            setErrorMessage(
              `Information of "${newName}" have been already removed from server or changed`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 2000)
          })
      }
    }
    else {
      const newPerson = { name: newName, number: newNumber, id: (persons.length) + 1 }

      phonebookService
        .createName(newPerson)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setColor('green')
          setErrorMessage(
            `"${newName}" was added`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 2000)
        })
        .catch(() => {
          setColor('red')
          setErrorMessage(
            `An error occured connecting to server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 2000)
        })
    }
  }
  
  const handleClickDelete = (id, name, persons) => {
    if (window.confirm(`Do you really want to delete ${name}?`)) {
      phonebookService
        .deleteName(id, persons)
        .then(initialList => {
          setPersons(initialList)
          setColor('green')
          setErrorMessage(
            `"${name}" was removed`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 2000)
        })
        .catch(() => {
          setColor('red')
          setErrorMessage(
            `Information of "${name}" have been already removed from server or changed`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 2000)
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