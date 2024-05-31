import {
    CREATE_TICKET_FAIL,
    CREATE_TICKET_REQUEST,
    CREATE_TICKET_SUCCESS,
    GET_TICKETS_FAIL,
    GET_TICKETS_REQUEST,
    GET_TICKETS_SUCCESS,
    GET_TICKET_DETAIL_FAIL,
    GET_TICKET_DETAIL_REQUEST,
    GET_TICKET_DETAIL_SUCCESS,
    UPDATE_TICKET_FAIL,
    UPDATE_TICKET_REQUEST,
    UPDATE_TICKET_SUCCESS
} from "../constants/ticketConstants"
import axios from "axios"



export const createTicket = (ticketData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_TICKET_REQUEST })
        const config = { headers: { "Content-Type": "multipart/form-data" } }
        const { data } = await axios.post('/api/v1/create/ticket', ticketData, config)

        dispatch({
            type: CREATE_TICKET_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: CREATE_TICKET_FAIL
        })
    }
}

export const getAllTickets = (
    status = [], department = [], date = [], createdBy = Number(0),
    initiateDate = [], initiatedBy = Number(0),
    resolveDate = [], resolvedBy = Number(0),
    closedDate = [], closedBy = Number(0),
    page = Number(1)
) => async (dispatch) => {


    //format status
    if (status.length === 0) {
        status = ['OP', 'UP', 'RC', 'CL']
    }

    //format department
    if (department.length === 0) {
        department = ['Electrical', 'Civil', 'House Keeping']
    }

    // Construct the query parameters
    const params = {
        status: status.join(','),
        department: department.join(','),
        date: date.join(','),
        createdBy: createdBy,
        initiateDate: initiateDate.join(','),
        initiatedBy: initiatedBy,
        resolveDate: resolveDate.join(','),
        resolvedBy: resolvedBy,
        closedDate: closedDate.join(','),
        closedBy: closedBy,
        page: page
    }

    try {
        dispatch({ type: GET_TICKETS_REQUEST })
        const config = {
            headers: { "Content-Type": "application/json" },
            params: params
        }
        const { data } = await axios.get('/api/v1/tickets', config)

        dispatch({
            type: GET_TICKETS_SUCCESS,
            payload: data
        })


    } catch (error) {
        console.log(error)
        dispatch({
            type: GET_TICKETS_FAIL
        })
    }
}

export const getTicketDetail = (id) => async (dispatch) => {
    try {
        dispatch({ type: GET_TICKET_DETAIL_REQUEST })
        const config = { headers: { "Content-Type": "application/json" } }
        const { data } = await axios.get(`/api/v1/ticket/${id}`, config)

        dispatch({
            type: GET_TICKET_DETAIL_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: GET_TICKET_DETAIL_FAIL
        })
    }
}


export const updateTicket = (ticketData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_TICKET_REQUEST })
        const config = { headers: { "Content-Type": "application/json" } }
        await axios.put(`/api/v1/update/ticket/${ticketData.id}`, ticketData, config)

        dispatch({
            type: UPDATE_TICKET_SUCCESS,
            payload: ticketData
        })


    } catch (error) {
        dispatch({
            type: UPDATE_TICKET_FAIL
        })
    }
}


export const totalTickets = async (status = [], department = [],
    date = [], createdBy = Number(0),
    initiateDate = [], initiatedBy = Number(0),
    resolveDate = [], resolvedBy = Number(0),
    closedDate = [], closedBy = Number(0)
) => {


    //format status
    if (status.length === 0) {
        status = ['OP', 'UP', 'RC', 'CL']
    }

    //format department
    if (department.length === 0) {
        department = ['Electrical', 'Civil', 'House Keeping']
    }

    // Construct the query parameters
    const params = {
        status: status.join(','),
        department: department.join(','),
        date: date.join(','),
        createdBy: createdBy,
        initiateDate: initiateDate.join(','),
        initiatedBy: initiatedBy,
        resolveDate: resolveDate.join(','),
        resolvedBy: resolvedBy,
        closedDate: closedDate.join(','),
        closedBy: closedBy
    }


    const config = { headers: { "Content-Type": "application/json" }, params: params }
    try {
        const { data } = await axios.get(`/api/v1/ticket/count`, config)
        return data
    } catch (error) {
        console.log(error)
    }
}
