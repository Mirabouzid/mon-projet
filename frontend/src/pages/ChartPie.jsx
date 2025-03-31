import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChartPie() {
    const [chartData, setChartData] = useState(null);
    const [totalVisits, setTotalVisits] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasData, setHasData] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem("currentMode");
        return saved || "light";
    });

    useEffect(() => {
        document.documentElement.className = mode;
        localStorage.setItem("currentMode", mode);
    }, [mode]);

    useEffect(() => {
        const fetchAndProcessData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'listings'));
                const listings = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const processedData = processListingsData(listings);

                setTotalVisits(processedData.total);
                setChartData(processedData.chartData);
                setHasData(processedData.hasData);
                setLoading(false);

            } catch (error) {
                console.error('Erreur de traitement des données:', error);
                setLoading(false);
            }
        };

        fetchAndProcessData();
    }, []);

    const processListingsData = (listings) => {

        const filteredListings = listings.filter(listing =>
            listing.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        let total = 0;
        const validListings = [];

        for (const listing of filteredListings) {
            const visits = Math.max(Number(listing.visits) || 0, 0);
            if (visits > 0) {
                total += visits;
                validListings.push({
                    name: (listing.name || 'Annonce sans nom').trim().substring(0, 20),
                    visits
                });
            }
        }

        const sorted = validListings.sort((a, b) => b.visits - a.visits);
        const top5 = sorted.slice(0, 5);

        return {
            total,
            hasData: validListings.length > 0,
            chartData: {
                labels: top5.map(item => item.name),
                datasets: [{
                    label: 'Répartition des visites',
                    data: top5.map(item => item.visits),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56',
                        '#4BC0C0', '#9966FF'
                    ],
                    borderWidth: 1
                }]
            }
        };
    };

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    if (loading) return <Spinner />;

    return (
        <>
            <TopBar
                open={open}
                handleDrawerOpen={handleDrawerOpen}
                setMode={setMode}
                mode={mode}
                searchQuery={searchQuery}
                onSearch={(value) => setSearchQuery(value)}
            />

            <SideBar open={open} handleDrawerClose={handleDrawerClose} />

            <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-16">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Répartition des visites (Total: {totalVisits})
                </h2>

                {hasData ? (
                    <div className="relative h-96">
                        <Pie
                            data={chartData || { labels: [], datasets: [] }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'right',
                                        labels: {
                                            boxWidth: 20,
                                            padding: 15,
                                            color: mode === 'dark' ? '#fff' : '#666'
                                        }
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => {
                                                const label = context.label || '';
                                                const value = context.raw || 0;
                                                const percentage = ((value / totalVisits) * 100).toFixed(1);
                                                return `${label}: ${value} visites (${percentage}%)`;
                                            }
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                ) : (
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-yellow-700">
                            Aucune donnée de visite disponible.
                            <br />
                            <span className="text-sm">
                                (Les visites seront enregistrées après consultation des annonces)
                            </span>
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}