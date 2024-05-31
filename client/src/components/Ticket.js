import React, { useState, useRef, memo, useEffect } from 'react'
import TicketDetails from './TicketDetails.js'
import moment from 'moment'



//redux
import { useSelector } from 'react-redux'

//css file and material ui
import './component.css'
import EmployeeInfo from './EmployeeInfo.js'
import axios from 'axios'




const Ticket = memo(({ ticket, socket, notificationTicketId, notificationViewer }) => {

    //redux
    const { userInfo } = useSelector(state => state.loadUser)


    //states
    const timeoutRef = useRef(null);
    const [detailsShow, setDetailsShow] = React.useState(false)
    const [statusHook, setStatusHook] = React.useState(ticket.status)
    const [showBio, setShowBio] = useState(false)


    //useEffect
    useEffect(() => {
        if (ticket) {
            setStatusHook(ticket.status)
        }
    }, [ticket])


    useEffect(() => {

        if (detailsShow) {
            const markNotificationAsRead = async () => {
                try {
                    socket.emit('updateNotification', { ticketId: ticket.id, employeeNo: userInfo.employeeNo, department: ticket.department })

                    const config = { headers: { "Content-Type": "application/json" } }
                    await axios.put(`/api/v1/notification/update/${ticket.id}/${userInfo.employeeNo}`, config)

                } catch (error) {
                    console.log(error)
                }

            }

            markNotificationAsRead()
        }

    }, [detailsShow, socket, ticket, userInfo])


    //if same ticket is opened in notification then close the ticket in inbox to avoid 
    //... sending multiple requests to server incase of status change
    useEffect(() => {
        if (notificationViewer && notificationTicketId === ticket.id) {
            setDetailsShow(false)
        }
    }, [notificationTicketId, notificationViewer, ticket])


    useEffect(() => {
        if (detailsShow) {
            let openTickets = JSON.parse(sessionStorage.getItem('openTickets'));

            if (!openTickets) {
                openTickets = [];
            }

            openTickets.push(ticket.id);

            sessionStorage.setItem('openTickets', JSON.stringify(openTickets));
        } else {
            let openTickets = JSON.parse(sessionStorage.getItem('openTickets'));

            if (!openTickets) {
                openTickets = []
            }
            openTickets = openTickets.filter((id) => id !== ticket.id)
            sessionStorage.setItem('openTickets', JSON.stringify(openTickets));
        }

    }, [detailsShow, ticket])

    // time format logic
    const formatTime = (dateString) => {
        //time logic
        let today = new Date()
        let momentDate = moment(new Date(dateString))
        if (momentDate.isSame(today, 'day')) {
            return momentDate.format('h:mm A')
        } else if (momentDate.isSame(today, 'year')) {
            return momentDate.format('DD/MM')
        } else {
            return momentDate.format('DD/MM/YY')
        }
    }

    //status color logic
    const findBackgroundColor = () => {
        switch (statusHook) {
            case 'OP':
                return 'rgb(239 68 68)'
            case 'UP':
                return 'rgb(249 115 22)'
            case 'RC':
                return 'rgb(253 224 71)'
            case 'CL':
                return 'rgb(132 204 22)'
            default:
                return 'gray'
        }
    }

    //mouse over and out logic
    const onMouseOverHandler = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current); // Clear the existing timeout if it exists
        }
        setShowBio(true)
    }

    const onMouseOutHandler = () => {
        timeoutRef.current = setTimeout(() => {
            setShowBio(false)
        }, 0)
    }


    return (
        <div
            className={`w-full  bg-white hover:bg-slate-100 b border-b-[1px] border-slate-100`}>
            <div onClick={() => setDetailsShow(!detailsShow)} className='w-full border-[1px] border-white hover:cursor-pointer shadow-none shadowing hover:shadow-black transition-all flex flex-row'>
                {/* all the data */}
                <div className='w-[95%] flex flex-row p-2  transition-all'>
                    <div className='flex justify-center w-[15%]  '><h1 className='text-lg  text-[#0d0c0c]'>{ticket.id}</h1></div>
                    <div className='flex justify-center w-[15%] '><h1 className='text-lg  text-[#0d0c0c]'>{ticket?.department}</h1></div>
                    <div className='flex justify-start w-[40%] px-4'><p className='text-lg w-full truncate   whitespace-nowrap overflow-hidden text-[#0d0c0c] text-center'>{ticket?.title}</p></div>
                    <div className='flex justify-center w-[10%] items-center '>
                        <span
                            style={{ backgroundColor: findBackgroundColor() }}
                            className={`w-4 h-4 mr-2 rounded-sm`}>
                        </span>
                        <h1 className='text-lg  text-[#0d0c0c]'>
                            {statusHook}
                        </h1></div>
                    <div
                        onMouseOver={onMouseOverHandler}
                        onMouseOut={onMouseOutHandler}
                        ref={timeoutRef}
                        className='flex justify-center w-[12%] relative'>
                        <h1 className='text-lg  text-[#0d0c0c]'>{ticket?.createdBy}</h1>
                        {showBio &&
                            <div className='w-[27vw] h-[26vh] absolute top-0 -left-[360px] z-20 bg-transparent'>
                                <EmployeeInfo employeeNo={ticket?.createdBy} />
                            </div>}
                    </div>
                    <div className='flex justify-center w-[8%]'><h1 className='text-lg  text-[#0d0c0c]'>{ }</h1>{formatTime(ticket.createdAt)}</div>
                </div>
                {/* down arrow */}
                <div
                    className='w-[5%] flex justify-center items-center'>
                    <svg className='h-[24px] w-[24px]'
                        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform={`${detailsShow ? 'rotate(90)' : 'rotate(270)'}`}><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 7L10 12L15 17" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g>
                    </svg>
                </div>
            </div>
            <div className='w-full'>
                {detailsShow && <TicketDetails id={ticket.id} key={ticket.id} setStatusHook={setStatusHook} setDetailsShow={setDetailsShow} socket={socket} statusHook={statusHook} />}
            </div>
        </div>
    )
})

export default Ticket
