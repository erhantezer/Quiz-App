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

export const AppProvider = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(false);
    

    const fetchQuestions = async () => {
        setLoading(true)
        try {
            const response = await axios(tempUrl)
            const data = response.data.results
            setQuestions(data)

            setLoading(false)
        } catch (error) {
            setError(true)
        }
    }

    console.log(questions)

    useEffect(() => {
        fetchQuestions()
    }, []);
    
    return (
            <AppContext.Provider value={{
                loading,
                error,
                
            }}>
                {children}
            </AppContext.Provider>
        )
}