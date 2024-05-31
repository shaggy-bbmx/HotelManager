
//react
import React, { useEffect, useState, useRef, useCallback, memo } from 'react'
import moment from 'moment'


//redux
import { useSelector, useDispatch } from 'react-redux'
import { getTicketDetail, updateTicket } from '../actions/ticketAction.js'
import { UPDATE_TICKET_RESET } from '../constants/ticketConstants.js'


//css and material ui
import { Alert } from '@mui/material'
import { CircularProgress } from '@mui/material'
import Stepper from 'react-stepper-horizontal'
import { Skeleton } from '@mui/material'
import Stopwatch from './microComponents/Stopwatch.js'
import EmployeeInfo from './EmployeeInfo.js'
import ImageViewer from 'react-simple-image-viewer'
import axios from 'axios'


const TicketDetails = memo(({ id, setStatusHook, setDetailsShow, socket, statusHook }) => {

    //constants
    const openImageViewer = useCallback((index) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, [])


    //redux
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.loadUser)
    const { ticket: TicketDetail, loading: ticketDetailLoading, error } = useSelector(state => state.getTicketDetail)
    const { loading: updateLoading, success: updateSuccess, error: updateError, updatedTicket } = useSelector(state => state.updateTicket)



    //useState
    const timeoutRefForCreator = useRef(null);
    const timeoutRefForInitiator = useRef(null);
    const timeoutRefForResolver = useRef(null);
    const timeoutRefForCloser = useRef(null);
    const [ticket, setTicket] = React.useState({})
    const [currentStatus, setCurrentStatus] = React.useState()
    const [showBioForCreator, setShowBioForCreator] = useState(false)
    const [showBioForInitiator, setShowBioForInitiator] = useState(false)
    const [showBioForResolver, setShowBioForResolver] = useState(false)
    const [showBioForCloser, setShowBioForCloser] = useState(false)
    const [currentImage, setCurrentImage] = useState(0)
    const [isViewerOpen, setIsViewerOpen] = useState(false)


    //useEffect
    useEffect(() => {
        dispatch(getTicketDetail(id))
    }, [id, statusHook, dispatch])


    useEffect(() => {
        if (TicketDetail) {
            setTicket(TicketDetail)
            setCurrentStatus(TicketDetail.status)
        }
    }, [TicketDetail])


    React.useEffect(() => {
        if (updateSuccess) {
            setStatusHook(updatedTicket.status)
            setTicket(updatedTicket)


            const findTheMessage = (status, name) => {
                switch (status) {
                    case 'OP':
                        return `has been created by ${name}`
                    default:
                        return `status changed to '${status}' by ${name}`

                }
            }


            const notificationData = {
                senderEmployeeNo: userInfo.employeeNo,
                senderName: userInfo.name,
                message: findTheMessage(updatedTicket.status, userInfo.name),
                time: new Date().toISOString(),
                room: ['User', updatedTicket.department],
                readBy: [],
                ticketId: updatedTicket.id,
                department: updatedTicket.department,
                title: updatedTicket.title,
                description: updatedTicket.description,
                roomNo: updatedTicket.roomNo,
                status: updatedTicket.status,
                createdBy: updatedTicket.createdBy,
                createdAt: updatedTicket.createdAt
            }


            const saveNotificationDB = async (notificationData) => {
                try {
                    const config = { headers: { "Content-Type": "application/json" } }
                    const { data } = await axios.post('/api/v1/create/notification', notificationData, config)
                    socket.emit('sendNotification', data)
                } catch (error) {
                    console.log(error)
                }
            }

            saveNotificationDB(notificationData)

        }

    }, [updateSuccess, socket, userInfo, updatedTicket])




    useEffect(() => {
        if (updateSuccess) {

            const timeOut = setTimeout(() => {
                dispatch({ type: UPDATE_TICKET_RESET })
            }, 1000)

            return () => clearTimeout(timeOut)
        }
    }, [updateSuccess, dispatch])


    useEffect(() => {
        if (updateError) {
            setCurrentStatus(ticket.status)
        }

    }, [updateError, ticket])

    useEffect(() => {
        if (updateError) {
            const timeOut = setTimeout(() => {
                dispatch({ type: UPDATE_TICKET_RESET });
            }, 2000)

            return () => clearTimeout(timeOut)
        }
    }, [updateError, dispatch,])


    //handlers
    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    }

    const selectionHandler = (e) => {
        setCurrentStatus(e.target.value)
    }

    const saveFormHandler = (e) => {
        e.preventDefault()

        let ticketData;
        switch (currentStatus) {
            case 'UP':
                ticketData = {
                    ...ticket,
                    status: currentStatus,
                    initiatedAt: new Date().toISOString(),
                    initiatedBy: Number(userInfo.employeeNo)
                }
                break;
            case 'RC':
                ticketData = {
                    ...ticket,
                    status: currentStatus,
                    resolvedAt: new Date().toISOString(),
                    resolvedBy: Number(userInfo.employeeNo)
                }
                break;
            case 'CL':
                ticketData = {
                    ...ticket,
                    status: currentStatus,
                    closedAt: new Date().toISOString(),
                    closedBy: Number(userInfo.employeeNo)
                }
                break;
            default:
                ticketData = {
                }
        }

        dispatch(updateTicket(ticketData))
    }

    //find active step
    const findActiveStep = () => {
        if (ticket.status === 'OP') {
            return 0
        } else if (ticket.status === 'UP') {
            return 1
        } else if (ticket.status === 'RC') {
            return 2
        } else if (ticket.status === 'CL') {
            return 3
        }
    }

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


    //mouse over and out logic
    const onMouseOverHandlerForCreator = () => {
        if (timeoutRefForCreator.current) {
            clearTimeout(timeoutRefForCreator.current); // Clear the existing timeout if it exists
        }
        setShowBioForCreator(true)
    }

    const onMouseOutHandlerForCreator = () => {
        timeoutRefForCreator.current = setTimeout(() => {
            setShowBioForCreator(false)
        }, 0)

    }

    const onMouseOverHandlerForInitiator = () => {
        if (timeoutRefForInitiator.current) {
            clearTimeout(timeoutRefForInitiator.current); // Clear the existing timeout if it exists
        }
        setShowBioForInitiator(true)
    }

    const onMouseOutHandlerForInitiator = () => {
        timeoutRefForInitiator.current = setTimeout(() => {
            setShowBioForInitiator(false)
        }, 0)
    }

    const onMouseOverHandlerForResolver = () => {
        if (timeoutRefForResolver.current) {
            clearTimeout(timeoutRefForResolver.current); // Clear the existing timeout if it exists
        }
        setShowBioForResolver(true)
    }

    const onMouseOutHandlerForResolver = () => {
        timeoutRefForResolver.current = setTimeout(() => {
            setShowBioForResolver(false)
        }, 0)
    }

    const onMouseOverHandlerForCloser = () => {
        if (timeoutRefForCloser.current) {
            clearTimeout(timeoutRefForCloser.current); // Clear the existing timeout if it exists
        }
        setShowBioForCloser(true)
    }

    const onMouseOutHandlerForCloser = () => {
        timeoutRefForCloser.current = setTimeout(() => {
            setShowBioForCloser(false)
        }, 0)
    }


    return (
        <div className='w-full  bg-slate-50  p-8 pl-16 flex flex-row'>
            {/* Alert */}
            {(error) &&
                <Alert
                    className='ml-[35%]' severity="error">
                    Something Went Wrong, Please Try Again!!!
                </Alert>
            }
            {ticket &&
                <div className='w-full flex flex-col space-y-20'>
                    {ticketDetailLoading && <div className='w-[90%] flex flex-row flex-wrap'>
                        <Skeleton variant='rectangular' style={{ width: '12rem', height: '12rem', marginRight: '2rem', marginBottom: '2rem' }}></Skeleton>
                        <Skeleton variant='rectangular' style={{ width: '12rem', height: '12rem', marginRight: '2rem', marginBottom: '2rem' }}></Skeleton>
                        <Skeleton variant='rectangular' style={{ width: '12rem', height: '12rem', marginRight: '2rem', marginBottom: '2rem' }}></Skeleton>
                    </div>}
                    {!ticketDetailLoading
                        && ticket?.pictures?.length > 0
                        && <div className=' w-[90%] flex flex-row flex-wrap mb-12'>
                            {ticket?.pictures?.map((image, index) => (
                                <div className='w-[12rem] h-[12rem] rounded-md mr-4 mb-4 cursor-pointer'>
                                    <img
                                        src={image}
                                        alt='pic'
                                        key={index}
                                        onClick={() => openImageViewer(index)}
                                        className=' object-contain w-full h-full rounded-md'
                                    />
                                </div>
                            ))
                            }
                            {isViewerOpen && (
                                <ImageViewer
                                    src={ticket?.pictures}
                                    currentIndex={currentImage}
                                    disableScroll={false}
                                    closeOnClickOutside={true}
                                    onClose={closeImageViewer}
                                />
                            )}
                        </div>}
                    <div className='w-[60%]'>
                        {< div className='w-full flex flex-col'>
                            {ticketDetailLoading ?
                                <Skeleton variant='text' style={{ width: '30%', height: '3rem' }}></Skeleton>
                                :
                                <p className='font-semibold text-ms mb-2'>Description</p>
                            }
                            {ticketDetailLoading ?
                                <Skeleton variant='rounded' style={{ width: '90%', height: '20vh', marginBottom: '12px' }}></Skeleton>
                                : <p className='font-normal text-md w-[90%] p-2 border-2 border-gray-300 rounded-lg mb-12 h-[20vh] overflow-auto'>{ticket?.description}</p>
                            }
                            {ticketDetailLoading ?
                                <Skeleton variant='rounded' style={{ width: '90%', height: '14vh', marginBottom: '12px' }}></Skeleton>
                                :
                                <>
                                    <p className='font-semibold text-md mb-4'>Status</p>
                                    <div className='w-full flex flex-row mb-4 text-gray-500'>
                                        <div className='w-[25%] flex flex-row'>
                                            {(ticket.createdAt) && <div className='w-full flex flex-row justify-center items-center'>
                                                <Stopwatch />
                                                {formatTime(ticket.createdAt)}
                                            </div>}
                                        </div>
                                        <div className='w-[25%] flex flex-row '>
                                            {(ticket.initiatedAt) && <div className='w-full flex flex-row justify-center items-center'>
                                                <Stopwatch />
                                                {formatTime(ticket.initiatedAt)}
                                            </div>}
                                        </div>
                                        <div className='w-[25%] flex flex-row '>
                                            {(ticket.resolvedAt) && <div className='w-full flex flex-row justify-center items-center'>
                                                <Stopwatch />
                                                {formatTime(ticket.resolvedAt)}
                                            </div>}
                                        </div>
                                        <div className='w-[25%] flex flex-row '>
                                            {(ticket.closedAt) && <div className='w-full flex flex-row justify-center items-center'>
                                                <Stopwatch />
                                                {formatTime(ticket.closedAt)}
                                            </div>}
                                        </div>
                                    </div>
                                    <div className='w-full flex flex-row items-center'>
                                        <div className='w-[25%] px-2  flex justify-center relative'>
                                            {ticket.createdBy &&
                                                <p
                                                    ref={timeoutRefForCreator}
                                                    onMouseOver={onMouseOverHandlerForCreator}
                                                    onMouseOut={onMouseOutHandlerForCreator}
                                                    className='rounded-md bg-[#5096FF] text-white px-2 py-2 cursor-pointer'>
                                                    {ticket?.createdBy}
                                                </p>
                                            }
                                            {showBioForCreator &&
                                                <div
                                                    onMouseOver={onMouseOverHandlerForCreator}
                                                    onMouseOut={onMouseOutHandlerForCreator}
                                                    className='w-[27vw] h-[26vh] absolute top-12 left-0 z-20 bg-transparent'>
                                                    <EmployeeInfo employeeNo={ticket?.createdBy} />
                                                </div>
                                            }
                                        </div>
                                        <div className='w-[25%] px-2  flex justify-center relative'>
                                            {ticket.initiatedBy &&
                                                <p
                                                    ref={timeoutRefForInitiator}
                                                    onMouseOver={onMouseOverHandlerForInitiator}
                                                    onMouseOut={onMouseOutHandlerForInitiator}
                                                    className='rounded-md bg-[#5096FF] text-white px-2 py-2 cursor-pointer'>{ticket?.initiatedBy}
                                                </p>}
                                            {showBioForInitiator &&
                                                <div
                                                    onMouseOver={onMouseOverHandlerForInitiator}
                                                    onMouseOut={onMouseOutHandlerForInitiator}
                                                    className='w-[27vw] h-[26vh] absolute top-12 left-0 z-20 bg-transparent'>
                                                    <EmployeeInfo employeeNo={ticket?.initiatedBy} />
                                                </div>
                                            }
                                        </div>
                                        <div className='w-[25%] px-2  flex justify-center relative'>
                                            {ticket.resolvedBy &&
                                                <p
                                                    ref={timeoutRefForResolver}
                                                    onMouseOver={onMouseOverHandlerForResolver}
                                                    onMouseOut={onMouseOutHandlerForResolver}
                                                    className='rounded-md bg-[#5096FF] text-white px-2 py-2 cursor-pointer'>{ticket?.resolvedBy}
                                                </p>}
                                            {showBioForResolver &&
                                                <div
                                                    onMouseOver={onMouseOverHandlerForResolver}
                                                    onMouseOut={onMouseOutHandlerForResolver}
                                                    className='w-[27vw] h-[26vh] absolute top-12 left-0 z-20 bg-transparent'>
                                                    <EmployeeInfo employeeNo={ticket?.resolvedBy} />
                                                </div>
                                            }
                                        </div>
                                        <div className='w-[25%] px-2  flex justify-center relative'>
                                            {ticket.closedBy &&
                                                <p
                                                    ref={timeoutRefForCloser}
                                                    onMouseOver={onMouseOverHandlerForCloser}
                                                    onMouseOut={onMouseOutHandlerForCloser}
                                                    className='rounded-md bg-[#5096FF] text-white px-2 py-2 cursor-pointer'>{ticket?.closedBy}
                                                </p>}
                                            {showBioForCloser &&
                                                <div
                                                    onMouseOver={onMouseOverHandlerForCloser}
                                                    onMouseOut={onMouseOutHandlerForCloser}
                                                    className='w-[27vw] h-[26vh] absolute top-12 left-0 z-20 bg-transparent'>
                                                    <EmployeeInfo employeeNo={ticket?.closedBy} />
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className='w-full mb-12'>
                                        <Stepper steps={[{ title: 'OP' }, { title: 'UP' }, { title: 'RC' }, { title: 'CL' }]} activeStep={findActiveStep()} />
                                    </div>

                                </>
                            }
                            {ticketDetailLoading ?
                                <Skeleton variant='rounded' style={{ width: '90%', height: '10vh', marginBottom: '12px' }}></Skeleton>
                                :
                                <>
                                    <p className='font-semibold text-md mb-2'>Change Status</p>
                                    {/* for technician */}
                                    {(userInfo.role !== 'User') && <>
                                        {(ticket.status === 'CL' || ticket.status === 'RC') &&
                                            <select disabled={true} className='w-[50%] p-2 border-2 border-gray-300 rounded-lg mb-8 outline-none'>
                                                <option value="OP">{ticket.status}</option>
                                            </select>
                                        }
                                        {ticket.status === 'UP' &&
                                            <select value={currentStatus} onChange={selectionHandler} className='w-[50%] p-2 border-2 border-gray-300 rounded-lg mb-8 outline-none cursor-pointer'>
                                                <option key="UP" value="UP">{ticket.status}</option>
                                                <option key="RC" value="RC">RC</option>
                                            </select>
                                        }
                                        {ticket.status === 'OP' &&
                                            <select value={currentStatus} onChange={selectionHandler} className='w-[50%] p-2 border-2 border-gray-300 rounded-lg mb-8 outline-none cursor-pointer'>
                                                <option key="OP" value="OP">{ticket.status}</option>
                                                <option key="UP" value="UP">UP</option>
                                            </select>
                                        }
                                    </>}
                                    {/* for user */}
                                    {(userInfo.role === 'User') && <>
                                        {(ticket.status === 'OP' || ticket.status === 'UP' || ticket.status === 'CL') &&
                                            <select disabled={true} className='w-[50%] p-2 border-2 border-gray-300 rounded-lg mb-8 outline-none'>
                                                <option value="OP">{ticket.status}</option>
                                            </select>
                                        }
                                        {ticket.status === 'RC' &&
                                            <select value={currentStatus} onChange={selectionHandler} className='w-[50%] p-2 border-2 border-gray-300 rounded-lg mb-8 outline-none cursor-pointer'>
                                                <option key="RC" value="RC">{ticket.status}</option>
                                                <option key="CL" value="CL">CL</option>
                                            </select>
                                        }
                                    </>}
                                    {currentStatus && (currentStatus !== ticket.status) &&
                                        <div className='w-full'>
                                            <button
                                                onClick={saveFormHandler}
                                                disabled={updateLoading ? true : false}
                                                style={updateLoading ? { opacity: '0.5' } : { opacity: '1' }}
                                                type='submit'
                                                className="shadow-sm shadow-gray-800 py-2 px-8 font-semibold text-xxl text-slate-50 bg-[#5096FF] rounded-md ">
                                                {updateLoading ? <CircularProgress color="inherit" size={20} /> : <p>Confirm</p>}
                                            </button>
                                        </div>
                                    }
                                </>}
                            {updateSuccess &&
                                <Alert
                                    severity="success">
                                    Satus Updated Successfully.
                                </Alert>
                            }
                            {(updateError) &&
                                <Alert severity="error">
                                    Something Went Wrong, Please Try Again!!!
                                </Alert>
                            }
                        </div>}

                    </div>
                </div>
            }
        </div >
    )
})

export default TicketDetails
