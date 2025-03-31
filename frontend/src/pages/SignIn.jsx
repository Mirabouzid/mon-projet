import React, { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { Link, useNavigate, } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Lottie from "lottie-react";
import LoginLottie from '../assets/img/picture.json'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'


export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [userRole, setUserRole] = useState('tenant')
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });


    const { email, password } = formData;
    const navigate = useNavigate()

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


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const auth = getAuth()
            const userCredential = await signInWithEmailAndPassword(auth, email, password)

            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))
            if (!userDoc.exists()) {
                throw new Error("User profile not found")
            }

            const userData = userDoc.data()


            switch (userData.role) {
                case 'owner':
                    navigate("/profile")
                    break
                case 'admin':
                    navigate("/dashboard")
                    break
                default:
                    navigate('/')

            }


            // function onchange(e) {
            //     setFormData((prevState) => ({
            //         ...prevState,
            //         [e.target.id]: e.target.value,
            //     }))
            // }

            // async function onSubmit(e) {
            //     e.preventDefault()
            //     try {
            //         const auth = getAuth()
            //         const userCredential = await signInWithEmailAndPassword(auth, email, password)

            //         if (userCredential.user) {
            //             if (userRole === 'owner') {
            //                 navigate("/profile-owner")
            //             } else {
            //                 navigate('/')
            //             }

            //         }
        }
        catch (error) {
            toast.error('Bad user credentials')
        }

    }
    return (
        <section>
            <h1 className='text-3xl text-center mt-6 font-bold'>  Sign In</h1>
            <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>

                <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6 '>
                    <Lottie animationData={LoginLottie} loop={true} className='w-full' />


                </div>
                <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>


                    <div className='flex gap-4 mb-6'>

                        <RoleButton role="tenant" label="Tenant" />
                        <RoleButton role="owner" label="Owner" />
                    </div>


                    <form onSubmit={handleSubmit}>
                        <input type="email" id='email'
                            value={email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}

                            placeholder='Email address'
                            className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'

                        />
                        <div className='relative mb-6'>
                            <input type={showPassword ? "text" : "password"}
                                id='password'
                                // value={password} onChange={onchange}
                                value={password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}

                                placeholder='Password'
                                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
                            />
                            {showPassword ? (<AiFillEyeInvisible className='absolute right-3 top-3 text-xl cursor-pointer '
                                onClick={() => setShowPassword((prevState) => !prevState)} />) : (<AiFillEye className='absolute right-3 top-3 text-xl cursor-pointer '
                                    onClick={() => setShowPassword((prevState) => !prevState)} />)}
                        </div>
                        <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
                            <p className='mb-6 '>Don't have a account?
                                <Link to='/sign-out' className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1'>Register</Link></p>
                            <p>
                                <Link to='/forgot-password' className='text-blue-600 hover:text-blue-700 transition duration-200 ease-in-out'>Forgot password?</Link>
                            </p>
                        </div>
                        <button className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg 
                    active:bg-blue-800' type="submit">Sign in </button>

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
