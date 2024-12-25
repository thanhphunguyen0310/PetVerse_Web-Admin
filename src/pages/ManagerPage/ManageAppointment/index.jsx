import { Col, Flex, Input, Modal, Pagination, Row, Spin, Table, Tag, Tooltip, Typography } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAppointmentDetails, getAppointmetList } from "../../../configs/api/appointment";
import ModalAppointmentDetail from "../../../components/Appointment/ModalAppointmentDetail";
import dayjs from "dayjs";

const { Search } = Input;
const { Title } = Typography;

const ManageAppointment = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [pageSize, setPageSize] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [appointmentList, setAppointmentList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const { accessToken } = useSelector((state) => state.auth);

    // Function to render status as a tag with color
    const renderStatusTag = (status) => {
        let color = "";
        let text = "";

        switch (status) {
            case 0:
                color = "orange";
                text = "Đang xử lí";
                break;
            case 1:
                color = "blue";
                text = "Chấp nhận";
                break;
            case 2:
                color = "green";
                text = "Hoàn thành";
                break;
            case 3:
                color = "red";
                text = "Từ chối";
                break;
            default:
                color = "gray";
                text = "Không rõ";
        }

        return <Tag color={color}>{text}</Tag>;
    };
    const columns = [
        {
            title: "STT",
            key: "index",
            render: (text, record, index) => index + 1, // Auto-generate index starting from 1
            width: 50,
        },
        {
            title: "Khách hàng",
            dataIndex: "userName",
        },
        {
            title: "Trung tâm",
            dataIndex: "centerName",
        },
        {
            title: "Loại dịch vụ",
            dataIndex: "type",
            render: (type) => (type === 0 ? "Dịch vụ" : "Phối giống"),
            filters: [
                { text: 'Dịch vụ', value: 0 },
                { text: 'Phối giống', value: 1 },
            ],
            onFilter: (value, record) => record.type === value,
            filterMultiple: false,
        },
        {
            title: "Tổng tiền",
            dataIndex: "amount",
            render: (amount) => formatPrice(amount),
        },
        {
            title: "Ngày tạo đặt đơn",
            dataIndex: "createdDate",
            render: (createdDate) => {
                const formattedDate = dayjs(createdDate, "DD/MM/YYYY HH:mm");
                return formattedDate.isValid() ? (
                  <Tooltip title={formattedDate.format("HH:mm DD/MM/YYYY")}>
                    {formattedDate.format("HH:mm DD/MM/YYYY")}
                  </Tooltip>
                ) : (
                  "Invalid Date"
                );
              },
              align: "center",
              width: 150,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status) => renderStatusTag(status),
            filters: [
                { text: 'Đang xử lí', value: 0 },
                { text: 'Chấp nhận', value: 1 },
                { text: 'Hoàn thành', value: 2 },
                { text: 'Từ chối', value: 3 },
            ],
            // onFilter: (value, record) => record.status === value,
            onFilter: (value, record) => record.status === value,
        }
    ];
    const fetchAppointmentList = async (page, pageSize, search) => {
        try {
            setIsLoading(true);
            const response = await getAppointmetList(accessToken,page, pageSize, search);
            setAppointmentList(response.data.items);
            setTotal(response.data.totalCount);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchAppointmentList(currentPage, pageSize, searchTerm);
    }, [currentPage, pageSize, searchTerm]);
    
    // Function to handle row click and show modal
    const handleRowClick = async (record) => {
        setIsLoading(true);
        try {
            const appointmentDetail = await getAppointmentDetails(accessToken, record.id, record.type);
            setSelectedAppointment(appointmentDetail.data);
            setIsModalVisible(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleTableChange = (pagination, filters) => {
        const statusFilter = filters.status && filters.status.length > 0 ? filters.status[0] : "";
        setSelectedStatus(statusFilter); 
        setCurrentPage(1); 
    };
    
    // Handle search input
    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
        fetchAppointmentList(1, pageSize, value);
    };
    // Handle pagination change
    const handlePaginationChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        fetchAppointmentList(page, pageSize, searchTerm);
    };
    // Function to handle modal close
    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedAppointment(null);
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
                {/* Table display data */}
                {isLoading ? (
                    <Spin size='large' />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={appointmentList}
                        pagination={false}
                        showSorterTooltip={{
                            target: "sorter-icon",
                        }}
                          onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                          })}
                        onChange={handleTableChange}

                    />
                )}
                {/* Custom Pagination */}
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
                footer={false}
                centered
            >
                <ModalAppointmentDetail appointment={selectedAppointment} isModalVisible={isModalVisible}  />
            </Modal>
        </>
    )
}

export default ManageAppointment
// const appointments = response.data.items;
// // Lấy thông tin chi tiết user và pet center
// const updatedAppointments = await Promise.all(
//     appointments.map(async (appointment) => {
//         const [userResponse, centerResponse] = await Promise.all([
//             getUserDetails(appointment.userId),
//             getPetCenterDetail(appointment.petCenterId),
//         ]);
//         console.log(updatedAppointments)
//         return {
//             ...appointment,
//             userName: userResponse.data.fullName,
//             centerName: centerResponse.data.name,
//         };
//     })
// );
// console.log(updatedAppointments)