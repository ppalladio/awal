'use client'
import { ReactNode, createContext, useContext, useState } from 'react';
interface UserContextType {
    user: { name: string; score: number };
    setUserName: (name: string) => void;
    setUserScore: (score: number) => void;
}
const UserContext = createContext<UserContextType>({
    user: { name: '', score: 0 },
    setUserName: () => {},
    setUserScore: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState({ name: '', score: 0 });

    const setUserName = (name: string) => {
        setUser((prevUser) => ({ ...prevUser, name }));
    };

    const setUserScore = (score: number) => {
        setUser((prevUser) => ({ ...prevUser, score }));
    };

    return (
        <UserContext.Provider value={{ user, setUserName, setUserScore }}>
            {children}
        </UserContext.Provider>
    );
};
