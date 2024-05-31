//React
import React, { useEffect } from 'react'
import { memo } from 'react'

//redux
import { useSelector, useDispatch } from 'react-redux'

//actions
import { createTicket } from '../actions/ticketAction'


//css file and material ui
import './component.css'
import { LinearProgress } from '@mui/material'
import Alert from '@mui/material/Alert'
import axios from 'axios'





const TicketForm = memo(({ setNewTicket, socket }) => {


    //redux
    const dispatch = useDispatch()
    const { loading, error, success, ticketInfo } = useSelector((state) => state.ticket)
    const { userInfo } = useSelector(state => state.loadUser)



    //state
    const [roomNo, setRoomNo] = React.useState()
    const [title, setTitle] = React.useState('')
    const [department, setDepartment] = React.useState('none')
    const [description, setDescription] = React.useState('')
    const [alert, setAlert] = React.useState(false)
    const [alertMessage, setAlertMessage] = React.useState('')
    const divRef = React.useRef()
    const [picture, setPicture] = React.useState([])
    const [picturePreview, setPicturePreview] = React.useState([])
    const [hoveredIndex, setHoveredIndex] = React.useState(null)



    //handler
    const selectionHandlerForDepartment = (e) => {
        setDepartment(e.target.value)
    }

    const cancelHandler = () => {
        setTitle('')
        setRoomNo()
        setDepartment('none')
        setDescription('')
        setNewTicket(false)
        setPicture([])
        setPicturePreview([])
        dispatch({ type: 'CREATE_TICKET_RESET' })
    }

    const saveFormHandler = (e) => {
        e.preventDefault()
        if (title === '' || roomNo === '' || department === 'none' || description === '') {
            setAlert(true)
            setAlertMessage('Please fill all the fields')
            return
        }



        const roomValue = parseInt(roomNo)
        if (isNaN(roomValue) || roomValue < 0 || roomValue > 1000) {
            setAlert(true)
            setAlertMessage('Please enter valid room number')
            return
        }

        const ticketData = new FormData()
        ticketData.append('department', department);
        ticketData.append('description', description);
        ticketData.append('roomNo', roomNo);
        ticketData.append('title', title);
        ticketData.append('status', 'OP');
        ticketData.append('createdAt', new Date().toISOString());
        ticketData.append('createdBy', Number(userInfo.employeeNo));

        if (picture.length > 0) {
            picture.forEach((pic) => {
                ticketData.append('picture', pic);
            });
        }


        dispatch(createTicket(ticketData))
    }

    const pictureChangeHandler = (e) => {
        e.preventDefault()
        const filesArray = Array.from(e.target.files)

        filesArray.forEach((file) => {
            setPicture((prev) => [...prev, file])

            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setPicturePreview((prev) => [...prev, reader.result])
                }
            }
        })

    }

    const cancelPictureHandler = (index) => {
        setPicture((prev) => prev.filter((_, i) => i !== index))
        setPicturePreview((prev) => prev.filter((_, i) => i !== index))
    }


    //useEffect
    useEffect(() => {

        if (error || success) {
            setRoomNo('')
            setTitle('')
            setDepartment('none')
            setDescription('')
            setPicture([])
            setPicturePreview([])
            setTimeout(() => {
                dispatch({ type: 'CREATE_TICKET_RESET' })
            }, 1000)
        }

        if (success) {

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
                message: findTheMessage(ticketInfo.status, userInfo.name),
                time: new Date().toISOString(),
                room: ['User', ticketInfo.department],
                readBy: [],
                ticketId: ticketInfo.id,
                department: ticketInfo.department,
                title: ticketInfo.title,
                description: ticketInfo.description,
                roomNo: ticketInfo.roomNo,
                status: ticketInfo.status,
                createdBy: ticketInfo.createdBy,
                createdAt: ticketInfo.createdAt
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


    }, [error, success, dispatch, socket, ticketInfo, userInfo])

    //useEffect
    useEffect(() => {
        if (alert === true) {
            setTimeout(() => {
                setAlert(false)
            }, 2000)
        }
    }, [alert])


    return (
        <div className='w-[50vw]  z-40 bg-white  p-4 absolute rounded-xl border-2 border-white flex flex-col items-center overflow-hidden shadow-xl '>
            {/* close button */}
            <div className='w-full flex justify-end pb-2'>
                <button
                    onClick={() => setNewTicket(false)}
                    className=' py-[1px] px-[8px] text-3xl text-gray-800 rounded-full rotate-45 '>
                    <p className='relative left-[1px] bottom-[2px]'>+</p>
                </button>
            </div>
            {/* title */}
            <div className='w-full flex justify-center pb-2'>
                <p
                    style={{ height: '100%', backgroundColor: '#c2e7ff', opacity: '0.9' }}
                    className='w-[10vw] text-xl py-2 transition-all flex  justify-center'>
                    New Ticket
                </p>
            </div>
            {/* Alert */}
            {error &&
                <Alert
                    className='w-full ml-2' severity="error">
                    Please try again
                </Alert>

            }
            {alert &&
                <Alert
                    className='w-full ml-2' severity="error">
                    {alertMessage}
                </Alert>

            }
            {success &&
                <Alert
                    className='w-full ml-2' severity="success">
                    Ticket created successfully
                </Alert>
            }
            {/* line */}
            <div className='w-full flex justify-center pb-8 '>
                <div className='w-[90%] ml-6  h-0.5 bg-white mb-12 lg:mb-0'></div>
            </div>
            {/* form */}
            <div className='w-full h-[60vh] rounded-br-lg overflow-hidden'>
                <div ref={divRef} className='sidebar w-full  h-full flex flex-col overflow-y-scroll'>

                    <div className='w-full flex space-x-4 justify-start items-center pl-[5%] text-lg font-semibold mb-4'>
                        <span>Title : </span>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} className='w-[85%] p-2 rounded-md outline-none bg-slate-50 text-lg font-normal' type='text' autoFocus={true} />
                    </div>
                    <div className='w-full flex space-x-4 justify-start items-center pl-[5%] text-lg font-semibold mb-4'>
                        <span>Room No : </span>
                        <input value={roomNo} onChange={(e) => setRoomNo(e.target.value)} className='w-[4vw] p-2 text-lg font-normal bg-slate-50 outline-none' type='text' />
                    </div>

                    <div className='w-full flex justify-start items-center space-x-4  pl-[5%] text-lg font-semibold mb-4'>
                        <span>Department :</span>
                        <select
                            value={department}
                            onChange={selectionHandlerForDepartment}
                            className='text-black mr-2 w-[40%] p-2 rounded-md outline-none text-lg font-normal bg-slate-50'>
                            <option key='Select Department' value='none'>---Select Department---</option>
                            <option key='Electrical' value='Electrical'>Electrical</option>
                            <option key='Civil' value='Civil'>Civil</option>
                            <option key='House Keeping' value='House Keeping'>House Keeping</option>
                        </select>
                    </div>
                    <div className='w-full flex flex-col space-y-2 justify-start  pl-[5%] text-lg font-semibold mb-8'>
                        <span>Description : </span>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='w-[90%] p-2 rounded-md outline-none overflow-y-auto h-[20vh] text-lg font-normal bg-slate-50 ' type='text' autoFocus={true}></textarea>
                    </div>

                    <div className='w-full flex flex-col space-y-12  items-center p-0 mb-8 pl-[5%]'>
                        <div className='w-full flex flex-row space-x-8 flex-wrap '>
                            {picturePreview && picturePreview.map((pic, index) =>
                                <div
                                    onClick={() => { cancelPictureHandler(index) }}
                                    key={index}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    className='relative'>
                                    <img src={pic} className='w-36 h-36 object-contain mb-6' alt='pics' />
                                    <div

                                        className={`absolute overflow-hidden top-0 left-0 bg-transparent backdrop-blur-md w-36 h-36  justify-center items-center text-5xl text-white transition-all duration-300 cursor-pointer ease-in-out ${hoveredIndex === index ? 'flex' : 'hidden'
                                            }`}
                                    > &#215;</div>
                                </div>
                            )}

                        </div>
                        <label className='cursor-pointer'>
                            <p className='p-2 border-lg bg-[#5096FF] text-white rounded-lg'>Upload Pic</p>
                            <input type='file' accept='image/*' multiple={true} className='hidden' onChange={pictureChangeHandler} />
                        </label>
                    </div>

                    <div className='flex w-full justify-center space-x-4 items-center'>
                        <button
                            onClick={saveFormHandler}
                            disabled={loading ? true : false}
                            style={loading ? { opacity: '0.5' } : { opacity: '1' }}
                            type='submit'
                            className="hover:shadow-md  py-2 px-8  text-xxl text-gray-800 bg-[#c2e7ff] rounded-md ">
                            Save
                        </button>
                        <button
                            onClick={cancelHandler}
                            disabled={loading ? true : false}
                            style={loading ? { opacity: '0.5' } : { opacity: '1' }}
                            type='submit'
                            className="hover:shadow-md  py-2 px-8  text-xxl text-gray-800 bg-[#c2e7ff] rounded-md ">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            {loading &&
                <LinearProgress
                    sx={{
                        backgroundColor: 'rgb(248 250 252)',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: 'rgb(203 213 225)',
                            paddingTop: '0rem'

                        }
                    }}
                    className='w-[104%] h-6 rounded-md absolute z-50 -bottom-[1rem]' />
            }
        </div>
    )
})

export default TicketForm
