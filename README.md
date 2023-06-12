# QUIZ-APP

## context.jsx
```js
import axios from "axios";
import { useContext, useState } from "react";
import { createContext } from "react";

const AppContext = createContext();

export const useGlobalContext = () => {
    return useContext(AppContext)
}

const API_ENDPOINT = 'https://opentdb.com/api.php?';
const url = ''
const tempUrl = 'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple';

export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [waiting, setWaiting] = useState(true);
    const [correct, setCorrect] = useState(0);
    const [index, setIndex] = useState(0);
    const [quiz, setQuiz] = useState({
        amount: 10,
        category: "sports",
        difficulty: "easy",
    });


    const fetchQuestions = async (url) => {
        setLoading(true)
        try {
            const response = await axios(url)
            if (response) {
                const data = response.data.results
                if (data.length > 0) {
                    setQuestions(data)
                    setLoading(false)
                    setError(false)
                    setWaiting(false)
                } else {
                    setError(true)
                    setWaiting(true)
                }
            } else {
                setWaiting(true)
            }


            
        } catch (error) {
            setError(true)
        }
    }


    const nextQuestion = () => {
        setIndex((oldIndex) => {
            const index = oldIndex + 1
            if (index > questions.length - 1) {
                openModal()
                return 0
            } else {
                return index
            }
        })
    }

    const checkAnswer = (value) => {
        if (value) {
            setCorrect((oldState) => oldState + 1)
        }
        nextQuestion()
    }

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setWaiting(true)
        setCorrect(0)
        setIsModalOpen(false)
    }

    const handleChange = (e) => {
        setQuiz({ ...quiz, [e.target.name]:e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const {amount, category, difficulty} = quiz
        const url = `${API_ENDPOINT}amount${amount}&difficulty${difficulty}&category${category}`
        fetchQuestions(url)
    }


    return (
        <AppContext.Provider value={{
            loading,
            error,
            questions,
            isModalOpen,
            quiz,
            waiting,
            handleChange,
            handleSubmit,
            openModal,
            closeModal,
            correct,
            setCorrect,
            index,
            setIndex,
            checkAnswer
        }}>
            {children}
        </AppContext.Provider>
    )
}

```

## App.jsx
```js
import Loading from "./Loading"
import Modal from "./Modal"
import SetupForm from "./SetupForm"
import { useGlobalContext } from "./context"


function App() {
  const { 
    waiting,
    loading,
    questions,
    index,
    correct,
    nextQuestion,
    checkAnswer,
    
  } = useGlobalContext();

  if (loading) {
    return <Loading />
  }
  
  if (waiting) {
    return <SetupForm />
  }

  // const answers = [...incorrect_answers, correct_answer]
  const { question, incorrect_answers, correct_answer } = questions[index];
  let answers = [...incorrect_answers]
  const tempIndex = Math.floor(Math.random() * 4)

  if (tempIndex === 3) {
    answers.push(correct_answer)
  } else {
    answers.push(answers[tempIndex])
    answers[tempIndex] = correct_answer
  }

  return (
    <main>
      <Modal />
      <section className="quiz">
        <p className="correct-answers">
          correct answers: {correct}/{index}
        </p>
        <article className="container">
          <h2 dangerouslySetInnerHTML={{ __html: question }} />
          <div className="btn-container">
            {answers.map((answer, index) => {
              return (
                <button
                  key={index}
                  className='answer-btn'
                  onClick={() => checkAnswer(correct_answer === answer)}
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              )
            })}
          </div>
        </article>
        <button className="next-question" onClick={nextQuestion}>
          next question
        </button>
      </section>
    </main>
  )
}

export default App

```

## Modal.jsx
```js
import { useGlobalContext } from "./context"

const Modal = () => {
    const { isModalOpen, closeModal, correct, questions } = useGlobalContext()
    
    return (
        <div className={`${isModalOpen ? 'modal-container isOpen' : 'modal-container'}`}>
            <div className='modal-content'>
                <h2>congrats!</h2>
                <p>
                    You answered {((correct / questions.length) * 100).toFixed(0)} % of
                    questions correctly
                </p>
                <button className='close-btn' onClick={closeModal}>
                    play again
                </button>
            </div>
        </div>
    )
}

export default Modal
```