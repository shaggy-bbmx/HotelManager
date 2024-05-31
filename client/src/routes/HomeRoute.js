import React from 'react'
import { Route } from 'react-router-dom/cjs/react-router-dom.min'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { ThreeDots } from 'react-loader-spinner'


const HomeRoute = ({ component: Component, isAdmin, ...rest }) => {

    const { isAuthenticated, loading } = useSelector((state) => state.loadUser)

    return (
        <>
            {(loading === true) &&
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
                </div>}
            {(loading === false) && (
                <Route
                    {...rest}
                    render={(props) => {
                        if (isAuthenticated === true) {
                            return <Redirect to='/user/account' />
                        } else {
                            return <Component {...props} />
                        }

                    }}
                />
            )}
        </>
    )
}

export default HomeRoute
