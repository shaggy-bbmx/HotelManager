import { act } from "react"
import {
    CREATE_TICKET_FAIL,
    CREATE_TICKET_SUCCESS,
    CREATE_TICKET_REQUEST,
    CREATE_TICKET_RESET,
    GET_TICKETS_REQUEST,
    GET_TICKETS_SUCCESS,
    GET_TICKETS_FAIL,
    GET_TICKETS_RESET,
    GET_TICKET_DETAIL_REQUEST,
    GET_TICKET_DETAIL_SUCCESS,
    GET_TICKET_DETAIL_FAIL,
    UPDATE_TICKET_REQUEST,
    UPDATE_TICKET_SUCCESS,
    UPDATE_TICKET_FAIL,
    UPDATE_TICKET_RESET
} from "../constants/ticketConstants"





export const createTicketReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_TICKET_REQUEST:
            return {
                ...state,
                loading: true
            }
        case CREATE_TICKET_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                ticketInfo: action.payload
            }
        case CREATE_TICKET_FAIL:
            return {
                ...state,
                loading: false,
                error: true
            }
        case CREATE_TICKET_RESET:
            return { loading: false, success: false, error: false, ticketInfo: null }

        default:
            return state
    }

}

export const getTicketsReducer = (state = { loading: false, error: false, tickets: [], success: false }, action) => {
    switch (action.type) {
        case GET_TICKETS_REQUEST:
            return {
                ...state,
                loading: true,
                success: false
            }
        case GET_TICKETS_SUCCESS:
            return {
                ...state,
                loading: false,
                tickets: action.payload,
                success: true
            }
        case GET_TICKETS_FAIL:
            return {
                ...state,
                loading: false,
                error: true
            }
        case GET_TICKETS_RESET:
            return { loading: false, error: false, tickets: null, success: false }

        default:
            return state
    }
}

export const getTicketDetailReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_TICKET_DETAIL_REQUEST:
            return {
                ...state,
                loading: true
            }
        case GET_TICKET_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                ticket: action.payload
            }
        case GET_TICKET_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: true
            }

        default:
            return state
    }
}

export const updateTicketReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_TICKET_REQUEST:
            return {
                ...state,
                loading: true
            }
        case UPDATE_TICKET_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                updatedTicket: action.payload
            }
        case UPDATE_TICKET_FAIL:
            return {
                ...state,
                loading: false,
                error: true,
                success: false
            }

        case UPDATE_TICKET_RESET:
            return {
                loading: false,
                success: false,
                error: false,
                updatedTicket: null
            }

        default:
            return state
    }
}

