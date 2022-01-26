import { GetServerSideProps } from "next"
import { setupApi } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard(){

  
  return(
    <div>
      <h1>Metrics</h1>

    </div>
  )
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(async (ctx)=>{
  const apiClient = setupApi(ctx)
  const response = await apiClient.get('/me')

  
  return (
    {
      props:{}
    }
  )
},{
  permissions:['metrics.list'],
  roles: ['administrator']
})