import React, { memo, useEffect, useState } from 'react'
import Ticket from './Ticket'
import axios from 'axios'
import { ThreeDots } from 'react-loader-spinner'



const NotificationViewer = memo(({ props }) => {

    const { notificationTicketId: ticketId,
        setNotificationViewer,
        notificationViewer,
        socket } = props



    //useState
    const [loading, setLoading] = React.useState(true)
    const [ticket, setTicket] = useState()


    //useEffect for fetching ticket
    useEffect(() => {
        if (ticketId && notificationViewer) {
            const fetchTicket = async () => {
                try {
                    setLoading(true)
                    const config = { headers: { "Content-Type": "application/json" } }
                    const { data } = await axios.get(`/api/v1/ticket/${ticketId}`, config)
                    setTicket(data)
                    setLoading(false)
                } catch (error) {
                    console.log(error)
                }
            }

            fetchTicket()
        }
    }, [ticketId, notificationViewer])

    return (
        <div className='w-[70vw] overflow-hidden z-50'>
            {(loading === true) &&
                <div className='w-full h-full flex justify-center items-center'>
                    <ThreeDots
                        visible={true}
                        height="80"
                        width="80"
                        color="rgb(107 114 128)"
                        radius="9"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass="" />
                </div>}
            {!loading && <>
                <div className='w-full flex justify-end bg-white rounded-t-lg pt-2 pr-2 pb-4'>
                    <span
                        onClick={() => {
                            setTicket(null)
                            setNotificationViewer(false)
                        }}
                        className='hover:cursor-pointer rotate-45 h-8 w-8  rounded-md  text-4xl'>+</span>
                </div>
                <div className='w-full flex flex-row p-2 pt-0 bg-white '>
                    <div className='flex justify-center w-[15%]'><h1 className='text-md font-semibold text-[#0d0c0c]'>ID</h1></div>
                    <div className='flex flex-row justify-center w-[15%] cursor-pointer'>
                        <h1 className='text-md font-semibold text-[#0d0c0c]'>Department</h1>
                    </div>

                    <div className='flex justify-center w-[40%] cursor-pointer'>
                        <h1 className='text-md font-semibold text-[#0d0c0c]'>Title</h1>
                    </div>
                    <div className='flex justify-center w-[10%] cursor-pointer'>
                        <h1 className='text-md font-semibold text-[#0d0c0c]'>Status</h1>
                    </div>
                    <div className='flex justify-center w-[12%] cursor-pointer'>
                        <h1 className='text-md font-semibold text-[#0d0c0c]'>Created By</h1>
                    </div>
                    <div className='flex justify-center w-[8%]'><h1 className='text-md font-semibold text-[#0d0c0c]'>Time</h1></div>
                </div>
                <div className='w-full flex justify-center'>
                    <div className='w-[100%] h-0.5 bg-slate-100'></div>
                </div>
                <div className='w-full h-[65vh] overflow-y-auto viewer-scroll-container'>
                    {ticket && <Ticket ticket={ticket} key={ticket.id} socket={socket} />}
                </div>
            </>}
        </div>
    )
})

export default NotificationViewer
