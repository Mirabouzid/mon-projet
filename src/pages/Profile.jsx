import { getAuth } from 'firebase/auth'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
    const auth = getAuth()

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    })

    function onLogout() {
        auth.signOut()
        navigate("/")
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

    return (
        <>
            <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
                <h1 className='text-3xl text-center mt-6 font-bold'>My profile</h1>
                <div className='w-full md:w-[50%] mt-6 px-3'>
                    <form>
                        <input
                            type="text"
                            value={formData.name}
                            disabled
                            className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out'
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
                                <span className='text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer'>Edit</span>
                            </p>
                            <p onClick={onLogout} className='text-blue-600 hover:text-blue-800 transition duration-200 cursor-pointer'>Sign out </p>
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}