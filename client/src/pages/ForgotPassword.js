//react imports
import React, { useEffect } from 'react'
import PreLoader from '../components/PreLoader.js'
import axios from 'axios'


//mui imports
import Alert from '@mui/material/Alert'
import { LinearProgress } from '@mui/material'
import { ThreeDots } from 'react-loader-spinner'

//redux imports

//image imports
import bgImage from "../assest/images/modern-studio-apartment-design-with-bedroom-living-space.jpg"



const ForgotPassword = () => {

    //state
    const [email, setEmail] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(false)
    const [success, setSuccess] = React.useState(false)




    const handler = (e) => {
        e.preventDefault()

        const sendtheLink = async () => {
            try {
                setLoading(true)
                const config = { headers: { "Content-Type": "application/json" } }
                await axios.post('/api/v1/user/forgot/password', { email }, config)
                setLoading(false)
                setSuccess(true)
            } catch (error) {
                setLoading(false)
                setError(true)
            }
        }


        sendtheLink()
    }

    //useEffect
    //clear the input fields after successful or unsuccessful registration
    useEffect(() => {
        if (error === true) {
            setEmail('')
            setTimeout(() => {
                setEmail('')
            }, 2000)
        }
    }, [error])




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
            {success &&
                <Alert
                    className='absolute w-[25vw] z-50 left-[50vw] top-[50vh]  -translate-y-[50%] -translate-x-[50%]' severity="success">
                    Check your email for credentials
                </Alert>
            }
            {error &&
                <Alert
                    onClose={() => {
                        setEmail('')
                    }}
                    className='absolute w-[25vw] z-50 top-16 left-[50vw] -translate-x-[50%]' severity="error">
                    Email not found
                </Alert>
            }
            {!success && <div className="h-auto w-auto  rounded-xl absolute left-[50vw] top-[50vh]  -translate-x-[50%] -translate-y-[50%] z-20  flex flex-col  justify-center text-center items-center bg-transparent space-y-6 ">
                <div className="absolute top-0 left-0 w-full h-full z-30 bg-transparent backdrop-blur-2xl opacity-60 rounded-lg"></div>
                <div className='w-full h-full shadow-2xl opacity-100  rounded-md  z-40 hover:cursor-pointer flex flex-col justify-center items-start bg-inherit px-8'>
                    <div className='w-[20vw]  h-[8vh] flex justify-center items-end mb-8'>
                        <div
                            className='  w-full text-xl bg-[rgb(194 65 12)] font-semibold text-white py-2 transition-all'>Reset Password
                        </div>
                    </div>
                    {/* login  */}
                    <>
                        <h1 className='text-xl text-white font-semibold mb-2'>Email</h1>
                        <input
                            value={email}
                            id='email'
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-[20vw] h-[6vh] rounded-md px-2 text-orange-600 mb-4 outline-none' autoFocus={true}
                            type='email'>
                        </input>
                        <div className='w-full h-auto mt-4 mb-4'>
                            <button
                                disabled={loading ? true : false}
                                style={loading ? { opacity: '0.5' } : { opacity: '1' }}
                                onClick={handler}
                                className="shadow-sm opacity-100 shadow-gray-800 py-2 px-8 font-semibold text-xxl text-slate-50 bg-blue-600 rounded-md ">
                                Send the link
                            </button>
                        </div>
                    </>
                </div>
                {loading &&
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
            </div>}
        </div>
    )
}


export default ForgotPassword
