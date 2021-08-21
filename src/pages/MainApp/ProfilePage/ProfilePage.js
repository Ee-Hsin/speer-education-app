import React, { useState, useEffect } from 'react';
import { db } from '../../../config/firebase';
import { useParams } from 'react-router-dom';
import history from '../../../hooks/history';
import {Helmet} from "react-helmet";
import './ProfilePage.css'
import { useAuth } from '../../../hooks/useAuth';
import StatsCard from '../../../components/Dashboard/StatsCard';
import ContactsSidebar from '../../../components/Profile/ContactsSidebar';
import { Button } from '@material-ui/core';
import { LanguageOutlined, LinkedIn } from '@material-ui/icons';
import UserFullProfile from '../../../components/Profile/UserFullProfile';
import EducationCard from '../../../components/Profile/EducationCard';
import PostCard from '../../../components/Dashboard/PostCard';
import SocialsCard from '../../../components/Profile/SocialsCard';

function ProfilePage({ isUser=false }) {
    const { profileId } = useParams();
    const { user, userDetails: currentUserDetails, signOut } = useAuth();
    const [userDetails, setUserDetails] = useState({});
    const [isMentor, setIsMentor] = useState(false);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    
    const { name, major, school, country,highlight1,highlight2, bio, socials } = userDetails || {};

    //If profileId is userId, then redirect to profile page
    useEffect(() => {
        if (profileId === user?.uid) {
            history.push('/app/profile');
        }
    }, [profileId, user])

    //If Profile Page is current user, set user details with current user details
    useEffect(() => {
        if (isUser) {
            setUserDetails(currentUserDetails);
        }
    }, [isUser, currentUserDetails]);
    
    useEffect(() => {
        if(isUser) return;
        return db.doc(`users/${profileId}`).onSnapshot(async snap => {
            console.log(snap.data())
            setUserDetails(snap.data());
            if (snap.data().isMtr){
                setIsMentor(true)
            }
            setLoading(false);
        })
    }, [isUser, profileId]);

    useEffect(() => {
        if(!user) return;
        return db.collection('posts').where('author','==',(profileId || user?.uid)).orderBy('_createdOn','desc').onSnapshot(async snap => {
            const posts = snap.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setPosts(posts);
        })
    }, [user]);
    
    return (
        <div className="profilePage h-app">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{isUser?"Your":name || ""} Profile | Speer Education</title>
            </Helmet>
            <div className="w-screen h-full flex flex-row">
                <div className="hidden xl:flex flex-col h-full h-app" style={{ width: `350px` }}>
                    <div className="fixed">
                        <ContactsSidebar profileId={profileId || user?.uid} userDetails={userDetails} isUser={isUser}/>
                        <StatsCard />
                    </div>
                </div>
                <div className="flex-1 flex flex-row w-full pr-5">
                    <div className="flex flex-row justify-center flex-1 w-full p-3 md:p-0">
                        <div className="flex flex-col h-full p-3 space-y-4 flex-1" style={{ maxWidth: "1024px" }}>
                            <p className="font-semibold text-lg">{isUser?"Your":name} Profile</p>
                            <UserFullProfile profileId={profileId || user?.uid} isUser={isUser} isMentor={isMentor} userDetails={userDetails}/>
                            <div className="rounded-xl shadow-lg w-full overflow-hidden bg-white py-5 px-8 space-y-2">
                                <p className="font-semibold text-lg">About Me</p>
                                <p className="text-gray-600">{bio}</p>
                            </div>
                            {/* Temporary */}
                            {isUser && <div className="rounded-xl shadow-lg w-full overflow-hidden bg-white py-5 px-8 space-y-2">
                                <p className="font-semibold text-lg">Settings</p>
                                {/* Logout Button */}
                                <Button variant="outlined" onClick={() => signOut()}>Logout</Button>
                            </div>}
                            {posts.map(post => <PostCard key={post.id} post={post}/>)}
                        </div>
                    </div>
                    <div className=" hidden md:flex flex-col h-app" style={{ width: `350px` }}>
                        <div className="fixed">
                            <EducationCard userDetails={userDetails} isUser={isUser} isMentor={isMentor} />
                            {socials && <SocialsCard socials={socials}/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    )
}

export default ProfilePage
