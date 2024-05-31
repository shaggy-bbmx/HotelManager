import { LOGIN_USER_FAIL, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, REGISTER_USER_FAIL, LOGIN_USER_RESET, UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_RESET, UPDATE_USER_FAIL, GET_EMPLOYEE_REQUEST, GET_EMPLOYEE_SUCCESS, GET_EMPLOYEE_FAIL } from "../constants/userConstant"
import { REGISTER_USER_REQUEST } from "../constants/userConstant"
import { REGISTER_USER_SUCCESS } from "../constants/userConstant"
import { REGISTER_USER_RESET } from "../constants/userConstant"
import { CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_RESET, CREATE_USER_FAIL, LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAIL, LOAD_USER_RESET } from "../constants/userConstant"




export const userReducer = (state = {}, action) => {
    switch (action.type) {

        //register related cases
        case REGISTER_USER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case REGISTER_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                registerSuccess: true
            }
        case REGISTER_USER_FAIL:
            return {
                ...state,
                loading: false,
                registerError: true
            }

        case REGISTER_USER_RESET:
            return {
                ...state,
                registerSuccess: null,
                registerError: null
            }

        //login related cases    
        case LOGIN_USER_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case LOGIN_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                loginSuccess: true,
            }
        case LOGIN_USER_FAIL:
            return {
                ...state,
                loading: false,
                loginError: true
            }

        case LOGIN_USER_RESET:
            return {
                ...state,
                loginSuccess: null,
                loginError: null,
            }


        default:
            return state
    }
}

export const loadUserReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_USER_REQUEST:
            return {
                ...state,
                loading: true,
                isAuthenticated: false
            }
        case LOAD_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                userInfo: action.payload
            }
        case LOAD_USER_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
            }
        case LOAD_USER_RESET:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                userInfo: null
            }

        default:
            return state
    }
}

export const updateUserReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_USER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true
            }
        case UPDATE_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: true
            }
        case UPDATE_USER_RESET:
            return {
                loading: null,
                error: null
            }
        default:
            return state
    }
}

export const createUserReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_USER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case CREATE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
            }
        case CREATE_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: true
            }
        case CREATE_USER_RESET:
            return {
                loading: null,
                error: null
            }
        default:
            return state
    }
}

export const getEmployeeReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_EMPLOYEE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case GET_EMPLOYEE_SUCCESS:
            return {
                ...state,
                loading: false,
                employee: action.payload
            }
        case GET_EMPLOYEE_FAIL:
            return {
                ...state,
                loading: true,
            }
        default:
            return state
    }
}