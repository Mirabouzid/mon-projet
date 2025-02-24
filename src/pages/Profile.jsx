import { getAuth, updateProfile } from 'firebase/auth'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { db } from '../firebase';
import { doc, updateDoc } from "firebase/firestore";
import { FcHome } from "react-icons/fc";


export default function Profile() {
    const auth = getAuth()

    const navigate = useNavigate()
    const [changeDetail, setChangeDetail] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    })

    function onLogout() {
        auth.signOut()
        navigate("/")
    }
    function onChange(e) {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }


    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                navigate('/sign-in')
            } else {
                setFormData({
                    name: user.displayName || '',
                    email: user.email || ''
                })


            }
        })

        return () => unsubscribe()
    }, [navigate, auth])

    if (!auth.currentUser) {
        return <div>Loading...</div>
    }

    async function onsubmit() {
        try {
            if (auth.currentUser.displayName !== formData.name) {
                await updateProfile(auth.currentUser, {
                    displayName: formData.name
                })
                const docRef = doc(db, "users", auth.currentUser.uid)
                await updateDoc(docRef, {

                });
            }
            toast.success('Profile details updated')

        } catch (error) {
            toast.error("Could not update the profile details")

        }

    }

    return (
        <>
            <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
                <h1 className='text-3xl text-center mt-6 font-bold'>My profile</h1>
                <div className='w-full md:w-[50%] mt-6 px-3'>
                    <form>
                        <input
                            type="text"
                            id='name'
                            value={formData.name}
                            disabled={!changeDetail}
                            onChange={onChange}
                            className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${changeDetail && "bg-red-200 focus:bg-red-200"}`}
                        />
                        { }

                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out'
                        />

                        <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg '>
                            <p className='flex items-center'>Do you want to change your name?

                                <span onClick={() => {
                                    changeDetail && onsubmit()
                                    setChangeDetail((prevState) => !prevState)

                                }}
                                    className='text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer'>
                                    {changeDetail ? "Apply change" : "Editt"}  </span>
                            </p>
                            <p onClick={onLogout} className='text-blue-600 hover:text-blue-800 transition duration-200 cursor-pointer'>Sign out </p>
                        </div>
                    </form>
                    <br /> <button type='submit' className='w-full bg-blue-600 text-white uppercase px-7 py-2 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>
                        <Link to='/create-listing' className='flex justify-center items-center'>

                            <FcHome className='mr-2 text-3xl bg-red-200 rounded-full p- border-2' />
                            Sell or rent your home
                        </Link>


                    </button>
                </div>
            </section>
        </>
    )
}