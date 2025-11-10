import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
    CARD_CREATE_REQUEST,
    CARD_CREATE_SUCCESS,
    CARD_CREATE_FAIL,
    CARD_CREATE_RESET,
} from '../constants/index'

import axios from 'axios'

// ✅ Base API URL (auto-switches between local and Render)
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

// 🛒 Add item to cart
export const addToCart = (id, qty) => async (dispatch, getState) => {
    try {
        // Fetch product details
        const { data } = await axios.get(`${API_BASE}/api/product/${id}/`);

        dispatch({
            type: CART_ADD_ITEM,
            payload: {
                product: data.id,
                name: data.name,
                image: data.image,
                price: data.price,
                countInStock: data.countInStock,
                qty,
            },
        });

        // Save to localStorage
        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
    } catch (error) {
        console.error("Error adding to cart:", error.message);
    }
};

// 🗑️ Remove item from cart
export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id,
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// 📦 Save shipping address
export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data,
    });

    localStorage.setItem('shippingAddress', JSON.stringify(data));
};

// 💳 Save payment method
export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data,
    });

    localStorage.setItem('paymentMethod', JSON.stringify(data));
};

// 🧾 Create order (or checkout)
export const createOrder = (orderData) => async (dispatch, getState) => {
    try {
        dispatch({ type: CARD_CREATE_REQUEST });

        const {
            userLoginReducer: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post(`${API_BASE}/payments/create-order/`, orderData, config);

        dispatch({
            type: CARD_CREATE_SUCCESS,
            payload: data,
        });

        // Clear cart after successful order creation
        localStorage.removeItem('cartItems');
        dispatch({ type: CARD_CREATE_RESET });

    } catch (error) {
        dispatch({
            type: CARD_CREATE_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};
