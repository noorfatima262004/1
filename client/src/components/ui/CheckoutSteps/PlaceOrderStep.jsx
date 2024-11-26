import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import Thunks
import { createOrder } from '../../../redux/asyncThunks/orderThunks';
import { clearCartData } from '../../../redux/slices/cartSlice';

// Import Components
import Button from '../Button';
import Loader from '../Loader';
import Message from '../Message';
import StripePaymentButton from './StripePaymentButton';

function PlaceOrderStep({ setCurrentStep }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const {
    shippingAddress,
    paymentMethod,
    cartItems,
    orderStripePaymentDetails,
  } = cart;

  const order = useSelector((state) => state.order);
  const { loading, orderInfo, orderCreateSuccess, orderCreateError } = order;

  const orderSummary = [
    {
      name: 'Items Price',
      value: cartItems?.reduce((acc, item) => acc + item.price * item.qty, 0),
    },
    {
      name: 'Delivery Charges',
      value:
        cartItems?.reduce((acc, item) => acc + item.price * item.qty, 0) > 100
          ? 0
          : 10,
    },
    {
      name: 'Sales Tax',
      value: Number(
        (
          0.15 *
          cartItems?.reduce((acc, item) => acc + item.price * item.qty, 0)
        ).toFixed(2)
      ),
    },
    {
      name: 'Total',
      value: Math.round(
        (
          cartItems?.reduce((acc, item) => acc + item.price * item.qty, 0) +
          (cartItems?.reduce((acc, item) => acc + item.price * item.qty, 0) > 100
            ? 0
            : 10) +
          Number(
            (
              0.15 *
              cartItems?.reduce((acc, item) => acc + item.price * item.qty, 0)
            ).toFixed(2)
          )
        ).toFixed(2)
      ),
    },
  ];

  const handlePlaceOrder = () => {
    if (!orderStripePaymentDetails?.stripePaymentId) {
      alert('Stripe payment ID is missing or invalid.');
      return;
    }
    console.log('In Placing Order',orderStripePaymentDetails);
    dispatch(
      createOrder({
        orderItems: cartItems,
        deliveryAddress: shippingAddress,
        salesTax: orderSummary[2].value,
        deliveryCharges: orderSummary[1].value,
        totalPrice: orderSummary[3].value,
        payment: {
          method: 'stripe',
          stripePaymentId: orderStripePaymentDetails?.stripePaymentId,
          status: orderStripePaymentDetails?.stripePaymentId ? 'success' : 'pending',
        },
      })
    );
  };

  useEffect(() => {
    if (orderCreateSuccess && orderInfo) {
      dispatch(clearCartData());
      navigate('/my-orders');
      setCurrentStep('Shipping');
    }
  }, [dispatch, navigate, orderCreateSuccess, orderInfo, setCurrentStep]);

  return (
    <div className="flex flex-col justify-between items-center mb-4">
      <h1 className="text-center text-black text-xl leading-relaxed">
        Place Order
      </h1>
      {orderCreateError && <Message>{orderCreateError}</Message>}
      <>
        {loading ? (
          <Loader />
        ) : cartItems && cartItems.length > 0 ? (
          <div className="w-full flex flex-col items-center justify-center border border-orange-300 rounded-2xl p-4 mt-2 space-y-4 md:flex-row md:space-y-0 md:space-x-6">
            <div className="flex flex-col items-start justify-between w-full md:w-2/3">
              {/* Shipping Address */}
              <div className="py-2">
                <h2 className="text-center text-black text-xl leading-relaxed">
                  Shipping Address
                </h2>
                <p className="text-orange-500 text-md leading-relaxed">
                  <span className="text-black text-md leading-relaxed mr-2">
                    Phone:
                  </span>
                  {shippingAddress.phoneNumber}
                </p>
                <p className="text-orange-500 text-md leading-relaxed">
                  <span className="text-black text-md leading-relaxed mr-2">
                    Address:
                  </span>
                  {`${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
                </p>
              </div>
              {/* Payment Method */}
              <div className="border-y border-y-orange-300 py-2">
                <h2 className="text-center text-black text-xl leading-relaxed">
                  Payment Method
                </h2>
                <p className="text-orange-500 text-md leading-relaxed">
                  <span className="text-black text-md leading-relaxed mr-2">
                    Method:
                  </span>
                  {paymentMethod}
                </p>
              </div>
              {/* Order Items */}
              <div className="py-2">
                <h2 className="text-center text-black text-xl leading-relaxed">
                  Order Items
                </h2>
                {cartItems.map((item) => (
                  <div key={item._id} className="py-2 border-b border-orange-300">
                    <p>{item.name}</p>
                    <p>
                      {item.qty} x ${item.price} = ${item.price * item.qty}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Order Summary */}
            <div className="sm:w-1/3 p-4 border-2 border-orange-300 rounded-2xl">
              <h2 className="text-center text-black text-xl leading-relaxed">
                Order Summary
              </h2>
              {orderSummary.map((item) => (
                <div key={item.name} className="py-1 border-t border-orange-300">
                  <p>{item.name}: ${item.value}</p>
                </div>
              ))}
              {/* Stripe Payment Button */}
              {!orderStripePaymentDetails?.stripePaymentId && (
                <StripePaymentButton
                  amount={orderSummary[3].value}
                  currency="USD" // Specify the currency
                />
              )}
              <Button
                variant="primary"
                disabled={!orderStripePaymentDetails?.stripePaymentId}
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-orange-500 text-xl">No items to order</p>
        )}
      </>
    </div>
  );
}

PlaceOrderStep.propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
};

export default PlaceOrderStep;
