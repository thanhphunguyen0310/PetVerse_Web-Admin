import './ChatList.css'
import AvatarIcon from '../../../../assets/icons/avatar.png'
import { useState, useEffect } from 'react'
import { db } from "../../../../configs/firebase"; // Import Firebase config
import { collection, query, where, onSnapshot, getDocs, orderBy } from "firebase/firestore";
import { useSelector } from 'react-redux'
import { getUserDetails } from '../../../../configs/api/user'
import { Divider } from 'antd';
const ChatList = ({ onSelectChat }) => {
    const { userId } = useSelector((state) => state.auth?.user)
    const [chatList, setChatList] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    const { accessToken } = useSelector((state) => state.auth);
    useEffect(() => {
        const q = query(
            collection(db, "chats"),
            where("participants", "array-contains", userId.toString())
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const chats = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // Extract participant IDs other than the current user
            const senderIds = Array.from(
                new Set(chats.flatMap(chat => chat.participants))
            ).filter(participant => participant !== userId.toString());
            // Fetch details for each participant
            const details = {};
            await Promise.all(
                senderIds.map(async (id) => {
                    const userDetail = await getUserDetails(accessToken, id);
                    details[id] = userDetail.data; 
                })
            );
            setUserDetails(details);

            // Fetch the last message for each chat
            // const updatedChats = await Promise.all(
            //     chats.map(async (chat) => {
            //         const messagesRef = collection(db, `chats/${chat.id}/messages`);
            //         const messagesQuery = query(messagesRef, orderBy("timestamp", "desc"), limit(1));
            //         const messagesSnapshot = await getDocs(messagesQuery);

            //         const lastMessage = messagesSnapshot.docs[0]?.data()?.text || "No messages yet";
            //         return {
            //             ...chat,
            //             lastMessage,
            //         };
            //     })
            // );
            setChatList(chats);
        });
        return () => unsubscribe();
    }, [userId]);
    return (
        <div className='chat-list-container'>
            <Divider />
            {chatList.map((chat) => {
                const senderId = chat.participants.find(id => id !== userId.toString());
                const sender = userDetails[senderId] || {};
                // const lastMessage = chat.messages && chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : "No messages";
                return (
                    <div
                        className="item"
                        key={chat.id}
                        onClick={() =>
                            onSelectChat(chat.id, sender)
                        }
                    >
                        <img src={sender.avatar || AvatarIcon} alt="Avatar" />
                        <div className="texts">
                            <span>{sender.fullName || "Unknown User"}</span>
                            {/* <p>{chat.lastMessage}</p> */}
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default ChatList