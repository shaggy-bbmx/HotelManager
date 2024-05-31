import React, { useEffect } from 'react'
import { useState } from 'react'
import moment from 'moment'
import axios from 'axios'


//redux
import { useSelector } from 'react-redux'

//mui & css
import { ThreeDots } from 'react-loader-spinner'




const Notification = ({ props }) => {

    //constants
    const { showNotification,
        setShowNotification,
        setNotificationViewer,
        setNotificationTicketId,
        socket, } = props


    const markNotificationAsRead = async (ticketId, employeeNo) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } }
            await axios.put(`/api/v1/notification/update/${ticketId}/${employeeNo}`, config)

        } catch (error) {
            console.log(error)
        }

    }

    //redux
    const { userInfo } = useSelector(state => state.loadUser)

    //states
    const [notifications, setNotifications] = useState([])
    const [count, SetCount] = useState(0)
    const [loading, setLoading] = useState(true)

    //useEffect for socket handling
    useEffect(() => {
        if (socket) {
            socket.on('getNotification', (data) => {
                if (data.senderEmployeeNo !== userInfo.employeeNo) {
                    setNotifications((prev) => {
                        let isExist = false
                        prev.forEach((notification) => {
                            if (notification.id === data.id) isExist = true
                        })
                        if (isExist) return prev

                        let openTickets = JSON.parse(sessionStorage.getItem('openTickets'))
                        let updatedNotifications;

                        if (openTickets.includes(data.ticketId)) {
                            // updatedNotifications = [{ ...data, readBy: [[...data.readBy], userInfo.employeeNo] }, ...prev]
                            updatedNotifications = prev
                        } else {
                            updatedNotifications = [data, ...prev]
                        }

                        markNotificationAsRead(data.ticketId, userInfo.employeeNo)
                        return updatedNotifications
                    })
                }
            })


            socket.on('markAsRead', (data) => {
                setNotifications((prev) => {
                    return prev.map((notification) => {
                        if (notification.ticketId === data.ticketId) {
                            return { ...notification, readBy: [...notification.readBy, data.employeeNo] }
                        } else {
                            return notification
                        }
                    })
                })
            })
        }
    }, [socket, userInfo])



    //useEffect count logic
    useEffect(() => {
        SetCount(0)
        notifications.forEach(notification => {
            if (!notification.readBy.includes(userInfo.employeeNo)) {
                SetCount((prev) => prev + 1)
            }
        })
    }, [notifications, userInfo])

    //useEffect for filtering notifications
    useEffect(() => {
        setNotifications((prev) => {
            return prev.filter((notification) => {
                return !notification.readBy.includes(userInfo.employeeNo)
            })
        })
    }, [notifications, userInfo])

    //fetch notifications from DB
    useEffect(() => {

        const fetchNotifications = async (employeeNo, department) => {
            if (department === '') {
                department = 'User'
            }

            try {
                const { data } = await axios.get(`/api/v1/notification/${employeeNo}/${department}`)
                if (data.length > 0) {
                    data.sort((a, b) => new Date(b.time) - new Date(a.time))
                }
                setNotifications(data)
                setLoading(false)
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }

        fetchNotifications(userInfo.employeeNo, userInfo.department)
    }, [userInfo])

    // time format logic
    const formatTime = (dateString) => {
        if (isNaN(Date.parse(dateString))) return ''
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



    return (
        <div className='relative'>
            <svg
                onClick={() => setShowNotification(!showNotification)}
                className='w-8 mr-2 hover:cursor-pointer ' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z" fill="rgb(75 85 99)"></path> </g>
            </svg>
            {count > 0 && < span className='w-4 h-4 bg-green-600 rounded-full flex justify-center items-center p-2 text-white text-xs absolute -top-1 right-1 border-[1px] border-white'>{count}</span>}
            {
                showNotification && <div className='w-[18vw] h-[38vh] shodow-md absolute top-12 right-8 pt-4  rounded-3xl  border-2 border-slate-100 bg-gray-800 z-40 shadow-2xl overflow-hidden'>
                    <div className='w-full flex flex-row justify-center items-center text-slate-50 text-md font-semibold pb-2'>Notifications</div>
                    <div className='w-full h-[1px] bg-slate-700'></div>
                    <div className='w-full flex flex-col h-[28vh]  overflow-auto notification-scroll-container hover:cursor-pointer'>
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
                        {!loading && notifications.length === 0 && <div className='w-full pt-2 text-slate-400 text-sm flex justify-center'>No Notifications</div>}
                        {!loading && notifications.length > 0 && notifications.map((notification, index) => (
                            <div
                                onClick={() => {
                                    setShowNotification(false)
                                    setNotificationViewer(true)
                                    setNotificationTicketId(notification?.ticketId)
                                }}
                                key={index} className='w-full  text-slate-50 text-sm'>
                                <p className={`w-full p-2 ${notification.readBy.includes(userInfo.employeeNo) ? 'text-slate-500' : 'text-white-600'}`}>Ticket<span className={`rounded-full border-[1px] px-2 ${notification.readBy.includes(userInfo.employeeNo) ? 'border-slate-500' : 'border-white'} mx-2`}>ID: {notification.ticketId}</span> {notification.message}</p>
                                <p className='w-full pr-2 flex flex-row justify-end text-[0.75rem] text-slate-400'>{formatTime(notification.time)}</p>
                                <p className='w-full h-[1px] bg-slate-700 flex'></p>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div >
    )
}

export default Notification
