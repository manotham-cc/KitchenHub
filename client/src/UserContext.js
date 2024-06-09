import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // Fetch the user profile when the component mounts
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                setUserInfo(data);
            }
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
        });
    }, []);

    const logout = () => {
        fetch('http://localhost:4000/logout', {
            method: 'POST',
            credentials: 'include',
        })
        .then(() => {
            setUserInfo(null);
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
    };

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, logout }}>
            {children}
        </UserContext.Provider>
    );
}
