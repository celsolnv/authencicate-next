import axios, {AxiosError} from 'axios'
import {parseCookies, setCookie} from 'nookies'
import { singOut } from '../contexts/AuthContext'

let cookies = parseCookies() 
let isRefreshing = false
let failureRequestsQueue = []

export const api = axios.create({
  baseURL:"http://localhost:3333",
  headers:{
    Authorization: `Bearer ${cookies['next-auth.token']}`
  }
})


api.interceptors.response.use(response =>{
  return response
},(error:AxiosError)=>{
  
  if(error.response.status === 401){
    if(error.response.data?.code === "token.expired"){
      if (!isRefreshing){
        isRefreshing = true
        cookies = parseCookies()
        
        const {'next-auth.refreshToken':refreshToken} = cookies
  
        api.post("/refresh",{refreshToken}).then(response =>{
          const {token} = response.data
          setCookie(undefined,"next-auth.token",token,{
            path:"/",
            maxAge:60 * 60 * 24 * 30 // 30 Days
          })
          setCookie(undefined,"next-auth.refreshToken",response.data.refreshToken,{
            path:"/",
            maxAge:60 * 60 * 24 * 30 // 30 Days
          })
          api.defaults.headers["Authorization"] = `Bearer ${token}`
          failureRequestsQueue.forEach((request) => request.onSuccess(token))
          failureRequestsQueue = []

        }).catch((err)=>{
          failureRequestsQueue.forEach((request) => request.onFailure(err))
          failureRequestsQueue = []
        })
        .finally(()=>{
          isRefreshing = false
        })

      }
      let originalConfig = error.config
      return new Promise((resolve,reject)=>{
        failureRequestsQueue.push({
          onSuccess: (token:string)=>{
            originalConfig.headers["Authorization"] = `Bearer ${token}`
            resolve(api(originalConfig))
          },
          onFailure: (err:AxiosError)=>{
            reject(err)
          } 
        })
      })
    } else{
      singOut()
    }
  }

  return Promise.reject(error)

})