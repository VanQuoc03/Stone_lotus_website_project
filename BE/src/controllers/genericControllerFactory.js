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
  };
}

module.exports = createController;
