import { GetServerSideProps } from "next"
import { useContext, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { setupApi } from "../services/api"
import { api } from "../services/apiClient"
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard(){
  const {user} = useContext(AuthContext)

  useEffect(()=>{
    api.get("/me").then(response=>{
      console.log("Dash", response.data)
    }).catch((error)=>console.log(error))
  },[])
  return(
    <div>
      <h1>Dashboard: {user?.email}</h1>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(async (ctx)=>{
  const apiClient = setupApi(ctx)
  const response = await apiClient.get('/me')
  console.log(response.data)
  
  return (
    {
      props:{}
    }
  )
})