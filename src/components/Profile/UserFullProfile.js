import { Button, IconButton } from "@material-ui/core";
import { EditOutlined, MessageOutlined } from "@material-ui/icons";
import { useRef } from "react";
import { functions, storage } from "../../config/firebase";
import history from "../../hooks/history";
import { useAuth } from "../../hooks/useAuth";
import { getMessageUserRoom } from "../../utils/chats";
import BannerPicture from "../User/BannerPicture";
import ProfilePicture from "../User/ProfilePicture";
import UserHighlight from "../User/UserHighlight";

const UserProfilePicture = ({ profileId, isUser }) => {
    const { user } = useAuth();
    const profileUpload = useRef();

    const handleUploadProfilePic = async (file) => {
        if (!isUser) return;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        let base64image = await new Promise((resolve, reject) => {
            reader.addEventListener("load", function () {
                resolve(reader.result);
            }, false);
        });
        console.log('uploading profile picture')
        try {
            const storageRef = await functions.httpsCallable('updateProfilePicture')({
                image: base64image,
            });
            console.log('uploaded, reload to see changes')
            //reload to see changes
            window.location.reload()
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="relative">
            <ProfilePicture className="w-24 h-24 md:w-32 md:h-32 rounded-full border-white border-8 border-solid shadow-lg transform -translate-y-16 mx-1 md:mx-3" uid={profileId} />
            <input ref={profileUpload} type="file" name="file" accept="image/*" onChange={({ target }) => handleUploadProfilePic(target.files[0])} hidden />
            {isUser && <div className="absolute top-0 right-0 text-white transform -translate-y-16 rounded-full bg-gray-800 scale-75">
                <IconButton onClick={e => profileUpload.current.click()}>
                    <EditOutlined className="text-white" />
                </IconButton>
            </div>}
        </div>
    )
}

const UserBannerPicture = ({ profileId, isUser }) => {
    const { user } = useAuth();
    const bannerUpload = useRef();
    
    const handleUploadBannerPic = async (file) => {
        if (!isUser) return;
        try {
            //Upload file to Firebase Storage
            console.log('uploading banner')
            const uploadTask = await storage.ref(`banners/${user.uid}.png`).put(file);
            window.location.reload()
        } catch (e) {
            console.error(e)
        }
    }

    return (<>
        <BannerPicture className="w-full h-32 rounded-xl shadow-md object-cover" uid={profileId} />
        <input ref={bannerUpload} type="file" name="file" accept="image/png" onChange={({ target }) => handleUploadBannerPic(target.files[0])} hidden />
        {isUser && <div className="absolute top-0 right-0 m-1 text-white rounded-full bg-gray-100 transform scale-75">
            <IconButton onClick={e => bannerUpload.current.click()}>
                <EditOutlined />
            </IconButton>
        </div>}
    </>)
}

export default function UserFullProfile({ profileId, isMentor, isUser, userDetails }) {

    const { user } = useAuth();
    const { name, major, school, country, highlight1, highlight2, bio, socials } = userDetails || {};

    const connectWithPerson = async () => {
        if (!user?.uid || !profileId) return;
        try {
            const targetRoomId = await getMessageUserRoom(profileId, user.uid)
            history.push(`/app/messages/${targetRoomId}`)
        } catch (e) {
            console.error(e)
        }
    }


    return <div className="rounded-xl shadow-lg w-full overflow-hidden bg-white relative">
        <UserBannerPicture profileId={profileId} isUser={isUser} />
        <div className="flex flex-row p-3 w-full">
            <UserProfilePicture profileId={profileId} isUser={isUser} />

            <div className="flex flex-col space-y-1 w-full">
                <div className="flex flex-row justify-between">
                    <h1 className="text-2xl text-gray-800">{name}</h1>
                    {/* Show Edit Profile if is User, else show Message User */}
                    {isUser ? <>
                        <div className="hidden md:inline">
                            <Button variant="contained" color="primary">Edit Your Profile</Button>
                        </div>
                        <div className="md:hidden">
                            <IconButton><EditOutlined /></IconButton>
                        </div>
                    </> : <>
                        <div className="hidden md:inline">
                            <Button variant="contained" color="primary" startIcon={<MessageOutlined />} onClick={() => connectWithPerson()}>Message</Button>
                        </div>
                        <div className="md:hidden">
                            <IconButton onClick={() => connectWithPerson()}><MessageOutlined /></IconButton>
                        </div>
                    </>}
                </div>
                <p className="text-gray-600 text-sm">{isMentor ? "Mentor" : major} at {school}</p>
                <p className="text-gray-600 text-sm">{country}</p>
                <div className="flex flex-row items-center my-5 space-x-3">
                    <UserHighlight highlight={highlight1} />
                    <UserHighlight highlight={highlight2} />
                </div>
            </div>
        </div>
    </div>
}