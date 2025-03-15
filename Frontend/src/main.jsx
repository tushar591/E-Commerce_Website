import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51R2WlC4WXDycV7VWRt7hE235MSvooS6BxwX6RWv3ctlIBmoHon2lVQhqZNQqSjx4i97nYesc0wOIoikgDS0UMWR000kltT8imO");

createRoot(document.getElementById('root')).render(
<Elements stripe={stripePromise}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</Elements>
)
