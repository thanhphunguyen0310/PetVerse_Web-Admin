import { useSelector } from "react-redux";
import { updateReport } from "../../configs/api/report"
import { Descriptions, Tag, Image, Tooltip, Divider, Flex, Button, Modal, notification } from "antd";
import { sendNotification } from "../../services/notification"
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const ModalReportDetails = ({ report, setIsModalVisible, fetchReportList }) => {
    const { accessToken } = useSelector((state) => state.auth);
    const { userId: managerId } = useSelector((state) => state.auth?.user);
    if (!report) return null;
    // Map status code to a readable status text
    const getStatusTag = (status) => {
        let statusText = '';
        let color = '';

        switch (status) {
            case 0:
                statusText = 'Đang xử lí';
                color = 'orange';
                break;
            case 1:
                statusText = 'Chấp nhận';
                color = 'blue';
                break;
            case 2:
                statusText = 'Từ chối';
                color = 'red';
                break;
            default:
                statusText = 'Không rõ';
                color = 'gray';
        }

        return <Tag color={color}>{statusText}</Tag>;
    };
    const handleAccept = (reportId, appointmentId, petCenterId, userId, managerId) => {
        // Show confirmation modal for acceptance
        Modal.confirm({
            title: "Xác nhận đã xử lí báo cáo",
            content: "Bạn đã xử lí báo cáo này?",
            okText: "Ok",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    const response = await updateReport(accessToken, reportId, 1); // Update status to '1' for accepted
                    if (response.statusCode === 201) {
                        // Tạo participants
                        const participants = {
                            [userId]: { isRead: false },
                            [petCenterId]: { isRead: false },
                        };
                        // Sắp xếp các participants theo ID
                        const sortedParticipants = Object.keys(participants)
                            .sort((a, b) => a - b) // Sắp xếp ID từ bé đến lớn
                            .reduce((acc, key) => {
                                acc[key] = participants[key];
                                return acc;
                            }, {});
                        // Gọi hàm sendNotification
                        await sendNotification({
                            appointmentId: appointmentId,
                            message: "Báo cáo đã được giải quyết",
                            participants: sortedParticipants,
                            reportId,
                            senderId: managerId,
                            status: 2,
                            title: "Phản hồi báo cáo",
                        });
                        notification.success({
                            message: "Thành công",
                            description: "Báo cáo đã được xử lí thành công.",
                            placement: "topRight",
                            duration: 2,
                        });
                        setIsModalVisible(false);
                        fetchReportList();
                    } else {
                        throw new Error("Failed to update report");
                    }
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi khi cập nhật báo cáo.",
                        placement: "topRight",
                        duration: 2,
                    });
                    console.error("Error updating application:", error);
                }
            },
        });
    };
    const handleReject = (reportId, appointmentId, petCenterId, userId, managerId) => {
        Modal.confirm({
            title: "Xác nhận từ chối báo cáo",
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    const response = await updateReport(accessToken, reportId, 2); // Update status to '2' for rejected
                    if (response.statusCode === 201) {
                        // Tạo participants
                        const participants = {
                            [userId]: { isRead: false },
                            [petCenterId]: { isRead: false },
                        };
                        // Sắp xếp các participants theo ID
                        const sortedParticipants = Object.keys(participants)
                            .sort((a, b) => a - b) // Sắp xếp ID từ bé đến lớn
                            .reduce((acc, key) => {
                                acc[key] = participants[key];
                                return acc;
                            }, {});
                        // Gọi hàm sendNotification
                        await sendNotification({
                            appointmentId: appointmentId,
                            message: "Báo cáo đã được giải quyết",
                            participants: sortedParticipants,
                            reportId,
                            senderId: managerId,
                            status: 2,
                            title: "Phản hồi báo cáo",
                        });
                        notification.success({
                            message: "Thành công",
                            description: "Báo cáo đã bị từ chối.",
                            placement: "topRight",
                            duration: 2,
                        });
                        setIsModalVisible(false);
                        fetchReportList();
                    } else {
                        throw new Error("Failed to reject report");
                    }
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi khi cập nhật báo cáo.",
                        placement: "topRight",
                        duration: 2,
                    });
                    console.error("Error updating report:", error);
                }
            },
        });
    };
    return (
        <>
            <Descriptions
                bordered
                column={1}
                size="large"
                labelStyle={{ fontWeight: "bold", width: "150px", whiteSpace: "nowrap" }}
                contentStyle={{ fontSize: "16px", minWidth: "100px" }}>
                <Descriptions.Item label="ID">{report.id}</Descriptions.Item>
                <Descriptions.Item label="Mã lịch hẹn">{report.appointmentId}</Descriptions.Item>
                {report?.appointmentStatus === 2 && (
                    <Descriptions.Item label="Ngày hoàn thành">
                        {report.completedDate || "Chưa hoàn thành"}
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="Tiêu đề">{report.title}</Descriptions.Item>
                <Descriptions.Item label="Lý do">{report.reason}</Descriptions.Item>
                <Descriptions.Item label="Ngày tạo báo cáo">
                    {report.createdDate}
                </Descriptions.Item>
                {report.updatedDate ? (
                    <Descriptions.Item label="Ngày cập nhật">
                        {report.updatedDate}
                    </Descriptions.Item>
                ) : null}
                <Descriptions.Item label="Hình ảnh">
                    {report.reportImages && report.reportImages.length > 0 ? (
                        report.reportImages.filter(media => media.type === 0).length > 0 ? (
                            <Image.PreviewGroup>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {report.reportImages.filter(media => media.type === 0).map((img, index) => (
                                        <Image
                                            key={img.id || index}
                                            src={img.url}
                                            preview={{
                                                mask: (
                                                    <Tooltip title="Zoom">
                                                        Xem ảnh
                                                    </Tooltip>
                                                )
                                            }}
                                            alt={`Hình ảnh báo cáo ${index + 1}`}
                                            width={120}
                                            style={{ height: 120, objectFit: 'cover', borderRadius: "4px", border: "1px solid #81818a" }}
                                        />
                                    ))}
                                </div>
                            </Image.PreviewGroup>
                        ) : (
                            <p>Không có hình ảnh</p>
                        )
                    ) : (
                        <p>Không có hình ảnh</p>
                    )}
                </Descriptions.Item>

                <Descriptions.Item label="Video">
                    {report.reportImages && report.reportImages.length > 0 ? (
                        report.reportImages.filter(media => media.type === 1).length > 0 ? (
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                                {report.reportImages.filter(media => media.type === 1).map((media, index) => (
                                    <div key={media.id || index} style={{ width: 180, height: 180 }}>
                                        <video width="100%" height="180" controls>
                                            <source src={media.url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Không có video</p>
                        )
                    ) : (
                        <p>Không có video</p>
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">{getStatusTag(report.status)}</Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* Button to edit the breeding details */}
            {report.status === 1 || report.status === 2 ? null :
                <Flex justify='center' align='center' gap={12} style={{ marginTop: "12px" }}>
                    <Button type="primary" danger
                        onClick={() => handleAccept(report.id, report.appointmentId, report.petCenterId, report.userId, managerId)}
                    >
                        Xử phạt
                    </Button>
                    <Button type="dashed" danger
                        onClick={() => handleReject(report.id, report.appointmentId, report.petCenterId, report.userId, managerId)}
                    >
                        Từ chối
                    </Button>
                </Flex>
            }

        </>
    )
}

export default ModalReportDetails