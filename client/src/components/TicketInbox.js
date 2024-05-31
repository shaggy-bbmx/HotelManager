import React, { useEffect, useState, useRef, memo } from 'react'
import Ticket from '../components/Ticket'
import { useSelector, useDispatch } from 'react-redux'
import { Alert } from '@mui/material'
import { getAllTickets, totalTickets } from '../actions/ticketAction'
import { ThreeDots } from 'react-loader-spinner'
import DownArrow from './microComponents/DownArrow'
import UpArrow from './microComponents/UpArrow'
import BothArrow from './microComponents/BothArrow'


const TicketInbox = memo(({ filters }) => {


    const {
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
    } = filters

    const oldestDate = new Date(0).toISOString()
    const now = new Date()
    let nextYear = now.getFullYear() + 1
    const newestDate = new Date(Date.UTC(nextYear, 0, 1, 0, 0, 0, 0)).toISOString()


    //redux
    const dispatch = useDispatch()
    const { loading, error, tickets, success } = useSelector(state => state.getAllTickets)


    //useStates
    const divRef = useRef()
    const [isFilterApplied, setIsFilterApplied] = useState(false)
    const [titleSort, setTitleSort] = useState(0)
    const [departmentSort, setDepartmentSort] = useState(0)
    const [statusSort, setStatusSort] = useState(0)
    const [createdBySort, setCreatedBySort] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [allTickets, setAllTickets] = useState([])
    const [currentPage, setCurrentPage] = useState(1)



    // useEffect to check if any filters are applied
    useEffect(() => {
        if (status.length > 0 || department.length > 0 || date[0] !== oldestDate || date[1] !== newestDate ||
            createdBy !== 0 || initiateDate[0] !== oldestDate || initiateDate[1] !== newestDate || initiatedBy !== 0 || resolveDate[0] !== oldestDate || resolveDate[1] !== newestDate || resolvedBy !== 0 || closedDate[0] !== oldestDate || closedDate[1] !== newestDate || closedBy !== 0
        ) {
            setIsFilterApplied(true)
            return
        }

    }, [status, department, date, createdBy, initiateDate, initiatedBy, resolveDate, resolvedBy, closedDate, closedBy, newestDate, oldestDate])

    //useEffect to fetch the count of all tickets when the filters change
    useEffect(() => {
        const fetchTickets = async () => {
            setAllTickets([])
            setCurrentPage(1)
            dispatch({ type: 'GET_TICKETS_RESET' })
            dispatch({ type: 'GET_TICKETS_REQUEST' })
            totalTickets(status, department, date, createdBy, initiateDate, initiatedBy, resolveDate, resolvedBy, closedDate, closedBy)
                .then((res) => {
                    setTotalPages(res)
                    dispatch(getAllTickets(status, department, date, createdBy, initiateDate, initiatedBy, resolveDate, resolvedBy, closedDate, closedBy, 1))
                    setFilterBoxLoading(false)
                    setStatusSort(0)
                    setCreatedBySort(0)
                    setDepartmentSort(0)
                    setTitleSort(0)
                })

        }

        fetchTickets()

    }, [status, department, date, createdBy, initiateDate, initiatedBy, resolveDate, resolvedBy, closedDate, closedBy,dispatch])


    //useEffect to scroll to bottom fetch more tickets by incrementing the current page
    useEffect(() => {

        const scrollHandler = () => {
            if (divRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = divRef.current
                if (scrollTop + clientHeight >= scrollHeight - 2 && loading !== true && currentPage <= totalPages) {
                    setCurrentPage(prev => prev + 1)
                }
            }
        }

        const currentDiv = divRef.current;

        if (currentDiv) {
            currentDiv.addEventListener('scroll', scrollHandler);
        }

        return () => {
            if (currentDiv) {
                currentDiv.removeEventListener('scroll', scrollHandler);
            }
        }


    }, [totalPages, loading])


    //useEffect when current page changes fetch more tickets
    useEffect(() => {
        if (currentPage > 1) {
            setStatusSort(0)
            setCreatedBySort(0)
            setDepartmentSort(0)
            setTitleSort(0)
            dispatch(getAllTickets(status, department, date, createdBy, initiateDate, initiatedBy, resolveDate, resolvedBy, closedDate, closedBy, currentPage))
        }

    }, [dispatch, currentPage])


    //useEffect when new tickets are created add it to the local state
    useEffect(() => {
        if (success) {
            setAllTickets((prev) => {
                const filteredTicketsId = new Set(prev.map(ticket => ticket.id))
                const filteredTickets = tickets.filter(ticket => !filteredTicketsId.has(ticket.id))
                return [...prev, ...filteredTickets]
            })
            dispatch({ type: 'GET_TICKETS_RESET' })
        }
    }, [success])


    useEffect(() => {
        if (titleSort === 0 && departmentSort === 0 && statusSort === 0 && createdBySort === 0) {
            setAllTickets(prev => [...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        }
    }, [departmentSort, titleSort, statusSort, createdBySort])

    useEffect(() => {
        if (departmentSort === 1) {
            setAllTickets(prev => [...prev].sort((a, b) => a.department.localeCompare(b.department)))
        }
        if (departmentSort === 2) {
            setAllTickets(prev => [...prev].sort((a, b) => b.department.localeCompare(a.department)))
        }
    }, [departmentSort])

    useEffect(() => {
        if (statusSort === 1) {
            setAllTickets(prev => [...prev].sort((a, b) => a.status.localeCompare(b.status)))
        }
        if (statusSort === 2) {
            setAllTickets(prev => [...prev].sort((a, b) => b.status.localeCompare(a.status)))
        }
    }, [statusSort])

    useEffect(() => {
        if (titleSort === 1) {
            setAllTickets(prev => [...prev].sort((a, b) => a.title.localeCompare(b.title)))
        }
        if (titleSort === 2) {
            setAllTickets(prev => [...prev].sort((a, b) => b.title.localeCompare(a.title)))
        }
    }, [titleSort])

    useEffect(() => {
        if (createdBySort === 1) {
            setAllTickets(prev => [...prev].sort((a, b) => a.createdBy - b.createdBy))
        }
        if (createdBySort === 2) {
            setAllTickets(prev => [...prev].sort((a, b) => b.createdBy - a.createdBy))
        }
    }, [createdBySort])

    useEffect(() => {
        if (socket) {
            socket.on('getNewTicket', (data) => {
                const ticketData = {
                    id: data.ticketId,
                    department: data.department,
                    title: data.title,
                    description: data.description,
                    roomNo: data.roomNo,
                    status: data.status,
                    createdBy: data.createdBy,
                    createdAt: data.createdAt,
                    initiatedBy: null,
                    initiatedAt: null,
                    resolvedBy: null,
                    resolvedAt: null,
                    closedBy: null,
                    closedAt: null
                }

                if (isFilterApplied) return

                if (data.status === 'OP') {
                    setAllTickets(prev => {

                        let result = []
                        //check if new ticket already exist or add it into the list
                        const filteredId = prev.map(ticket => ticket.id)
                        if (filteredId.includes(ticketData.id)) result = prev
                        else result = [ticketData, ...prev]

                        //sort as per existing sort
                        if (departmentSort === 1) {
                            return result.sort((a, b) => a.department.localeCompare(b.department));
                        }
                        if (departmentSort === 2) {
                            return result.sort((a, b) => b.department.localeCompare(a.department));
                        }
                        if (titleSort === 1) {
                            return result.sort((a, b) => a.title.localeCompare(b.title));
                        }
                        if (titleSort === 2) {
                            return result.sort((a, b) => b.title.localeCompare(a.title));
                        }
                        if (statusSort === 1) {
                            return result.sort((a, b) => a.status.localeCompare(b.status));
                        }
                        if (statusSort === 2) {
                            return result.sort((a, b) => b.status.localeCompare(a.status));
                        }
                        if (createdBySort === 1) {
                            return result.sort((a, b) => a.createdBy - b.createdBy);
                        }
                        if (createdBySort === 2) {
                            return result.sort((a, b) => b.createdBy - a.createdBy);
                        }

                        return result;

                    })
                } else {
                    setAllTickets((prev) => {

                        const result = prev.map(ticket => {
                            if (ticket.id === ticketData.id) {
                                return { ...ticket, ...ticketData }
                            }
                            return ticket
                        });

                        //sort as per existing sort
                        if (departmentSort === 1) {
                            return result.sort((a, b) => a.department.localeCompare(b.department));
                        }
                        if (departmentSort === 2) {
                            return result.sort((a, b) => b.department.localeCompare(a.department));
                        }
                        if (titleSort === 1) {
                            return result.sort((a, b) => a.title.localeCompare(b.title));
                        }
                        if (titleSort === 2) {
                            return result.sort((a, b) => b.title.localeCompare(a.title));
                        }
                        if (statusSort === 1) {
                            return result.sort((a, b) => a.status.localeCompare(b.status));
                        }
                        if (statusSort === 2) {
                            return result.sort((a, b) => b.status.localeCompare(a.status));
                        }
                        if (createdBySort === 1) {
                            return result.sort((a, b) => a.createdBy - b.createdBy);
                        }
                        if (createdBySort === 2) {
                            return result.sort((a, b) => b.createdBy - a.createdBy);
                        }

                        return result;
                    })
                }
            })
        }
    }, [socket, titleSort, departmentSort, statusSort, createdBySort, isFilterApplied])


    //#handlers

    const departmentSortHandler = () => {
        setTitleSort(0)
        setCreatedBySort(0)
        setStatusSort(0)
        setDepartmentSort(prev => (prev === 2 ? 0 : prev + 1))
    }

    const titleSortHandler = () => {
        setDepartmentSort(0)
        setCreatedBySort(0)
        setStatusSort(0)
        setTitleSort(prev => (prev === 2 ? 0 : prev + 1))
    }

    const statusSortHandler = () => {
        setDepartmentSort(0)
        setCreatedBySort(0)
        setTitleSort(0)
        setStatusSort(prev => (prev === 2 ? 0 : prev + 1))
    }

    const createdBySortHandler = () => {
        setDepartmentSort(0)
        setTitleSort(0)
        setStatusSort(0)
        setCreatedBySort(prev => (prev === 2 ? 0 : prev + 1))
    }

    return (
        <div className={`w-full h-[77vh] overflow-hidden rounded-3xl   flex flex-col bg-white`}>
            <div className='w-[95%] flex flex-row p-2 pt-6  rounded-tl-3xl rounded-tr-3xl '>
                <div className='flex justify-center w-[15%]'><h1 className='text-md font-semibold text-[#0d0c0c]'>ID</h1></div>
                <div onClick={departmentSortHandler} className='flex flex-row justify-center w-[15%] cursor-pointer'>
                    {departmentSort === 0 && <BothArrow />}
                    {departmentSort === 1 && <DownArrow />}
                    {departmentSort === 2 && <UpArrow />}
                    <h1 className='text-md font-semibold text-[#0d0c0c]'>Department</h1>
                </div>

                <div onClick={titleSortHandler} className='flex justify-center w-[40%] cursor-pointer'>
                    {titleSort === 0 && <BothArrow />}
                    {titleSort === 1 && <DownArrow />}
                    {titleSort === 2 && <UpArrow />}
                    <h1 className='text-md font-semibold text-[#0d0c0c]'>Title</h1>
                </div>
                <div onClick={statusSortHandler} className='flex justify-center w-[10%] cursor-pointer'>
                    {statusSort === 0 && <BothArrow />}
                    {statusSort === 1 && <DownArrow />}
                    {statusSort === 2 && <UpArrow />}
                    <h1 className='text-md font-semibold text-[#0d0c0c]'>Status</h1>
                </div>
                <div onClick={createdBySortHandler} className='flex justify-center w-[12%] cursor-pointer'>
                    {createdBySort === 0 && <BothArrow />}
                    {createdBySort === 1 && <DownArrow />}
                    {createdBySort === 2 && <UpArrow />}
                    <h1 className='text-md font-semibold text-[#0d0c0c]'>Created By</h1>
                </div>
                <div className='flex justify-center w-[8%]'><h1 className='text-md font-semibold text-[#0d0c0c]'>Time</h1></div>
            </div>
            <div className='w-full flex justify-center'>
                <div className='w-[100%] h-0.5 bg-slate-100'></div>
            </div>
            <div ref={divRef} className='w-full h-[77vh] flex flex-col justify-start overflow-auto inbox-scroll-container'>
                {(allTickets?.length === 0 && !loading) ?
                    <div className='w-full flex h-[70vh] justify-center p-2 bg-white text-slate-500 italic'>...You have no tickets to show</div> :
                    <>
                        {error && <Alert className='w-full flex justify-center' severity="error">Something Went Wrong, Please Try Again!!!</Alert>}
                        {allTickets && allTickets.map(ticket =>
                            <Ticket
                                ticket={ticket}
                                key={ticket.id}
                                socket={socket}
                                notificationTicketId={notificationTicketId}
                                notificationViewer={notificationViewer} />)}
                        {loading && <div className='w-full flex justify-center p-2 bg-white'>
                            <ThreeDots visible={true} height="60" width="60" color="#ffa078" radius="9" ariaLabel="three-dots-loading" />
                        </div>}
                    </>
                }
            </div>
        </div>
    )
})

export default TicketInbox 
