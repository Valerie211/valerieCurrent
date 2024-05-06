import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../utils/auth";
import { toast } from "react-toastify";
import {jwtDecode} from "jwt-decode"; // Import jwtDecode without destructuring

const Login = () => {
    const nav = useNavigate();
    const [payload, setPayload] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("value",value)
        setPayload(prev => ({ ...prev, [name]: value }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const result = await loginApi(payload);
            if (result.status === 200) {
                const token = result?.data?.access;
                localStorage.setItem('token', JSON.stringify(token)); // Store token as a string
                toast.success("Login successful");

                // Decode the token after storing it
                const user = jwtDecode(token);

                setTimeout(() => {
                    if (user.project_manager) {
                        nav("/dashboard");
                    } else {
                        nav("/dashboard-for-users");
                    }
                }, 2000);
            } else if (result.status === 401) {
                toast.error("Unauthorized");
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 401) {
                toast.error("Unauthorized");
            } else {
                toast.error("Invalid Credentials");
            }
        }
    };

    return (
        <div className='border-2 border-[#A748F6] shadow-xl rounded-2xl px-4 py-4 bg-white'>
            <h2 className="text-center text-md text-[#A748F6] font-bold">Login</h2>
            <form className="mt-4 md:w-[400px]" onSubmit={submitHandler}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="" className="flex flex-col">Username <span className="text-red-400">*</span></label>
                    <input
                        placeholder=""
                        type="text"
                        id="username"
                        name="username"
                        value={payload.username}
                        onChange={handleChange}
                        className="border-2 py-2 px-2 border-[#A748F6] rounded-md"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="" className="flex flex-col">Password <span className="text-red-400">*</span></label>
                    <input
                        placeholder=""
                        type="password"
                        name="password"
                        onChange={handleChange}
                        id="password"
                        value={payload.password}
                        className="border-2 border-[#A748F6] py-2 px-2 rounded-md"
                    />
                </div>
                <div className="mt-4 mb-4">
                    <button type="submit" className="text-center text-white mt-2 rounded-md px-2 py-2 bg-[#A748F6] w-full">Login</button>
                    <span className="text-sm text-gray">Don't have an account? <a href="/register" className="text-purple-500">Sign up</a></span>
                </div>
            </form>
        </div>
    );
}

export default Login;
