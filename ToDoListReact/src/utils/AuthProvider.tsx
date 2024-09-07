import React, { useState, useContext, createContext } from 'react';
import { UserConnectOrNull } from '../models/user.model';

interface AuthContextProps {
    user: UserConnectOrNull;
    setUser: React.Dispatch<React.SetStateAction<UserConnectOrNull>>;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    setUser: () => {}
});

export interface Props {
    children: React.ReactNode;
}

const AuthContextProvider = ({children}: Props) => {
    const [user, setUser] = useState<UserConnectOrNull>(null);
    return (
        <AuthContext.Provider value={{user,setUser}}>
        {children}
        </AuthContext.Provider>
    ); 
}

export default AuthContextProvider;
//eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
}