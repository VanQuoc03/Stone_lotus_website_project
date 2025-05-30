function createBaseService(model, defaultFilter = {}) {
  return {
    async getWithPagination(skip, limit) {
      const [items, total] = await Promise.all([
        model.find(defaultFilter).skip(skip).limit(limit),
        model.countDocuments(defaultFilter),
      ]);
      return { items, total };
    },
    async getById(id) {
      return await model.findById(id);
    },
    async create(data) {
      const item = new model(data);
      return await item.save();
    },

    async update(id, data) {
      const item = await model.findById(id);
      if (!item) return null;
      Object.assign(item, data);
      return await item.save();
    },

    async delete(id) {
      const result = await model.findByIdAndDelete(id);
      return result !== null;
    },

    async bulkDelete(ids) {
      const result = await model.deleteMany({ _id: { $in: ids } });
      return result.deletedCount;
    },

    async bulkUpdateStatus(ids, status) {
      const result = await model.updateMany(
        { _id: { $in: ids } },
        { $set: { status } }
      );
      return result.modifiedCount;
    },
  };
}

module.exports = createBaseService;
