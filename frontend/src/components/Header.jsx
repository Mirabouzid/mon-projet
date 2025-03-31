import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import logo from '../assets/img/logo-site.png'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [userRole, setUserRole] = useState(null)
    const [pageState, setPageState] = useState("Sign in")
    const location = useLocation()
    const navigate = useNavigate()
    const auth = getAuth()

    const allowedRoles = ['owner', 'admin']
    const isTenant = userRole === 'tenant'
    const isAdmin = userRole === 'admin'


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid))
                const role = userDoc.exists() ? userDoc.data().role : 'tenant'

                setUserRole(role)
                setPageState(role === 'admin' ? "Admin" : "Profile")
            } else {
                setUserRole(null)
                setPageState("Sign in")
            }
        })
        return () => unsubscribe()
    }, [auth])

    const pathMatchRoute = (route) => route === location.pathname

    const renderNavItem = (route, label, onClick) => (
        <li
            className={`cursor-pointer py-3 text-sm font-semibold transition duration-300 border-b-[3px] ${pathMatchRoute(route)
                ? "text-red-600 border-b-red-600"
                : "text-gray-400 border-b-transparent hover:border-b-red-500 hover:text-black"
                }`}
            onClick={onClick}
        >
            {label}
        </li>
    )

    const renderMobileNavItem = (route, label, onClick) => (
        <li
            className={`px-4 py-3 text-sm font-semibold border-b cursor-pointer ${pathMatchRoute(route) ? "text-black bg-gray-50" : "text-gray-400"
                }`}
            onClick={onClick}
        >
            {label}
        </li>
    )

    return (
        <div className="bg-white border-b shadow-sm sticky top-0 z-40">
            <header className="flex justify-between items-center px-4 md:px-3 max-w-6xl mx-auto">
                <div className="pl-2 md:pl-8">
                    <img
                        src={logo}
                        alt="logo"
                        className="w-full h-14 object-contain cursor-pointer"
                        onClick={() => navigate("/")}
                    />
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:block pr-8">
                    <ul className="flex space-x-10">
                        {renderNavItem("/", "Home", () => navigate("/"))}
                        {renderNavItem("/offers", "Offers", () => navigate("/offers"))}

                        {!userRole || isTenant ? (
                            renderNavItem("/sign-in", "Sign in", () => navigate("/sign-in"))
                        )
                            : (allowedRoles.includes(userRole) &&
                                renderNavItem("/profile", pageState, () => navigate("/profile")))}

                        {isAdmin && renderNavItem("/dashboard", "Dashboard", () => navigate("/dashboard"))}
                    </ul>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden pr-2">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white md:hidden shadow-lg">
                        <ul className="flex flex-col">
                            {renderMobileNavItem("/", "Home", () => {
                                navigate("/")
                                setIsMenuOpen(false)
                            })}

                            {renderMobileNavItem("/offers", "Offers", () => {
                                navigate("/offers")
                                setIsMenuOpen(false)
                            })}

                            {!userRole || isTenant ? (
                                renderMobileNavItem("/sign-in", "Sign in", () => {
                                    navigate("/sign-in")
                                    setIsMenuOpen(false)
                                })
                            ) : (allowedRoles.includes(userRole) &&
                                renderMobileNavItem("/profile", pageState, () => {
                                    navigate("/profile")
                                    setIsMenuOpen(false)
                                }))}

                            {isAdmin &&
                                renderMobileNavItem("/dashboard", "Dashboard", () => {
                                    navigate("/dashboard")
                                    setIsMenuOpen(false)
                                })}
                        </ul>
                    </div>
                )}
            </header>
        </div>
    )
}