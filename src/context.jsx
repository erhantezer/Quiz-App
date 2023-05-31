import { useContext } from "react";
import { createContext } from "react";

const AppContext = createContext();

export const useGlobalContext = () => {
    return useContext(AppContext)
}

export const AppProvider = ({children}) => {

    
    return (
            <AppContext>
                {children}
            </AppContext>
        )
}