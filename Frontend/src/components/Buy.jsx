import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../../utils/utils.js";

export default function Buy() {
  const courseId = useParams().courseid;
  //console.log(courseId)
  const [loading, setloading] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [coursedata, setcoursedata] = useState([]);
  const [paymentdata, setpaymentdata] = useState("");
  const [errormessage, setErrorMessage] = useState("");
  const [carderror, setcarderror] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const handlebuydata = async () => {
      if (!token) {
        setErrorMessage("Please login first");
        return;
      }

      try {
        setloading(true);
        const response = await axios.post(
          `${BACKEND_URL}/course/buy/${courseId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        //console.log("Response: ", response.data);
        setcoursedata(response.data.course);
        setpaymentdata(response.data.paymentIntent);
        setClientSecret(response.data.clientSecret);
        setloading(false);
      } catch (error) {
        setloading(false);
        if (error?.response?.status === 401) {
          setErrorMessage("The course has been already purchased");
        } else {
          setErrorMessage(error?.response?.data?.message);
        }
        navigate("/purchases");
      }
    };
    handlebuydata();
  }, []);

  const stripe = useStripe();
  const elements = useElements();

  const handlebuy = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or Element Error Detected");
      return;
    }
    setloading(true);
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("Card not found");
      setloading(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("Stripe error", error);
      setloading(false);
      setcarderror(error.message);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
    }

    if (!clientSecret) {
      setloading(false);
      return;
    }

    const { paymentIntent, error: confirmerror } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: token,
          },
        },
      });
    if (confirmerror) {
      console.log("Error 107");
      setcarderror(confirmerror.message);
    } else if (paymentIntent.status == "succeeded") {
      console.log("Payment Successfull", paymentIntent);
      setcarderror("your payment id :", paymentIntent.id);
      const paymentInfo = {
        courseId: courseId,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      };
      console.log("paymentInfo :", paymentInfo);
      try {
        const response = axios.post(
          `${BACKEND_URL}/api/v1/order`,
          paymentInfo,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        //console.log(response);
      } catch (error) {
        console.log("Error occured while creating order", error);
        toast.error("Error occured while creating order");
      }

      toast.success("Payment successfull");
      navigate("/purchases");
    }
    setloading(false);
  };

  return (
    <>
      {errormessage ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-lg font-semibold">{errormessage}</p>
            <Link
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
              to={"/purchases"}
            >
              Purchases
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row my-40 container mx-auto">
          <div className="w-full md:w-1/2">
            <h1 className="text-xl font-semibold underline">Order Details</h1>
            <div className="flex items-center text-center space-x-2 mt-4">
              <h2 className="text-gray-600 text-sm">Total Price</h2>
              <p className="text-red-500 font-bold">${coursedata.price}</p>
            </div>
            <div className="flex items-center text-center space-x-2">
              <h1 className="text-gray-600 text-sm">Course name</h1>
              <p className="text-red-500 font-bold">{coursedata.title}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                Process your Payment!
              </h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm mb-2"
                  htmlFor="card-number"
                >
                  Credit/Debit Card
                </label>
                <form onSubmit={handlebuy}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />

                  <button
                    type="submit"
                    disabled={!stripe || loading} // Disable button when loading
                    className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                  >
                    {loading ? "Processing..." : "Pay"}
                  </button>
                </form>
                {carderror && (
                  <p className="text-red-500 font-semibold text-xs">
                    {carderror}
                  </p>
                )}
              </div>

              <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
                <span className="mr-2">🅿️</span> Other Payments Method
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
