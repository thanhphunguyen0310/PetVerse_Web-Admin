import './UserInfo.css'
import AvatarIcon from '../../../../assets/icons/avatar.png'
import { getUserDetails } from '../../../../configs/api/user'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const UserInfo = () => {
  const [user, setUser] = useState("");
  const { userId } = useSelector((state) => state.auth?.user)
  const { accessToken } = useSelector((state) => state.auth); 
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getUserDetails(accessToken, userId);
        setUser(response.data); 
      } catch (error) {
        console.log(error); 
      }
    };

    if (userId) {
      fetchUserDetails(); 
    }
  }, [userId]); 

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className='userInfo-container'>
        <div className="user">
            <img src={user.avatar || AvatarIcon} alt='avatar'/>
            <h2>{user.fullName}</h2>
        </div>
    </div>
  )
}

export default UserInfo