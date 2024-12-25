import { Button, Card, Carousel, Descriptions, Divider, Flex, Image, List, Modal, notification, Tooltip, Typography } from 'antd';
import { getBreedBySpecies } from '../../configs/api/species';
import { getUserDetails } from '../../configs/api/user';
import { deletePet } from '../../configs/api/pet';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IoFemale, IoMale } from "react-icons/io5";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"
import "./ModalDetailPet.css"
const ModalDetailPet = ({ pet, setIsEditing, setIsModalVisible, fetchPet }) => {
    const { accessToken } = useSelector((state) => state.auth);
    const [breedName, setBreedName] = useState('');
    const [ownerName, setOwnerName] = useState('');

    useEffect(() => {
        if (!pet) return null
        const fetchDetails = async () => {
            if (pet?.speciesId && pet?.breedId && pet?.userId) {
                try {
                    // Call both APIs simultaneously
                    const [breedResponse, userResponse] = await Promise.all([
                        getBreedBySpecies(accessToken, pet.speciesId, pet.breedId),
                        getUserDetails(accessToken, pet.userId)
                    ]);

                    // Handle breed response
                    if (breedResponse?.isSuccess) {
                        setBreedName(breedResponse.data.name);
                    }

                    // Handle user response
                    if (userResponse?.isSuccess) {
                        setOwnerName(userResponse.data.fullName);
                    }
                } catch (error) {
                    console.error("Error fetching details:", error);
                }
            }
        };

        fetchDetails();
    }, [pet, accessToken]);

    const petImages = pet.petPhotos.filter(photo => photo.type === 0);
    const petVideos = pet.petPhotos.filter(photo => photo.type === 1);

    const handleDeletePet = async (petId) => {
        Modal.confirm({
            title: `Xác nhận xóa thú cưng ${pet.name}`,
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    await deletePet(accessToken, petId);
                    notification.success({
                        message: "Thành công",
                        description: "Xóa thành công",
                        placement: "topRight",
                        duration: 2,
                    });
                    setIsEditing(false);
                    setIsModalVisible(false);
                    fetchPet();
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi khi xóa thú cưng.",
                        placement: "topRight",
                        duration: 2,
                    });
                    console.error("Error updating application:", error);
                }
            },
        });
    }
    return (
        <>
            <Flex className='basic-pet-information' align='center' gap={24}>
                <Image
                    className="pet-image"
                    key={pet.id}
                    src={pet.avatar}
                    alt={pet.name}
                    style={{
                        borderRadius: "50%",
                        border: "1px solid #b8b0b0",
                        objectFit: "cover",
                    }}
                    preview={{
                        mask: <span style={{
                            color: "#fff",
                            padding: "4px 8px",
                            borderRadius: "4px"
                        }}>Xem ảnh</span>
                    }}
                    width={100}
                    height={100}
                />
                <div>
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        {pet.name}
                    </Typography.Title>
                    <Flex vertical>
                        <Typography.Text type="secondary">ID: {pet.id}</Typography.Text>
                        <Typography.Text type="secondary">Chủ nhân: {ownerName}</Typography.Text>
                    </Flex>
                </div>
            </Flex>

            <Divider style={{ margin: '24px 0' }} />

            {/* Pet Details */}
            <Descriptions title="Thông Tin Chi Tiết" bordered column={2} size="middle"
                labelStyle={{ fontWeight: "bold" }}
                contentStyle={{ fontSize: "16px" }}>
                <Descriptions.Item label="Loài">{pet.speciesId === 1 ? "Chó" : "Mèo"}</Descriptions.Item>
                <Descriptions.Item label="Giống">{breedName}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">{pet.birthDate}</Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                    {pet.gender === 1 ? <IoMale style={{ color: "#0314fc", fontSize: "18px" }} /> : <IoFemale style={{ color: "#fc03d3", fontSize: "18px" }} />}
                </Descriptions.Item>
                <Descriptions.Item label="Cân nặng (kg)">{pet.weight}</Descriptions.Item>
                <Descriptions.Item label="Đã triệt sản">
                    {pet.sterilized ? (
                        <CheckOutlined style={{ color: "green" }} />
                    ) : (
                        <CloseOutlined style={{ color: "red" }} />
                    )}
                </Descriptions.Item>
            </Descriptions>

            {/* Additional Details */}
            <Divider style={{ margin: '24px 0' }} />

            <Typography.Title level={4}>Mô tả</Typography.Title>
            <Typography.Paragraph style={{ lineHeight: 1.7 }}>
                {pet.description || 'Không có mô tả.'}
            </Typography.Paragraph>

            {/* Pet Images Carousel */}
            {petImages.length > 0 && (
                <>
                    <Typography.Title level={4}>Hình ảnh của {pet.name}</Typography.Title>
                    <Carousel arrows draggable autoplay>
                        {petImages.map(photo => (
                            <div key={photo.petPhotoId} className="photo-container">
                                <Image
                                    src={photo.url}
                                    alt={`Pet photo ${photo.petPhotoId}`}
                                    style={{ borderRadius: "4px", objectFit: "cover", border: "1px solid #ccc" }}
                                    // style={{ borderRadius: "4px", width:"100px", height:"100px", border: "1px solid #ccc" }}
                                    preview={{
                                        mask: <span style={{
                                            color: "#fff",
                                            padding: "4px 8px",
                                            borderRadius: "4px"
                                        }}>Xem ảnh</span>,
                                    }}
                                />
                            </div>
                        ))}
                    </Carousel>
                    <Divider style={{ margin: '24px 0' }} />
                </>
            )}
            {/* Pet Videos */}
            {petVideos.length > 0 && (
                <>
                    <Typography.Title level={4}>Video của {pet.name}</Typography.Title>
                    <Carousel arrows draggable autoplay>
                        {petVideos.map(video => (
                            <div key={video.petPhotoId} className="video-container" style={{ textAlign: 'center' }}>
                                <video
                                    src={video.url}
                                    controls
                                    style={{ width: '100%', height: "300px", borderRadius: '4px', border: '1px solid #ccc' }}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ))}
                    </Carousel>
                    <Divider style={{ margin: '24px 0' }} />
                </>
            )}
            {/* Vaccination List */}
            {pet.petVaccinateds.length > 0 && (
                <>
                    <Typography.Title level={4}>Tiêm chủng</Typography.Title>
                    <List
                        bordered
                        dataSource={pet.petVaccinateds}
                        renderItem={vaccination => (
                            <List.Item>
                                <Card style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                    <Image
                                        src={vaccination.image}
                                        alt={vaccination.name}
                                        style={{ width: 100, height: 100, borderRadius: "4px", objectFit: "cover", border: "1px solid #ccc" }}
                                        preview={{
                                            mask: (
                                                <Tooltip title="Zoom">
                                                    <span>Xem ảnh</span>
                                                </Tooltip>
                                            ),
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <Typography.Text strong>{vaccination.name}</Typography.Text>
                                        <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
                                            Ngày tiêm: {vaccination.dateVaccinated}
                                        </Typography.Text>
                                    </div>
                                </Card>
                            </List.Item>
                        )}
                    />
                </>
            )}
            <Flex justify='center' gap={12} style={{ marginTop: "12px" }}>
                <Button
                    key="edit"
                    type="primary"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    Chỉnh sửa
                </Button>
                <Button
                    key="delete"
                    type="primary"
                    danger
                    onClick={() => handleDeletePet(pet.id)}>
                    Xóa
                </Button>
            </Flex>
        </>
    );
};

export default ModalDetailPet;
