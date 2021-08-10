import { useAuth } from "../../../hooks/useAuth"
import ProfilePicture from "../../User/ProfilePicture";

const UserSmallProfileCard = () => {
    const { userDetails, user } = useAuth();
    const { name , major, school, highlight1, highlight2 } = userDetails || {};
    return <div className="p-3 m-2 shadow-lg rounded-md bg-gray-50 bg-opacity-90">
        <div className="flex flex-row space-x-2 items-center">
            <ProfilePicture uid={user?.uid} alt="user" className="w-28 h-28 rounded-full border-white border-8 border-solid shadow-lg"/>
            <div className="space-y-1 ">
                <h3 className="font-medium">{name}</h3>
                <p className="text-md text-gray-600">{major} @ {school}</p>
            </div>
        </div>
        <div className="mt-5 mb-6">
            <h3 className="font-medium text-gray-600">Your Highlights</h3>
            <div className="flex flex-row items-center mt-3">
                <div className="w-1/6 p-3 text-center text-2xl bg-white rounded-xl flex justify-center items-center shadow-md mr-2">{highlight1?.emoji}</div>
                <span className="w-1/3 text-sm text-gray-500">{highlight1?.description}</span>
                <span className="w-1/6 p-3 text-center text-2xl bg-white rounded-xl flex justify-center items-center shadow-md mx-2">{highlight2?.emoji}</span>
                <span className="w-1/3 text-sm text-gray-500">{highlight2?.description}</span>
            </div>
        </div>

    </div>
}

export default UserSmallProfileCard