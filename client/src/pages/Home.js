//react imports
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min.js'
import PreLoader from '../components/PreLoader.js'
import { useGoogleLogin } from '@react-oauth/google'

//mui imports
import Alert from '@mui/material/Alert'
import { LinearProgress } from '@mui/material'
import { ThreeDots } from 'react-loader-spinner'

//redux imports
import { useDispatch, useSelector } from 'react-redux'
import { Login, Register, loadUser, resetLogin, resetRegister } from '../actions/userAction.js'

//image imports
import bgImage from "../assest/images/modern-studio-apartment-design-with-bedroom-living-space.jpg"
import googleLogo from '../assest/images/pocho.jpg'
import axios from 'axios'



const Home = () => {


    //redux
    const dispatch = useDispatch()
    const { loading, registerError, loginError, registerSuccess, loginSuccess } = useSelector(state => state.user)
    const { isAuthenticated } = useSelector(state => state.loadUser)


    //state
    const history = useHistory()
    const [newUser, setNewUser] = React.useState(false)
    const [role, setRole] = React.useState('none')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [googleLoading, setGoogleLoading] = React.useState(false)



    useEffect(() => {
        if (isAuthenticated === true) {
            history.push('/user/account')
        }
    }, [history])



    //handlers
    const selectionHandler = (e) => {
        setRole(e.target.value)
    }



    const registerHandler = (e) => {
        e.preventDefault()
        const userData = { email, role }
        dispatch(Register(userData))
    }

    const loginHandler = (e) => {
        e.preventDefault()
        const userData = { email, password }
        dispatch(Login(userData))
    }


    const checkGoogleToken = async (tokenResponse) => {
        try {
            setGoogleLoading(true)
            const { data } = await axios.get(`/api/v1/user/google/${tokenResponse.access_token}`)
            setGoogleLoading(false)
            dispatch(loadUser())
        } catch (error) {
            setGoogleLoading(false)
            console.log(error)
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: tokenResponse => checkGoogleToken(tokenResponse),
    })

    //useEffect
    //clear the input fields after successful or unsuccessful registration
    useEffect(() => {
        if (registerSuccess || registerError) {
            setEmail('')
            setPassword('')
            setRole('none')
            setTimeout(() => {
                dispatch(resetRegister())
            }, 5000)
        }
    }, [registerSuccess, registerError])

    //clear the input fields after unsuccessful login
    useEffect(() => {
        if (loginError) {
            setEmail('')
            setPassword('')
            setRole('none')
            setTimeout(() => {
                dispatch(resetLogin())
            }, 5000)
        }
    }, [loginError])


    //redirect to user account page after successful login
    useEffect(() => {
        if (loginSuccess) {
            history.push('/user/account')
        }
    }, [loginSuccess])




    //imageloader
    const imageLoader = PreLoader(bgImage)
    if (!imageLoader) {
        return (
            <div className='w-[100vw] h-[100vh] flex justify-center items-center'>
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
        )
    }

    return (
        <div className="w-[100vw] h-[100vh] relative bg-cover" style={{ backgroundImage: `url(${bgImage})` }}>
            {registerSuccess &&
                <Alert
                    onClose={() => {
                        setEmail('')
                        setPassword('')
                        setRole('none')
                        dispatch(resetRegister())
                    }}
                    className='absolute w-[25vw] z-50 top-16 left-[50vw] -translate-x-[50%]' severity="success">
                    Check your email for credentials
                </Alert>
            }
            {registerError &&
                <Alert
                    onClose={() => {
                        setEmail('')
                        setPassword('')
                        setRole('none')
                        dispatch(resetRegister())
                    }}
                    className='absolute w-[25vw] z-50 top-16 left-[50vw] -translate-x-[50%]' severity="error">
                    Email already exists
                </Alert>
            }
            {loginError &&
                <Alert
                    onClose={() => {
                        setEmail('')
                        setPassword('')
                        setRole('none')
                        dispatch(resetLogin())
                    }}
                    className='absolute w-[25vw] z-50 top-16 left-[50vw] -translate-x-[50%]' severity="error">
                    Please check email or password
                </Alert>
            }

            <div className="h-auto w-auto  rounded-xl absolute left-[50vw] top-[50vh]  -translate-x-[50%] -translate-y-[50%] z-20  flex flex-col  justify-center text-center items-center bg-transparent space-y-6 ">
                <div className="absolute top-0 left-0 w-full h-full z-30 bg-transparent backdrop-blur-2xl opacity-60 rounded-lg"></div>
                {(googleLoading === true) &&
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
                }
                {!googleLoading && <div className='w-full h-full shadow-2xl opacity-100  rounded-md  z-40 hover:cursor-pointer flex flex-col justify-center items-start bg-inherit px-8'>
                    <div className='w-[20vw]  h-[8vh] flex justify-around items-end mb-8'>
                        <button
                            onClick={() => setNewUser(false)}
                            style={newUser ? { height: '90%', backgroundColor: 'inherit', opacity: '0.3' } : { height: '100%', backgroundColor: 'rgb(59 130 246)', opacity: '0.9' }}
                            className='  w-full text-xl font-semibold text-white py-2 transition-all'>Login</button>
                        <button
                            onClick={() => setNewUser(true)}
                            style={!newUser ? { height: '90%', backgroundColor: 'inherit', opacity: '0.3' } : { height: '100%', backgroundColor: 'rgb(59 130 246)', opacity: '0.9' }}
                            className='w-full text-xl font-semibold text-white  py-2 transition-all'>Register</button>
                    </div>

                    {/* login  */}
                    {!newUser &&
                        <>
                            <h1 className='text-xl text-white font-semibold mb-2'>Email</h1>
                            <input
                                value={email}
                                id='email'
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-[20vw] h-[6vh] rounded-md px-2  mb-4 outline-none' autoFocus={true}
                                type='email'>
                            </input>
                            <h1 className='text-xl text-white font-semibold mb-2'>Password</h1>
                            <input
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='w-[20vw] h-[6vh] rounded-md px-2  mb-4 outline-none' type='password'>
                            </input>
                            <div className='w-full h-auto mt-4 mb-8'>
                                <button
                                    disabled={loading ? true : false}
                                    style={loading ? { opacity: '0.5' } : { opacity: '1' }}
                                    onClick={loginHandler}
                                    className="shadow-lg opacity-100 shadow-slate-500 py-2 px-8 font-semibold text-xxl text-slate-50 bg-blue-500 rounded-md ">
                                    Login
                                </button>
                            </div>
                            <div className='w-full h-[1px] bg-slate-50 mb-8'></div>
                            <div className='w-full h-auto mt-4 text-white '>
                                Sign in with
                            </div>
                            <div className='w-full h-auto mt-4 mb-4 flex justify-center'>
                                <button
                                    disabled={loading ? true : false}
                                    style={loading ? { opacity: '0.5' } : { opacity: '1' }}
                                    onClick={() => googleLogin()}
                                    className="shadow-lg opacity-100 shadow-slate-500   font-semibold text-xxl text-slate-50 bg-blue-500 rounded-md flex items-center pr-4 ">
                                    <img src={googleLogo} className='object-contain w-12 h-12 rounded-md' alt='logo' />
                                    <span className='ml-4'>Google</span>
                                </button>
                            </div>
                            <a href='/forgot/password' className='text-sm text-white w-full flex justify-end  font-semibold mb-2'>forgot password</a>

                        </>
                    }
                    {/* register */}
                    {newUser &&
                        <>
                            <h1 className='text-xl text-white font-semibold mb-2'>Email</h1>
                            <input
                                id='emaiL'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-[20vw] h-[6vh] rounded-md px-2  mb-4 outline-none' autoFocus={true} type='email'>
                            </input>
                            <div className='w-[20vw] h-[6vh] rounded-md px-2  bg-white  mb-4'>
                                <select value={role} placeholder='Select a Role' onChange={selectionHandler} className='w-full h-full outline-none cursor-pointer' type='text'>
                                    <option key='Select a Role' value='none'>---Select a Role---</option>
                                    <option key='User' value='User'>User</option>
                                    <option key='Technician' value='Technician'>Technician</option>
                                </select>
                            </div>
                            <div className='w-full h-auto mt-4 mb-4'>
                                <button
                                    disabled={loading ? true : false}
                                    style={loading ? { opacity: '0.5' } : { opacity: '1' }}
                                    onClick={registerHandler}
                                    type='submit'
                                    className="shadow-lg shadow-slate-500 py-2 px-8 font-semibold text-xxl text-slate-50 bg-blue-500 rounded-md ">
                                    Register
                                </button>
                            </div>

                        </>
                    }
                </div>}
                {!googleLoading && loading &&
                    <LinearProgress
                        sx={{
                            backgroundColor: 'rgb(241 245 249)',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: 'rgb(59 130 246)',
                                paddingTop: '0rem'

                            }
                        }}
                        className='w-[98%] h-2 rounded-md absolute z-50 bottom-0' />
                }
            </div>
        </div>
    )
}

export default Home
