import {
  Col,
  Flex,
  Row,
  Table,
  Input,
  Pagination,
  Tag,
  Modal,
  Typography,
  Button,
  Descriptions,
  Image,
  message,
  Upload,
  Form,
  DatePicker,
  Select
} from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from "react";
import { getUser, getUserDetails, updateUser, disableUser } from "../../../configs/api/user";
import { getPetCenterDetail } from "../../../configs/api/petCenter";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;
// Define role mapping with roleId, name, and tag color
const roleMapping = {
  "aba65e35-22cd-40bf-ec08-08dce517cc10": { name: "Quản lí", color: "blue" },
  "6fa35036-8107-4d7f-ec09-08dce517cc10": { name: "Khách hàng", color: "green" },
  "0913b4e9-0ce2-4a46-ec0a-08dce517cc10": { name: "Trung tâm", color: "purple" },
};
// Generate filters directly from roleMapping object
const roleFilters = Object.entries(roleMapping).map(([roleId, { name }]) => ({
  text: name,
  value: roleId,
}));
const columns = [
  {
    title: "STT",
    key: "index",
    render: (text, record, index) => index + 1, // Auto-generate index starting from 1
    width: 50,
  },
  {
    title: "Hình ảnh",
    key: "avatar",
    render: (text, record) => (
      <Flex justify="center">
        <Image
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: "1px solid #b8b0b0",
            objectFit: "cover",
          }}
          preview={false}
          src={record.avatar || `https://avatar.iran.liara.run/username?username=${record.fullName}`}
        />
      </Flex>
    ),
  },
  {
    title: "Họ và tên",
    dataIndex: "fullName",
    showSorterTooltip: {
      target: "full-header",
    },
    sorter: (a, b) => a.fullName.length - b.fullName.length,
    sortDirections: ["descend"],
  },
  {
    title: "Email",
    dataIndex: "email",
    defaultSortOrder: "descend",
    responsive: ["md"],
    width: 200,
  },
  {
    title: "Số điện thoại",
    dataIndex: "phoneNumber",
    responsive: ["md"],
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    responsive: ["lg"],
    width: 200,
  },
  {
    title: "Vai trò",
    dataIndex: "roleId",
    filters: roleFilters,
    onFilter: (value, record) => record.roleId === value,
    render: (roleId) => {
      const { name, color } = roleMapping[roleId] || {};
      return name ? <Tag color={color}>{name}</Tag> : <Tag>Unknown</Tag>;
    },
    responsive: ["lg"],
  },
];
function ManageAccount() {
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPetCenterVisible, setIsPetCenterVisible] = useState(false);
  const [petCenterDetails, setPetCenterDetails] = useState(null);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const { accessToken } = useSelector((state) => state.auth);

  const fetchUser = async (page, pageSize, search) => {
    try {
      const response = await getUser(accessToken, page, pageSize, search);
      setUser(response.data.items);
      setTotal(response.data.totalCount);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUserDetails = async (userId) => {
    try {
      const response = await getUserDetails(accessToken, userId);
      const userData = response.data;

      // Check if dateOfBirth exists and format it
      if (userData.dateOfBirth) {
        userData.dateOfBirth = dayjs(userData.dateOfBirth, "DD/MM/YYYY");
      }
      setSelectedUser(userData);
      setIsPetCenterVisible(false);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchPetCenterDetails = async (petCenterId) => {
    try {
      const response = await getPetCenterDetail(accessToken, petCenterId);
      setPetCenterDetails(response.data);
      setIsPetCenterVisible(true);
    } catch (error) {
      console.error(error);
    }
  };
  const deleteUser = (userId) => {
    Modal.confirm({
      title: 'Xác nhận xóa tài khoản',
      content: 'Bạn có chắc chắn muốn xóa tài khoản này?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        try {
          await disableUser(accessToken, userId);
          message.success('Xóa tài khoản thành công!');
          setIsModalVisible(false);
          fetchUser(currentPage, pageSize, searchTerm); // Fetch updated user list
        } catch (error) {
          message.error('Failed to disable user!');
        }
      },
    });
  };
  // Handle form submit update user
  const handleFormSubmit = async (values) => {
    try {
      const updatedUserData = {
        ...values,
        dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('DD/MM/YYYY') : '',
      };
      await updateUser(accessToken, selectedUser.id, updatedUserData);
      message.success('Cập nhật thông tin thành công!');
      setIsModalVisible(false);
      form.resetFields();
      setIsEditMode(false);
      fetchUser(1, pageSize, searchTerm);
    } catch (error) {
      message.error('Failed to update user!');
    }
  };

  useEffect(() => {
    fetchUser(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm]);
  // Handle search input
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
    fetchUser(1, pageSize, value); // Fetch search results
  };
  const handleShowPetCenter = () => {
    if (selectedUser && selectedUser.petCenterId) {
      fetchPetCenterDetails(selectedUser.petCenterId);
    }
  };
  const handleRowClick = (record) => {
    fetchUserDetails(record.id);
    setIsModalVisible(true); // Show the modal
  };
  const handleModalClose = () => {
    form.resetFields();
    setIsModalVisible(false);
    setIsEditMode(false);
    setSelectedUser(null);
    setIsPetCenterVisible(false);
  };
  // Filter data to only include Manager, Customer, Doctor and PetCenter roles
  const filteredData = useMemo(
    () =>
      user.filter((d) =>
        Object.keys(roleMapping).includes(d.roleId)
      ),
    [user]
  );
  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    fetchUser(page, pageSize, searchTerm);
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  return (
    <>
      <Flex style={{ flexDirection: "column" }} gap={16}>
        {/* search bar */}
        <Row>
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm theo tên"
              onSearch={handleSearch}
              allowClear
              enterButton
            />
          </Col>
        </Row>
        {/* table data */}
        <Table
          columns={columns}
          dataSource={filteredData}
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
            showSizeChanger={false}
            onChange={handlePaginationChange}
          />
        </Flex>
      </Flex>
      <Modal
        title={
          <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
            Thông tin chi tiết
          </Title>
        }
        width={700}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={
          <Flex justify="center" gap={12}>
            {isEditMode ? (
              <>
              </>
            ) : (
              <>
                <Button
                  key="edit"
                  type="primary"
                  onClick={() => {
                    form.setFieldsValue(selectedUser);
                    setIsPetCenterVisible(false);
                    setIsEditMode(true);
                  }}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  onClick={() => deleteUser(selectedUser.id)}
                  key="delete"
                  type="primary"
                  danger>
                  Xóa
                </Button>
              </>
            )}
          </Flex>
        }
      >
        {selectedUser && (
          isEditMode ? (
            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[
                  { max: 50, message: "Tên trung tâm không được quá 50 ký tự!" },
                  {
                    pattern: /^[A-Za-zÀ-ỹ0-9\s]+$/,
                    message: "Tên trung tâm không được chứa ký tự đặc biệt!",
                  },
                ]}>
                <Input />
              </Form.Item>
              <Flex gap={12} align="center">
                <Form.Item label="Giới tính" name="gender">
                  <Select
                    placeholder="Giới tính"
                    style={{ width: 150 }}
                  >
                    <Option value={1}>Nam</Option>
                    <Option value={2}>Nữ</Option>
                    <Option value={3}>Khác</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      validator: (_, value) => {
                        // Convert to dayjs object to check if date is after today
                        if (value && dayjs(value).isAfter(dayjs())) {
                          return Promise.reject('Ngày sinh không thể lớn hơn hôm nay!');
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  label="Ngày sinh"
                  name="dateOfBirth"
                >
                  <DatePicker
                    disabledDate={(current) => current && current.isAfter(dayjs())}
                    placeholder="Ngày sinh"
                    format={{
                      format: 'DD/MM/YYYY',
                      type: 'mask',
                    }}
                  />
                </Form.Item>
              </Flex>
              <Flex gap={12} align="center">
                <Form.Item
                  label="Số điện thoại"
                  name="phoneNumber"
                  rules={[
                    {
                      pattern: /^[0-9]{1,15}$/, // Chỉ chấp nhận số, tối đa 15 số
                      message: "Số điện thoại phải hợp lệ và không vượt quá 15 số!",
                    },
                  ]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Hình ảnh" name="avatar">
                  <Upload
                    fileList={fileList}
                    beforeUpload={(file) => {
                      const isImage =
                        file.type === "image/png" ||
                        file.type === "image/jpeg" ||
                        file.type === "image/jpg";
                      if (!isImage) {
                        message.error("Chỉ chấp nhận ảnh PNG, JPG, hoặc JPEG!");
                        return Upload.LIST_IGNORE; // Ngăn không cho ảnh không hợp lệ vào fileList
                      }
                      if (fileList.length >= 1) {
                        message.error("Chỉ được chọn 1 ảnh! Vui lòng xóa ảnh hiện tại.");
                        return Upload.LIST_IGNORE;
                      }
                      const imageSize = file.size / 1024 / 1024 < 1;
                      if (!imageSize) {
                        message.error('Ảnh phải nhỏ hơn 1MB!');
                        return Upload.LIST_IGNORE;
                    }
                      setFileList([file]); 
                      form.setFieldsValue({ avatar: file }); 
                      message.success("Ảnh đã được chọn thành công!");
                      return false;
                    }}
                    onRemove={() => {
                      setFileList([]); 
                      form.setFieldsValue({ avatar: null }); 
                      message.info("Ảnh đã bị xóa!");
                    }}
                  >
                    {fileList.length === 0 && (
                      <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                    )}
                  </Upload>
                </Form.Item>
              </Flex>
              <Form.Item label="Địa chỉ" name="address"
                rules={[
                  { max: 200, message: "Địa chỉ không được quá 200 ký tự!" },
                ]}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item>
                <Flex align="center" justify="center" gap={16}>
                  <Button type="primary" htmlType="submit">
                    Lưu thay đổi
                  </Button>
                  <Button key="cancel" onClick={() => setIsEditMode(false)}>
                    Hủy
                  </Button>
                </Flex>
              </Form.Item>
            </Form>
          ) : (
            <>
              <Descriptions
                column={2}
                bordered
                labelStyle={{ fontWeight: "bold" }}
                contentStyle={{ fontSize: "16px" }}
              >
                <Descriptions.Item span={2} label="ID">{selectedUser.id}</Descriptions.Item>
                <Descriptions.Item span={2} className="user-image" label="Hình ảnh">
                  <Image
                    alt={selectedUser.name}
                    style={{
                      borderRadius: "50%",
                      border: "1px solid #b8b0b0",
                      objectFit: "cover",
                    }}
                    preview={{
                      mask: <span style={{
                          color: "#fff",
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          padding: "4px 8px",
                          borderRadius: "4px"
                      }}>Xem ảnh</span>
                  }}
                    width={100}
                    height={100}
                    src={selectedUser.avatar || `https://avatar.iran.liara.run/username?username=${selectedUser.fullName}`}
                  />
                </Descriptions.Item>
                <Descriptions.Item
                  span={2}
                  label={selectedUser.petCenterId ? "Tên trung tâm" : "Họ và tên"}
                >
                  {selectedUser.fullName}
                </Descriptions.Item>
                <Descriptions.Item span={2} label="Email">
                  {selectedUser.email}
                </Descriptions.Item>
                <Descriptions.Item span={2} label="Số điện thoại">
                  {selectedUser.phoneNumber}
                </Descriptions.Item>
                <Descriptions.Item span={2} label="Địa chỉ">
                  {selectedUser.address}
                </Descriptions.Item>
                {selectedUser.roleId !== "0913b4e9-0ce2-4a46-ec0a-08dce517cc10" && ( // Check if the role is not PetCenter
                  <>
                    <Descriptions.Item label="Ngày sinh">
                      {selectedUser.dateOfBirth ? dayjs(selectedUser.dateOfBirth, "DD/MM/YYYY hh:mm:ss A").format("DD/MM/YYYY") : "Chưa cập nhật"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Giới tính">
                      {selectedUser.gender === 1
                        ? "Nam"
                        : selectedUser.gender === 2
                          ? "Nữ"
                          : selectedUser.gender === 3
                            ? "Khác"
                            : "Chưa cập nhật"}
                    </Descriptions.Item>
                  </>
                )}
                <Descriptions.Item span={2} label="Ngày tạo">
                  {selectedUser.createdDate}
                </Descriptions.Item>
                <Descriptions.Item label="Vai trò">
                  <Tag color={roleMapping[selectedUser.roleId].color}>
                    {roleMapping[selectedUser.roleId].name}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
              {/* Show detail of PetCenter button if petCenterId exists */}
              {selectedUser.petCenterId && (
                <Flex justify="flex-end">
                  <a onClick={handleShowPetCenter}>Xem chi tiết trung tâm</a>
                </Flex>
              )}
            </>
          )
        )}

        {isPetCenterVisible && petCenterDetails && (
          <Descriptions
            column={2}
            bordered
            labelStyle={{ fontWeight: "bold" }}
            contentStyle={{ fontSize: "16px" }}
          >
            <Descriptions.Item span={2} label="Mã trung tâm">{petCenterDetails.id}</Descriptions.Item>
            <Descriptions.Item span={2} label="Mã đơn đăng ký">{petCenterDetails.applicationId}</Descriptions.Item>

            {/* Certifications */}
            <Descriptions.Item span={2} label="Chứng chỉ">
              {petCenterDetails.certifications.length > 0 ? (
                petCenterDetails.certifications.map((cert, index) => (
                  <Image
                    key={cert.id}
                    src={cert.image}
                    alt={`Chứng chỉ ${index + 1}`}
                    style={{ borderRadius: "4px", objectFit: "cover", border: "1px solid #ccc", height:"100px" }}
                    width={100}
                    preview={{
                      mask: <span style={{
                          color: "#fff",
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          padding: "4px 8px",
                          borderRadius: "4px"
                      }}>Xem ảnh</span>
                  }}
                  />
                ))
              ) : (
                <span>Không có chứng chỉ</span>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Kinh nghiệm">{petCenterDetails.yoe}</Descriptions.Item>
            <Descriptions.Item label="Số lượng thú">{petCenterDetails.numPet}</Descriptions.Item>
            <Descriptions.Item span={2} label="Mô tả chi tiết">{petCenterDetails.description}</Descriptions.Item>
            <Descriptions.Item label="Đã xác thực">{petCenterDetails.isVerified ? "Có" : "Không"}</Descriptions.Item>
            <Descriptions.Item label="Đánh giá"> {Number(petCenterDetails.rate).toFixed(1)}/5</Descriptions.Item>

            {/* Pet Center Services */}
            <Descriptions.Item label="Dịch vụ">
              {petCenterDetails.petCenterServices.length > 0 ? (
                petCenterDetails.petCenterServices.map((service) => (
                  <div key={service.petCenterServiceId} style={{ marginBottom: 8 }}>
                    <strong>{service.name}</strong> - Giá: {formatPrice(service.price)}
                  </div>
                ))
              ) : (
                <span>Không có dịch vụ</span>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
}

export default ManageAccount;

{/* <Button type="primary" onClick={() => handleFormSubmit(selectedUser)}>
                  Lưu thay đổi
                </Button>
                <Button key="cancel" onClick={() => setIsEditMode(false)}>
                  Hủy
                </Button> */}
