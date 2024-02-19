import { useState } from "react"
import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom";


export default function Signin() {
  
  const [formData,setFormData]=useState({});

  const [error,setError]=useState(null);
  
  const [loading,setLoading]=useState(false);

  const navigate=useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]:e.target.value
    })
  };
  
  const formSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        setLoading(false);
        setError(errorData.message);
        return;
      }
  
      await res.json();
      setLoading(false);
      setError(null);
      navigate('/');
    } catch (error) {
      setLoading(false);
      setError("An unexpected error occurred");
      console.error("API request failed:", error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
        <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

        <form onSubmit={formSubmitHandler} className="flex flex-col gap-4">
          <input type="email" placeholder="Email"
            className="border p-3 rounded-lg" id="email" onChange={handleChange}/>
          <input type="password" placeholder="Password"
            className="border p-3 rounded-lg" id="password" onChange={handleChange}/>
          <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg 
            uppercase hover:opacity-95 disabled:opacity-80">
              {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>
        
        <div className="flex gap-2 mt-5">
          <p>Dont have an account?</p>
          <Link to={"/sign-up"}>
            <span className="text-blue-700">Sign up</span>
          </Link>
        </div>
        {error && <p className="text-red-600 mt-5">{error}</p>}
    </div>
  )
}
