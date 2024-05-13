const { Group, BillGroup} = require('../models/group');
const { UserDebts } = require('../models/debts');

async function makeDivision(req, res) {
    const { group_id, mode } = req.body;

    try {
        const group = await Group.findByPk(group_id);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const users = await group.getUsers();
        if (!users) {
            return res.status(404).json({ error: 'there is no user in that group' });
        }

        const billGroups = await BillGroup.findAll({
            where: { GroupId: group_id }, 
            attributes: ['amount'] 
        });

        const amounts = billGroups.map(billGroup => billGroup.amount);
        const totalAmount = amounts.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        const equitativeAmount = totalAmount / users.length;

        if (mode === "equitative") {       

            for (const user of users) {

                const existingUserDebt = await UserDebts.findOne({
                    where: {
                        UserId: user.id,
                        BillGroupId: group_id
                    }
                });

                if (existingUserDebt) {
                    existingUserDebt.amount = equitativeAmount;
                    await existingUserDebt.save();
                } else {
                    await UserDebts.create({
                        amount: equitativeAmount, 
                        UserId: user.id ,
                        BillGroupId : group_id
                    });

                }
            }
        }
              
        res.status(200).json({mode : mode, amount: equitativeAmount});
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

module.exports = {
    makeDivision
};