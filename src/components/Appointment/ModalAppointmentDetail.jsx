import { Descriptions, Divider, Flex, Image, Tag } from 'antd';
import { CheckOutlined, CloseOutlined, CheckCircleOutlined } from "@ant-design/icons"
import { useSelector } from 'react-redux';
import { getPetService } from '../../configs/api/petService'
import { getPetCenterServiceDetails } from '../../configs/api/petCenterService';
import { getPetBreedingDetails } from '../../configs/api/breeding';
import { getBreedBySpecies } from '../../configs/api/species';
import { useEffect, useState } from 'react';

const ModalAppointmentDetail = ({ appointment, isModalVisible }) => {
    const { accessToken } = useSelector((state) => state.auth);
    const [petServiceName, setPetServiceName] = useState("");
    const [breedingDetails, setBreedingDetails] = useState(null);
    const [petBreedName, setPetBreedName] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                if (isModalVisible) {
                    // type 0 la cac dich vu
                    if (appointment?.type === 0 && appointment?.petCenterServiceId) {
                        const petCenterService = await getPetCenterServiceDetails(
                            accessToken,
                            appointment.petCenterServiceId
                        );
                        const petServiceId = petCenterService.data.petServiceId;

                        const petServiceResponse = await getPetService(accessToken);
                        const services = petServiceResponse.data.items;

                        const matchedService = services.find((service) => service.id === petServiceId);
                        setPetServiceName(matchedService ? matchedService.name : "Service not found");
                        //type 1 la phoi giong
                    } else if (appointment?.type === 1 && appointment?.centerBreedId) {
                        const breedDetailsResponse = await getPetBreedingDetails(accessToken, appointment.centerBreedId);
                        const breedData = breedDetailsResponse.data;
                        setBreedingDetails(breedData && breedDetailsResponse.isSuccess ? breedData : null);
                    }
                    // lay ra ten loai
                    if (appointment?.speciesId && appointment?.pet?.breedId) {
                        const breedResponse = await getBreedBySpecies(accessToken, appointment.speciesId, appointment.pet.breedId);
                        const breeds = breedResponse.data;

                        if (breeds && breedResponse.isSuccess && breeds.id === appointment.pet.breedId) {
                            setPetBreedName(breeds.name);
                        } else {
                            setPetBreedName("Breed not found");
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching details:", error);
                if (appointment?.type === 0) setPetServiceName("Error fetching service");
                if (appointment?.type === 1) setBreedingDetails(null);
                setPetBreedName("Error fetching breed");
            }
        };

        fetchDetails();
    }, [isModalVisible, appointment, accessToken]);
    // useEffect(() => {
    //     console.log(appointment, "chi tiết")
    // })
    if (!appointment) return null;

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
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };
    return (
        <>
            {/* Thông tin đặt lịch */}
            <h3>Thông tin lịch hẹn</h3>
            <Descriptions
                bordered
                size="large"
                column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }}
                labelStyle={{ fontWeight: "bold", width: "150px", whiteSpace: "nowrap" }}
                contentStyle={{ fontSize: "16px", minWidth: "120px" }}
            >
                <Descriptions.Item span={2} label="Mã lịch hẹn">
                    {appointment.id}
                </Descriptions.Item>
                <Descriptions.Item label="Tên khách hàng">
                    {appointment.userName}
                </Descriptions.Item>
                <Descriptions.Item label="Trung tâm">
                    {appointment.centerName}
                </Descriptions.Item>
                <Descriptions.Item label="Loại hình">
                    {appointment.type === 0 ? "Dịch vụ" : "Phối giống"}
                </Descriptions.Item>
                <Descriptions.Item label="Tên dịch vụ">
                    {appointment.type === 0 ? petServiceName : "Phối giống"}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian">
                    {appointment.startTime} <br /> {appointment.endTime}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                    {appointment.createdDate}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày chỉnh sửa">
                    {appointment.updatedDate ? appointment.updatedDate : "Chưa chỉnh sửa"}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">
                    <strong>{formatPrice(appointment.amount)}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    {renderStatusTag(appointment.status)}
                </Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* Thông tin thú cưng */}
            <h3>Thông tin thú cưng</h3>
            <Descriptions
                bordered column={2}
                size="large"
                labelStyle={{ fontWeight: "bold", width: "150px", whiteSpace: "nowrap" }}
                contentStyle={{ fontSize: "16px", minWidth: "100px" }}>
                <Descriptions.Item span={2} label="Hình ảnh">
                    <Image
                        src={appointment.pet.avatar}
                        alt={appointment.pet.name}
                        width={120}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="Tên thú cưng">
                    {appointment.pet.name}
                </Descriptions.Item>
                <Descriptions.Item label="Giống">
                    {petBreedName}
                </Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                    {appointment.pet.gender === 1 ? "Đực" : "Cái"}
                </Descriptions.Item>
                <Descriptions.Item label="Cân nặng">
                    {appointment.pet.weight} kg
                </Descriptions.Item>
                <Descriptions.Item label="Triệt sản">
                    {appointment.pet.sterilized ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả">
                    {appointment.pet.description}
                </Descriptions.Item>
            </Descriptions>
            <Divider />
            {/* Thông tin phối giống (only for type = 1) */}
            {appointment.type === 1 && breedingDetails && (
                <>
                    <h3>Thông tin phối giống</h3>
                    <Descriptions
                        bordered
                        column={1}
                        size="large"
                        labelStyle={{ fontWeight: "bold", width: "150px", whiteSpace: "nowrap" }}
                        contentStyle={{ fontSize: "16px", minWidth: "100px" }}>
                        <Descriptions.Item label="Loài">
                            {breedingDetails.speciesName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên">
                            {breedingDetails.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mô tả">
                            {breedingDetails.description}
                        </Descriptions.Item>
                        {breedingDetails.images && breedingDetails.images.length > 0 ? (
                            <Descriptions.Item label="Hình ảnh">
                                <Flex gap={8}>
                                    {breedingDetails.images.map((imageObj, index) => (
                                        <Image
                                            key={index}
                                            src={imageObj.image} // Lấy URL từ thuộc tính 'image'
                                            alt={breedingDetails.name}
                                            width={120}
                                            style={{ height: "120px", border: "1px solid #737478", borderRadius: "4px" }}
                                        />
                                    ))}
                                </Flex>
                            </Descriptions.Item>
                        ) : (
                            <Descriptions.Item label="Hình ảnh">
                                <p>Không có ảnh nào để hiển thị.</p>
                            </Descriptions.Item>
                        )}

                    </Descriptions>
                </>
            )}

            <Divider />
            {/* Lịch trình */}
            <h3>Lịch trình</h3>
            {appointment.schedules && appointment.schedules.length > 0 ? (
                appointment.schedules.map((schedule, index) => (
                    <div key={index}>
                        <h4>Ngày: {schedule.date}</h4>
                        <Descriptions
                            bordered
                            column={2}
                            size="large"
                            labelStyle={{ fontWeight: "bold", width: "150px", whiteSpace: "nowrap" }}
                            contentStyle={{ fontSize: "16px", minWidth: "100px" }}
                        >
                            {schedule.records && schedule.records.length > 0 ? (
                                schedule.records.map((record, recordIndex) => {
                                    const hasTracking = record.trackings && record.trackings.length > 0;

                                    return (
                                        <Descriptions.Item
                                            key={recordIndex}
                                            label={
                                                <>
                                                    <p style={{
                                                        color: hasTracking ? "#048a23" : "inherit", // Highlight rows with tracking
                                                    }}>{record.time}</p>
                                                </>
                                            }
                                        >
                                            <div>
                                                <span>{record.description}</span>
                                                {hasTracking && (
                                                    <CheckCircleOutlined
                                                        style={{ color: "green", marginLeft: "10px" }}
                                                    />
                                                )}
                                            </div>
                                        </Descriptions.Item>
                                    );
                                })
                            ) : (
                                <Descriptions.Item label="Ghi chú">Không có lịch trình</Descriptions.Item>
                            )}
                        </Descriptions>
                    </div>
                ))
            ) : (
                <p>Không có lịch trình nào được cung cấp.</p>
            )}
        </>
    )
}

export default ModalAppointmentDetail