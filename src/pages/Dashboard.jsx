import { collection, getDocs, getCountFromServer, limit, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import Spinner from '../components/Spinner'
import { getAuth } from 'firebase/auth'
import { Chart } from 'chart.js/auto'
import { useNavigate, Outlet } from 'react-router-dom'
import { ThemeProvider, styled } from '@mui/material/styles';


import {

    Package,
    TrendingUp,

} from "lucide-react";
import TopBar from '../components/TopBar'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline'
import {
    Home as MuiHome,
    BarChart,

    Notifications,
    Settings
} from '@mui/icons-material';
import SideBar from '../components/SideBar';
import { getTheme } from './Theme';


const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));




export default function Dashboard() {
    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState(Boolean(localStorage.getItem("currentMode"))
        ? localStorage.getItem("currentMode")
        : "light");

    const theme = React.useMemo(() => getTheme(mode), [mode]);

    const [globalStats, setGlobalStats] = useState({
        totalAds: 0,
        totalSales: 0,
        adsGrowth: 25,
        salesGrowth: 19
    });

    const navigate = useNavigate()
    const auth = getAuth()

    const handleDrawerOpen = () => {
        setOpen(true);
    };


    const handleDrawerClose = () => {
        setOpen(false);
    };

    // useEffect(() => {
    //     const savedMode = localStorage.getItem('ThemeMode') || 'light';
    //     setMode(savedMode);
    // }, []);

    useEffect(() => {
        if (!auth.currentUser) {
            navigate('/sign-in')
        }
    }, [auth.currentUser, navigate]);

    useEffect(() => {
        const fetchGlobalStats = async () => {
            try {
                // Récupérer le nombre total d'annonces
                const coll = collection(db, 'listings');
                const totalAdsSnapshot = await getCountFromServer(coll);

                // Récupérer le total des ventes
                const salesQuery = query(coll, where('sold', '==', true));
                const salesSnapshot = await getDocs(salesQuery);
                const totalSales = salesSnapshot.docs.reduce((sum, doc) => {
                    return sum + (doc.data().price || 0);
                }, 0);

                setGlobalStats(prev => ({
                    ...prev,
                    totalAds: totalAdsSnapshot.data().count,
                    totalSales
                }));
            } catch (error) {
                console.error("error retrieving global statistics :", error);
            }
        };

        if (auth.currentUser) {
            fetchGlobalStats();
        }
    }, [auth.currentUser]);

    useEffect(() => {
        const fetchUserListings = async () => {
            try {
                if (!auth.currentUser) return

                const q = query(
                    collection(db, 'listings'),
                    where('userRef', '==', auth.currentUser.uid),
                    orderBy('timestamp', "desc"),
                    limit(100)
                );
                const querySnap = await getDocs(q);

                const listingsData = [];
                querySnap.forEach(doc => {
                    listingsData.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });

                setListings(listingsData);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des annonces :", error);
                setLoading(false);
            }
        }
        fetchUserListings();
    }, [auth.currentUser]);

    useEffect(() => {
        let chartInstance = null;
        const ctx = document.getElementById('propertyChart');

        if (ctx && listings.length) {
            if (Chart.getChart(ctx)) Chart.getChart(ctx).destroy();

            const typesCount = listings.slice(0, 50).reduce((acc, { data: { type } }) => {
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, {});

            chartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(typesCount),
                    datasets: [{
                        data: Object.values(typesCount),
                        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
                        hoverOffset: 4
                    }]
                }
            });
        }

        return () => chartInstance?.destroy();
    }, [listings]);

    if (loading) return <Spinner />

    const totalProperties = listings.length;
    const totalOffers = listings.filter(listing => listing.data.offer).length;

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                display: 'flex', minHeight: '100vh'
            }}>
                <CssBaseline />
                <TopBar
                    open={open}
                    handleDrawerOpen={handleDrawerOpen}
                    mode={mode}
                    setMode={setMode}
                />

                <SideBar open={open} handleDrawerClose={handleDrawerClose} />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,

                    }}
                >
                    <main
                        className={`
          p-6 w-full pt-20 ml-0 transition-all duration-300 
          ${mode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}
        `}
                    >
                        <div className="space-y-6">
                            {/* Grid des statistiques */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {/* Carte "Active Ads" */}
                                <div className={`rounded-xl p-6 ${mode === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500">
                                            <Notifications fontSize="medium" />
                                        </div>
                                        <p className="text-lg font-semibold">Active Ads</p>
                                    </div>
                                    <div className={`rounded-xl p-4 ${mode === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}`}>
                                        <p className="text-3xl font-bold">{totalProperties}</p>
                                    </div>
                                </div>

                                {/* Carte "Special Offers" */}
                                <div className={`rounded-xl p-6 ${mode === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="rounded-lg bg-green-500/20 p-2 text-green-500">
                                            <Settings fontSize="medium" />
                                        </div>
                                        <p className="text-lg font-semibold">Special Offers</p>
                                    </div>
                                    <div className={`rounded-xl p-4 ${mode === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}`}>
                                        <p className="text-3xl font-bold">{totalOffers}</p>
                                    </div>
                                </div>

                                {/* Carte "Total Ads" */}
                                <div className={`rounded-xl p-6 ${mode === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="rounded-lg bg-orange-500/20 p-2 text-orange-500">
                                            <BarChart fontSize="medium" />
                                        </div>
                                        <p className="text-lg font-semibold">Total Ads</p>
                                    </div>
                                    <div className={`rounded-xl p-4 ${mode === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}`}>
                                        <p className="text-3xl font-bold">
                                            {globalStats.totalAds.toLocaleString()}
                                        </p>
                                        <span className="flex items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 text-sm mt-2 w-fit">
                                            <TrendingUp size={16} />
                                            {globalStats.adsGrowth}%
                                        </span>
                                    </div>
                                </div>

                                {/* Carte "Sales" */}
                                <div className={`rounded-xl p-6 ${mode === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="rounded-lg bg-purple-500/20 p-2 text-purple-500">
                                            <MuiHome fontSize="medium" />
                                        </div>
                                        <p className="text-lg font-semibold">Sales</p>
                                    </div>
                                    <div className={`rounded-xl p-4 ${mode === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}`}>
                                        <p className="text-3xl font-bold">
                                            ${globalStats.totalSales.toLocaleString()}
                                        </p>
                                        <span className="flex items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 text-sm mt-2 w-fit">
                                            <TrendingUp size={16} />
                                            {globalStats.salesGrowth}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Carte de Chart */}
                            <div className={`rounded-xl p-6 ${mode === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}>
                                <div className="mb-4">
                                    <p className="text-lg font-semibold">Distribution of Assets</p>
                                </div>
                                <div className="p-6">
                                    <canvas id="propertyChart" className="max-h-96"></canvas>
                                </div>
                            </div>

                            {/* Listings récents */}
                            <div className={`rounded-xl p-6 ${mode === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}>
                                <div className="mb-4">
                                    <p className="text-lg font-semibold">Recent Listings</p>
                                </div>
                                <div className="space-y-4">
                                    {listings.slice(0, 4).map((listing, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${mode === 'dark' ? 'bg-gray-600' : 'bg-blue-100'}`}>
                                                    {/* Utilisation de "size" pour lucide-react */}
                                                    <Package className="text-blue-500" size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{listing.data.name}</p>
                                                    <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                                        {new Date(listing.data.timestamp?.seconds * 1000).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-blue-500 font-medium">${listing.data.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DrawerHeader />

                    </main>

                </Box>
            </Box>
        </ThemeProvider>
    )
}
