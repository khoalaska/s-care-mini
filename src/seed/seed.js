import bcrypt from "bcrypt";

import { sequelize } from "../config/database.js";

import Role from "../models/Role.js";
import User from "../models/User.js";
import Apartment from "../models/Apartment.js";
import Request from "../models/Request.js";
import RequestHistory from "../models/RequestHistory.js";
import RequestImage from "../models/RequestImage.js";
import Notification from "../models/Notification.js";


const seed = async () => {

    try {

        console.log("Starting seed...");

        // =========================================================
        // BƯỚC 1: Đồng bộ database
        // =========================================================

        await sequelize.sync({ alter: true });

        console.log("Database sync successful.");


        // =========================================================
        // BƯỚC 2: Xóa dữ liệu cũ
        // =========================================================

        // Xóa theo thứ tự từ bảng phụ -> bảng cha
        await Notification.destroy({ where: {} });
        await RequestImage.destroy({ where: {} });
        await RequestHistory.destroy({ where: {} });
        await Request.destroy({ where: {} });
        await User.destroy({ where: {} });
        await Apartment.destroy({ where: {} });
        await Role.destroy({ where: {} });

        console.log("Old data cleared.");


        // =========================================================
        // BƯỚC 3: Tạo Role
        // =========================================================

        const managerRole = await Role.create({
            name: "MANAGER"
        });

        const technicianRole = await Role.create({
            name: "TECHNICIAN"
        });

        const residentRole = await Role.create({
            name: "RESIDENT"
        });

        console.log("Roles created.");


        // =========================================================
        // BƯỚC 4: Tạo Apartment
        // =========================================================

        const apartments = await Apartment.bulkCreate([
            {
                code: "A101",
                floor: 1,
                area: 65.5,
                status: "OCCUPIED"
            },
            {
                code: "A102",
                floor: 1,
                area: 70.0,
                status: "OCCUPIED"
            },
            {
                code: "A103",
                floor: 1,
                area: 55.5,
                status: "OCCUPIED"
            },
            {
                code: "A201",
                floor: 2,
                area: 68.0,
                status: "OCCUPIED"
            },
            {
                code: "A202",
                floor: 2,
                area: 72.5,
                status: "OCCUPIED"
            },
            {
                code: "A203",
                floor: 2,
                area: 60.0,
                status: "OCCUPIED"
            },
            {
                code: "A301",
                floor: 3,
                area: 75.0,
                status: "OCCUPIED"
            },
            {
                code: "A302",
                floor: 3,
                area: 80.0,
                status: "VACANT"
            },
            {
                code: "A401",
                floor: 4,
                area: 90.0,
                status: "OCCUPIED"
            },
            {
                code: "A402",
                floor: 4,
                area: 85.0,
                status: "VACANT"
            }
        ]);

        console.log("Apartments created.");


        // =========================================================
        // BƯỚC 5: Hash password dùng cho seed
        // =========================================================

        const hashedPassword = await bcrypt.hash("123456", 10);


        // =========================================================
        // BƯỚC 6: Tạo Manager
        // =========================================================

        const manager = await User.create({
            phone_number: "0900000001",
            password: hashedPassword,
            full_name: "Building Manager",
            role_id: managerRole.id,
            apartment_id: null
        });


        // =========================================================
        // BƯỚC 7: Tạo 2 Technician
        // =========================================================

        const technician1 = await User.create({
            phone_number: "0900000002",
            password: hashedPassword,
            full_name: "Technician One",
            role_id: technicianRole.id,
            apartment_id: null
        });

        const technician2 = await User.create({
            phone_number: "0900000003",
            password: hashedPassword,
            full_name: "Technician Two",
            role_id: technicianRole.id,
            apartment_id: null
        });


        // =========================================================
        // BƯỚC 8: Tạo 5 Resident
        // =========================================================

        const residents = await User.bulkCreate([
            {
                phone_number: "0900000004",
                password: hashedPassword,
                full_name: "Resident One",
                role_id: residentRole.id,
                apartment_id: apartments[0].id
            },
            {
                phone_number: "0900000005",
                password: hashedPassword,
                full_name: "Resident Two",
                role_id: residentRole.id,
                apartment_id: apartments[1].id
            },
            {
                phone_number: "0900000006",
                password: hashedPassword,
                full_name: "Resident Three",
                role_id: residentRole.id,
                apartment_id: apartments[2].id
            },
            {
                phone_number: "0900000007",
                password: hashedPassword,
                full_name: "Resident Four",
                role_id: residentRole.id,
                apartment_id: apartments[3].id
            },
            {
                phone_number: "0900000008",
                password: hashedPassword,
                full_name: "Resident Five",
                role_id: residentRole.id,
                apartment_id: apartments[4].id
            }
        ]);

        console.log("Users created.");


        // =========================================================
        // BƯỚC 9: Tạo 20 Request
        // =========================================================

        const now = new Date();

        const requests = await Request.bulkCreate([

            // -------------------------
            // NEW - 4 requests
            // -------------------------

            {
                type: "ELECTRIC",
                description: "Đèn hành lang tầng 1 bị hỏng.",
                priority: "HIGH",
                status: "NEW",
                is_overdue: false,
                created_at: new Date(now.getTime() - 1 * 60 * 60 * 1000),
                created_by: residents[0].id,
                assigned_to: null
            },

            {
                type: "WATER",
                description: "Vòi nước trong phòng tắm bị rò rỉ.",
                priority: "MEDIUM",
                status: "NEW",
                is_overdue: false,
                created_at: new Date(now.getTime() - 3 * 60 * 60 * 1000),
                created_by: residents[1].id,
                assigned_to: null
            },

            {
                type: "CLEANING",
                description: "Khu vực hành lang cần được vệ sinh.",
                priority: "LOW",
                status: "NEW",
                is_overdue: false,
                created_at: new Date(now.getTime() - 5 * 60 * 60 * 1000),
                created_by: residents[2].id,
                assigned_to: null
            },

            {
                type: "SECURITY",
                description: "Camera tại tầng 2 không hoạt động.",
                priority: "HIGH",
                status: "NEW",
                is_overdue: false,
                created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
                created_by: residents[3].id,
                assigned_to: null
            },


            // -------------------------
            // ASSIGNED - 4 requests
            // -------------------------

            {
                type: "ELECTRIC",
                description: "Ổ điện trong phòng khách không hoạt động.",
                priority: "HIGH",
                status: "ASSIGNED",
                is_overdue: false,
                created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
                created_by: residents[4].id,
                assigned_to: technician1.id
            },

            {
                type: "WATER",
                description: "Áp lực nước trong căn hộ thấp.",
                priority: "MEDIUM",
                status: "ASSIGNED",
                is_overdue: false,
                created_at: new Date(now.getTime() - 8 * 60 * 60 * 1000),
                created_by: residents[0].id,
                assigned_to: technician2.id
            },

            {
                type: "CLEANING",
                description: "Cần vệ sinh khu vực thang máy.",
                priority: "LOW",
                status: "ASSIGNED",
                is_overdue: false,
                created_at: new Date(now.getTime() - 12 * 60 * 60 * 1000),
                created_by: residents[1].id,
                assigned_to: technician1.id
            },

            {
                type: "OTHER",
                description: "Cửa ra vào tầng 3 đóng mở khó khăn.",
                priority: "MEDIUM",
                status: "ASSIGNED",
                is_overdue: false,
                created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000),
                created_by: residents[2].id,
                assigned_to: technician2.id
            },


            // -------------------------
            // IN_PROGRESS - 4 requests
            // -------------------------

            {
                type: "ELECTRIC",
                description: "Điện trong phòng ngủ chập chờn.",
                priority: "HIGH",
                status: "IN_PROGRESS",
                is_overdue: false,
                created_at: new Date(now.getTime() - 3 * 60 * 60 * 1000),
                created_by: residents[3].id,
                assigned_to: technician1.id
            },

            {
                type: "WATER",
                description: "Đường ống nước dưới bồn rửa bị rò.",
                priority: "MEDIUM",
                status: "IN_PROGRESS",
                is_overdue: false,
                created_at: new Date(now.getTime() - 10 * 60 * 60 * 1000),
                created_by: residents[4].id,
                assigned_to: technician2.id
            },

            {
                type: "SECURITY",
                description: "Khóa cửa tầng 1 bị lỗi.",
                priority: "HIGH",
                status: "IN_PROGRESS",
                is_overdue: false,
                created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
                created_by: residents[0].id,
                assigned_to: technician1.id
            },

            {
                type: "CLEANING",
                description: "Sảnh tầng 2 cần xử lý vệ sinh.",
                priority: "LOW",
                status: "IN_PROGRESS",
                is_overdue: false,
                created_at: new Date(now.getTime() - 20 * 60 * 60 * 1000),
                created_by: residents[1].id,
                assigned_to: technician2.id
            },


            // -------------------------
            // DONE - 4 requests
            // -------------------------

            {
                type: "ELECTRIC",
                description: "Thay bóng đèn tại hành lang tầng 4.",
                priority: "MEDIUM",
                status: "DONE",
                is_overdue: false,
                created_at: new Date(now.getTime() - 30 * 60 * 60 * 1000),
                created_by: residents[2].id,
                assigned_to: technician1.id
            },

            {
                type: "WATER",
                description: "Sửa vòi nước tại căn hộ A102.",
                priority: "HIGH",
                status: "DONE",
                is_overdue: false,
                created_at: new Date(now.getTime() - 8 * 60 * 60 * 1000),
                created_by: residents[3].id,
                assigned_to: technician2.id
            },

            {
                type: "CLEANING",
                description: "Vệ sinh khu vực tầng 3.",
                priority: "LOW",
                status: "DONE",
                is_overdue: false,
                created_at: new Date(now.getTime() - 40 * 60 * 60 * 1000),
                created_by: residents[4].id,
                assigned_to: technician1.id
            },

            {
                type: "SECURITY",
                description: "Kiểm tra camera tầng 1.",
                priority: "HIGH",
                status: "DONE",
                is_overdue: false,
                created_at: new Date(now.getTime() - 12 * 60 * 60 * 1000),
                created_by: residents[0].id,
                assigned_to: technician2.id
            },


            // -------------------------
            // CLOSED - 2 requests
            // -------------------------

            {
                type: "OTHER",
                description: "Xử lý yêu cầu kiểm tra cửa sổ.",
                priority: "LOW",
                status: "CLOSED",
                is_overdue: false,
                created_at: new Date(now.getTime() - 72 * 60 * 60 * 1000),
                created_by: residents[1].id,
                assigned_to: technician1.id
            },

            {
                type: "ELECTRIC",
                description: "Sửa công tắc điện trong phòng khách.",
                priority: "MEDIUM",
                status: "CLOSED",
                is_overdue: false,
                created_at: new Date(now.getTime() - 48 * 60 * 60 * 1000),
                created_by: residents[2].id,
                assigned_to: technician2.id
            },


            // -------------------------
            // REJECTED - 1 request
            // -------------------------

            {
                type: "OTHER",
                description: "Yêu cầu thay đổi thiết kế ban công.",
                priority: "LOW",
                status: "REJECTED",
                is_overdue: false,
                created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000),
                created_by: residents[3].id,
                assigned_to: null
            },


            // -------------------------
            // CANCELLED - 1 request
            // -------------------------

            {
                type: "CLEANING",
                description: "Đăng ký vệ sinh nhưng cư dân đã hủy yêu cầu.",
                priority: "LOW",
                status: "CANCELLED",
                is_overdue: false,
                created_at: new Date(now.getTime() - 5 * 60 * 60 * 1000),
                created_by: residents[4].id,
                assigned_to: null
            }

        ]);

        console.log(`${requests.length} requests created.`);


        // =========================================================
        // BƯỚC 10: Tạo RequestHistory
        // =========================================================

        // Seed history cơ bản cho các request đã qua trạng thái.
        const histories = [];

        for (const request of requests) {

            if (request.status === "ASSIGNED") {

                histories.push({
                    request_id: request.id,
                    updated_by: manager.id,
                    old_status: "NEW",
                    new_status: "ASSIGNED",
                    note: "Manager phân công technician."
                });

            }

            if (request.status === "IN_PROGRESS") {

                histories.push(
                    {
                        request_id: request.id,
                        updated_by: manager.id,
                        old_status: "NEW",
                        new_status: "ASSIGNED",
                        note: "Manager phân công technician."
                    },
                    {
                        request_id: request.id,
                        updated_by: request.assigned_to,
                        old_status: "ASSIGNED",
                        new_status: "IN_PROGRESS",
                        note: "Technician bắt đầu xử lý."
                    }
                );

            }

            if (request.status === "DONE") {

                histories.push(
                    {
                        request_id: request.id,
                        updated_by: manager.id,
                        old_status: "NEW",
                        new_status: "ASSIGNED",
                        note: "Manager phân công technician."
                    },
                    {
                        request_id: request.id,
                        updated_by: request.assigned_to,
                        old_status: "ASSIGNED",
                        new_status: "IN_PROGRESS",
                        note: "Technician bắt đầu xử lý."
                    },
                    {
                        request_id: request.id,
                        updated_by: request.assigned_to,
                        old_status: "IN_PROGRESS",
                        new_status: "DONE",
                        note: "Technician hoàn thành xử lý."
                    }
                );

            }

            if (request.status === "CLOSED") {

                histories.push(
                    {
                        request_id: request.id,
                        updated_by: manager.id,
                        old_status: "NEW",
                        new_status: "ASSIGNED",
                        note: "Manager phân công technician."
                    },
                    {
                        request_id: request.id,
                        updated_by: request.assigned_to,
                        old_status: "ASSIGNED",
                        new_status: "IN_PROGRESS",
                        note: "Technician bắt đầu xử lý."
                    },
                    {
                        request_id: request.id,
                        updated_by: request.assigned_to,
                        old_status: "IN_PROGRESS",
                        new_status: "DONE",
                        note: "Technician hoàn thành xử lý."
                    },
                    {
                        request_id: request.id,
                        updated_by: residents.find(
                            resident => resident.id === request.created_by
                        ).id,
                        old_status: "DONE",
                        new_status: "CLOSED",
                        note: "Resident xác nhận đã xử lý xong."
                    }
                );

            }

            if (request.status === "REJECTED") {

                histories.push({
                    request_id: request.id,
                    updated_by: manager.id,
                    old_status: "NEW",
                    new_status: "REJECTED",
                    note: "Yêu cầu không thuộc phạm vi xử lý."
                });

            }

            if (request.status === "CANCELLED") {

                histories.push({
                    request_id: request.id,
                    updated_by: request.created_by,
                    old_status: "NEW",
                    new_status: "CANCELLED",
                    note: "Resident tự hủy yêu cầu."
                });

            }
        }

        await RequestHistory.bulkCreate(histories);

        console.log(`${histories.length} request histories created.`);


        // =========================================================
        // BƯỚC 11: Tạo một vài RequestImage mẫu
        // =========================================================

        await RequestImage.bulkCreate([
            {
                request_id: requests[0].id,
                image_url: "https://example.com/images/electric-1.jpg"
            },
            {
                request_id: requests[1].id,
                image_url: "https://example.com/images/water-1.jpg"
            },
            {
                request_id: requests[4].id,
                image_url: "https://example.com/images/electric-2.jpg"
            }
        ]);

        console.log("Request images created.");


        // =========================================================
        // BƯỚC 12: Tạo Notification mẫu
        // =========================================================

        // Notification chỉ cần minh họa dữ liệu.
        // A6 sau này sẽ chịu trách nhiệm tự động tạo notification
        // khi request quá hạn.

        await Notification.create({
            request_id: requests[8].id
        });

        console.log("Notification created.");


        // =========================================================
        // BƯỚC 13: Hoàn tất
        // =========================================================

        console.log("Seed completed successfully.");

    } catch (error) {

        console.error("Seed failed:");
        console.error(error);

    } finally {

        // Đóng kết nối database
        await sequelize.close();

        console.log("Database connection closed.");
    }
};


seed();