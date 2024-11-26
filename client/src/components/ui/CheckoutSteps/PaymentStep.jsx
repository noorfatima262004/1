import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Actions
import {
  createStripePaymentIntent,
  savePaymentMethod,
} from '../../../redux/slices/cartSlice';

// Import Components
import Button from '../Button';
import Loader from '../Loader';
import Message from '../Message';

function PaymentStep({ setCurrentStep }) {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const {
    shippingAddress,
    cartItems,
    orderGetStripePaymentIntentDetails, // Access the correct field
    orderGetStripePaymentIntentError,
    orderGetStripePaymentIntentSuccess,
  } = cart;
  

  const [paymentMethod, setPaymentMethod] = useState(cart.paymentMethod || '');

  useEffect(() => {
    if (!shippingAddress) {
      setCurrentStep('Shipping');
    }
  }, [shippingAddress, setCurrentStep]);

  const submitHandler = (e) => {
    e.preventDefault();

    // Calculate the total amount
    const amount =
      cartItems &&
      Math.round(
        (
          cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) +
          (cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) > 100
            ? 0
            : 10) +
          Number(
            (
              0.15 *
              cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
            ).toFixed(2)
          )
        ).toFixed(2)
      );

    // Save payment method to state
    dispatch(savePaymentMethod(paymentMethod));

    // Create Stripe Payment Intent
    dispatch(createStripePaymentIntent({ amount, currency: 'USD' }));
  };

  useEffect(() => {
    // Proceed to the next step if the payment intent is successfully created
    if (orderGetStripePaymentIntentDetails && orderGetStripePaymentIntentSuccess) {
      setCurrentStep('Place Order');
    }
  }, [orderGetStripePaymentIntentSuccess, orderGetStripePaymentIntentDetails, setCurrentStep]);

  // useEffect(() => {
  //   if (orderGetRazorPayOrderIdSuccess && orderGetRazorPayOrderDetails) {
  //     setCurrentStep('Place Order');
  //   }
  // }, [orderGetRazorPayOrderIdSuccess,orderGetRazorPayOrderDetails,setCurrentStep,]);

  return (
    <form onSubmit={submitHandler} className="w-full p-4">
      <p className="text-center text-black text-xl leading-relaxed">
        Payment
        <br />
        <span className="text-sm text-orange-500">Select Payment Method</span>
      </p>
      {cartItems && cartItems.length > 0 ? (
        <>
          {orderGetStripePaymentIntentError && (
            <Message>{orderGetStripePaymentIntentError}</Message>
          )}
          <div className="flex flex-col items-center justify-center mt-4">
            <div className="flex items-center justify-center">
              <input
                type="radio"
                id="stripe"
                value="Stripe"
                name="paymentMethod"
                required
                checked={paymentMethod === 'Stripe'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              <label
                htmlFor="stripe"
                className="text-orange-500 font-semibold text-lg"
              >
                Online Payment
              </label>
            </div>
          </div>
          <Button
            variant="outline"
            type="submit"
            disabled={!paymentMethod || !cartItems}
            className="w-full sm:w-1/3 rounded-full mt-4 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center w-full border border-orange-300 rounded-2xl p-4">
          <p className="text-center text-orange-500 text-xl leading-relaxed">
            Can&apos;t Place Order Without Order Items
          </p>
        </div>
      )}
    </form>
  );
}

PaymentStep.propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
};

export default PaymentStep;
