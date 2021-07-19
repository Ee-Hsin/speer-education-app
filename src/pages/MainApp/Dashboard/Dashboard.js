import React, { useState } from 'react';
import MentorShowcase from '../../../components/Dashboard/MentorShowcase';
import PostComposerCard from '../../../components/Dashboard/PostComposerCard';
import PostStream from '../../../components/Dashboard/PostStream';
import NotificationShowcase from '../../../components/Dashboard/NotificationShowcase';
import OpenChats from '../../../components/Dashboard/OpenChats';
import StatsCard from '../../../components/Dashboard/StatsCard';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import { IconButton } from '@material-ui/core';
import {Helmet} from "react-helmet";
import './Dashboard.css';

function Dashboard() {
    return (
        <div className="dashboard">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Dashboard | Speer Education</title>
            </Helmet>
            <div>
                {/* left side bar */}
                <MentorShowcase/>
                <StatsCard/>
            </div>
            <div className="stream_container">
                {/* center container */}
                <div className="flex-1 max-w-4xl">
                    <div className="flex flex-row justify-between w-full">
                        <p className="font-semibold text-lg pl-4 pt-4">Post Feed</p>
                    </div>
                    <PostComposerCard /> {/* only show if user wants to create a post */}
                    <PostStream/>
                </div>
            </div>
            <div>
                {/* right side bar */}
                <OpenChats/>
            </div>
        </div>
    )
}

export default Dashboard
