import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  BellFilled,
  InfoCircleFilled,
} from "@ant-design/icons";
import {
  Button,
  Flex,
  Avatar,
  Dropdown,
  Badge,
  Menu,
  Spin,
} from "antd";
import "./Header.css";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { useEffect, useState } from "react";
import { fetchNotifications, markNotificationAsRead } from "../../services/notification";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi"; // Đổi sang ngôn ngữ tiếng Việt
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);
dayjs.locale("vi");
const items = [
  {
    key: "3",
    label: "Logout",
    icon: <LogoutOutlined />,
  },
];
function Header({ collapsed, setCollapsed }) {
  const { userId, roleName } = useSelector((state) => state.auth?.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [menuNotifications, setMenuNotifications] = useState(false);

  useEffect(() => {
    let unsubscribe = null;

    const fetchData = async () => {
      setLoading(true);
      unsubscribe = await fetchNotifications(userId, (data) => {
        setNotifications(data);
        // console.log(data, "data from firebase")
        setLoading(false);
      });
    };
    fetchData();
    // Cleanup khi component unmount
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Hủy lắng nghe
      }
    };
  }, [userId]);
  // Filter unread notifications (isRead = false)
  const unreadNotifications = notifications.filter(notification => {
    const userIsParticipant = notification.participants[userId];
    return userIsParticipant && !userIsParticipant.isRead;
  });

  const handleNotificatonClick = (reportId, notificationId) => {
    navigate(`/manager/manage-report?reportId=${reportId}`);
    markNotificationAsRead(notificationId, userId); // Truyền đúng notificationId
  };

  // Handle logout
  const handleMenuClick = (e) => {
    if (e.key === "3") { // 3 corresponds to the "Logout" option
      dispatch(logout());
    }
  };
  const renderMenu = () => {
    if (loading) {
      return (
        <Menu style={{ width: "300px" }}>
          <Menu.Item disabled>
            <div style={{ textAlign: "center", padding: "10px" }}>
              <Spin size="small" />
            </div>
          </Menu.Item>
        </Menu>
      );
    }

    if (notifications.length === 0) {
      return (
        <Menu style={{ width: "300px" }}>
          <Menu.Item disabled>
            <div style={{ padding: "10px", textAlign: "center" }}>
              Không có thông báo nào
            </div>
          </Menu.Item>
        </Menu>
      );
    }

    return (
      <Menu style={{ width: "300px", maxHeight: '400px', overflowY: 'auto' }}>
        {notifications
          .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds) // Sort notifications outside map
          .map((notification) => {
            const notificationDate = dayjs.unix(notification.timestamp.seconds);
            const isRecent = dayjs().diff(notificationDate, 'days') <= 3;
            const formattedTime = isRecent
              ? notificationDate.fromNow() // Relative time for notifications within 3 days
              : notificationDate.format('DD/MM/YYYY'); // Exact date for older notifications
            // Kiểm tra trạng thái đã đọc
            const isRead = notification.participants[userId]?.isRead || false;
            return (
              <Menu.Item
                key={notification.id}
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  padding: '10px', // Padding for spacing
                  backgroundColor: isRead ? '#ffffff' : 'rgba(245,245,245,0.5)',
                  transition: 'background-color 0.3s ease',
                }}
                onClick={() => handleNotificatonClick(notification.reportId, notification.id)}
              >
                <Flex align="center" gap={16}>
                  <InfoCircleFilled style={{ color: "#e32012", fontSize: "26px" }} />
                  <div>
                    <div style={{ fontWeight: "bold" }}>{notification.title}</div>
                    <div>{notification.message}</div>
                    <div style={{ fontSize: "12px", color: "gray" }}>
                      {formattedTime} {/* Display the formatted time */}
                    </div>
                  </div>
                </Flex>
              </Menu.Item>
            );
          })}
      </Menu>
    );
  };

  return (
    <div className="site-layout-background">
      <Flex align="center" gap={5} className="header-left">
        {/* Toggle Button */}
        <Button
          className="toggle-button"
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
        {/* <Typography.Title level={2} className="header-title">Dashboard</Typography.Title> */}
      </Flex>
      <Flex align="center" className="header-right">
        {roleName !== "Admin" && (
          <Dropdown
            arrow
            overlay={renderMenu()}
            placement="bottomRight"
            trigger={["click"]}
            open={menuNotifications}
            onOpenChange={(visible) => setMenuNotifications(visible)}
          >
            <Badge
              className="notification"
              showZero
              count={unreadNotifications.length}
              style={{ backgroundColor: "#f5222d" }}
            >
              <BellFilled
                style={{
                  color: "#3D4ED9",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              />
            </Badge>
          </Dropdown>
        )}
        <Dropdown
          menu={{ items, selectable: true, onClick: handleMenuClick }}
          placement="bottomRight"
          trigger={["click"]}
          arrow
        >
          <Avatar
            style={{ marginLeft: "24px", cursor: "pointer" }}
            size="large"
            icon={<UserOutlined />}
            alt="user-avatar"
          />
        </Dropdown>
      </Flex>
    </div>
  );
}

export default Header;
