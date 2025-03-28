import React, { useState, useEffect } from 'react'
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { getAuth } from 'firebase/auth';
import { serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase'
import { Navigate, useNavigate } from 'react-router-dom';



export default function ListingCreate() {
    const Navigate = useNavigate();
    const auth = getAuth();
    const [geolocationEnabled] = useState(false);
    const [loading, setLoading] = useState(false)


    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        description: "",
        detailedDescription: "",
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        latitude: 0,
        longitude: 0,

        images: []
    });
    const { type, name, bedrooms, bathrooms, parking, furnished, address, description, offer, regularPrice, discountedPrice, latitude, longitude, images } = formData

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData((prevState) => ({
                        ...prevState,
                        latitude,
                        longitude,
                    }));
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    toast.error("Error retrieving location.");
                }
            );
        } else {
            toast.error("Geolocation is not supported by this browser.");
        }
    }, []);


    function onChange(e) {
        let boolean = null;
        if (e.target.value === "true") {
            boolean = true;
        }
        if (e.target.value === "false") {
            boolean = false;
        }
        //files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: [...e.target.files],

            }))
        }
        //text/boolean/number
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }))
        }
    }
    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);

        if (!formData.detailedDescription?.trim()) {
            toast.error("La description détaillée est obligatoire");
            setLoading(false);
            return;
        }


        if (+discountedPrice >= +regularPrice) {
            setLoading(false)
            toast.error("Discounted price need to be less than regular price ")
            return;
        }

        if (images.length > 6) {
            setLoading(false)
            toast.error("Maximum 6 images are allowed ")
            return;

        }

        if (!address.trim()) {
            toast.error("Address is required.");
            setLoading(false);
            return;
        }
        // Géocodage de l'adresse avec OpenCage
        let geolocation = {};
        let locationFormatted = "";

        try {
            const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;
            const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const firstResult = data.results[0];
                geolocation = {
                    lat: firstResult.geometry.lat || 0,
                    lng: firstResult.geometry.lng || 0,
                };
                locationFormatted = firstResult.formatted;
            } else {
                toast.error("Address not found.");
                setLoading(false);
                return;
            }
        } catch (error) {
            console.error("Geocoding error :", error);
            toast.error("Geocoding error.");
            setLoading(false);
            return;
        }

        console.log("Geolocation:", geolocation);
        console.log("Formatted Address:", locationFormatted);

        // Envoyez les données au serveur
        setLoading(false);


        // Téléchargement des images sur Cloudinary
        try {
            const imgUrls = await Promise.all(
                [...images].map((image) => uploadImageToCloudinary(image))
            );

            console.log("Image URLs:", imgUrls);

            const formDataCopy = {
                ...formData,
                detailedDescription: formData.detailedDescription || "Description non fournie",
                imgUrls,
                geolocation,
                locationFormatted,
                timestamp: serverTimestamp(),
                userRef: auth.currentUser.uid,
            };

            delete formDataCopy.images;
            if (!formDataCopy.offer) {
                delete formDataCopy.discountedPrice;
            }
            delete formDataCopy.latitude;
            delete formDataCopy.longitude;

            // Envoyer les données à Firebase
            const docRef = await addDoc(collection(db, "listings"), formDataCopy);
            console.log("Document written with ID:", docRef.id);

            setLoading(false);
            toast.success("Listing created successfully!");
            Navigate(`/category/${formDataCopy.type}/${docRef}`);
        } catch (error) {
            console.error("Error uploading images or saving data:", error);
            toast.error("Failed to create listing.");
            setLoading(false);
        }

    }
    async function uploadImageToCloudinary(image) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'first_time_using_cloudinary');

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/dc4zcbagf/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const data = await response.json();
        return data.secure_url;

    }

    if (loading) {
        return <Spinner />
    }

    return (

        <main className='max-w-md px-2 mx-auto'>
            <h1 className='text-3xl text-center mt-6 font-bold'>Create a Listing</h1>
            <form onSubmit={onSubmit}>
                <p className='text-lg mt-6 font-semibold'>Sell / Rent</p>

                <div className='flex'>
                    <button type='button' id='type' value="sale"
                        onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                    ${type === "sale" ? "bg-white text-black" : "bg-slate-600  text-white"} `}

                    >sell

                    </button>

                    <button type='button' id='type' value="rent"
                        onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                    ${type === "rent" ? "bg-white text-black" : "bg-slate-600  text-white"} `}

                    >rent

                    </button>
                </div>
                <p className='text-lg mt-6 font-semibold'>Name</p>
                <input type="text" id='name' value={name} onChange={onChange} placeholder='Name' maxLength='32' minLength='10' required
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6 ' />
                <div className='flex space-x-6 mb-6'>
                    <div>
                        <p className='text-lg font-semibold'>Beds</p>
                        <input type="number" id="bedrooms" value={bedrooms} onChange={onChange} min="1" max="50" required
                            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />

                    </div>

                    <div>
                        <p className='text-lg font-semibold'>Baths</p>
                        <input type="number" id="bathrooms" value={bathrooms} onChange={onChange} min="1" max="50" required
                            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />

                    </div>
                </div>

                <p className='text-lg mt-6 font-semibold'>Parking spot</p>

                <div className='flex'>
                    <button type='button' id='parking' value={true}
                        onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                        ${!parking ? "bg-white text-black" : "bg-slate-600  text-white"} `}

                    >Yes

                    </button>

                    <button type='button' id='parking' value={false}
                        onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                        ${parking ? "bg-white text-black" : "bg-slate-600  text-white"} `}

                    >No

                    </button>
                </div>


                <p className='text-lg mt-6 font-semibold'>Furnished</p>

                <div className='flex'>
                    <button type='button' id='furnished' value={true}
                        onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                        ${!furnished ? "bg-white text-black" : "bg-slate-600  text-white"} `}

                    >Yes

                    </button>

                    <button type='button' id='furnished' value={false}
                        onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                         ${furnished ? "bg-white text-black" : "bg-slate-600  text-white"} `}

                    >No

                    </button>
                </div>

                <p className='text-lg mt-6 font-semibold'>Address</p>
                <textarea type="text" id='address' value={address} onChange={onChange} placeholder='Address' required
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6 ' />

                {!geolocationEnabled && (
                    <div className='flex space-x-6 justify-start mb-6'>
                        <div className=''>
                            <p className='text-lg font-semibold'>Latitude</p>
                            <input type="number" id='latitude' value={latitude} onChange={onChange} required min="-180" max="180" className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center' />

                        </div>
                        <div className=''>
                            <p className='text-lg font-semibold'>Longitude</p>
                            <input type="number" id='longitude' value={longitude} onChange={onChange} required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center' />

                        </div>
                    </div>
                )}


                <p className='text-lg font-semibold'>Description</p>
                <textarea type="text" id='description' value={description} onChange={onChange} placeholder='Description' required
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6 ' />



                <p className='text-lg font-semibold'>Offer</p>

                <div className='flex mb-6'>
                    <button type='button' id='offer' value={true}
                        onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                        ${!offer ? "bg-white text-black" : "bg-slate-600  text-white"} `}

                    >Yes

                    </button>

                    <button type='button' id='offer' value={false}
                        onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                        ${offer ? "bg-white text-black" : "bg-slate-600  text-white"} `}

                    >No

                    </button>
                </div>
                <div className='flex items-center mb-6'>
                    <div>
                        <p className='text-lg font-semibold'>Regular price</p>
                        <div className='flex w-full justify-center items-center space-x-6 '>
                            <input type="number" id='regularPrice' value={regularPrice} onChange={onChange} min="50" max="900000000" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />

                            {type === "rent" && (
                                <div className=''>
                                    <p className='text-md w-full whitespace-nowrap'>$ / Month </p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {offer && (
                    <div className='flex items-center mb-6'>
                        <div>
                            <p className='text-lg font-semibold'>DiscountedPrice</p>
                            <div className='flex w-full justify-center items-center space-x-6 '>
                                <input type="number" id='discountedPrice' value={discountedPrice} onChange={onChange} min="50" max="900000000" required={offer} disabled={!offer} className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />

                                {type === "rent" && (
                                    <div className=''>

                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                )}

                <div className='mb-6'>
                    <p className='text-lg font font-semibold'>Images</p>
                    <p className='text-gray-600 '>the first image will be the cover (max 6)</p>
                    <input type="file" id='images' onChange={onChange} accept='.jpg,.png,.jpeg' multiple required
                        className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600' />

                </div>
                <div className="mt-8 border-t pt-6">
                    <h3 className="text-2xl font-bold mb-4">Detailed Description</h3>
                    <textarea
                        id="detailedDescription"
                        value={formData.detailedDescription}
                        onChange={onChange}
                        placeholder="Describe your property in detail..."
                        className="w-full p-4 text-lg border rounded-lg min-h-[200px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        Provide a complete description with special features and details
                    </p>
                </div>
                <br />

                <button type="submit" className='mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'> Create Listing</button>



            </form>
        </main>
    );
}



