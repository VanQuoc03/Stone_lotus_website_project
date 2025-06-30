function createController(service, entityName = "item") {
  return {
    getPaginated: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { items, total } = await service.getWithPagination(skip, limit);
        res.json({
          data: items,
          total,
          page,
          totalPage: Math.ceil(total / limit),
        });
      } catch (error) {
        res.status(500).json({ message: `Lỗi khi lấy ${entityName}` });
      }
    },
    getById: async (req, res) => {
      try {
        const item = await service.getById(req.params.id);
        if (!item)
          return res
            .status(404)
            .json({ message: `${entityName} không tồn tại` });
        res.json(item);
      } catch (error) {
        res.status(500).json({ message: `Lỗi khi lấy ${entityName}` });
      }
    },
    getMe: async (req, res) => {
      try {
        const user = await service.getById(req.user.id);
        if (!user)
          return res.status(404).json({ message: "Người dùng không tồn tại" });

        const userObj = user.toObject();
        userObj.hasPassword = !!user.password;

        res.json(userObj);
      } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng" });
      }
    },
    updateMe: async (req, res) => {
      try {
        const updated = await service.update(req.user.id, req.body);
        if (!updated)
          return res.status(404).json({ message: "Người dùng không tồn tại" });
        res.json(updated);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Lỗi khi cập nhật thông tin người dùng" });
      }
    },
    create: async (req, res) => {
      try {
        const created = await service.create(req.body);
        res.status(201).json(created);
      } catch (error) {
        res.status(500).json({ message: `Lỗi khi tạo ${entityName}` });
      }
    },
    update: async (req, res) => {
      try {
        const updated = await service.update(req.params.id, req.body);
        if (!updated)
          return res
            .status(404)
            .json({ message: `${entityName} không tồn tại` });
        res.json(updated);
      } catch (error) {
        res.status(500).json({ message: `Lỗi khi cập nhật ${entityName}` });
      }
    },
    delete: async (req, res) => {
      try {
        const deleted = await service.delete(req.params.id);
        if (!deleted)
          res.status(404).json({ message: `${entityName} không tồn tại` });
        res.json({ message: `Xóa ${entityName} thành công!` });
      } catch (error) {
        res.status(500).json({ message: `Lỗi khi xóa ${entityName}` });
      }
    },
    bulkDelete: async (req, res) => {
      try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
          return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
        }
        const deleted = await service.bulkDelete(ids);
        res.json({ deleted });
      } catch (error) {
        res.status(500).json({ message: `Lỗi khi xóa ${entityName}` });
      }
    },
    bulkUpdateStatus: async (req, res) => {
      try {
        const { ids, status } = req.body;
        const updated = await service.bulkUpdateStatus(ids, status);
        res.json({ updated });
      } catch (error) {
        res.status(500).json({ message: `Lỗi khi cập nhật ${entityName}` });
      }
    },
    changePassword: async (req, res) => {
      try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
          return res
            .status(400)
            .json({ message: "Vui lòng nhập đầy đủ thông tin" });
        }
        const user = await service.getById(req.user.id);
        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        const isMath = await service.comparePassword(
          currentPassword,
          user.password
        );
        if (!isMath) {
          return res
            .status(400)
            .json({ message: "Mật khẩu hiện tại không đúng" });
        }
        const updated = await service.updatePassword(req.user.id, newPassword);
        res.json({ message: "Đổi mật khẩu thành công", user: updated });
      } catch (error) {
        res.status(500).json({ message: "Lỗi khi lưu mật khẩu" });
      }
    },
    setPassword: async (req, res) => {
      try {
        const { newPassword } = req.body;
        if (!newPassword) {
          return res
            .status(400)
            .json({ message: "Vui lòng nhập mật khẩu mới" });
        }
        const user = await service.getById(req.user.id);
        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        if (user.password && user.password.length > 0) {
          return res.status(400).json({
            message:
              "Tài khoản đã có mật khẩu. Vui lòng đổi mật khẩu thay vì đặt mới",
          });
        }

        const updated = await service.updatePassword(req.user.id, newPassword);
        res.json({ message: "Thiết lập mật khẩu thành công", user: updated });
      } catch (error) {
        res.status(500).json({ message: "Lỗi khi thiết lập mật khẩu" });
      }
    },
  };
}

module.exports = createController;
