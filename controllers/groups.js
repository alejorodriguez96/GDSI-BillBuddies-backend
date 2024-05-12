const { Group, UserGroup } = require('../models/group');
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

module.exports = {
    getGroups,
    getAllGroups,
    createGroup,
    addGroupMember,
    removeGroupMember,
    acceptGroupInvitation,
    getGroupMembers,
};
