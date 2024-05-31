import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min.js'


//redux
import { useDispatch, useSelector } from 'react-redux'
import { createUser } from '../actions/userAction.js'


//css and image
import bgImage from '../assest/images/modern-studio-apartment-design-with-bedroom-living-space.jpg'
import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'
import sample from '../assest/images/sample_avatar.avif'
import Camera from '../components/microComponents/Camera.js'



const RegisterForm = () => {

    //constants
    const isStrongPassword = (password) => {
        // At least 8 characters long, includes at least one uppercase letter, one lowercase letter, one number, and one special character
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        return regex.test(password)
    }

    //useState
    const [name, setName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [role, setRole] = React.useState('')
    const [token, setToken] = React.useState('')
    const [department, setDepartment] = React.useState('Electrical')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [alert, setAlert] = React.useState(false)
    const [alertMessage, setAlertMessage] = React.useState('')
    const [profilePic, setProfilePic] = React.useState('')
    const [profilePicPreview, setProfilePicPreview] = React.useState('')

    //redux
    const dispatch = useDispatch()
    const history = useHistory()
    const { email: emailParam, token: tokenParam, role: roleParam } = useParams()
    const { loading, success, error } = useSelector(state => state.createUser)


    // useEffect
    useEffect(() => {
        setEmail(emailParam)
        setRole(roleParam)
        setToken(tokenParam)
    }, [])


    useEffect(() => {
        if (alert === true) {
            setTimeout(() => {
                setAlert(false)
            }, 2000)
        }

        if (success === true) {
            setTimeout(() => {
                history.push('/')
            }, 2000)
        }

    }, [alert, success])


    //handler
    const submitHandler = (e) => {
        e.preventDefault()
        if (name === '' || password === '' || confirmPassword === '' || !profilePic) {
            setAlert(true)
            setAlertMessage('Please fill all the fields !!!')
            return
        }

        if (!isStrongPassword(password)) {
            setAlert(true)
            setAlertMessage('Password must be at least 8 characters long, includes at least one uppercase letter, one lowercase letter, one number, and one special character !!!')
            return
        }

        if (password !== confirmPassword) {
            setAlert(true)
            setAlertMessage('Password does not match !!!')
            return
        }

        const myForm = new FormData()
        myForm.set('name', name)
        myForm.set('email', email)
        myForm.set('role', role)
        myForm.set('department', department)
        myForm.set('password', password)
        myForm.set('token', token)
        myForm.set('profilePic', profilePic)


        dispatch(createUser(myForm))

    }

    const profilePicChangeHandler = (file) => {
        setProfilePic(file)
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            if (reader.readyState === 2) {
                setProfilePicPreview(reader.result)
            }
        }
    }



    return (
        <div className='w-[100vw] h-[100vh] relative bg-cover flex  justify-center items-center' style={{ backgroundImage: `url(${bgImage})` }}>
            <div className='w-[100vw] h-[100vh] top-0 left-0 absolute bg-transparent backdrop-blur-sm z-20'></div>
            <div className='w-[50vw]  bg-slate-50  p-4 absolute rounded-xl border-2 border-white flex flex-col items-center overflow-hidden  z-30'>
                {success === true &&
                    <Alert
                        className='w-full ml-2' severity="success">
                        You have registered successfully
                    </Alert>
                }
                {error === true &&
                    <Alert
                        className='w-full ml-2' severity="error">
                        Something went wrong, Please try again!!!
                    </Alert>

                }
                {(success != true && error != true) && <>
                    {/* title */}
                    <div className='w-full flex justify-center pb-2'>
                        <p
                            style={{ height: '100%', backgroundColor: '#c2e7ff', opacity: '0.9' }}
                            className='w-[10vw] text-lg text-gray-800  py-2 transition-all flex  justify-center  border-2 border-white'>
                            Register form
                        </p>
                    </div>
                    {/* Alert */}

                    {alert &&
                        <Alert
                            className='w-full ml-2' severity="error">
                            {alertMessage}
                        </Alert>

                    }
                    {/* line */}
                    <div className='w-full flex justify-center pb-8 '>
                        <div className='w-[90%] ml-6  h-0.5 bg-white mb-12 lg:mb-0'></div>
                    </div>
                    {/* form */}
                    <div className='w-full h-[80vh]  rounded-br-lg overflow-auto'>
                        <div className='w-full  h-full flex flex-col items-center'>
                            <div className='w-full flex flex-col space-y-4 justify-center items-center p-0 mb-8 relative'>
                                <img src={profilePicPreview === '' ? sample : profilePicPreview} className='w-64  object-contain' />
                                <label className='cursor-pointer'>
                                    <p className='p-2 border-lg bg-[#5096FF] text-white rounded-lg'>Upload Pic</p>
                                    <input type='file' accept='image/*' className='hidden' onChange={(e) => { profilePicChangeHandler(e.target.files[0]) }} />
                                </label>
                            </div>
                            <div className='w-full flex space-x-4 justify-start items-center pl-[5%] text-lg font-semibold mb-4'>
                                <span className='w-[18%]'>Name  </span>
                                <input value={name} onChange={(e) => setName(e.target.value)} className='p-2 w-[40%] rounded-md outline-none text-lg font-normal' type='text' autoFocus={true} />
                            </div>
                            <div className='w-full flex space-x-4 justify-start items-center pl-[5%] text-lg font-semibold mb-4'>
                                <span className='w-[18%]'>Email  </span>
                                <input value={email} disabled={true}
                                    className='text-gray-500 mr-2 w-[40%] p-2 rounded-md outline-none text-lg font-normal bg-white'>
                                </input>
                            </div>
                            <div className='w-full flex space-x-4 justify-start items-center pl-[5%] text-lg font-semibold mb-4'>
                                <span className='w-[18%]'>Role  </span>
                                <input value={role} disabled={true}
                                    className='text-gray-500 mr-2 w-[40%] p-2 rounded-md outline-none text-lg font-normal bg-white'>
                                </input>
                            </div>

                            {role === 'Technician' && <div className='w-full flex justify-start items-center space-x-4  pl-[5%] text-lg font-semibold mb-4'>
                                <span className='w-[18%]'>Department  </span>
                                <select value={department} placeholder='Select Department' onChange={(e) => setDepartment(e.target.value)} className='text-black mr-2 w-[40%] p-2 rounded-md outline-none text-lg font-normal bg-white' type='text'>
                                    <option key='Electrical' value='Electrical'>Electrical</option>
                                    <option key='Civil' value='Civil'>Civil</option>
                                    <option key='House Keeping' value='House Keeping'>House Keeping</option>
                                </select>
                            </div>}
                            <div className='w-full flex space-x-4 justify-start items-center pl-[5%] text-lg font-semibold mb-4'>
                                <span className='w-[18%]'>Password  </span>
                                <input value={password} onChange={(e) => setPassword(e.target.value)} className='p-2 w-[40%] rounded-md outline-none text-lg font-normal' type='password' />
                            </div>
                            <div className='w-full flex space-x-4 justify-start items-center pl-[5%] text-lg font-semibold mb-4'>
                                <span className='w-[18%]'>Confirm</span>
                                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='p-2 w-[40%] rounded-md outline-none text-lg font-normal' type='password' />
                            </div>
                            <div className='flex w-full justify-center space-x-4 items-center'>
                                <button
                                    disabled={loading ? true : false}
                                    style={loading ? { opacity: '0.5' } : { opacity: '1' }}
                                    onClick={submitHandler}
                                    type='submit'
                                    className="shadow-sm py-2 px-8  text-md text-gray-800 bg-[#c2e7ff] rounded-md ">
                                    Submit
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
                </>}
            </div>

        </div>
    )
}

export default RegisterForm
