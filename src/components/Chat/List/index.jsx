import './List.css'
import ChatList from './ChatList'
import UserInfo from './UserInfo'

const List = ({ onSelectChat }) => {
  return (
    <div className='list-container'>
        <UserInfo />
        <ChatList onSelectChat={onSelectChat}/>
    </div>
  )
}

export default List