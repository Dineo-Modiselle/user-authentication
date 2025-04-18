import React from "react";
import { useState,useContext } from "react";
import { assets } from "../assets/assets2/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
    const navigate = useNavigate();
    const {backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState(""); 
    const onSubmitHandler = async (e) => {
    try {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        if(state==='Sign Up'){
const {data} = await axios.post(backendUrl + "/api/auth/register", {name,email,password})
        if(data.success){
            setIsLoggedIn(true);
           getUserData();
            navigate("/");
        }else{
            toast.error(data.message);
        }
        }else{
            const {data} = await axios.post(backendUrl + "/api/auth/login", {email,password})
        if(data.success){
            setIsLoggedIn(true);
             getUserData();
            navigate("/");
        }else{
            toast.error(data.message);
        }


        }
    } catch (error) {
        console.error(error); // log the full error
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong");
        }
      }
      
} 
    
  return (

    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 ">
      <img
        src={assets.logo}
        alt=""
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create account" : "Login to your account"}
        </h2>
        <p className="text-center text-sm mb-4">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account"}
        </p>
        <form onSubmit={onSubmitHandler}>
            {state === "Sign Up" && (
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-500  ">
            <img src={assets.person_icon} alt="" />
            <input
              className="bg-transparent outline-none "
              type="text"
              onChange ={(e) => setName(e.target.value)}
              value={name}
              placeholder="Full Name"
              required
            />
          </div>
            )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-500  ">
            <img src={assets.mail_icon} alt="" />
            <input
              className="bg-transparent outline-none "
              type="email"
                onChange ={(e) => setEmail(e.target.value)}
                value={email}
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-500  ">
            <img src={assets.lock_icon} alt="" />
            <input
              className="bg-transparent outline-none "
              type="password"
                onChange ={(e) => setPassword(e.target.value)}
                value={password}
              placeholder="Password"
              required
            />
          </div>
          <p onClick={()=> navigate('/reset-password') } className="mb-4 text-indigo-500 cursor-pointer">Forgot Password</p>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 font-medium text-white">
            {state}
          </button>
        </form>
        {state === "Sign Up" ? ( <p className="text-gray-400 text-center text-xs mt-4 ">
          Already have an account?{" "}
          <span onClick={()=> setState('Login')} className="text-blue-400 cursor-pointer underline">
            Login here
          </span>
        </p>) 
        :
        ( <p className="text-gray-400 text-center text-xs mt-4 ">
          Don't have an account?{" "}
          <span onClick={()=> setState('Sign Up')} className="text-blue-400 cursor-pointer underline">
            Sign up here
          </span>
        </p>
    ) }
       
        
      </div>
    </div>
  );
}

export default Login;
