import { useRouter } from "next/router";
import {  createContext, ReactNode, useState } from "react";
import {setCookie} from 'nookies'
import { api } from "../services/api";

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

      setCookie(undefined,"next-auth.token",token,{
        path:"/",
        maxAge:60 * 60 * 24 * 30 // 30 Days
      })
      setCookie(undefined,"next-auth.refreshToken",refreshToken,{
        path:"/",
        maxAge:60 * 60 * 24 * 30 // 30 Days
      })
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
