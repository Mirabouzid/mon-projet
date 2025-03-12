import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Header() {
    const [pageState, setPageState] = useState("Sign in")
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation();
    const navigate = useNavigate()
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setPageState("Profile")
            } else {
                setPageState("Sign in")
            }
        })
        return () => unsubscribe()
    }, [auth])

    function pathMatchRoute(route) {
        return route === location.pathname;

        /*  if (route === location.pathname) {
              return true
          }*/
    }

    /*console.log(location.pathname);*/
    return (
        <div className='bg-white border-b shadow-sm sticky top-0 z-40'>

            <header className='flex justify-between items-center px-4 md:px-3 max-w-6xl mx-auto'>
                <div className=' pl-2 md:pl-8'>
                    <img src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" alt="logo"
                        className='h-5 cursor-pointer'
                        onClick={() => navigate("/")} />

                </div>
                {/*menu desktop*/}
                <div className='hidden md:block pr-8'>
                    <ul className='flex space-x-10'>
                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent transition duration-300
                            ${pathMatchRoute("/") ? "text-red-600" : "hover:border-b-red-500 hover:text-black"

                            }`}
                            onClick={() => navigate("/")}
                        >Home</li>

                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent  transition duration-300
                            ${pathMatchRoute("/offers") ? "text-red-600"
                                : "hover:border-b-red-500 hover:text-black"
                            }`}
                            onClick={() => navigate("/offers")}
                        >Offers</li>

                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent  transition duration-300
                            ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) ? "text-red-600"
                                : "hover:border-b-red-500 hover:text-black"} `}
                            onClick={() => navigate("/profile")}

                        >
                            {pageState}
                        </li>
                    </ul>
                </div>
                {/*menu mobile*/}
                <div className='md:hidden pr-2'>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className='p-2 focus:outline-none'>
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />

                        </svg>
                    </button>
                </div>

                {/*mobile menu dropdown */}
                {isMenuOpen && (
                    <div className='absolute top-full left-0 w-full bg-white md:hidden shadow-lg '>
                        <ul className='flex flex-col'>
                            <li className={`px-4 py-3 text-sm font-semibold border-b cursor-pointer ${pathMatchRoute("/") ? "text-black bg-gray-50" : "text-gray-400"}`}
                                onClick={() => {
                                    navigate("/")
                                    setIsMenuOpen(false)
                                }}
                            >
                                Home
                            </li>
                            <li className={`px-4 py-3 text-sm font-semibold border-b cursor-pointer
                                    ${pathMatchRoute("/offers") ? "text-black bg-gray-50" : "text-gray-400"}`}
                                onClick={() => {
                                    navigate("/offers")
                                    setIsMenuOpen(false)
                                }}
                            > Offers

                            </li>
                            <li className={`px-4 py-3 text-sm font-semibold border-b cursor-pointer
                                    ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) ? "text-black bg-gray-50" : "text-gray-400"}`}
                                onClick={() => {
                                    navigate("/profile")
                                    setIsMenuOpen(false)
                                }}
                            >
                                {pageState}


                            </li>

                        </ul>

                    </div>
                )}
            </header>
        </div>
    )
}

