import {
    PRODUCTS_LIST_REQUEST,
    PRODUCTS_LIST_SUCCESS,
    PRODUCTS_LIST_FAIL,

    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,

    CREATE_PRODUCT_REQUEST,
    CREATE_PRODUCT_SUCCESS,
    CREATE_PRODUCT_FAIL,

    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,

    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,

    CHANGE_DELIVERY_STATUS_REQUEST,
    CHANGE_DELIVERY_STATUS_SUCCESS,
    CHANGE_DELIVERY_STATUS_FAIL,

} from '../constants/index'

import axios from 'axios'

// ✅ Base API URL — switches between local and Render automatically
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

// 📦 Products List
export const getProductsList = () => async (dispatch) => {
    try {
        dispatch({ type: PRODUCTS_LIST_REQUEST });

        // API call
        const { data } = await axios.get(`${API_BASE}/api/products/`);

        dispatch({
            type: PRODUCTS_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: PRODUCTS_LIST_FAIL,
            payload: error.message,
        });
    }
};

// 📄 Product Details
export const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        // API call
        const { data } = await axios.get(`${API_BASE}/api/product/${id}/`);

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.message,
        });
    }
};

// ➕ Create Product
export const createProduct = (product) => async (dispatch, getState) => {
    try {
        dispatch({ type: CREATE_PRODUCT_REQUEST });

        const {
            userLoginReducer: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post(
            `${API_BASE}/api/product-create/`,
            product,
            config
        );

        dispatch({
            type: CREATE_PRODUCT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: CREATE_PRODUCT_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

// ❌ Delete Product
export const deleteProduct = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: DELETE_PRODUCT_REQUEST });

        const {
            userLoginReducer: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.delete(
            `${API_BASE}/api/product-delete/${id}/`,
            config
        );

        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

// ✏️ Update Product
export const updateProduct = (id, product) => async (dispatch, getState) => {
    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });

        const {
            userLoginReducer: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(
            `${API_BASE}/api/product-update/${id}/`,
            product,
            config
        );

        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

// 🚚 Change Ordered Product Delivery Status
export const changeDeliveryStatus = (id, product) => async (dispatch, getState) => {
    try {
        dispatch({ type: CHANGE_DELIVERY_STATUS_REQUEST });

        const {
            userLoginReducer: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(
            `${API_BASE}/account/change-order-status/${id}/`,
            product,
            config
        );

        dispatch({
            type: CHANGE_DELIVERY_STATUS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: CHANGE_DELIVERY_STATUS_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};
