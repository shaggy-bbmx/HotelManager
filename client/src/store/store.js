import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'
import { userReducer, createUserReducer, updateUserReducer, loadUserReducer, getEmployeeReducer } from '../reducers/userReducer'
import { createTicketReducer, getTicketDetailReducer, getTicketsReducer, updateTicketReducer } from '../reducers/ticketReducer'
import { loadUser } from '../actions/userAction'


const reducer = combineReducers({
    user: userReducer,
    ticket: createTicketReducer,
    getAllTickets: getTicketsReducer,
    getTicketDetail: getTicketDetailReducer,
    updateTicket: updateTicketReducer,
    createUser: createUserReducer,
    updateUser: updateUserReducer,
    loadUser: loadUserReducer,
    getEmployee: getEmployeeReducer,
})


const store = configureStore({ reducer, devTools: true })
export default store