//React 
import React, { useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import Cookies from 'js-cookie'
import FilterBox from '../components/FilterBox.js'
import TicketInbox from '../components/TicketInbox.js'
import TicketForm from '../components/TicketForm.js'
import Profile from '../components/Profile.js'
import PreLoader from '../components/PreLoader.js'
import Notification from '../components/Notification.js'
import NotificationViewer from '../components/NotificationViewer.js'



//redux
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../actions/userAction.js'



//image
import bgImg from '../assest/images/accountBg.svg'
import './pages.css'
import { ThreeDots } from 'react-loader-spinner'
import { getAllTickets, totalTickets } from '../actions/ticketAction.js'
import Pen from '../assest/images/pen.png'
import logo from '../assest/images/logo.png'

//socket.io
import io from 'socket.io-client'








const UserAccount = () => {

    //constants

    const oldestDate = new Date(0).toISOString()
    const now = new Date()
    let nextYear = now.getFullYear() + 1
    const newestDate = new Date(Date.UTC(nextYear, 0, 1, 0, 0, 0, 0)).toISOString()

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    //redux
    const history = useHistory()
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.loadUser)
    const { loading, error, tickets, success } = useSelector(state => state.getAllTickets)

    //state

    const [newTicket, setNewTicket] = React.useState(false)

    const [filterBoxLoading, setFilterBoxLoading] = React.useState(false)
    const [status, setStatus] = React.useState([])
    const [department, setDepartment] = React.useState([])
    const [date, setDate] = React.useState([oldestDate, newestDate])
    const [createdBy, setCreatedBy] = React.useState(0)
    const [initiateDate, setInitiateDate] = React.useState([oldestDate, newestDate])
    const [initiatedBy, setInitiatedBy] = React.useState(0)
    const [resolveDate, setResolveDate] = React.useState([oldestDate, newestDate])
    const [resolvedBy, setResolvedBy] = React.useState(0)
    const [closedDate, setClosedDate] = React.useState([oldestDate, newestDate])
    const [closedBy, setClosedBy] = React.useState(0)
    const [logout, setLogout] = React.useState(false)
    const [showProfile, setShowProfile] = React.useState(false)
    const specificChildRef = useRef(null)
    const [showNotification, setShowNotification] = useState(false)
    const [socket, setSocket] = useState(null)
    const [notificationViewer, setNotificationViewer] = useState(false)
    const [notificationTicketId, setNotificationTicketId] = useState()






    //handler
    const logoutHandler = () => {
        dispatch({ type: 'LOAD_USER_RESET' })
        dispatch({ type: 'LOGIN_USER_RESET' })
        logoutUser()
        history.push('/')

    }



    useEffect(() => {
        //For Dev mode choose ==1) For Production choose ==2)
        // const newSocket = io('http://localhost:5000')
        const newSocket = io('https://hotelmanager-q6bz.onrender.com:5000')

        setSocket(newSocket)

        return () => {
            newSocket.disconnect()
        }

    }, [userInfo])

    useEffect(() => {
        if (!socket) return


        if (userInfo) {
            if (userInfo.role === 'User') {
                socket.emit('joinRoom', 'User')
            } else {
                socket.emit('joinRoom', userInfo.department)
            }

        }

    }, [socket, userInfo])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (specificChildRef.current && !specificChildRef.current.contains(event.target)) {
                setShowNotification(false)
            }
        }

        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [specificChildRef])


    useEffect(() => {
        sessionStorage.setItem('openTickets', JSON.stringify([]))
    }, [])

    return (
        <div
            className='w-full bg-cover bg-center bg-no-repeat flex flex-col  pb-4 relative  bg-slate-50 pt-4'>
            {/* notification viewer */}
            <div className={`z-30 ${notificationViewer ? 'w-full' : 'w-0'} transition-all  duration-500 h-full absolute inset-0 bg-transparent  backdrop-blur-md  flex justify-center pt-[20vh] overflow-hidden`}>
                <div className='absolute w-full h-full bg-gray-900  left-0 top-0 opacity-10 z-40 '></div>
                <NotificationViewer
                    props={{
                        notificationTicketId,
                        setNotificationViewer,
                        notificationViewer,
                        socket
                    }}
                />
            </div>


            {/* profile */}
            <div className={`z-20 ${showProfile ? 'w-full' : 'w-0'} transition-all  duration-500 h-full absolute top-0 left-0 bg-transparent backdrop-blur-md flex justify-center items-center overflow-hidden`}>
                <Profile setShowProfile={setShowProfile} />
            </div>

            <div className='w-[95vw] h-[10vh] p-2 ml-[2vw] flex flex-row justify-between   mb-6'>
                {/* menu */}
                <div className='flex flex-row items-center text-gray-600'>
                    <img src={logo} className='w-20 h-20 object-contain mr-2' alt='logo' />
                    {userInfo && <p className='w-[50%] flex justify-center  text-lg font-normal italic'>
                        Mr.<span className='ml-2'>{capitalizeFirstLetter(userInfo.name)}</span></p>}
                </div>
                <div className=' pl-2  flex flex-row rounded-md items-center space-x-6' >

                    <div
                        onClick={() => setShowProfile(true)}
                        className='h-full cursor-pointer flex justify-center items-center  pl-2'>
                        <img src={userInfo.profilePic} className='w-8 h-8  transition-all bg-gray-800  hover:scale-[3]  rounded-full object-contain' alt='profile' />
                    </div>

                    <div ref={specificChildRef} className='transition-all h-full flex justify-center items-center rounded-lg pl-2'>
                        <Notification props={{
                            showNotification,
                            setShowNotification,
                            setNotificationViewer,
                            setNotificationTicketId,
                            socket,
                        }} />
                    </div>
                    <div
                        onClick={() => setLogout(true)}
                        className='transition-all h-full  flex justify-center rounded-lg pl-2'>
                        <svg
                            className='w-8 mr-2 hover:cursor-pointer' viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.75 9.874C11.75 10.2882 12.0858 10.624 12.5 10.624C12.9142 10.624 13.25 10.2882 13.25 9.874H11.75ZM13.25 4C13.25 3.58579 12.9142 3.25 12.5 3.25C12.0858 3.25 11.75 3.58579 11.75 4H13.25ZM9.81082 6.66156C10.1878 6.48991 10.3542 6.04515 10.1826 5.66818C10.0109 5.29121 9.56615 5.12478 9.18918 5.29644L9.81082 6.66156ZM5.5 12.16L4.7499 12.1561L4.75005 12.1687L5.5 12.16ZM12.5 19L12.5086 18.25C12.5029 18.25 12.4971 18.25 12.4914 18.25L12.5 19ZM19.5 12.16L20.2501 12.1687L20.25 12.1561L19.5 12.16ZM15.8108 5.29644C15.4338 5.12478 14.9891 5.29121 14.8174 5.66818C14.6458 6.04515 14.8122 6.48991 15.1892 6.66156L15.8108 5.29644ZM13.25 9.874V4H11.75V9.874H13.25ZM9.18918 5.29644C6.49843 6.52171 4.7655 9.19951 4.75001 12.1561L6.24999 12.1639C6.26242 9.79237 7.65246 7.6444 9.81082 6.66156L9.18918 5.29644ZM4.75005 12.1687C4.79935 16.4046 8.27278 19.7986 12.5086 19.75L12.4914 18.25C9.08384 18.2892 6.28961 15.5588 6.24995 12.1513L4.75005 12.1687ZM12.4914 19.75C16.7272 19.7986 20.2007 16.4046 20.2499 12.1687L18.7501 12.1513C18.7104 15.5588 15.9162 18.2892 12.5086 18.25L12.4914 19.75ZM20.25 12.1561C20.2345 9.19951 18.5016 6.52171 15.8108 5.29644L15.1892 6.66156C17.3475 7.6444 18.7376 9.79237 18.75 12.1639L20.25 12.1561Z" fill="rgb(75 85 99)"></path> </g>
                        </svg>
                    </div>

                </div>

            </div>
            <div className='w-full  flex flex-row px-2 pt-8 space-x-8 '>
                <div className='w-[20vw] flex flex-col space-y-8'>
                    {(userInfo?.role === 'User') && <div className='p-2 w-full'>
                        <button
                            onClick={() => setNewTicket(true)}
                            className='shadow-sm  py-2 px-8 font-normal bg-[#c2e7ff] flex flex-row items-center rounded-md text-md border-2 hover:shadow-md'>
                            <img src={Pen} alt='pen' className='w-4 h-4 mr-2' />
                            <span>New Ticket</span>
                        </button>
                    </div>}
                    <div className='w-full h-[64vh]  bg-white   rounded-3xl p-2 sticky top-12 border-2 border-white'>
                        <FilterBox
                            filters={{
                                status,
                                setStatus,
                                department,
                                setDepartment,
                                date,
                                setDate,
                                createdBy,
                                setCreatedBy,
                                initiateDate,
                                setInitiateDate,
                                initiatedBy,
                                setInitiatedBy,
                                resolveDate,
                                setResolveDate,
                                resolvedBy,
                                setResolvedBy,
                                closedDate,
                                setClosedDate,
                                closedBy,
                                setClosedBy,
                                setFilterBoxLoading,
                                filterBoxLoading
                            }}
                        />
                    </div>
                </div>
                <div className='w-full rounded-md'>
                    <TicketInbox
                        filters={{
                            status,
                            department,
                            date,
                            createdBy,
                            initiateDate,
                            initiatedBy,
                            resolveDate,
                            resolvedBy,
                            closedDate,
                            closedBy,
                            setFilterBoxLoading,
                            socket,
                            notificationViewer,
                            notificationTicketId,
                        }}
                    />
                </div>
            </div>
            {newTicket &&
                <div
                    className='w-full h-full z-20  bg-slate-50  absolute top-0 left-0 flex justify-center p-16'>
                    <TicketForm setNewTicket={setNewTicket} socket={socket} />
                </div>
            }
            {logout && <div className='w-[100%] h-[100vh] bg-transparent backdrop-blur-md absolute top-0 left-0 flex justify-center items-center'>
                <div className='w-[20vw] h-[20vh] p-8 flex flex-col bg-slate-50 rounded-lg  shadow-lg'>
                    <p className='w-full text-lg mb-4'>Are You You Want to Logout?</p>
                    <div className='w-full flex justify-around'>
                        <button
                            // disabled={loading ? true : false}
                            // style={loading ? { opacity: '0.5' } : { opacity: '1' }}
                            onClick={() => logoutHandler()}
                            type='submit'
                            className="py-2 px-6 font-normal text-lg bg-[#c2e7ff] rounded-md ">
                            Logout
                        </button>
                        <button
                            onClick={() => setLogout(false)}
                            type='submit'
                            className="py-2 px-6 font-normal text-lg bg-[#c2e7ff] rounded-md">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>}
        </div>

    )
}

export default UserAccount
