const SectionRepo = require('../repos/SectionRepo');

// Get sections by formType
exports.getSectionsByFormType = async (req, res) => {
  try {
    const { formType } = req.query;
    if (!formType) {
      return res.status(400).json({ error: 'formType query parameter is required.' });
    }
    const sections = await SectionRepo.getSectionsByFormType(formType);
    return res.json(sections);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch sections.' });
  }
};
