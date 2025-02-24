import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Header() {
    const [pageState, setPageState] = useState("Sign in")
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

            <header className='flex justify-between items-center px-3 max-w-6x1 mx-auto'>
                <div className='pl-8'>
                    <img src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" alt="logo"
                        className='h-5 cursor-pointer'
                        onClick={() => navigate("/")} />

                </div>
                <div className='pr-8'>
                    <ul className='flex space-x-10'>
                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent transition duration-300
                            ${pathMatchRoute("/") && "text-black border-b-red-500"}   hover:border-b-red-500 hover:text-black`}
                            onClick={() => navigate("/")}
                        >Home</li>

                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent  transition duration-300
                            ${pathMatchRoute("/offers") && "text-black border-b-red-500"}   hover:border-b-red-500 hover:text-black`}
                            onClick={() => navigate("/offers")}
                        >Offers</li>

                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent  transition duration-300
                            ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) && "text-black border-b-red-500"} hover:border-b-red-500 hover:text-black `}
                            onClick={() => navigate("/profile")}

                        >
                            {pageState}
                        </li>
                    </ul>
                </div>
            </header>
        </div>
    )
}
