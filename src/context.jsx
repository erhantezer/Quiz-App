import { useContext, useState } from "react";
import { createContext } from "react";

const AppContext = createContext();

export const useGlobalContext = () => {
    return useContext(AppContext)
}

export const AppProvider = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(false);

    const fetchQuestions = () => {
        setLoading(true)
        try {
            
            setLoading(false)
        } catch (error) {
            
        }
    }
    
    return (
            <AppContext.Provider value={{
                
            }}>
                {children}
            </AppContext.Provider>
        )
}