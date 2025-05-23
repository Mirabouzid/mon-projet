import React, { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db } from '../firebase';
import { serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import Lottie from "lottie-react";
import LoginLottie from '../assets/img/picture.json'


export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [userRole, setUserRole] = useState('tenant')
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const { name, email, password } = formData;


    const RoleButton = ({ role, label }) => (
        <button
            type='button'
            onClick={() => setUserRole(role)}
            className={`flex-1 py-2 rounded transition-colors ${userRole === role
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
        >
            {label}
        </button>
    )


    function onchange(e) {
        // console.log(e.target.id, e.target.value);
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }
    async function onSubmit(e) {
        e.preventDefault()
        try {
            const auth = getAuth()
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)

            await updateProfile(userCredential.user, {
                displayName: name
            });
            const user = userCredential.user;
            const formDataCopy = {
                ...formData


            };

            formDataCopy.timestamp = serverTimestamp();
            formDataCopy.role = userRole;
            delete formDataCopy.password;
            await setDoc(doc(db, "users", user.uid), formDataCopy)
            toast.success('Sign up was successful')
            navigate('/');

            console.log(userCredential.user);

        } catch (error) {
            toast.error('Something went wrong with the registration ')
            // toast.error("Erreur : " + error.message)
            console.log(error.message);

        }
    }

    return (
        <section>
            <h1 className='text-3xl text-center mt-6 font-bold'>Sign Up</h1>
            <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>

                <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6 '>
                    <Lottie animationData={LoginLottie} loop={true} className='w-full' />
                    {/* <img src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="key"
                        className='w-full rounded-2xl' /> */}
                </div>
                <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>

                    <form onSubmit={onSubmit}>
                        <div className='flex gap-4 mb-6'>

                            <RoleButton role="tenant" label="Tenant" />
                            <RoleButton role="owner" label="Owner" />
                        </div>



                        <input type="text" id='name'
                            value={name} onChange={onchange}
                            placeholder='Full name'
                            className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'

                        />
                        <input type="email" id='email'
                            value={email} onChange={onchange}
                            placeholder='Email address'
                            className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'

                        />
                        <div className='relative mb-6'>
                            <input type={showPassword ? "text" : "password"}
                                id='password'
                                value={password} onChange={onchange}
                                placeholder='Password'
                                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
                            />
                            {showPassword ? (<AiFillEyeInvisible className='absolute right-3 top-3 text-xl cursor-pointer '
                                onClick={() => setShowPassword((prevState) => !prevState)} />) : (<AiFillEye className='absolute right-3 top-3 text-xl cursor-pointer '
                                    onClick={() => setShowPassword((prevState) => !prevState)} />)}
                        </div>
                        <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
                            <p className='mb-6 '> have a account?
                                <Link to='/sign-in' className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1'>Sign in </Link></p>
                            <p>
                                <Link to='/forgot-password' className='text-blue-600 hover:text-blue-700 transition duration-200 ease-in-out'>Forgot password?</Link>
                            </p>
                        </div>
                        <button className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg 
                    active:bg-blue-800' type="submit">Sign up </button>

                        <div className='flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 
                    after:border-t after:flex-1 after:border-gray-300'>
                            <p className='text-center font-semibold mx-4'>OR</p>
                        </div>
                    </form>
                    <OAuth />


                </div>


            </div>



        </section>
    )
}
