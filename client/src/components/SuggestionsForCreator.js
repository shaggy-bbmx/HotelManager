import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Skeleton } from '@mui/material'

const SuggestionsForCreator = ({ props }) => {

    const { createdByEmployeeNo: employeeNo,
        handleCheckBoxChangeForCreator,
    } = props

    const [loading, setLoading] = useState(true)
    const [suggestions, setSuggestions] = useState([])
    const timeoutRef = React.useRef(null)


    useEffect(() => {

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        const fetchSuggestions = async () => {
            try {
                const { data } = await axios.get(`/api/v1/employee/suggestions/${employeeNo}`)
                setSuggestions(data)
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }

        timeoutRef.current = setTimeout(fetchSuggestions, 1000)
        return () => {
            clearTimeout(timeoutRef.current)
        }
    }, [employeeNo])

    return (
        <div className='w-full h-full p-4'>
            {loading && <Skeleton className='w-full mb-[2px]' sx={{ height: '2rem' }} variant='rectangular'></Skeleton>}
            {(suggestions.length === 0 && !loading) &&
                <div className='w-full p-2 bg-[#5096FF] text-md text-white flex justify-center italic mb-[1px] rounded-lg'>
                    Sorry, no such employee found !!!
                </div>}
            {suggestions &&
                suggestions.map(suggestion =>
                    <div key={suggestion.employeeNo} className='w-full p-2 bg-[#5096FF] text-md text-white mb-[1px] flex flex-row cursor-pointer'
                        onClick={
                            (e) => {
                                handleCheckBoxChangeForCreator(e, suggestion.employeeNo)
                            }}>
                        <div className='w-[33%] flex items-center'>
                            <span className='w-4 h-4 bg-white rounded-sm mr-2'></span>
                            <span>{suggestion.employeeNo}</span>
                        </div>
                        <div className='w-[33%] flex items-center'>
                            <span className='w-4 h-4 bg-white rounded-sm mr-2'></span>
                            <span>{suggestion.name}</span>
                        </div>
                        {(suggestion?.department) && <div className='w-[33%] flex items-center'>
                            <span className='w-4 h-4 bg-white rounded-sm mr-2'></span>
                            <span>{suggestion?.department}</span>
                        </div>}
                    </div>
                )
            }
        </div>
    )
}

export default SuggestionsForCreator
