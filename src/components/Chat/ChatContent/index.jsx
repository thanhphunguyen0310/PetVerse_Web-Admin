import "./ChatContent.css";
import { FaImage } from "react-icons/fa";
import { MdEmojiEmotions } from "react-icons/md";
import { RiVideoFill } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { db } from "../../../configs/firebase";
import { collection, query, onSnapshot, orderBy, serverTimestamp, addDoc, doc, writeBatch, } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { useSelector } from "react-redux";
import AvatarIcon from '../../../assets/icons/avatar.png'

dayjs.extend(relativeTime);
dayjs.locale("vi");
const ChatContent = ({ chatId, sender }) => {
    const { userId } = useSelector((state) => state.auth?.user)
    const [emojiPick, setEmojiPick] = useState(false);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const endRef = useRef(null);

    useEffect(() => {
        if (!chatId) return;
        const messagesRef = collection(db, `chats/${chatId}/messages`);
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(msgs);
            // Lọc các tin nhắn chưa đọc và cập nhật `isRead` thành true
            const unreadMessages = msgs.filter(msg => !msg.isRead && msg.senderId !== userId);
            if (unreadMessages.length > 0) {
                const batch = writeBatch(db); // Use `writeBatch` instead of `db.batch()`
                unreadMessages.forEach((msg) => {
                    const msgDoc = doc(db, `chats/${chatId}/messages`, msg.id);
                    batch.update(msgDoc, { isRead: true });
                });
    
                try {
                    await batch.commit(); // Commit the batch
                } catch (error) {
                    console.error("Error updating messages: ", error);
                }
            }
        });
        return () => unsubscribe();
    }, [chatId, userId, db]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessages = async () => {
        if (!text && !image && !video) return;

        try {
            let imageUrl = '';
            let videoUrl = '';

            // Upload image if present
            if (image) {
                const imageRef = ref(getStorage(), `chats/${chatId}/${Date.now()}_${image.name}`);
                const uploadTask = uploadBytesResumable(imageRef, image);
                await uploadTask;
                imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            }

            // Upload video if present
            if (video) {  // Ensure `video` is a valid file
                const videoRef = ref(getStorage(), `chats/${chatId}/${Date.now()}_${video.name}`);
                const uploadTask = uploadBytesResumable(videoRef, video);
                await uploadTask;
                videoUrl = await getDownloadURL(uploadTask.snapshot.ref);
            }
            const message = {
                text: text,
                senderId: userId,
                imageUrl: imageUrl,
                videoUrl: videoUrl,
                timestamp: serverTimestamp(),
                isRead: false,
            };
            await addDoc(collection(db, `chats/${chatId}/messages`), message);
            setText("");
            setImage(null);
            setVideo(null);
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    };
    const handleEmojiClick = (e) => {
        setText((prev) => prev + e.emoji);
        setEmojiPick(false);
    };
    const formatTimestamp = (timestamp) => {
        // Ensure timestamp is valid
        if (!timestamp || !timestamp.seconds) return "Ngày chưa xác định"; // Default fallback text

        const time = dayjs.unix(timestamp.seconds); // Extract seconds from timestamp
        const diffInMinutes = dayjs().diff(time, 'minutes');
        const diffInHours = dayjs().diff(time, 'hours');
        const diffInDays = dayjs().diff(time, 'days');
        // Handle different time ranges
        if (diffInMinutes <= 60) {
            return `${diffInMinutes} phút trước`;
        } else if (diffInHours <= 24) {
            return `${diffInHours} giờ trước`;
        } else if (diffInDays <= 7) {
            return `${diffInDays} ngày trước`;
        } else {
            return time.format('DD/MM/YYYY');
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideo(file); // Store the video file, not a URL object
            if (file.duration > 15) {
                alert("Video không được vượt quá 15 giây!");
            }
        }
    };

    return (
        <div className="chat-content-container">
            <div className="top">
                <div className="user">
                    <img src={sender.avatar || AvatarIcon} alt={sender.fullName} />
                    <div className="texts">
                        <span>{sender.fullName}</span>
                    </div>
                </div>
            </div>
            <div className="center">
                {messages.map((msg) => (
                    <div
                        className={`message ${msg.senderId === sender.id ? "" : "own"}`}
                        key={msg.id}
                    >
                        <div className="texts">
                            {msg.text && <p>{msg.text}</p>}
                            {msg.imageUrl && <img src={msg.imageUrl} alt="img" className="message-image" />}
                            {msg.videoUrl && <video src={msg.videoUrl} controls className="message-video" />}
                            <span>{formatTimestamp(msg.timestamp)}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div ref={endRef}></div>
            <div className="bottom">
                <div className="icons">
                    <label htmlFor="image-upload">
                        <FaImage fontSize={25} className="icon"/>
                    </label>
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="video-upload">
                        <RiVideoFill fontSize={25} className="icon"/>
                    </label>
                    <input
                        type="file"
                        id="video-upload"
                        accept="video/*"
                        onChange={handleVideoChange}
                        style={{ display: 'none' }}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Nhập văn bản..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        // Kiểm tra xem phím nhấn có phải là Enter hay không
                        if (e.key === "Enter") {
                            e.preventDefault(); // Ngăn chặn hành vi mặc định của Enter (để không thêm một dòng mới)
                            sendMessages(); 
                        }
                    }}
                />
                <div className="emoji">
                    <MdEmojiEmotions fontSize={25} className="emoji-icon" onClick={() => setEmojiPick((prev) => !prev)}/>
                    <div className="emoji-picker">
                        {emojiPick && <EmojiPicker onEmojiClick={handleEmojiClick} />}
                    </div>
                </div>
                <button className="send-button" onClick={sendMessages}>Gửi</button>
            </div>
        </div>
    );
};

export default ChatContent;
