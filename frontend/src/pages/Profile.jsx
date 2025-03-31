import { getAuth, updateProfile } from 'firebase/auth'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { db } from '../firebase';
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, getDoc, where } from "firebase/firestore";
import { FcHome } from "react-icons/fc";
import ListingItem from '../components/ListingItem';




export default function Profile() {
    const auth = getAuth()
    const navigate = useNavigate()


    const [changeDetail, setChangeDetail] = useState(false)
    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: ''
    })

    useEffect(() => {
        const checkAuthorization = async () => {
            if (formData.role === '') return;

            if (formData.role === 'tenant') {
                toast.error("Unauthorized access")
                navigate('/')
            }
        }
        checkAuthorization()
    }, [formData.role, navigate])

    useEffect(() => {
        const fetchUserData = async (user) => {
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {

                    const role = docSnap.data().role || 'tenant';
                    setFormData(prev => ({
                        ...prev,
                        role: role
                    }));

                    if (role === 'tenant') {
                        toast.error("Unauthorized access");
                        navigate('/');
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        // useEffect(() => {
        //     const fetchUserData = async (user) => {
        //         const docRef = doc(db, "users", user.uid)
        //         const docSnap = await getDoc(docRef)

        //         if (docSnap.exists()) {
        //             setFormData(prev => ({
        //                 ...prev,
        //                 role: docSnap.data().role || 'tenant'
        //             }))
        //         }
        //     }





        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                navigate('/sign-in')
            } else {
                setFormData({
                    name: user.displayName || '',
                    email: user.email || ''

                })
                fetchUserData(user)

            }
        })

        return () => unsubscribe()
    }, [navigate, auth])


    useEffect(() => {
        async function fetchUserListings() {
            try {
                if (!auth.currentUser?.uid || formData.role !== 'owner') return
                setLoading(true)

                const listingRef = collection(db, "listings")
                const q = query(
                    listingRef,
                    where("userRef", "==", auth.currentUser.uid),
                    orderBy("timestamp", "desc")
                )

                const querySnap = await getDocs(q)
                const listingsData = querySnap.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                }))

                setListings(listingsData)
            } catch (error) {
                toast.error("Failed to load listings")
            } finally {
                setLoading(false)
            }
        }
        fetchUserListings()
    }, [auth.currentUser?.uid, formData.role]) // Dépendance sécurisée

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
                    name: formData.name

                });
            }
            toast.success('Profile details updated')

        } catch (error) {
            toast.error("Could not update the profile details")

        }

    }
    async function onDelete(listingID) {
        if (window.confirm("Are you sure you want to delete ?")) {
            await deleteDoc(doc(db, "listings", listingID))
            const updatedListings = listings.filter((listing) => listing.id !== listingID);
            setListings(updatedListings);
            toast.success("Successfully deleted the listing")
        }
    }
    function onEdit(listingID) {
        navigate(`/edit-listing/${listingID}`)
    }


    return (
        <>
            <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
                <h1 className='text-3xl text-center mt-6 font-bold'>My profile</h1>
                <div className='w-full md:w-[50%] mt-6 px-3'>
                    <form>
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2'>
                                Role : {formData.role}
                            </label>
                        </div>

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
                    <br />
                    {(formData.role === 'owner' || formData.role === 'admin') && (
                        <button type='submit' className='w-full bg-blue-600 text-white uppercase px-7 py-2 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>
                            <Link to='/create-listing' className='flex justify-center items-center'>

                                <FcHome className='mr-2 text-3xl bg-red-200 rounded-full p- border-2' />
                                Sell or rent your home
                            </Link>


                        </button>
                    )}
                </div>
            </section>
            {(formData.role === 'owner' || formData.role === 'admin') && (
                <div className='max-w-6xl px-3 mt-6 mx-auto'>
                    {!loading && listings.length > 0 && (
                        <>
                            <h2 className='text-2xl text-center font-semibold mb-6'>My Listings</h2>
                            <ul className='sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3'>
                                {listings.map((listing) => (
                                    <ListingItem key={listing.id} id={listing.id} listing={listing.data}
                                        onDelete={() => onDelete(listing.id)}
                                        onEdit={() => onEdit(listing.id)}
                                    />
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}
        </>
    )
}