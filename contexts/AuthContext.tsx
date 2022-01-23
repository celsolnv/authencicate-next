import { useRouter } from "next/router";
import {  createContext, ReactNode, useState } from "react";
import { api } from "../services/api";

type User = {
  email:string;
  permissions: string[];
  roles: string[];

}
type SingInCredentials = {
  email:string;
  password:string;
}
type AuthContextData = {
  singIn: (credentials:SingInCredentials) => Promise<void>;
  isAuthenticated: boolean;
  user: User;
}
type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)


export function AuthProvider({children}: AuthProviderProps){

  const [user,setUser] = useState<User>()
  const router = useRouter()
  const isAuthenticated = !!user

  async function singIn({email,password}:SingInCredentials){
    try {
      const response = await api.post("/sessions",{
        email,
        password
      })

      const {token, refreshToken, roles, permissions} = response.data

      setUser({
        email,
        roles,
        permissions
      })

      router.push("/dashboard")
    } catch (error) {
      
    }


  }
  return(
    <AuthContext.Provider value={{singIn,isAuthenticated, user}}>
      {children}
    </AuthContext.Provider>
  )
}