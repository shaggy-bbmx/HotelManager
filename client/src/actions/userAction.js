//userConstant.js
import {
    REGISTER_USER_FAIL,
    REGISTER_USER_RESET,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_RESET,
    CREATE_USER_REQUEST,
    CREATE_USER_SUCCESS,
    CREATE_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    GET_EMPLOYEE_REQUEST,
    GET_EMPLOYEE_SUCCESS,
    GET_EMPLOYEE_FAIL
} from "../constants/userConstant"

import axios from 'axios'


//action to register a user
export const Register = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST })
        const config = { headers: { "Content-Type": "application/json" } }
        await axios.post('/api/v1/register', userData, config)

        dispatch({
            type: REGISTER_USER_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL
        })
    }
}

//action to reset the register state
export const resetRegister = () => async (dispatch) => {
    dispatch({ type: REGISTER_USER_RESET })
}


//action to login a user
export const Login = (userData) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_USER_REQUEST })
        const config = { headers: { "Content-Type": "application/json" } }
        const { data } = await axios.post('/api/v1/login', userData, config)

        //save token to local storage

        const userInfo = data

        dispatch({
            type: LOGIN_USER_SUCCESS
        })

        dispatch({ type: LOAD_USER_SUCCESS, payload: userInfo })

    } catch (error) {
        dispatch({
            type: LOGIN_USER_FAIL
        })
    }
}

//action to load a user from jwt token
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST })
        const config = { headers: { "Content-Type": "application/json" } }
        const { data } = await axios.get('/api/v1/load/user', config)

        const userInfo = data

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: userInfo
        })

    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL
        })
    }
}

//action to reset the login state
export const resetLogin = () => async (dispatch) => {
    dispatch({ type: LOGIN_USER_RESET })
}

//action to create a user
export const createUser = (userInfo) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_USER_REQUEST })
        const config = { headers: { "Content-Type": "multipart/form-data" } }
        await axios.post('/api/v1/create/user', userInfo, config)

        dispatch({
            type: CREATE_USER_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: CREATE_USER_FAIL
        })
    }
}

//action to update a user
export const updateUser = (id, password) => async (dispatch) => {
    try {
        const userData = { id, password }
        dispatch({ type: UPDATE_USER_REQUEST })
        const config = { headers: { "Content-Type": "application/json" } }
        await axios.put('/api/v1/update/user', userData, config)

        dispatch({
            type: UPDATE_USER_SUCCESS,
        })


    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL
        })
    }
}

export const logoutUser = async () => {
    try {
        await axios.get('/api/v1/logout')
    } catch (error) {
        console.log(error)
    }
}

//action to load a employee data from employee no
export const getEmployee = (employeeNo) => async (dispatch) => {
    try {
        dispatch({ type: GET_EMPLOYEE_REQUEST })
        const config = { headers: { "Content-Type": "application/json" } }
        const { data } = await axios.get(`/api/v1/employee/${employeeNo}`, config)

        dispatch({
            type: GET_EMPLOYEE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: GET_EMPLOYEE_FAIL
        })
    }
}