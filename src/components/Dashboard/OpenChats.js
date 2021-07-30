import { IconButton } from '@material-ui/core';
import { MessageTwoTone } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import NotificationCard from './NotificationCard';
import ProfilePicture from '../User/ProfilePicture';
import { Link } from 'react-router-dom';

export default function OpenChats() {

    const { userDetails } = useAuth();

    const [chatrooms, setChatrooms] = useState();

    //Sorts the activeChats in the user document
    useEffect(() => {

        //If user id hasn't loaded yet, just return
        if (userDetails?.activeRooms) {
            const { activeRooms } = userDetails
            //Transform activeChats object into an array to better iterate through
            const rooms = Object.values(activeRooms).map((val, index) => {
                return {
                    id: Object.keys(activeRooms)[index],
                    ...val
                }
            })
            //Order Active chats by chronological order
            setChatrooms(rooms.sort(({date: x},{date: y}) => x.toMillis() - y.toMillis()))
        }
    }, [userDetails?.activeRooms])

    return (
        <div className="rounded-md bg-white m-2 p-3 w-300 min-w-500 shadow-md" style={{'min-height': '500px'}}>
            {!chatrooms ? "No notifications" : <>
            <p>Recent Chats</p>
            {chatrooms.map(({senderUsername, senderId, message, roomId})=> (
                <div className="flex flex-row mt-2 hover:bg-gray-300 cursor-pointer">
                    <ProfilePicture uid={senderId} className="w-10 h-10 rounded-full"/>
                    <div className="flex-1 ml-2 max-w-full">
                        <p className="font-medium">{senderUsername}</p>
                        <p className="overflow-hidden overflow-ellipsis whitespace-nowrap w-full">{message}</p>
                    </div>
                </div>
            ))}
            
            </>}
        </div>
    )
}
