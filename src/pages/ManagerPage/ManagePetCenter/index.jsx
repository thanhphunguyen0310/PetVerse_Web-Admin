import {
  Modal,
  Table,
  Input,
  Pagination,
  Row,
  Flex,
  Col,
  Typography,
  Descriptions,
  Button,
  Image,
  Form,
  message,
  Upload,
  Tag,
  Space
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getPetCenter, getPetCenterDetail, updatePetCenter, disablePetCenter } from "../../../configs/api/petCenter";
import { useEffect, useState } from "react";
import "./ManagePetCenter.css";
import { useSelector } from "react-redux";
const { Search } = Input;
const { Title } = Typography;

const serviceColors = {
  "Trông thú": "blue",
  "Dịch vụ spa": "green",
  "Huấn luyện": "purple",
  "Bác sĩ thú y": "red",
};
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
    render: (avatar) => (
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
          src={avatar}
          alt="avatar"
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
  },
  {
    title: "Số điện thoại",
    dataIndex: "phoneNumber",
  },
  {
    title: "Dịch vụ",
    dataIndex: "petCenterServices",
    filters: [
      { text: "Trông thú", value: "Trông thú" },
      { text: "Dịch vụ spa", value: "Dịch vụ spa" },
      { text: "Huấn luyện", value: "Huấn luyện" },
      { text: "Bác sĩ thú y", value: "Bác sĩ thú y" },
    ],
    onFilter: (value, record) => record.petCenterServices.includes(value),
    render: (services) => (
      <>
        {services.map((service) => (
          <Tag style={{ marginBottom: "2px" }} key={service} color={serviceColors[service] || "gray"} >
            {service}
          </Tag>
        ))}
      </>
    ),
    width: 200
  },
];

