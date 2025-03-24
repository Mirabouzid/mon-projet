import React, { useEffect, useState } from 'react';
import Slider from '../components/Slider';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Home() {
    const [filters, setFilters] = useState({
        address: '',
        type: '',


    });
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Anciens états pour les sections par défaut
    const [offerListings, setOfferListings] = useState(null);
    const [rentListings, setRentListings] = useState(null);
    const [saleListings, setSaleListings] = useState(null);

    // Recherche dynamique
    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const listingsRef = collection(db, 'listings');
            const queryConstraints = [];

            if (filters.type) queryConstraints.push(where('type', '==', filters.type));


            if (filters.address) {
                queryConstraints.push(
                    where('address', '>=', filters.address.toLowerCase()),
                    where('address', '<=', filters.address.toLowerCase() + '\uf8ff')
                );
            }

            const q = query(listingsRef, ...queryConstraints, orderBy('timestamp', 'desc'),
                limit(20));
            const querySnap = await getDocs(q);

            const results = [];
            querySnap.forEach(doc =>
                results.push({ id: doc.id, data: doc.data() }));


            setSearchResults(results);
        } catch (err) {
            setError('Erreur de recherche : ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Chargement initial des offres
    useEffect(() => {
        const fetchListings = async (condition, setter) => {
            try {
                const q = query(
                    collection(db, "listings"),
                    ...condition,
                    orderBy("timestamp", "desc"),
                    limit(4)
                );
                const querySnap = await getDocs(q);
                const listings = [];
                querySnap.forEach(doc => listings.push({ id: doc.id, data: doc.data() }));
                setter(listings);
            } catch (error) {
                console.log(error);
            }
        };

        fetchListings([where("offer", "==", true)], setOfferListings);
        fetchListings([where("type", "==", "rent")], setRentListings);
        fetchListings([where("type", "==", "sale")], setSaleListings);
    }, []);

    return (
        <div>
            <Slider />

            {/* Barre de recherche */}
            <div className="max-w-[95%] md:max-w-3xl lg:max-w-4xl mx-auto px-2 sm:px-4">
                <form onSubmit={handleSearch} className="relative -mt-8 md:-mt-14 z-10 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                    {/* Champ Location */}
                    <div className="space-y-1 col-span-1 md:col-span-2 lg:col-span-1">
                        <label className="block text-sm font-medium">Destination</label>
                        <input
                            type="text"
                            placeholder="Address, city, state"
                            className="w-full p-3 border rounded-lg"
                            value={filters.address}
                            onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                        />
                    </div>

                    {/* Sélecteur Type */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium">TYPE</label>
                        <select
                            className="w-full p-3 border rounded-lg"
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        >
                            <option value="">All Types</option>
                            <option value="rent">Rent</option>
                            <option value="sale">Sale</option>
                        </select>
                    </div>



                    {/* Bouton de recherche */}
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                            disabled={loading}
                        >
                            {loading ? 'Searching...' : 'SEARCH'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Affichage des résultats */}
            <div className="max-w-6xl mx-auto pt-4 space-y-6">
                {error && <p className="text-red-500 px-4">{error}</p>}

                {searchResults ? (
                    // Résultats de recherche
                    <div className="m-2 mb-6">
                        <h2 className="px-3 text-2xl mt-6 font-semibold">
                            {searchResults.length} Search Results
                        </h2>
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                            {searchResults.map((listing) => (
                                <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
                            ))}
                        </ul>
                    </div>
                ) : (
                    // Affichage par défaut
                    <>
                        {offerListings?.length > 0 && (
                            <div className="m-2 mb-6">
                                <h2 className="px-3 text-2xl mt-6 font-semibold">Recent Offers</h2>
                                <Link to="/offers" className="px-3 text-sm text-blue-600 hover:text-blue-800">
                                    Show more offers
                                </Link>
                                <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                    {offerListings.map((listing) => (
                                        <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
                                    ))}
                                </ul>
                            </div>
                        )}

                        {rentListings?.length > 0 && (
                            <div className="m-2 mb-6">
                                <h2 className="px-3 text-2xl mt-6 font-semibold">Places for Rent</h2>
                                <Link to="/category/rent" className="px-3 text-sm text-blue-600 hover:text-blue-800">
                                    Show more rentals
                                </Link>
                                <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                    {rentListings.map((listing) => (
                                        <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
                                    ))}
                                </ul>
                            </div>
                        )}

                        {saleListings?.length > 0 && (
                            <div className="m-2 mb-6">
                                <h2 className="px-3 text-2xl mt-6 font-semibold">Places for Sale</h2>
                                <Link to="/category/sale" className="px-3 text-sm text-blue-600 hover:text-blue-800">
                                    Show more sales
                                </Link>
                                <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                    {saleListings.map((listing) => (
                                        <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}