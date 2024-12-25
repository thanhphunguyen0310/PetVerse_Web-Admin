import { Menu, Tooltip } from "antd";
import {
  MdDashboard,
  MdAccountCircle,
  MdReport,
  MdPayments,
  MdOutlinePets,
  MdHistory,
  MdVaccines 
} from "react-icons/md";
import { FaPlaceOfWorship } from "react-icons/fa6";
import { BsHearts } from "react-icons/bs";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const adminItems = [
  {
    key: "dashboard",
    icon: <MdDashboard style={{ fontSize: "24px", color: "rgba(76, 175, 80, 0.8)" }} />,
    label: (
      <Tooltip mouseEnterDelay={1} title="Dashboard">
        Dashboard
      </Tooltip>
    ),
    path: "/admin",
  },
  {
    key: "account",
    icon: <MdAccountCircle style={{ fontSize: "24px", color: "rgba(38, 55, 237, 0.8)" }} />,
    label: <Tooltip title="Tài khoản người dùng">Tài khoản</Tooltip>,
    children: [
      {
        key: "user-account",
        label: "Người dùng",
        path: "/admin/user-accounts",
      },
      // {
      //   key: "create-user",
      //   label: "Tạo tài khoản",
      //   path: "/admin/create-accounts",
      // },
    ],
  },
  // {
  //   key: "user-reports",
  //   icon: <MdReport style={{ fontSize: "24px" }} />,
  //   label: <Tooltip title="Báo cáo người dùng">Báo cáo người dùng</Tooltip>,
  //   path: "/admin/user-reports",
  // },
  {
    key: "user-transactions",
    icon: <MdPayments style={{ fontSize: "24px", color:"rgba(3, 128, 17, 0.8)" }} />,
    label: (
      <Tooltip title="Giao dịch và Thanh toán">Giao dịch và Thanh toán</Tooltip>
    ),
    children: [
      {
        key: "transactions",
        label: "Danh sách giao dịch",
        path: "/admin/transactions",
      },
      // {
      //   key: "/pay-salary",
      //   label: "Thanh toán tiền lương",
      //   path: "/admin/pay-salary",
      // },
    ]
  },
  {
    key: "vaccine-recommendation",
    icon: <MdVaccines style={{ fontSize: "24px", color: "rgba(191, 27, 71, 0.8)" }} />,
    label: (
      <Tooltip title="Đề xuất vaccine">
        Đề xuất vaccine
      </Tooltip>
    ),
    children: [
      {
        key: "vaccine-list",
        label: "Danh sách vaccine",
        path: "/admin/vaccine-list",
      },
      {
        key: "add-new-vaccine",
        label: "Thêm mới vaccine",
        path: "/admin/add-new-vaccine",
      },
    ]
  },
  {
    key: "place-recommendation",
    icon: <FaPlaceOfWorship style={{ fontSize: "24px", color: "rgba(14, 235, 224, 0.8)" }} />,
    label: (
      <Tooltip title="Đề xuất khu vui chơi">
        Đề xuất khu vui chơi
      </Tooltip>
    ),
    children: [
      {
        key: "place-list",
        label: "Danh sách khu vui chơi",
        path: "/admin/place-list",
      },
      {
        key: "add-new-place",
        label: "Thêm mới khu vui chơi",
        path: "/admin/add-new-place",
      },
    ]
  },
];
const managerItems = [
  {
    key: "dashboard",
    icon: <MdDashboard style={{ fontSize: "24px", color: "rgba(76, 175, 80, 0.8)" }} />, // Green with 80% opacity
    label: (
      <Tooltip mouseEnterDelay={1} title="Dashboard">
        Dashboard
      </Tooltip>
    ),
    path: "/manager",
  },
  {
    key: "petCenter",
    icon: <MdAccountCircle style={{ fontSize: "24px", color: "rgba(255, 152, 0, 0.8)" }} />, // Orange with 80% opacity
    label: <Tooltip title="Tài khoản trung tâm">Trung tâm</Tooltip>,
    children: [
      {
        key: "listPetCenter",
        label: "Danh sách trung tâm",
        path: "/manager/petcenter-accounts",
      },
      {
        key: "petCenterApplication",
        label: "Đơn đăng ký mới",
        path: "/manager/list-petcenter-application",
      },
    ],
  },
  {
    key: "pet",
    icon: <MdOutlinePets style={{ fontSize: "24px", color: "rgba(33, 150, 243, 0.8)" }} />,
    label: <Tooltip title="Thú cưng">Thú cưng</Tooltip>,
    path: "/manager/pet-accounts",
  },
  {
    key: "breeding",
    icon: <BsHearts style={{ fontSize: "24px", color: "rgba(222, 22, 192, 0.8)" }} />,
    label: <Tooltip title="Phối giống">Phối giống</Tooltip>,
    path: "/manager/pet-breeding",
  },
  {
    key: "appointment",
    icon: <RiCalendarScheduleFill style={{ fontSize: "24px", color: "rgba(27, 27, 209, 0.8)" }} />, 
    label: <Tooltip title="Phối giống">Lịch hẹn</Tooltip>,
    path: "/manager/appointments",
  },
  {
    key: "report",
    icon: <MdReport style={{ fontSize: "24px", color: "rgba(244, 67, 54, 0.8)" }} />, // Red with 80% opacity
    label: <Tooltip title="Báo cáo người dùng">Báo cáo người dùng</Tooltip>,
    children: [
      {
        key: "user-report",
        label: "Báo cáo",
        path: "/manager/manage-report",
      },
      {
        key: "42",
        label: "Chat",
        path: "/manager/chat-reports",
      },
    ],
  },
  {
    key: "historyWork",
    icon: <MdHistory  style={{ fontSize: "24px", color: "rgba(8, 6, 138, 0.8)" }} />,
    label: (
      <Tooltip title="Lịch sử xử lí công việc">
        Lịch sử xử lí công việc
      </Tooltip>
    ),
    children: [
      {
        key: 'DonePetCenterApplication',
        label: "Đăng ký trung tâm",
        path: "/manager/history-pet-center-application",
      },
      {
        key: 'DoneBreedingApplication',
        label: "Đăng ký phối giống",
        path: "/manager/history-breeding-application",
      },
      {
        key: 'DoneUserReport',
        label: "Xử lí báo cáo",
        path: "/manager/history-user-report",
      },
    ],
  },
];

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current path  // Use React Router's navigate function
  const { role: userRole } = useSelector((state) => state.auth);
  const items = userRole == "admin" ? adminItems : managerItems;
  
  let selectedKey = "dashboard"; // Default to dashboard only if no other path matches

  items.forEach((item) => {
    if (location.pathname.startsWith(item.path)) {
      selectedKey = item.key;
    }
    
    if (item.children) {
      item.children.forEach((child) => {
        if (location.pathname.startsWith(child.path)) {
          selectedKey = child.key;
        }
      });
    }
  });
  const onClick = (e) => {
    let selectedItem = items.find((item) => item.key === e.key);
    if (!selectedItem) {
      items.forEach((item) => {
        if (item.children) {
          const childItem = item.children.find((child) => child.key === e.key);
          if (childItem) {
            selectedItem = childItem;
          }
        }
      });
    }
    if (selectedItem && selectedItem.path) {
      navigate(selectedItem.path);
    }
  };
  return (
    <Menu
      style={{ fontSize: "1rem" }}
      onClick={onClick}
      selectedKeys={[selectedKey]}
      mode="inline"
      items={items}
    />
  );
}

export default SideBar;
