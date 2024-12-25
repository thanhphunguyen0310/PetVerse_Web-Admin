import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Modal,
  Descriptions,
  Image,
  Table,
  Flex,
  Tag,
  Row,
  Col,
  Input,
  Tooltip,
  Pagination,
  notification,
  Space,
  Checkbox,
} from "antd";
import {
  getApplication,
  getApplicationDetail,
  updateApplication,
} from "../../../../configs/api/application";
import { getRole } from "../../../../configs/api/role";
import "./ManageApplication.css";
import { useSelector } from "react-redux";
const { Title } = Typography;
const { Search } = Input;
const columns = [
  {
    title: "STT",
    key: "index",
    render: (text, record, index) => index + 1, // Auto-generate index starting from 1
    width: 50,
  },
  {
    title: "Hình ảnh",
    dataIndex: "avatar",
    render: (image) => (
      <Flex justify="center">
        <Image
          style={{
            border: "1px solid #b8b0b0",
            borderRadius: "50%", // Makes the image circular
            objectFit: "cover", // Ensures the image covers the area without distortion
          }}
          preview={false}
          width={64}
          height={64}
          src={image}
        />
      </Flex>
    ),
  },
  {
    title: "Họ và tên",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    width: 200
  },
  {
    title: "Số điện thoại",
    dataIndex: "phoneNumber",
  },
  {
    title: "Dịch vụ",
    dataIndex: "applicationPetServices",
    render: (services) => (
      <span >
        {services.map((service, index) => {
          let serviceName = "";
          let color = "";
          // Map the petServiceId to a specific service name and color
          switch (service.petServiceId) {
            case 1:
              serviceName = "Trông thú";
              color = "green";
              break;
            case 2:
              serviceName = "Huấn luyện";
              color = "blue";
              break;
            case 3:
              serviceName = "Dịch vụ spa";
              color = "purple";
              break;
            case 4:
              serviceName = "Bác sĩ thú y";
              color = "red";
              break;
            default:
              serviceName = "Dịch vụ khác";
              color = "gray";
          }

          return (
            <Tag color={color} key={index}>
              {serviceName}
            </Tag>
          );
        })}
      </span>
    ),
    width: 220,
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (status) => {
      let statusText = "";
      let color = "";

      // Map the status to a specific label and color
      switch (status) {
        case 1:
          statusText = "Đang xử lí";
          color = "orange";
          break;
        case 2:
          statusText = "Chấp nhận";
          color = "blue";
          break;
        case -1:
          statusText = "Từ chối";
          color = "red";
          break;
        default:
          statusText = "Không rõ";
          color = "gray";
      }

      return <Tag color={color}>{statusText}</Tag>;
    },
  },
];
function PetCenterApplication() {
  const { accessToken } = useSelector((state) => state?.auth)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [application, setApplication] = useState([]);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApplication = async (page, pageSize, search) => {
    try {
      const response = await getApplication(accessToken, page, pageSize, search, 1);
      setApplication(response.data.items);
      setTotal(response.data.totalCount);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchApplicationDetail = async (applicationId) => {
    try {
      const response = await getApplicationDetail(accessToken, applicationId);
      setSelectedApplication(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchRoleId = async (roleName) => {
    try {
      const response = await getRole();
      const roleList = response.data.items;
      const role = roleList.find((r) => r.name === roleName);
      return role ? role.id : null;
    } catch (error) {
      console.error("Error fetching role ID:", error);
      return null;
    }
  };
  useEffect(() => {
    fetchApplication(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm]);
  const handleRowClick = (record) => {
    fetchApplicationDetail(record.id);
    setIsModalVisible(true); // Show the modal
  };
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedApplication(null);
  };
  const handleAcceptClick = async () => {
    const roleId = await fetchRoleId("PetCenter"); // Fetch roleId of PetCenter
    if (!roleId) {
      console.error("PetCenter role ID is not available.");
      return;
    }
    let verified = false;
    Modal.confirm({
      title: "Xác nhận",
      content: (
        <>
          {selectedApplication ? (
            <p>
              Bạn xác nhận <strong>{selectedApplication.name}</strong> trở thành
              người chăm sóc thú cưng?
            </p>
          ) : null}
          <Space>
            <Checkbox
               onChange={(e) => {
                verified = e.target.checked; // Update the local variable
              }}
            >
              Xác thực
            </Checkbox>
          </Space>
        </>
      ),
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        const id = selectedApplication.id;
        const userId = selectedApplication.userId;
        const status = 2;
        const cancelReason = "";
        try {
          await updateApplication(accessToken, id, userId, roleId, status, cancelReason, verified);
          // Show success notification
          notification.success({
            message: "Thành công",
            description: `${selectedApplication.name} đã trở thành người chăm sóc thú cưng thành công!`,
            placement: "topRight",
            duration: 2,
          });
          setIsModalVisible(false);
          fetchApplication(1, pageSize, searchTerm);
        } catch (error) {
          notification.error({
            message: "Lỗi",
            description: "Đã xảy ra lỗi khi cập nhật đơn đăng ký.",
            placement: "topRight",
            duration: 2,
          });
          console.error("Error updating application:", error);
        }
      },
      onCancel: () => {
        setIsModalVisible(false);
      },
      
    });
  };
  const handleRejectClick = async () => {
    const roleId = await fetchRoleId("Customer"); // Lấy roleId của Customer khi từ chối
    let cancelReason = "";
    Modal.confirm({
      title: "Xác nhận",
      content: (
        <>
          {selectedApplication ? (
            <p>
              Bạn xác nhận từ chối <strong>{selectedApplication.name}</strong>?
            </p>
          ) : null}
          <Input.TextArea
            placeholder="Nhập lý do từ chối"
            onChange={(e) => (cancelReason = e.target.value)}
            rows={4}
            maxLength={200}
          />
        </>
      ),
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        if (roleId) {
          const id = selectedApplication.id;
          const userId = selectedApplication.userId;
          const status = -1;
          try {
            await updateApplication(accessToken, id, userId, roleId, status, cancelReason);
            // Show success notification
            notification.success({
              message: "Thành công",
              description: `${selectedApplication.name} đã bị từ chối!`,
              placement: "topRight",
              duration: 2,
            });
            setIsModalVisible(false);
            fetchApplication(1, pageSize, searchTerm);
          } catch (error) {
            notification.error({
              message: "Lỗi",
              description: "Đã xảy ra lỗi khi cập nhật đơn đăng ký.",
              placement: "topRight",
              duration: 2,
            });
            console.error("Error updating application:", error);
          }
        } else {
          console.error("Role ID is not available.");
        }
        setIsModalVisible(false);
      },
      onCancel: () => { setIsModalVisible(false); },
    });
  };
  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    fetchApplication(page, pageSize, searchTerm);
  };
  // Handle search input
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
    fetchApplication(1, pageSize, value); // Fetch search results
  };
  return (
    <>
      <Flex gap={16} style={{ flexDirection: "column", overflowX: "auto" }}>
        {/* Search bar */}
        <Row>
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm theo tên trung tâm"
              onSearch={handleSearch}
              allowClear
              enterButton
            />
          </Col>
        </Row>
        {/* Table display data */}
        <Table
          columns={columns}
          dataSource={application}
          pagination={false}
          showSorterTooltip={{
            target: "sorter-icon",
          }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
        {/* pagination */}
        <Flex justify="flex-end">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePaginationChange}
          />
        </Flex>
      </Flex>
      {/* Modal for Petsitter Details */}
      <Modal
        title={
          <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
            Chi tiết đơn đăng ký
          </Title>
        }
        width={700}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={
          selectedApplication &&
            (selectedApplication.status === 2 ||
              selectedApplication.status === -1) ? null : (
            <Flex justify="center" gap={12}>
              <Button key="accept" type="primary" onClick={handleAcceptClick}>
                Chấp nhận
              </Button>
              <Button key="reject" type="primary" danger onClick={handleRejectClick}>
                Từ chối
              </Button>
            </Flex>
          )
        }
      >
        {selectedApplication && (
          <Descriptions
            column={1}
            bordered
            labelStyle={{ fontWeight: "bold" }}
            contentStyle={{ fontSize: "16px" }}>
            <Descriptions.Item label="ID">
              {selectedApplication.id}
            </Descriptions.Item>
            <Descriptions.Item className="user-image" label="Hình ảnh">
              <Image
                alt={selectedApplication.name}
                style={{
                  borderRadius: "50%",
                  border: "1px solid #b8b0b0",
                  objectFit: "cover",
                }}
                preview={{
                  mask: <Tooltip title="Zoom"><span style={{
                    color: "#fff",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    padding: "4px 8px",
                    borderRadius: "4px"
                  }}>Xem ảnh</span></Tooltip>
                }}
                width={100}
                height={100}
                src={selectedApplication.avatar}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Tên trung tâm">
              {selectedApplication.name}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedApplication.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {selectedApplication.address}
            </Descriptions.Item>
            <Descriptions.Item label="Chi tiết">
              {selectedApplication.description}
            </Descriptions.Item>
            <Descriptions.Item className="user-certification" label="Chứng nhận">
              <Flex wrap="wrap" gap={16} justify="flex-start">
                {selectedApplication.certifications.map((cert, index) => (
                  <Image
                    key={cert}
                    src={cert}
                    alt={`Chứng nhận ${index + 1}`}
                    preview={{
                      mask: <Tooltip title="Zoom"><span style={{
                        color: "#fff",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        padding: "4px 8px",
                        borderRadius: "4px"
                      }}>Xem ảnh</span></Tooltip>
                    }}
                    style={{
                      border: "1px solid #b8b0b0",
                      maxWidth: "100px",
                      objectFit: "cover",
                      marginBottom: "16px",
                      position: "relative",
                      width: "100px",
                      height: "120px",
                    }}
                  />
                ))}
              </Flex>
            </Descriptions.Item>
            <Descriptions.Item label="Dịch vụ">
              {selectedApplication.applicationPetServices.map((service) => {
                let serviceText = "";
                let color = "";

                // Map the service type to a specific label and color
                switch (service.petServiceId) {
                  case 1: // Pet Care
                    serviceText = "Trông thú";
                    color = "green";
                    break;
                  case 2: // Training
                    serviceText = "Huấn luyện";
                    color = "blue";
                    break;
                  case 3: // Spa Service
                    serviceText = "Dịch vụ spa";
                    color = "purple";
                    break;
                  case 4:
                    serviceText = "Bác sĩ thú y";
                    color = "red";
                    break;
                  default:
                    serviceText = "Dịch vụ không rõ";
                    color = "gray";
                }

                return (
                  <Tag
                    key={service.petServiceId}
                    color={color}
                    style={{ margin: "4px" }}
                  >
                    {serviceText}
                  </Tag>
                );
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {(() => {
                let statusText = "";
                let color = "";

                // Retrieve the status from selectedApplication
                const status = selectedApplication.status;

                // Map the status to a specific label and color
                switch (status) {
                  case 1:
                    statusText = "Đang xử lí";
                    color = "orange";
                    break;
                  case 2:
                    statusText = "Chấp nhận";
                    color = "blue";
                    break;
                  case -1:
                    statusText = "Từ chối";
                    color = "red";
                    break;
                  default:
                    statusText = "Không rõ";
                    color = "gray";
                }

                return <Tag color={color}>{statusText}</Tag>;
              })()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
}

export default PetCenterApplication;
