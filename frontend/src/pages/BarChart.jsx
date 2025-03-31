import React, { useEffect, useState } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from '../components/Spinner';
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';

export default function BarChart() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem("currentMode");
        return saved || "light";
    });

    useEffect(() => {
        const fetchData = async () => {
            try {

                const listingsRef = collection(db, "listings");
                const snapshot = await getDocs(listingsRef);

                let listingsData = [];

                snapshot.forEach((doc) => {
                    const listing = doc.data();
                    // console.log("Document raw data:", listing); // Debugging

                    listingsData.push({
                        type: listing.type?.trim() || "Inconnu",
                        prix: parseInt(listing.discountedPrice, 10) || 0,
                    });
                });

                // console.log("Raw data before grouping:", listingsData); // Debugging

                const groupedData = listingsData.reduce((acc, curr) => {
                    const existing = acc.find(item => item.type === curr.type);
                    if (existing) {
                        existing.prix += curr.prix;
                    } else {
                        acc.push({ ...curr });
                    }
                    return acc;
                }, []);

                console.log("Grouped data:", groupedData); // Debugging

                if (groupedData.length === 0) {
                    setError("No data available");
                } else {
                    setData(groupedData);
                }
            } catch (err) {
                console.error("Recovery error:", err);
                setError("Error loading data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    if (loading) return <Spinner />


    if (error) {
        return <div className="error">{error}</div>;
    }

    if (data.length === 0) {
        return <div>Aucune donnée à afficher</div>;
    }


    const handleDrawerOpen = () => {
        setOpen(true);
    };


    const handleDrawerClose = () => {
        setOpen(false);
    };
    return (
        <>
            <TopBar open={open}
                handleDrawerOpen={handleDrawerOpen} setMode={setMode} mode={mode} />


            <SideBar open={open} handleDrawerClose={handleDrawerClose} />

            <div className='mt-16' style={{ height: '450px', width: '80%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                        data={data}
                        margin={{ top: 50, right: 30, left: 300, bottom: 5 }}
                    >
                        <XAxis
                            dataKey="type"
                            label={{
                                value: 'Type of property',
                                position: 'bottom',
                                offset: -10
                            }}
                        />
                        <YAxis
                            label={{
                                value: 'Total price ($)',
                                angle: -90,
                                position: 'right',
                                offset: 10
                            }}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="prix"
                            name="Total price"
                            fill="#b5b209"
                            unit="$"
                        />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}