function ManagePetCenter() {
  const { accessToken } = useSelector((state) => state?.auth)
  const [petsitters, setPetsitters] = useState([]);
  const [selectedPetsitter, setSelectedPetsitter] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditting, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // Fetch petsitter data from API
  const fetchPetCenters = async (page, pageSize, search) => {
    try {
      const response = await getPetCenter(accessToken, page, pageSize, search);
      // Map API response to match Table data structure
      const formattedData = response.data.items.map((petsitter) => ({
        petsitterId: petsitter.id,
        userId: petsitter.userId,
        name: petsitter.name,
        address: petsitter.address,
        phoneNumber: petsitter.phoneNumber,
        avatar: petsitter.avatar,
        petCenterServices: petsitter.petCenterServices,
      }));
      setPetsitters(formattedData);
      setTotal(response.data.totalCount);
    } catch (error) {
      console.error(error);
    }
  };
  // Fetch petsitter detail data from API
  const fetchPetCenterDetails = async (petsitterId) => {
    try {
      const response = await getPetCenterDetail(accessToken, petsitterId);
      setSelectedPetsitter(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPetCenters(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm]);

  // Handle search input
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
    fetchPetCenters(1, pageSize, value); // Fetch search results
  };
  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    fetchPetCenters(page, pageSize, searchTerm);
  };
  // Function to handle row click and show modal
  const handleRowClick = (record) => {
    fetchPetCenterDetails(record.petsitterId);
    setIsModalVisible(true);
  };
  // Function to handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
    setIsEditing(false)
    setSelectedPetsitter(null);
  };
  // Function to toggle edit mode
  const handleEditClick = () => {
    setIsEditing(true);
    form.setFieldsValue({
      name: selectedPetsitter.name,
      address: selectedPetsitter.address,
      phoneNumber: selectedPetsitter.phoneNumber,
      yoe: selectedPetsitter.yoe,
      price: selectedPetsitter.price,
      description: selectedPetsitter.description
    });
  };
  // Function to handle form submission and update the petsitter
  const handleFormSubmit = async (values) => {
    try {
      await updatePetCenter(accessToken, selectedPetsitter.id, values);
      message.success("Thông tin đã được cập nhật!");
      setIsEditing(false);
      setIsModalVisible(false);
      fetchPetCenters(currentPage, pageSize, searchTerm);
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật!");
      console.error(error);
    }
  };
  const deletePetCenter = (userId) => {
    Modal.confirm({
      title: 'Xác nhận vô hiệu hóa trung tâm',
      content: 'Bạn có chắc chắn muốn vô hiệu hóa trung tâm này?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        try {
          await disablePetCenter(accessToken, userId);
          message.success('Vô hiệu hóa trung tâm thành công!');
          setIsModalVisible(false);
          fetchPetCenters(currentPage, pageSize, searchTerm); // Fetch updated user list
        } catch (error) {
          message.error('Failed to disable user!');
        }
      },
    });
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
        {/* Search Bar */}
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
        <Table
          columns={columns}
          dataSource={petsitters}
          pagination={false}
          showSorterTooltip={{
            target: "sorter-icon",
          }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
        {/* Custom Pagination */}
        <Flex justify="flex-end">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePaginationChange}
          />
        </Flex>
      </Flex>

      {/* Modal to display petsitter details */}
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
            {isEditting ? (
              <>
              </>
            ) : (
              <>
                <Button
                  key="edit"
                  type="primary"
                  onClick={handleEditClick}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  key="delete"
                  type="primary"
                  danger
                  onClick={() => deletePetCenter(selectedPetsitter.id)}
                >
                  Xóa
                </Button>
              </>
            )}
          </Flex>
        }
        centered
      >
        {selectedPetsitter && (
          <>
            {isEditting ? (
              <Form
                form={form}
                id="editPetsitterForm"
                layout="vertical"
                onFinish={handleFormSubmit}
                initialValues={{
                  petCenterId: selectedPetsitter.id,
                  name: selectedPetsitter.name,
                  address: selectedPetsitter.address,
                  phoneNumber: selectedPetsitter.phoneNumber,
                  description: selectedPetsitter.description
                }}
              >
                <Form.Item
                  label="Tên trung tâm"
                  name="name"
                  rules={[
                    { max: 50, message: "Tên trung tâm không được quá 50 ký tự!" },
                    {
                      pattern: /^[A-Za-zÀ-ỹ0-9\s]+$/,
                      message: "Tên trung tâm không được chứa ký tự đặc biệt!",
                    },
                  ]}
                >
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
                <Form.Item
                  label="Số điện thoại"
                  name="phoneNumber"
                  rules={[
                    {
                      pattern: /^[0-9]{1,15}$/, // Chỉ chấp nhận số, tối đa 15 số
                      message: "Số điện thoại phải hợp lệ và không vượt quá 15 số!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Địa chỉ"
                  name="address"
                  rules={[
                    { max: 200, message: "Địa chỉ không được quá 200 ký tự!" },
                  ]}>
                  <Input.TextArea />
                </Form.Item>
                <Form.Item
                  label="Mô tả chi tiết"
                  name="description"
                  rules={[
                    { max: 200, message: "Mô tả chi tiết không được quá 200 ký tự!" },
                  ]}>
                  <Input.TextArea />
                </Form.Item>
                <Form.Item>
                  <Flex align="center" justify="center" gap={16}>
                    <Button type="primary" htmlType="submit">
                      Lưu thay đổi
                    </Button>
                    <Button key="cancel" onClick={() => setIsEditing(false)}>
                      Hủy
                    </Button>
                  </Flex>
                </Form.Item>
              </Form>
            ) : (
              <Descriptions
                column={2}
                size="large"
                bordered
                labelStyle={{ fontWeight: "bold" }}
                contentStyle={{ fontSize: "16px" }}
              >
                {/* Basic Information */}
                <Descriptions.Item span={2} label="Mã trung tâm">
                  {selectedPetsitter.id}
                </Descriptions.Item>
                <Descriptions.Item span={2} label="Mã đơn đăng ký">
                  {selectedPetsitter.applicationId}
                </Descriptions.Item>
                <Descriptions.Item className="petCenter-avatar" label="Hình ảnh">
                  <Image
                    alt={selectedPetsitter.name}
                    style={{
                      borderRadius: "50%",
                      border: "1px solid #b8b0b0",
                      objectFit: "cover",
                    }}
                    preview={{
                      mask: <span>Xem ảnh</span>
                    }}
                    width={100}
                    height={100}
                    src={selectedPetsitter.avatar}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Tên trung tâm">
                  {selectedPetsitter.name}
                </Descriptions.Item>
                <Descriptions.Item span={2} label="Địa chỉ">
                  {selectedPetsitter.address || "Không có"}
                </Descriptions.Item>
                <Descriptions.Item span={2} label="Số điện thoại">
                  {selectedPetsitter.phoneNumber || "Không có"}
                </Descriptions.Item>
                <Descriptions.Item span={2} label="Mô tả trung tâm">
                  {selectedPetsitter.description || "Không có"}
                </Descriptions.Item>

                {/* Additional Information */}
                <Descriptions.Item label="Kinh nghiệm">
                  {selectedPetsitter.yoe ? `${selectedPetsitter.yoe} năm` : "Không có"}
                </Descriptions.Item>
                <Descriptions.Item label="Hoàn thành">
                  {selectedPetsitter.numPet || "Không có"}
                </Descriptions.Item>
                <Descriptions.Item label="Loại thú">
                  {selectedPetsitter.species && selectedPetsitter.species.length > 0
                    ? selectedPetsitter.species.join(", ")
                    : "Không có"}
                </Descriptions.Item>
                <Descriptions.Item label="Đánh giá">
                  {selectedPetsitter.rate
                    ? `${Number(selectedPetsitter.rate).toFixed(1)}/5`
                    : "Không có"}
                </Descriptions.Item>
                {/* Pet Center Services */}
                <Descriptions.Item span={2} label="Dịch vụ">
                  {selectedPetsitter.petCenterServices && selectedPetsitter.petCenterServices.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                      {selectedPetsitter.petCenterServices.map((service) => (
                        <div
                          key={service.petCenterServiceId}
                          style={{
                            width: 'calc(50% - 8px)',
                            marginBottom: '16px',
                            boxSizing: 'border-box',
                          }}
                        >
                          <Tag style={{ marginBottom: "2px" }} key={service.petCenterServiceId} color={serviceColors[service.name] || "gray"} >
                            {service.name}
                          </Tag>
                          <br />
                          Giá: {service.price ? formatPrice(service.price) : "Không có"}
                        </div>
                      ))}
                    </div>
                  ) : (
                    "Không có"
                  )}
                </Descriptions.Item>
                {/* Certifications */}
                <Descriptions.Item span={2} label="Chứng chỉ">
                  {selectedPetsitter.certifications && selectedPetsitter.certifications.length > 0 ? (
                    <Space>
                      {selectedPetsitter.certifications.map((cert) => (
                        <Image
                          key={cert.id}
                          width={100}
                          height={100}
                          src={cert.image}
                          style={{ borderRadius: "4px", objectFit: "cover", border: "1px solid #ccc" }}
                          preview={{
                            mask: (
                              <span>Xem ảnh</span>
                            ),
                          }}
                        />
                      ))}
                    </Space>
                  ) : (
                    "Không có"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {selectedPetsitter.isDisabled ? (
                    <Tag color="red">Tạm ngưng</Tag>
                  ) : (
                    <Tag color="#17a2b8 ">Hoạt động</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Xác thực">
                  {selectedPetsitter.isVerified ? (
                    <FaCheckCircle style={{ color: 'green', fontSize: '20px' }} />
                  ) : (
                    <FaTimesCircle style={{ color: 'red', fontSize: '20px' }} />
                  )}
                </Descriptions.Item>
              </Descriptions>
            )}
          </>
        )}
      </Modal>
    </>
  );
}
export default ManagePetCenter;
{/* Rates */ }
//   <Descriptions.Item span={2} label="Chi tiết đánh giá">
//   {selectedPetsitter.rates && selectedPetsitter.rates.length > 0 ? (
//     selectedPetsitter.rates.map((rate) => (
//       <div key={rate.petCenterServiceId} style={{ marginBottom: "8px" }}>
//         <strong>{rate.petServiceName}</strong>: {rate.rate}/5 ({rate.numRate} đánh giá)
//       </div>
//     ))
//   ) : (
//     "Không có"
//   )}
// </Descriptions.Item>