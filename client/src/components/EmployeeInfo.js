import React, { useEffect } from 'react'
import Name from './microComponents/Name'
import EmployeeCard from './microComponents/EmployeeCard'
import Email from './microComponents/Email'
import Department from './microComponents/Department'

//redux
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'


//css
import { getEmployee } from '../actions/userAction'
import { Skeleton } from '@mui/material'



const EmployeeInfo = ({ employeeNo }) => {

    //redux
    const dispatch = useDispatch()
    const { loading, employee } = useSelector(state => state.getEmployee)


    //useEffect
    useEffect(() => {
        dispatch(getEmployee(employeeNo))
    }, [employeeNo, dispatch])


    //handler
    const capitalizeFirstLetter = (string) => {
        if (!string) return string
        return string.charAt(0).toUpperCase() + string.slice(1)
    }


    return (
        <div className='flex flex-row w-full h-full bg-transparent backdrop-blur-xl  rounded-tr-2xl rounded-br-2xl  border-2 border-gray-200 shadow-xl'>
            <div className='w-[50%] h-full'>
                {loading ?
                    <Skeleton className='w-full ' sx={{ height: '26vh' }} variant='rectangular'></Skeleton>
                    :
                    <img alt='avatar' src={employee?.profilePic} className='w-full h-full object-contain' />}
            </div>
            <div className='w-[50%] h-full  p-2  text-[#0d0c0c]'>
                <div className='w-full text-lg flex flex-row items-center pb-4'>
                    <Name />
                    {loading ? <Skeleton variant='text' className='w-full h-full'></Skeleton> : <span>{capitalizeFirstLetter(employee?.name)}</span>}
                </div>
                <div className='w-full text-md flex flex-row items-center pb-4'>
                    <EmployeeCard />
                    {loading ? <Skeleton variant='text' className='w-full h-full'></Skeleton> : <span>{employee?.employeeNo}</span>}
                </div>
                <div className='w-full text-sm  flex flex-row items-center pb-4'>
                    <Email />
                    {loading ? <Skeleton variant='text' className='w-full h-full'></Skeleton> : <div className='w-full text-wrap'>
                        <span className='break-all'>{employee?.email}</span>
                    </div>}
                </div>
                {employee?.department && <div className='w-full text-md  flex flex-row items-center'>
                    <Department />
                    {loading ? <Skeleton variant='text' className='w-full h-full'></Skeleton> : <span className=''>{employee?.department}</span>}
                </div>}
            </div>
        </div>
    )
}

export default EmployeeInfo
