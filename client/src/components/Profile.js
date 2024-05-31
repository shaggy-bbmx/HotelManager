import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'


//redux
import { useDispatch, useSelector } from 'react-redux'

//css and image
import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'
import { updateUser } from '../actions/userAction'



const Profile = ({ setShowProfile }) => {

    //redux
    const { loading, success, error } = useSelector(state => state.updateUser)
    const { userInfo } = useSelector(state => state.loadUser)


    //states
    const dispatch = useDispatch()
    const [changePassword, setChangePassword] = React.useState(false)
    const [newPassword, setNewPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [alert, setAlert] = React.useState(false)
    const [alertMessage, setAlertMessage] = React.useState('')



    //useEffect for handling error and success
    useEffect(() => {
        if (error === true || success === true) {
            setChangePassword(false)
            setConfirmPassword('')
            setNewPassword('')
            setTimeout(() => {
                dispatch({ type: 'UPDATE_USER_RESET' })
            }, 2000)
        }
    }, [success, error, dispatch])


    //handler
    const submitHandler = () => {
        if (newPassword !== confirmPassword) {
            setAlert(true)
            setAlertMessage('Password does not match !!!')
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
            }, 1000)
            return
        }

        dispatch(updateUser(userInfo?.id, newPassword))
    }

    return (
        <div className='w-[50vw]  bg-slate-50  p-4 absolute rounded-xl border-2 border-white flex flex-col  overflow-hidden shadow-xl'>
            {/* close button */}
            <div className='w-full flex justify-end pb-2'>
                <button
                    onClick={() => {
                        setNewPassword('')
                        setConfirmPassword('')
                        setChangePassword(false)
                        setShowProfile(false)
                    }}
                    className=' py-[1px] px-[8px] font-semibold text-3xl text-gray-500  rounded-full rotate-45 '>
                    <p className='relative left-[1px] bottom-[2px]'>+</p>
                </button>
            </div>
            {/* title */}
            <div className='w-full flex justify-center pb-2'>
                <p
                    style={{ height: '100%', backgroundColor: '#c2e7ff', opacity: '0.9' }}
                    className='w-[10vw] text-xl  text-gray-800 py-2 transition-all flex  justify-center'>
                    Profile
                </p>
            </div>
            {alert &&
                <Alert
                    className='w-full ml-2' severity="error">
                    {alertMessage}
                </Alert>

            }
            {error &&
                <Alert
                    className='w-full ml-2' severity="error">
                    Coiuld not update password !!!
                </Alert>
            }
            {success &&
                <Alert
                    className='w-full ml-2' severity="success">
                    Password updated successfully
                </Alert>
            }
            {/* line */}
            <div className='w-full flex justify-center pb-8 '>
                <div className='w-[90%] ml-6  h-0.5 bg-white mb-12 lg:mb-0'></div>
            </div>
            {/* form */}
            <div className='w-full h-[60vh] rounded-br-lg overflow-hidden'>
                <div className='sidebar w-full  h-full flex flex-col overflow-y-scroll'>
                    <div className='w-full flex justify-center pb-12'>
                        <img src={userInfo?.profilePic} className='w-48 h-48 object-contain rounded-lg' alt='profile' />
                    </div>
                    <div className='w-full flex space-x-4 justify-start  pl-[5%] text-xl  mb-4'>
                        <span className='w-[18%]'>Name  </span>
                        <span className='p-2 w-[40%] bg-white  rounded-md outline-none text-lg font-normal' type='text'>{userInfo?.name}</span>
                    </div>
                    <div className='w-full flex space-x-4 justify-start  pl-[5%] text-xl  mb-4'>
                        <span className='w-[18%]'>Email  </span>
                        <span className='p-2 w-[40%] bg-white  rounded-md outline-none text-lg font-normal' type='text'>{userInfo?.email}</span>
                    </div>
                    <div className='w-full flex space-x-4 justify-start  pl-[5%] text-xl  mb-4'>
                        <span className='w-[18%]'>Role  </span>
                        <span className='p-2 w-[40%] bg-white  rounded-md outline-none text-lg font-normal' type='text'>{userInfo?.role}</span>
                    </div>
                    {(userInfo?.role === 'technician') && <div className='w-full flex space-x-4 justify-start  pl-[5%] text-xl font-semibold mb-6'>
                        <span className='w-[18%]'>Department  </span>
                        <span className='p-2 w-[40%] bg-white  rounded-md outline-none text-lg font-normal' type='text'>{userInfo?.department}</span>
                    </div>}
                    {(!changePassword) && <div className='flex  justify-start space-x-4  ml-10'>
                        <button
                            onClick={() => setChangePassword(true)}
                            // disabled={loading ? true : false}
                            // style={loading ? { opacity: '0.5' } : { opacity: '1' }}
                            type='submit'
                            className=" shadow-gray-800 py-2 px-8 font-semibold text-xxl text-slate-50 bg-green-600 rounded-md border-2 border-white ">
                            Change Password
                        </button>
                    </div>}
                    {changePassword &&
                        <div className='w-full flex space-x-4 justify-start center pl-[5%] text-xl font-semibold mb-4'>
                            <span className='w-[18%] text-sm'>new password  </span>
                            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className='p-2 w-[40%] bg-white  rounded-md outline-none text-lg font-normal' type='password' autoFocus={true} />
                        </div>
                    }
                    {changePassword &&
                        <div className='w-full flex space-x-4 justify-start  pl-[5%] text-xl font-semibold mb-4'>
                            <span className='w-[18%] text-sm'>confirm password  </span>
                            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='p-2 w-[40%] bg-white  rounded-md outline-none text-lg font-normal' type='password' />
                        </div>
                    }
                    {changePassword && <div className='flex w-full justify-center space-x-4 items-center'>
                        <button
                            disabled={loading ? true : false}
                            style={loading ? { opacity: '0.5' } : { opacity: '1' }}
                            onClick={submitHandler}
                            type='submit'
                            className="shadow-sm  py-2 px-8  hover:shadow-xl  bg-[#c2e7ff] rounded-md ">
                            Submit
                        </button>
                    </div>}
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
}

export default Profile
