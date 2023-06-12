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