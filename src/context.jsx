import axios from "axios";
import { useContext, useEffect, useState } from "react";
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
    const [quiz, setQuiz] = useState({
        amount: 10,
        category: "sports",
        difficulty: "easy",
    });


    const fetchQuestions = async () => {
        setLoading(true)
        try {
            const response = await axios(tempUrl)
            if (response) {
                const data = response.data.results
                if (data.length > 0) {
                    setQuestions(data)
                    setLoading(true)
                    setError(false)
                } else {
                    setError(true)
                }
            } else {
                console.log("waiting")
            }


            
        } catch (error) {
            setError(true)
        }
    }

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    console.log(questions)

    useEffect(() => {
        fetchQuestions()
    }, []);

    return (
        <AppContext.Provider value={{
            loading,
            error,
            questions,
            isModalOpen,
            quiz,

        }}>
            {children}
        </AppContext.Provider>
    )
}