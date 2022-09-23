import targetWordsList from './targetWords.json' assert {type: 'json'};
import dictionaryList from './dictionary.json' assert {type: 'json'};

const targetWords = targetWordsList
const dictionary = dictionaryList
const WORD_LENGTH = 5
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500
const keyboard = document.querySelector("[data-keyboard]")
const alertContainer = document.querySelector("[data-alert-container]")
const guessGrid = document.querySelector("[data-guess-grid]")
// const offsetFromDate = new Date(2022, 0, 1)
// const msOffsest = Date.now() - offsetFromDate
// const dayOffset = msOffsest / 1000 / 60 / 60 / 24
// console.log(dayOffset)
// const targetWord = targetWords[Math.floor(dayOffset)]
const targetWord = targetWords[Math.floor(Math.random() * targetWords.length)]
console.log(targetWord)
const buttonNext = document.getElementsByClassName("button-next")


  startInteraction()
  
  function startInteraction() {
    document.addEventListener("click", handleMouseClick)
    document.addEventListener("keydown", handleKeyPress)
  }

  function stopInteraction() {
    document.removeEventListener("click", handleMouseClick)
    document.removeEventListener("keydown", handleKeyPress)
  }

  function handleMouseClick(e) {
    if (e.target.matches("[data-key]")) {
        pressKey(e.target.dataset.key)
        return
    }
    if (e.target.matches("[data-enter]")) {
        submitGuess()
        return
    }
    if(e.target.matches("[data-delete]")) {
        deleteKey()
        return
    }
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
        submitGuess()
        return
    }
    if (e.key === "Backspace" || e.key === "Delete") {
        deleteKey()
        return
    } 
    if (e.key.match(/^[a-z]$/)) {
        pressKey(e.key)
    }
  }

  function pressKey(key) {
    const activeTiles = getActiveTiles()
    if (activeTiles.length >= WORD_LENGTH) return
    const nextTile = guessGrid.querySelector(":not([data-letter])")
    nextTile.dataset.letter = key.toLowerCase()
    nextTile.textContent = key
    nextTile.dataset.state = "active"
  }

  function deleteKey() {
    const activeTiles = getActiveTiles()
    const lastTile = activeTiles[activeTiles.length - 1]
    if (lastTile == null) return
    lastTile.textContent = ""
    delete lastTile.dataset.state
    delete lastTile.dataset.letter
  }

  function submitGuess() {
    const activeTiles = [...getActiveTiles()]
    if (activeTiles.length !== WORD_LENGTH) {
        showAlert("Your word is too short")
        shakeTiles(activeTiles)
        return
    }
    const guess = activeTiles.reduce((word, tile) => {
        return word + tile.dataset.letter
    }, "")
    console.log(guess)
    if (!dictionary.includes(guess)) {
        showAlert("Your word is not in the list")
        shakeTiles(activeTiles)
        return
    }
    stopInteraction()
    activeTiles.forEach((...params) => flipTile(...params, guess))
  }

  function flipTile(tile, index, array, guess) {
    const letter = tile.dataset.letter
    const key = keyboard.querySelector(`[data-key="${letter}"i]`)
    setTimeout(() =>{
        tile.classList.add("flip")
    }, index * FLIP_ANIMATION_DURATION / 2)

    tile.addEventListener("transitionend", () => {
        tile.classList.remove("flip")
        if (targetWord[index] === letter) {
            tile.dataset.state = "correct"
            key.classList.add("correct")
        } else if (targetWord.includes(letter)) {
            tile.dataset.state = "wrong-location"
            key.classList.add("wrong-location")
        } else {
            tile.dataset.state = "wrong"
            key.classList.add("wrong")
        }

        if (index === array.length -1) {
            tile.addEventListener("transitionend", () => {
                startInteraction()
                checkWinLose(guess, array)
            }, { once: true })
           
        }
    }, { once: true })
  }

  function getActiveTiles() {
    return guessGrid.querySelectorAll('[data-state="active"]')
  }

  function showAlert (message, duration = 1000) {
    const alert = document.createElement("div")
    alert.textContent = message
    alert.classList.add("alert")
    alertContainer.prepend(alert)
    if (duration == null) return
    setTimeout(() => {
        alert.classList.add("hide")
        alert.addEventListener("transitionend", () => {alert.remove()})
    }, duration)
  }

  function shakeTiles(tiles) {
    tiles.forEach(tile => {
        tile.classList.add("shake")
        tile.addEventListener("animationend", () => {
            tile.classList.remove("shake")
        }, {once: true})
    })
  }

  function checkWinLose(guess, tiles) {
    if (guess === targetWord) {
        showAlert("Amazing!", 5000)
        danceTiles(tiles)
        stopInteraction()
        return
    }
    const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
    if (remainingTiles.length === 0) {
        showAlert(targetWord.toUpperCase(), null)
    }
  }

  function danceTiles(tiles) {
    tiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add("dance")
            tile.addEventListener("animationend", () => {
                tile.classList.remove("dance")
        }, 
        { once: true }
        )
        }, index * DANCE_ANIMATION_DURATION / 5)
    })
  }