import React from 'react'
import { useEffect } from 'react'
import SuggestionsForCreator from './SuggestionsForCreator.js'
import SuggestionsForInitiator from './SuggestionsForInitiator.js'
import SuggestionsForResolver from './SuggestionsForResolver.js'
import SuggestionsForCloser from './SuggestionsForCloser.js'

//redux
import { useSelector } from 'react-redux'


//css
import './component.css'
import { ThreeDots } from 'react-loader-spinner'



const FilterBox = ({ filters }) => {

    //constants
    const {
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
    } = filters

    const oldestDate = new Date(0).toISOString()
    const now = new Date()
    let nextYear = now.getFullYear() + 1
    const newestDate = new Date(Date.UTC(nextYear, 0, 1, 0, 0, 0, 0)).toISOString()


    //redux
    const { userInfo } = useSelector(state => state.loadUser)

    //#useState
    const [alert, setAlert] = React.useState(0)

    const [createdByEmployeeNo, setCreatedByEmployeeNo] = React.useState()
    const [showSuggestionsForCreator, setShowSuggestionsForCreator] = React.useState(false)



    const [initiatedByEmployeeNo, setInitiatedByEmployeeNo] = React.useState()
    const [showSuggestionsForInitiator, setShowSuggestionsForInitiator] = React.useState(false)


    const [resolvedByEmployeeNo, setResolvedByEmployeeNo] = React.useState()
    const [showSuggestionsForResolver, setShowSuggestionsForResolver] = React.useState(false)

    const [closedByEmployeeNo, setClosedByEmployeeNo] = React.useState()
    const [showSuggestionsForCloser, setShowSuggestionsForCloser] = React.useState(false)


    //useEffect
    useEffect(() => {
        if (alert > 0) {
            setTimeout(() => {
                setAlert(0)
            }, 2000)
        }
    }, [alert])

    useEffect(() => {
        if ((createdBy === 0) && (createdByEmployeeNo) && createdByEmployeeNo !== '') {
            setShowSuggestionsForCreator(true)
        } else {
            setShowSuggestionsForCreator(false)
        }

    }, [createdBy, createdByEmployeeNo])

    useEffect(() => {
        if ((initiatedBy === 0) && (initiatedByEmployeeNo) && initiatedByEmployeeNo !== '') {
            setShowSuggestionsForInitiator(true)
        } else {
            setShowSuggestionsForInitiator(false)
        }

    }, [initiatedBy, initiatedByEmployeeNo])

    useEffect(() => {
        if ((resolvedBy === 0) && (resolvedByEmployeeNo) && resolvedByEmployeeNo !== '') {
            setShowSuggestionsForResolver(true)
        } else {
            setShowSuggestionsForResolver(false)
        }

    }, [resolvedBy, resolvedByEmployeeNo])

    useEffect(() => {
        if ((closedBy === 0) && (closedByEmployeeNo) && closedByEmployeeNo !== '') {
            setShowSuggestionsForCloser(true)
        } else {
            setShowSuggestionsForCloser(false)
        }

    }, [closedBy, closedByEmployeeNo])


    //handler
    const handleCheckBoxChangeForStatus = (e) => {
        setFilterBoxLoading(true)
        setStatus((prev) => {
            if (prev.includes(e.target.value)) {
                return (prev.filter(option => option !== e.target.value));
            } else {
                return ([...prev, e.target.value]);
            }
        })
    }

    const handleCheckBoxChangeForDepartment = (e) => {
        setFilterBoxLoading(true)
        setDepartment((prev) => {
            if (prev.includes(e.target.value)) {
                return (prev.filter(option => option !== e.target.value));
            } else {
                return ([...prev, e.target.value]);
            }
        })
    }

    const handleCheckBoxChangeForCreator = (e, employeeNo) => {

        e.preventDefault()
        setShowSuggestionsForCreator(false)

        if (isNaN(employeeNo)) {
            setAlert(1)
            setCreatedByEmployeeNo('')
            return
        }

        setFilterBoxLoading(true)
        setCreatedBy(Number(employeeNo))
        setCreatedByEmployeeNo('')
    }

    const handleCheckBoxChangeForInitiator = (e, employeeNo) => {

        e.preventDefault()
        setShowSuggestionsForInitiator(false)

        if (isNaN(employeeNo)) {
            setAlert(2)
            setInitiatedByEmployeeNo('')
            return
        }

        setFilterBoxLoading(true)
        setInitiatedBy(Number(employeeNo))
        setInitiatedByEmployeeNo('')
    }

    const handleCheckBoxChangeForResolver = (e, employeeNo) => {
        e.preventDefault()
        setShowSuggestionsForResolver(false)

        if (isNaN(employeeNo)) {
            setAlert(3)
            setResolvedByEmployeeNo('')
            return
        }
        setFilterBoxLoading(true)
        setResolvedBy(Number(employeeNo))
        setResolvedByEmployeeNo('')
    }

    const handleCheckBoxChangeForCloser = (e, employeeNo) => {

        e.preventDefault()
        setShowSuggestionsForCloser(false)

        if (isNaN(employeeNo)) {
            setAlert(4)
            setClosedByEmployeeNo('')
            return
        }
        setFilterBoxLoading(true)
        setClosedBy(Number(employeeNo))
        setClosedByEmployeeNo('')
    }

    const createDateHandler = (e) => {
        e.preventDefault()
        setFilterBoxLoading(true)

        if (e.target.id === 'fromDate1') {
            setDate((prev) => {
                return ([e.target.value, prev[1]])
            })
        } else if (e.target.id === 'toDate1') {
            setDate((prev) => {
                return ([prev[0], e.target.value])
            })
        }

    }

    const initiateDateHandler = (e) => {
        e.preventDefault()
        setFilterBoxLoading(true)

        if (e.target.id === 'fromDate2') {
            setInitiateDate((prev) => {
                return ([e.target.value, prev[1]])

            })
        } else if (e.target.id === 'toDate2') {
            setInitiateDate((prev) => {
                return ([prev[0], e.target.value])
            })
        }

    }

    const resolvedDateHandler = (e) => {
        e.preventDefault()
        setFilterBoxLoading(true)
        if (e.target.id === 'fromDate3') {
            setResolveDate((prev) => {
                return ([e.target.value, prev[1]])
            })
        } else if (e.target.id === 'toDate3') {
            setResolveDate((prev) => {
                return ([prev[0], e.target.value])
            })
        }

    }

    const closedDateHandler = (e) => {
        e.preventDefault()
        setFilterBoxLoading(true)
        if (e.target.id === 'fromDate4') {
            setClosedDate((prev) => {
                return ([e.target.value, prev[1]])
            })
        } else if (e.target.id === 'toDate4') {
            setClosedDate((prev) => {
                return ([prev[0], e.target.value])
            })
        }

    }

    const resetForCreatedByHandler = () => {
        setFilterBoxLoading(true)
        setCreatedBy(0)
        setCreatedByEmployeeNo('')
    }

    const resetForCreatedAtHandler = () => {
        setFilterBoxLoading(true)
        setDate([oldestDate, newestDate])
    }

    const resetForInitiatedByHandler = () => {
        setFilterBoxLoading(true)
        setInitiatedBy(0)
        setInitiatedByEmployeeNo('')
    }

    const resetForInitiatedAtHandler = () => {
        setFilterBoxLoading(true)
        setInitiateDate([oldestDate, newestDate])
    }

    const resetForResolvedByHandler = () => {
        setFilterBoxLoading(true)
        setResolvedBy(0)
        setResolvedByEmployeeNo('')
    }

    const resetForResolvedAtHandler = () => {
        setFilterBoxLoading(true)
        setResolveDate([oldestDate, newestDate])
    }

    const resetForClosedByHandler = () => {
        setFilterBoxLoading(true)
        setClosedBy(0)
        setClosedByEmployeeNo('')
    }

    const resetForClosedAtHandler = () => {
        setFilterBoxLoading(true)
        setClosedDate([oldestDate, newestDate])

    }




    return (
        <>
            {filterBoxLoading ?
                <div className='w-full h-full flex justify-center items-center'>
                    <ThreeDots
                        visible={true}
                        height="80"
                        width="80"
                        color="#ffa078"
                        radius="9"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass="" />
                </div>
                :
                <div className='w-full h-full flex flex-col relative'>
                    {/* heading */}
                    <div className='w-full flex justify-center pb-2'>
                        <p className='font-semibold text-xl'>Filters</p>
                    </div>
                    {/* Reset Filters */}
                    <div className='w-full flex flex-row flex-wrap pb-4 space-x-1 pl-[5%]'>
                        {(createdBy !== 0) && <span className='text-sm px-2 rounded-full text-white bg-[#ffa078] cursor-pointer mb-1' onClick={resetForCreatedByHandler}>creator &#215;</span>}
                        {(date[0] !== oldestDate || date[1] !== newestDate) && <span className='text-sm px-2 rounded-full text-white bg-[#ffa078] cursor-pointer mb-1' onClick={resetForCreatedAtHandler}>created &#215;</span>}
                        {(initiatedBy != 0) && <span className='text-sm px-2 rounded-full text-white bg-[#ffa078] cursor-pointer mb-1' onClick={resetForInitiatedByHandler}>initiator &#215;</span>}
                        {(initiateDate[0] !== oldestDate || initiateDate[1] !== newestDate) && <span className='text-sm px-2 rounded-full text-white bg-[#ffa078] cursor-pointer mb-1' onClick={resetForInitiatedAtHandler}>initiated &#215;</span>}
                        {(resolvedBy !== 0) && <span className='text-sm px-2 rounded-full text-white bg-[#ffa078] cursor-pointer mb-1' onClick={resetForResolvedByHandler}>resolver &#215;</span>}
                        {(resolveDate[0] !== oldestDate || resolveDate[1] !== newestDate) && <span className='text-sm px-2 rounded-full text-white bg-[#ffa078] cursor-pointer mb-1' onClick={resetForResolvedAtHandler}>resolved &#215;</span>}
                        {(closedBy !== 0) && <span className='text-sm px-2 rounded-full text-white bg-[#ffa078] cursor-pointer mb-1' onClick={resetForClosedByHandler}>closer  &#215;</span>}
                        {(closedDate[0] !== oldestDate || closedDate[1] !== newestDate) && <span className='text-sm px-2 rounded-full text-white bg-[#ffa078] cursor-pointer mb-1' onClick={resetForClosedAtHandler}>closed &#215;</span>}
                    </div>
                    {/* line */}
                    <div className='w-full flex justify-center pb-4 '>
                        <div className='w-[90%]   h-0.5 dark:h-[1px]  bg-slate-100 mb-12 lg:mb-0'></div>
                    </div>
                    {/* suggestions */}
                    {(showSuggestionsForCreator) &&
                        <div
                            onClick={() => setShowSuggestionsForCreator(false)}
                            className='absolute w-[45vw]  top-8 left-32 rounded-md bg-transparent backdrop-blur-xl  border-2 border-gray-200 shadow-xl z-40'>
                            <SuggestionsForCreator
                                props={{
                                    createdByEmployeeNo,
                                    handleCheckBoxChangeForCreator
                                }}
                            />
                        </div>
                    }
                    {/* suggestions */}
                    {(showSuggestionsForInitiator) &&
                        <div
                            onClick={() => setShowSuggestionsForInitiator(false)}
                            className='absolute w-[45vw]  top-8 left-32 rounded-md bg-transparent backdrop-blur-xl  border-2 border-gray-200 shadow-xl z-40'>
                            <SuggestionsForInitiator
                                props={{
                                    initiatedByEmployeeNo,
                                    handleCheckBoxChangeForInitiator
                                }}
                            />
                        </div>
                    }
                    {/* suggestions */}
                    {(showSuggestionsForResolver) &&
                        <div
                            onClick={() => setShowSuggestionsForResolver(false)}
                            className='absolute w-[45vw]  top-8 left-32 rounded-md bg-transparent backdrop-blur-xl  border-2 border-gray-200 shadow-xl z-40'>
                            <SuggestionsForResolver
                                props={{
                                    resolvedByEmployeeNo,
                                    handleCheckBoxChangeForResolver
                                }}
                            />
                        </div>
                    }
                    {/* suggestions */}
                    {(showSuggestionsForCloser) &&
                        <div
                            onClick={() => setShowSuggestionsForCloser(false)}
                            className='absolute w-[45vw]  top-8 left-32 rounded-md bg-transparent backdrop-blur-xl  border-2 border-gray-200 shadow-xl z-40'>
                            <SuggestionsForCloser
                                props={{
                                    closedByEmployeeNo,
                                    handleCheckBoxChangeForCloser
                                }}
                            />
                        </div>
                    }
                    {/* status */}
                    <div className='w-full h-full  overflow-y-auto filter-scroll-container pb-12 '>
                        <div className='w-full flex justify-start pl-[5%] text-lg font-semibold mb-2'>Status </div>
                        <div className='w-full flex justify-start pl-[5%] text-sm'>
                            <input className='text-black mr-2' type='checkbox' id='OP'
                                onChange={handleCheckBoxChangeForStatus} value='OP' checked={status.includes('OP')} />
                            <label htmlFor='OP'>OP
                                <span className='ml-2 text-sm'>(open)</span>
                            </label>
                        </div>
                        <div className='w-full flex justify-start pl-[5%] text-sm'>
                            <input className='text-black mr-2' type='checkbox' id='UP'
                                onChange={handleCheckBoxChangeForStatus} value='UP' checked={status.includes('UP')} />
                            <label htmlFor='UP'>UP
                                <span className='ml-2 text-sm'>(under progress)</span>
                            </label>
                        </div>
                        <div className='w-full flex justify-start pl-[5%] text-sm'>
                            <input className='text-black mr-2' type='checkbox' id='RC'
                                onChange={handleCheckBoxChangeForStatus} value='RC' checked={status.includes('RC')} />
                            <label htmlFor='RC'>RC
                                <span className='ml-2 text-sm'>(requested closing)</span>
                            </label>
                        </div>
                        <div className='w-full flex justify-start pl-[5%] text-sm mb-4'>
                            <input className='text-black mr-2' type='checkbox' id='CL'
                                onChange={handleCheckBoxChangeForStatus} value='CL' checked={status.includes('CL')} />
                            <label htmlFor='CL'>CL
                                <span className='ml-2 text-sm'>(closed)</span>
                            </label>
                        </div>
                        <div className='w-full flex justify-center pb-8 '>
                            <div className='w-[90%]   h-0.5 dark:h-[1px] dark:bg-gray-700 bg-slate-100 mb-12 lg:mb-0'></div>
                        </div>
                        {/* department */}
                        {(userInfo?.role === 'User') && <>
                            <div className='w-full flex justify-start pl-[5%] text-lg font-semibold mb-2'>Department</div>
                            <div className='w-full flex justify-start pl-[5%] text-md'>
                                <input className='text-black mr-2' type='checkbox' id='Electrical' value='Electrical' onChange={handleCheckBoxChangeForDepartment} checked={department.includes('Electrical')} />
                                <label htmlFor='Electrical'>Electrical</label>
                            </div>
                            <div className='w-full flex justify-start pl-[5%] text-md'>
                                <input className='text-black mr-2' type='checkbox' id='Civil' value='Civil' onChange={handleCheckBoxChangeForDepartment} checked={department.includes('Civil')} />
                                <label htmlFor='Civil'>Civil</label>
                            </div>
                            <div className='w-full flex justify-start pl-[5%] text-md mb-4'>
                                <input className='text-black mr-2' type='checkbox' id='House Keeping' value='House Keeping' onChange={handleCheckBoxChangeForDepartment} checked={department.includes('House Keeping')} />
                                <label htmlFor='House Keeping'>House Keeping</label>
                            </div>
                            <div className='w-full flex justify-center pb-8 '>
                                <div className='w-[90%]   h-0.5 dark:h-[1px] dark:bg-gray-700 bg-slate-100 mb-12 lg:mb-0'></div>
                            </div>
                        </>}
                        {/* creator */}
                        <div className='w-full flex justify-between pl-[5%] text-lg font-semibold mb-2 pr-2'>
                            <p>Creator</p>

                        </div>
                        <div className='w-full flex  pl-[5%] text-md mb-4 items-center space-x-2'>
                            <input
                                disabled={createdBy ? true : false}
                                className={` p-2 rounded-md ${createdBy ? 'bg-slate-500  text-white' : 'bg-white text-black border-2 rounded-md border-gray-200'} w-[70%] outline-none`}
                                type='text'
                                value={createdBy ? createdBy : createdByEmployeeNo}
                                onChange={(e) => setCreatedByEmployeeNo(e.target.value)} placeholder='empoyeeNo' />
                        </div>
                        {(alert === 1) && <div className='w-full flex justify-start pl-[5%] text-sm text-red-500 mb-2'>Please enter a valid employee number</div>}
                        <div className='w-full flex justify-center pb-8 '>
                            <div className='w-[90%]  h-0.5 dark:h-[1px] dark:bg-gray-700 bg-slate-100 mb-12 lg:mb-0'></div>
                        </div>

                        {/* dates */}
                        <div className='w-full flex justify-between pl-[5%] text-lg font-semibold mb-2'>
                            <p>Created</p>
                        </div>
                        <div className='w-full flex justify-start pl-[5%] text-md items-center mb-4 '>
                            <p className='w-[4vw]'>From </p>
                            <input
                                className='text-black mr-2  outline-none p-1 rounded-md border-2 border-gray-200'
                                type='date'
                                id='fromDate1'
                                onChange={createDateHandler}
                                max={document.getElementById('toDate1')?.value}
                                value={(date[0] === oldestDate) ? '' : date[0]} />
                        </div>
                        <div className='w-full flex justify-start pl-[5%] text-md items-center mb-4'>
                            <p className='w-[4vw]'>To </p>
                            <input
                                className='text-black mr-2 outline-none p-1 rounded-md border-2 border-gray-200'
                                type='date'
                                id='toDate1'
                                onChange={createDateHandler}
                                min={document.getElementById('fromDate1')?.value}
                                value={(date[1] === newestDate) ? '' : date[1]} />
                        </div>
                        <div className='w-full flex justify-center pb-8 mb-12'>
                            <div className='w-[90%]   h-0.5 dark:h-[1px] dark:bg-gray-700 bg-slate-100 mb-12 lg:mb-0'></div>
                        </div>

                        {/* initiate */}
                        <div className='w-full flex justify-between pl-[5%] text-lg font-semibold mb-2 pr-2'>
                            <p>Initiator</p>
                            {(initiatedBy !== 0) && <span className='text-sm px-2 rounded-full text-white bg-[#ffa078] cursor-pointer' onClick={resetForInitiatedByHandler}>reset</span>}
                        </div>
                        <div className='w-full flex  pl-[5%] text-md mb-4 items-center space-x-2'>
                            <input
                                disabled={initiatedBy ? true : false}
                                className={` p-2 rounded-md ${initiatedBy ? 'bg-slate-500  text-white' : 'bg-white text-black border-2 rounded-md border-gray-200'} w-[70%] outline-none`}
                                type='text'
                                value={initiatedBy ? initiatedBy : initiatedByEmployeeNo}
                                onChange={(e) => setInitiatedByEmployeeNo(e.target.value)} placeholder='empoyeeNo' />
                        </div>
                        {(alert === 2) && <div className='w-full flex justify-start pl-[5%] text-sm text-red-500 mb-2'>Please enter a valid employee number</div>}
                        <div className='w-full flex justify-center pb-8 '>
                            <div className='w-[90%]  h-0.5 dark:h-[1px] dark:bg-gray-700 bg-slate-100 mb-12 lg:mb-0'></div>
                        </div>

                        {/* initiatedDate */}
                        <div className='w-full flex justify-between pl-[5%] text-lg font-semibold mb-2 pr-2'>
                            <p>Initiated</p>
                        </div>
                        <div className='w-full flex justify-start pl-[5%] text-md items-center mb-4'>
                            <p className='w-[4vw]'>From </p>
                            <input
                                className='text-black mr-2  outline-none p-1 rounded-md border-2 border-gray-200'
                                type='date'
                                id='fromDate2'
                                onChange={initiateDateHandler}
                                max={document.getElementById('toDate2')?.value}
                                value={(initiateDate[0] === oldestDate) ? '' : initiateDate[0]} />
                        </div>
                        <div className='w-full flex justify-start pl-[5%] text-md items-center mb-4'>
                            <p className='w-[4vw]'>To </p>
                            <input
                                className='text-black mr-2 outline-none p-1 rounded-md border-2 border-gray-200'
                                type='date'
                                id='toDate2'
                                onChange={initiateDateHandler}
                                min={document.getElementById('fromDate2')?.value}
                                value={(initiateDate[1] === newestDate) ? '' : initiateDate[1]} />
                        </div>
                        <div className='w-full flex justify-center pb-8 mb-12'>
                            <div className='w-[90%]   h-0.5 dark:h-[1px] dark:bg-gray-700 bg-slate-100 mb-12 lg:mb-0'></div>
                        </div>

                        {/* resolved */}
                        <div className='w-full flex justify-between pl-[5%] text-lg font-semibold mb-2 pr-2'>
                            <p>Resolver</p>
                        </div>
                        <div className='w-full flex  pl-[5%] text-md mb-4 items-center space-x-2'>
                            <input
                                disabled={resolvedBy ? true : false}
                                className={` p-2 rounded-md ${resolvedBy ? 'bg-slate-500  text-white' : 'bg-white text-black border-2 rounded-md border-gray-200'} w-[70%] outline-none`}
                                type='text'
                                value={resolvedBy ? resolvedBy : resolvedByEmployeeNo}
                                onChange={(e) => setResolvedByEmployeeNo(e.target.value)} placeholder='empoyeeNo' />
                        </div>
                        {(alert === 3) && <div className='w-full flex justify-start pl-[5%] text-sm text-red-500 mb-2'>Please enter a valid employee number</div>}
                        <div className='w-full flex justify-center pb-8 '>
                            <div className='w-[90%]   h-0.5 dark:h-[1px] dark:bg-gray-700 bg-slate-100 mb-12 lg:mb-0'></div>
                        </div>

                        {/* resolvedDate */}
                        <div className='w-full flex justify-between pl-[5%] text-lg font-semibold mb-2'>
                            <p>Resolved</p>
                        </div>
                        <div className='w-full flex justify-start pl-[5%] text-md items-center mb-4'>
                            <p className='w-[4vw]'>From </p>
                            <input
                                className='text-black mr-2  outline-none p-1 rounded-md border-2 border-gray-200'
                                type='date'
                                id='fromDate3'
                                onChange={resolvedDateHandler}
                                max={document.getElementById('toDate3')?.value}
                                value={(resolveDate[0] === oldestDate) ? '' : resolveDate[0]} />
                        </div>
                        <div className='w-full flex justify-start pl-[5%] text-md items-center mb-4'>
                            <p className='w-[4vw]'>To </p>
                            <input
                                className='text-black mr-2 outline-none p-1 rounded-md border-2 border-gray-200'
                                type='date'
                                id='toDate3'
                                onChange={resolvedDateHandler}
                                min={document.getElementById('fromDate3')?.value}
                                value={(resolveDate[1] === newestDate) ? '' : resolveDate[1]} />
                        </div>
                        <div className='w-full flex justify-center pb-8 mb-12'>
                            <div className='w-[90%]  h-0.5 dark:h-[1px] dark:bg-gray-700 bg-slate-100 mb-12 lg:mb-0'></div>
                        </div>
                        {/* closed */}
                        <div className='w-full flex justify-between pl-[5%] text-lg font-semibold mb-2'>
                            <p>Closer</p>
                        </div>
                        <div className='w-full flex  pl-[5%] text-md mb-4 items-center space-x-2'>
                            <input
                                disabled={closedBy ? true : false}
                                className={` p-2 rounded-md ${closedBy ? 'bg-slate-500  text-white' : 'bg-white text-black border-2 rounded-md border-gray-200'} w-[70%] outline-none`}
                                type='text'
                                value={closedBy ? closedBy : closedByEmployeeNo}
                                onChange={(e) => setClosedByEmployeeNo(e.target.value)} placeholder='empoyeeNo' />
                        </div>
                        {(alert === 4) && <div className='w-full flex justify-start pl-[5%] text-sm text-red-500 mb-2'>Please enter a valid employee number</div>}
                        <div className='w-full flex justify-center pb-8 '>
                            <div className='w-[90%]   h-0.5 dark:h-[1px] dark:bg-gray-700 bg-slate-100 mb-12 lg:mb-0'></div>
                        </div>

                        {/* closedDate */}
                        <div className='w-full flex justify-between pl-[5%] text-lg font-semibold mb-2'>
                            <p>Closed</p>
                        </div>
                        <div className='w-full flex justify-start pl-[5%] text-md items-center mb-4'>
                            <p className='w-[4vw]'>From </p>
                            <input
                                className='text-black mr-2  outline-none p-1 rounded-md border-2 border-gray-200 '
                                type='date'
                                id='fromDate4'
                                onChange={closedDateHandler}
                                max={document.getElementById('toDate4')?.value}
                                value={(closedDate[0] === oldestDate) ? '' : closedDate[0]} />
                        </div>
                        <div className='w-full flex justify-start pl-[5%] text-md items-center mb-4'>
                            <p className='w-[4vw]'>To </p>
                            <input
                                className='text-black mr-2 outline-none p-1 rounded-md border-2 border-gray-200'
                                type='date'
                                id='toDate4'
                                onChange={closedDateHandler}
                                min={document.getElementById('fromDate4')?.value}
                                value={(closedDate[1] === newestDate) ? '' : closedDate[1]} />
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default FilterBox
