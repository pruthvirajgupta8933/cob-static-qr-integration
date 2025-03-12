import React, { useEffect } from 'react'
import WebWhiteList from '../WebWhiteList'
import { useDispatch } from 'react-redux'
import { clearWebsiteWhiteList } from '../../../slices/kycSlice'

function WebsiteWhitelistPage() {
    const dispatch = useDispatch()

    useEffect(() => {
        return () => {
            dispatch(clearWebsiteWhiteList())
        }
    }, [])


    return (
        <WebWhiteList />
    )
}

export default WebsiteWhitelistPage