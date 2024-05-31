import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import axios from 'axios'


//redux
import { useDispatch, useSelector } from 'react-redux'

//css and image
import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'
import { updateUser } from '../actions/userAction'




const ResetPassword = () => {

    const { email, token } = useParams()
    const history = useHistory()

    const [newPassword, setNewPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [alert, setAlert] = React.useState(false)
    const [alertMessage, setAlertMessage] = React.useState('')
    const [error, setError] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [success, setSuccess] = React.useState(false)




    //useEffect
    useEffect(() => {
        if (error === true) {
            setConfirmPassword('')
            setNewPassword('')
            setTimeout(() => {
                setError(false)
            }, 2000)
        }

        if (success === true) {
            setConfirmPassword('')
            setNewPassword('')
            setTimeout(() => {
                history.push('/')
            }, 2000)
        }
    }, [success, error])



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

        const sendResetPassword = async () => {
            try {
                setLoading(true)
                const config = { headers: { "Content-Type": "application/json" } }
                const { data } = await axios.put(`/api/v1/user/reset/password/${email}/${token}`, { password: newPassword }, config)
                setLoading(false)
                setSuccess(true)
            } catch (error) {
                setLoading(false)
                setError(true)
            }
        }

        sendResetPassword()
    }




    return (
        <div className='z-20 w-full transition-all  duration-500 h-[100vh]  bg-transparent backdrop-blur-md flex justify-center items-center'>
            <div className='w-[50vw]  bg-slate-50  p-4 absolute rounded-xl border-2 border-white flex flex-col  overflow-hidden shadow-xl'>
                {/* title */}
                <div className='w-full flex justify-center pb-2'>
                    <p
                        style={{ height: '100%', backgroundColor: '#c2e7ff', opacity: '0.9' }}
                        className='w-[10vw] text-xl text-gray-800  py-2 transition-all flex  justify-center'>
                        Reset Password
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
                        Coiuld not reset password !!!
                    </Alert>
                }
                {/* line */}
                <div className='w-full flex justify-center pb-8 '>
                    <div className='w-[90%] ml-6  h-0.5 bg-white mb-12 lg:mb-0'></div>
                </div>
                {success &&
                    <Alert
                        className='w-full ml-2' severity="success">
                        Password updated successfully
                    </Alert>
                }
                {/* form */}
                {(!success) && <div className='w-full h-[60vh] rounded-br-lg overflow-hidden'>
                    <div className='sidebar w-full  h-full flex flex-col overflow-y-scroll'>
                        <div className='w-full flex space-x-4 justify-start  pl-[5%] text-xl  mb-4'>
                            <span className='w-[18%]'>Email  </span>
                            <span className='p-2 w-[40%] bg-white  rounded-md outline-none text-lg font-normal' type='text'>{email}</span>
                        </div>
                        <div className='w-full flex space-x-4 justify-start center pl-[5%] text-xl font-semibold mb-4'>
                            <span className='w-[18%] text-sm'>new password  </span>
                            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className='p-2 w-[40%] bg-white  rounded-md outline-none text-lg font-normal' type='password' autoFocus={true} />
                        </div>
                        <div className='w-full flex space-x-4 justify-start  pl-[5%] text-xl font-semibold mb-4'>
                            <span className='w-[18%] text-sm'>confirm password  </span>
                            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='p-2 w-[40%] bg-white  rounded-md outline-none text-lg font-normal' type='password' />
                        </div>

                        <div className='flex w-full justify-center space-x-4 items-center'>
                            <button
                                disabled={loading ? true : false}
                                style={loading ? { opacity: '0.5' } : { opacity: '1' }}
                                onClick={submitHandler}
                                type='submit'
                                className="shadow-sm  py-2 px-8 text-gray-800 bg-[#c2e7ff] rounded-md ">
                                Submit
                            </button>
                        </div>
                    </div>
                    {loading &&
                        <LinearProgress
                            sx={{
                                backgroundColor: 'rgb(253 186 116)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: 'rgb(248 250 252)',
                                    paddingTop: '0rem'

                                }
                            }}
                            className='w-[104%] h-6 rounded-md absolute z-50 -bottom-[1rem]' />
                    }
                </div>}
            </div>
        </div>
    )
}

export default ResetPassword
