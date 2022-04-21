import { Button, IconButton } from "@mui/material";
import { EditOutlined, ExitToAppOutlined, MessageOutlined } from "@mui/icons-material";
import { lazy, useRef, useState } from "react";
import { functions, db } from "../../config/firebase";
import { useAuth } from "../../hooks/useAuth";
import MentorCardModal from "../Modal/MentorCardModal";
import BannerPicture from "../User/BannerPicture";
import ProfilePicture from "../User/ProfilePicture";
import UserHighlight from "../User/UserHighlight";
import { logEvent } from "../../utils/analytics";
import { useNavigate } from "react-router-dom";

const LazyEditDetailsDialog = lazy(() => import("./EditDetailsDialog"));

const UserProfilePicture = ({ profileId, isUser }) => {
    const profileUpload = useRef();

    const handleUploadProfilePic = async (file) => {
        if (!isUser) return;
        logEvent('update_profile_picture')
        let reader = new FileReader();
        reader.readAsDataURL(file);
        let base64image = await new Promise((resolve, reject) => {
            reader.addEventListener("load", function () {
                resolve(reader.result);
            }, false);
        });
        try {
            const storageRef = await functions.httpsCallable('updateProfilePicture')({
                image: base64image,
            });
            //reload to see changes
            window.location.reload()
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="relative">
            <ProfilePicture className="w-24 h-24 md:w-32 md:h-32 rounded-full border-white border-8 border-solid shadow-lg transform -translate-y-16 mx-1" uid={profileId} forceRefresh/>
            <input ref={profileUpload} type="file" name="file" accept="image/*" onChange={({ target }) => handleUploadProfilePic(target.files[0])} hidden />
            {isUser && <div className="absolute top-0 right-0 text-white transform -translate-y-16 rounded-full bg-gray-800 scale-75">
                <IconButton onClick={e => profileUpload.current.click()} size="large">
                    <EditOutlined className="text-white" />
                </IconButton>
            </div>}
        </div>
    );
}

const UserBannerPicture = ({ profileId, isUser }) => {
    const { user } = useAuth();
    const bannerUpload = useRef();

    const handleUploadBannerPic = async (file) => {
        if (!isUser) return;
        logEvent('update_banner_picture')
        let reader = new FileReader();
        reader.readAsDataURL(file);
        let base64image = await new Promise((resolve, reject) => {
            reader.addEventListener("load", function () {
                resolve(reader.result);
            }, false);
        });
        try {
            const storageRef = await functions.httpsCallable('updateBannerPicture')({
                image: base64image,
            });
            //reload to see changes
            window.location.reload()
        } catch (e) {
            console.error(e)
        }

    }

    return (
        <div className="relative">
            <BannerPicture className="w-full h-32 rounded-xl shadow-md object-cover" uid={profileId} />
            <input ref={bannerUpload} type="file" name="file" accept="image/png" onChange={({ target }) => handleUploadBannerPic(target.files[0])} hidden />
            {isUser && <div className="absolute top-0 right-0 m-1 text-white rounded-full bg-gray-100 transform scale-75">
                <IconButton onClick={e => bannerUpload.current.click()} size="large">
                    <EditOutlined />
                </IconButton>
            </div>}
        </div>
    );
}

export default function UserFullProfile({ profileId, isMentor, isUser, userDetails }) {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const { name, major, school, country, highlight1, highlight2 } = userDetails || {};
    const [mentorModalOpen, setMentorModalOpen] = useState(false);
    const [openEditDetails, setOpenEditDetails] = useState(false);

    const connectWithPerson = async () => {
        if (!user?.uid || !profileId) return;

        const snap = await db.doc(`relationships/${profileId}_${user.uid}`).get()

        //Relationsip has not been made, room does not exist yet, open the modal.
        if(!snap.exists) {
            setMentorModalOpen(true)
        //Room exists, just push to the roomId
        } else {
            try {
                logEvent('message_user', { targetUser: profileId })
                const targetRoomId = snap.data()?.roomId
                navigate(`/messages/${targetRoomId}`)
            } catch (e) {
                console.error(e)
            }
        }

    }


    return <>
        <div className="rounded-xl shadow-lg w-full overflow-hidden bg-white">
            <UserBannerPicture profileId={profileId} isUser={isUser} />
            <div className="flex flex-col md:flex-row p-3 w-full items-start">
                <UserProfilePicture profileId={profileId} isUser={isUser}/>
                <div className="flex flex-col space-y-1 w-full relative transform -mb-16 md:mb-0 -translate-y-16 md:translate-y-0">
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="text-2xl text-gray-800">{name}</h1>
                        {/* Show Edit Profile if is User, else show Message User */}
                        {isUser ? <div className="flex flex-row space-y-1">
                            <IconButton onClick={() => signOut()} size="large">
                                <ExitToAppOutlined className="text-red-600" />
                            </IconButton>
                            <div className="hidden md:inline">
                                <Button variant="contained" color="primary" onClick={e => setOpenEditDetails(true)}>Edit Your Profile</Button>
                            </div>
                            <div className="md:hidden">
                                <IconButton onClick={e => setOpenEditDetails(true)} size="large"><EditOutlined /></IconButton>
                            </div>
                        </div> : <>
                            <div className="hidden md:inline">
                                <Button variant="contained" color="primary" startIcon={<MessageOutlined />} onClick={() => connectWithPerson()}>Message</Button>
                            </div>
                            <div className="md:hidden">
                                <IconButton onClick={() => connectWithPerson()} size="large"><MessageOutlined /></IconButton>
                            </div>
                        </>}
                    </div>
                    <p className="text-gray-600 text-sm">{isMentor ? "Mentor" : major} at {school}</p>
                    <p className="text-gray-600 text-sm ">{country}</p>
                    <div className="flex flex-row items-center my-5 space-x-3">
                        <UserHighlight highlight={highlight1} />
                        <UserHighlight highlight={highlight2} />
                    </div>
                </div>
            </div>
        </div>
        <LazyEditDetailsDialog open={openEditDetails} onClose={() => setOpenEditDetails(false)} />
        <MentorCardModal open={mentorModalOpen} setOpen={setMentorModalOpen} mentorSelected={{id: profileId, ...userDetails}}/>
    </>;
}