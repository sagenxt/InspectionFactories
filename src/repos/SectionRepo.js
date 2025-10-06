const { Section } = require('../models');

const SectionRepo = {
  async getSectionsByFormType(formType) {
    return Section.findAll({
      where: { formType },
      order: [['order', 'ASC']],
    });
  },
};

module.exports = SectionRepo;
