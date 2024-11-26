import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { setStripePaymentDetails } from '../../../redux/slices/cartSlice';
import Button from '../Button';
import Loader from '../Loader';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY_ID);

function StripePaymentButton({ amount, currency }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { userInfo } = user;

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false); // Track payment in progress

  // Fetch PaymentIntent from the backend
  useEffect(() => {
    const fetchPaymentIntent = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/orders/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({ amount, currency }),
        });
        const data = await response.json();
        if (data?.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      } catch (error) {
        console.error('Error fetching PaymentIntent:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [amount, currency, userInfo.token]);

  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
    if (!stripe || !elements) {
      alert('Stripe.js has not loaded yet.');
      return;
    }
  
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      alert('Payment form is not fully loaded yet.');
      return;
    }
  
    if (isPaymentInProgress) {
      alert('Payment is already in progress.');
      return;
    }
  
    setIsPaymentInProgress(true);
  
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: userInfo.name,
            email: userInfo.email,
          },
        },
      });
  
      if (error) {
        alert(`Payment failed: ${error.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
        dispatch(
          setStripePaymentDetails({
            stripePaymentId: paymentIntent.id,
            stripeClientSecret: clientSecret,
          })
        );
      }
    } catch (err) {
      console.error('Unexpected error during payment:', err);
    } finally {
      setIsPaymentInProgress(false);
    }
  };
  

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <CardElement />
          <Button
            variant="outline"
            type="button"
            className="w-full rounded-full mt-2"
            disabled={!stripe || !clientSecret || isPaymentInProgress} // Disable the button during payment processing
            onClick={handlePayment}
          >
            Pay Now
          </Button>
        </div>
      )}
    </div>
  );
}

StripePaymentButton.propTypes = {
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
};

export default StripePaymentButton;
