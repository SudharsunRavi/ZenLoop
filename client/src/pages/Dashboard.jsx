import { useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const userid=useSelector((state)=>state?.user?.currentUser?._id)
  const navigate=useNavigate();

  const surveryCheck=async()=>{
    const res=await fetch(`${import.meta.env.VITE_BASE_URL}/survey/${userid}`, {
      method: "GET",
      credentials: "include",
    })
    const data=await res.json()
    //console.log(data)

    if(data.status==false) {
      toast.error(data.message, { duration: 3000 })
      return
    }

    if(!data?.data?._id) {
      toast.error("Please fill the survey", { duration: 3000 })
      navigate("/survey")
    }
  }

  useEffect(()=>{
    surveryCheck()
  },[])

  return (
    <div>
      <Toaster/>
      <h1>Dashboard</h1>
    </div>
  )
}

export default Dashboard
