const { Group, UserGroup, Payments} = require('../models/group');
const { Debts } = require('../models/debts');
const { Bill } = require('../models/bills');
const { User } = require('../models/user');
const { InviteNotification } = require('../models/notification');

async function getGroups(req, res) {
    const { id } = req.params;

    try {
        const group = await Group.findByPk(id);
        if (!group) {
            throw new Error('Group not found');
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

async function getAllGroups(req, res) {
    const { user } = req;

    try {
        const groups = await user.getGroups();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createGroup(req, res) {
    const { name } = req.body;

    try {
        const group = await Group.create({ name });
        group.addUser(req.user, { through: { accepted: true } });
        await group.save();
        res.status(201).json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function addGroupMember(req, res) {
    const { id } = req.params;
    const { user } = req;
    const { userId } = req.body;

    try {
        const group = await Group.findByPk(id);
        if (!group) {
            throw new Error('Group not found');
        }
        const integrant = await User.findByPk(userId);
        if (!integrant) {
            throw new Error('User not found');
        }
        await group.addUser(integrant);
        await group.save();
        await new InviteNotification(user, group, integrant).save();

        res.status(201).json(group);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

async function removeGroupMember(req, res) {
    const { id } = req.params;
    const { email } = req.body;

    try {
        const group = await Group.findByPk(id);
        if (!group) {
            throw new Error('Group not found');
        }
        const integrant = await User.findOne({ where: { email } });
        if (!integrant) {
            throw new Error('User not found');
        }
        group.removeUser(integrant);
        await group.save();

        res.status(201).json(group);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

async function acceptGroupInvitation(req, res) {
    const { id } = req.params;
    const { user } = req;

    try {
        const group = await Group.findByPk(id);
        if (!group) {
            throw new Error('Group not found');
        }
        const accepted = req.body.accept;
        if (!accepted) {
            throw new Error('Invalid request');
        }
        const userGroup = await UserGroup.findOne({ where: { GroupId: group.id, UserId: user.id } });
        if (!userGroup) {
            throw new Error('User not found in group');
        }
        userGroup.accepted = accepted;
        userGroup.rejected = !accepted;
        await userGroup.save();

        res.status(201).json(group);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

async function getGroupMembers(req, res) {
    const { id } = req.params;

    try {
        const group = await Group.findByPk(id);
        if (!group) {
            throw new Error('Group not found');
        }
        const members = await group.getUsers();
        res.status(200).json(members); 
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

async function getGroupBills(req, res) {
    const { id } = req.params;
    try {
        const selectedGroup = await Group.findByPk(id);

        if (!selectedGroup) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const users = await selectedGroup.getUsers();
        if (!users) {
            return res.status(404).json({ error: 'there is no user in that group' });
        }

        const payments = await Bill.findAll({
            where: { GroupId: id }, 
            attributes: ['UserId', 'amount'] 
        });

        const userIds = payments.map(payment => payment.UserId);

        const userNames = {};
        users.forEach(user => {
            if (userIds.includes(user.id)) {
                userNames[user.id] = {
                    first_name: user.first_name,
                    last_name: user.last_name
                };
            }
        });

        const userPayments = payments.map(payment => ({
            first_name: userNames[payment.UserId] ? userNames[payment.UserId].first_name : 'Unknown',
            last_name: userNames[payment.UserId] ? userNames[payment.UserId].last_name : 'Unknown',
            amount: payment.amount
        }));
        
        res.status(200).json(userPayments);

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

async function addPaymentToGroup(req, res) {
    const { group_id, bill_amount, user_id_owner, mode} = req.body;

    try {
        const selectedGroup = await Group.findByPk(group_id);
        if (!selectedGroup) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const userGroupOwner = await UserGroup.findOne({
            where: {
                GroupId: selectedGroup.id,
                UserId: user_id_owner
            }
        });
    
        if (!userGroupOwner) {
            return res.status(404).json({ error: 'UserGroup not found' });
        }

        const users = await selectedGroup.getUsers();
        if (!users) {
            return res.status(404).json({ error: 'there is no user in that group' });
        }

        if (mode === "equitative") {
            const equitativeAmount = bill_amount / users.length;
            for (const user of users) {
                if (user.id == user_id_owner) {

                    await Bill.create({
                        amount: bill_amount,
                        UserId: user_id_owner,
                        GroupId: group_id
                    });

                } else {

                    await Debts.create({
                        amount: equitativeAmount, 
                        userFromId: user.id ,
                        userToId : user_id_owner,
                        groupId: group_id
                    });

                }
            }
        }

        res.status(201).json({ success: true });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}


module.exports = {
    getGroups,
    getAllGroups,
    createGroup,
    addGroupMember,
    removeGroupMember,
    acceptGroupInvitation,
    getGroupMembers,
    getGroupBills,
    addPaymentToGroup
};
