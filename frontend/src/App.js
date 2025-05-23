import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword"
import Offers from "./pages/Offers"
import Header from "./components/Header";
import { ToastContainer, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ListingCreate from "./pages/ListingCreate";
import EditListing from "./pages/EditListing";
import Listing from "./pages/Listing";
import Contact from "./components/Contact";
import Category from "./pages/Category";

// import TopBar from "./components/TopBar";
// import Dashboard from "./pages/Dashboard";
// import Calendar from "./pages/Calendar";
// import BarChart from "./pages/BarChart";
// import ChartPie from "./pages/ChartPie";






function App() {
  return (
    <>

      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-out" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/category/:categoryName/:listingId" element={<Listing />} />
          <Route path="/contact/:ownerId" element={<Contact />} />


          <Route element={<PrivateRoute />}>
            {/* <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/bar" element={<BarChart />} />
            <Route path="/pie" element={<ChartPie />} /> */}




            {/* <Route path="contacts" element={<Contacts />} /> */}

            <Route path="/profile" element={<Profile />} />





            <Route path="/create-listing" element={<ListingCreate />} />
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
          </Route>



        </Routes>
      </Router>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>


  );
}

export default App;
