/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import type { PropsWithChildren, FC } from "react";

// Define the context type
interface UserContextType {
    username: string ;
    setUsername: (username: string) => void;
    highScore: number;
    setHighScore: (score: number) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void;
}

// Create context with proper typing
export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FC<PropsWithChildren<object>> = ({ children }) => {
    const [username, setUsername] = useState<string>(localStorage.getItem('username') || '');
    const [highScore, setHighScore] = useState<number>(parseInt(localStorage.getItem('highScore') || '0'));
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('username')); // Initialize based on username
    
    return (
        <UserContext.Provider value={{
            username, 
            setUsername, 
            highScore, 
            setHighScore, 
            isLoggedIn, 
            setIsLoggedIn
        }}>
            {children}
        </UserContext.Provider>
    );
};
