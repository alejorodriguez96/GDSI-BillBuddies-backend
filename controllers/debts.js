const { Group} = require('../models/group');

async function equitativeDivision(req, res) {
    console.log("ACA ESTAMO");
    // const { group_id } = req.body;

    // try {
    //     const group = await Group.findByPk(group_id);
    //     if (!group) {
    //         throw new Error('Group not found');
    //     }
        
    //     res.status(200).json(group);
    // } catch (error) {
    //     res.status(404).json({ error: error.message });
    // }
}

module.exports = {
    equitativeDivision
};