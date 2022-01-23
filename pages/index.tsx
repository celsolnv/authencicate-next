import { FormEvent, useContext, useState } from "react"
import { AuthContext } from "../contexts/AuthContext"

export default function Home(){
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const {singIn} = useContext(AuthContext)
  async function handleSubmit(event:FormEvent){
    event.preventDefault()
    const data = {
      email,
      password
    }

    await singIn(data)
  }

  return(
    <form onSubmit={handleSubmit} className="container">
      <input 
        type="text" 
        name="email" 
        onChange={(e)=>setEmail(e.target.value)} 
        value={email}
      />
      <input 
        type="password" 
        name="password" 
        onChange={(e)=>setPassword(e.target.value)}
        value={password}
      />
      <input type="submit" value="Enviar" />

    </form>
  )
}