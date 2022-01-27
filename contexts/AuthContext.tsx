import  Router  from "next/router";
import {  createContext, ReactNode, useEffect, useState } from "react";
import {setCookie, parseCookies, destroyCookie} from 'nookies'
import { api } from "../services/apiClient"

export const AuthContext = createContext({} as AuthContextData)

let authChanel:BroadcastChannel

export function singOut(){
  destroyCookie(undefined,"next-auth.token")
  destroyCookie(undefined,"next-auth.refreshToken")

  authChanel.postMessage('singOut')
  Router.push("/")
}


export function AuthProvider({children}: AuthProviderProps){

  const [user,setUser] = useState<User>()
  const isAuthenticated = !!user

  useEffect(()=>{
    authChanel = new BroadcastChannel('auth')

    authChanel.onmessage = message =>{
      console.log(message)
      switch(message.data){
        case 'singOut':
          singOut();
          break;
        default:
          break
      }
      
    }

  },[])
  useEffect(()=>{
    const {'next-auth.token':token} = parseCookies()
    if (token){
      api.get("/me").then(response=>{
        const {email, permissions, roles} = response.data

        setUser({email, permissions, roles})
      }).catch(()=>{
        singOut()
      })
    }
  },[])

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
      api.defaults.headers["Authorization"] = `Bearer ${token}`
      
      Router.push("/dashboard")

    } catch (error) {
      
    }


  }
  return(
    <AuthContext.Provider value={{singIn,singOut,isAuthenticated, user}}>
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
  singOut: () => void;
  isAuthenticated: boolean;
  user: User;
}
type AuthProviderProps = {
  children: ReactNode
}
