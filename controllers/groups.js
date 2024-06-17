const { Group, UserGroup , findUserGroupOwner, findGroupById, getUsersInGroup } = require('../models/group');
const { Debts } = require('../models/debts');
const { Bill } = require('../models/bills');
const { User, findUserById } = require('../models/user');
const { Category, findCategoryById, setDefaultCategories } = require('../models/category');
const { InviteNotification, DebtNotification } = require('../models/notification');
const { UserConfig } = require('../models/user_configs');

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
        const sortedGroups = groups.sort((group1, group2) => group2.UserGroup.favorite - group1.UserGroup.favorite);
        res.status(200).json(sortedGroups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createGroup(req, res) {
    const { name } = req.body;

    try {
        const group = await Group.create({ name });
        group.addUser(req.user, { through: { accepted: true } });
        await setDefaultCategories(group);
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
        const notificationConfig = await UserConfig.findOne({ where: { UserId: integrant.id, config_key: "allowNotifications" } });
        const showNotification = notificationConfig ? notificationConfig.config_value === 'true' : true;
        const emailNotificactionConfig = await UserConfig.findOne({ where: { UserId: integrant.id, config_key: "allowEmailNotifications" } });
        const sendEmail = emailNotificactionConfig ? emailNotificactionConfig.config_value === 'true' : true;
        const notif = new InviteNotification(user, group, integrant, sendEmail);
        if (showNotification) {
            await notif.save();
        }
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

async function setGroupAsFavorite(req, res) {
    const { id } = req.params;
    const { user } = req;

    try {
        const group = await Group.findByPk(id);
        if (!group) {
            throw new Error('Group not found');
        }
        const userGroup = await UserGroup.findOne({ where: { GroupId: group.id, UserId: user.id } });
        if (!userGroup) {
            throw new Error('User not found in group');
        }
        userGroup.favorite = !userGroup.favorite;
        await userGroup.save();

        res.status(200).json(group);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

async function getGroupCategories(req, res) {
    const { id } = req.params;
    try {
        const selectedGroup = await Group.findByPk(id);

        if (!selectedGroup) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const categories = await selectedGroup.getCategories();

        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function addCategoryToGroup(req, res) {
    const { id } = req.params;
    const { name, icon, color } = req.body;

    try {
        const selectedGroup = await Group.findByPk(id);
        if (!selectedGroup) {
            return res.status(404).json({ error: 'Group not found' });
        }
        const category = await Category.create({ name, icon, color });
        await category.save();
        await selectedGroup.addCategory(category);
        await selectedGroup.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getGroupBills(req, res) {
    const { id } = req.params;
    try {
        const selectedGroup = await Group.findByPk(id);

        if (!selectedGroup) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const bills = await Bill.findAll({
            where: { GroupId: id },
            include: [
                { model: User },
                { model: Category }
            ]
        });
        const returnData = bills.map(bill => ({
            first_name: bill.User.first_name,
            last_name: bill.User.last_name,
            amount: bill.amount,
            paidOff: bill.paidOff,
            category: bill.Category,
            createdAt: bill.createdAt,
            isInInstallments: bill.isInInstallments,
            installment: bill.installment,
            totalInstallments: bill.totalInstallments
        }));
        let response = [];
        for (let i = 0; i < returnData.length; i++) {
            const bill = returnData[i];
            const billDate = new Date(bill.createdAt);
            const installment = bill.isInInstallments ? bill.installment : 1;
            const auxDate = new Date(billDate + (installment - 1) * 30 * 24 * 60 * 60 * 1000);
            const show = new Date() >= auxDate;
            if (bill.isInInstallments && !show){
                continue;
            }
            console.log(auxDate);
            console.log(new Date());
            response.push(bill);
        }
        
        res.status(200).json(response);

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

async function addBillToGroup(req, res) {
    const { group_id, bill_amount, mode, category_id, debts_list, installments } = req.body;
    const { user } = req;
    const user_id_owner = user.id;

    try {
        const selectedGroup = await findGroupById(group_id);
        await findUserGroupOwner(selectedGroup.id, user_id_owner);
        const users = await getUsersInGroup(selectedGroup);
        const debtsToPay = users.length - 1;
        const category = await findCategoryById(category_id);
        const userToPay = await findUserById(user_id_owner);

        if (installments && installments > 1) {
            const installmentAmount = bill_amount / installments;
            for (let i = 1; i <= installments; i++) {
                await handleBillCreation(mode, users, debts_list, installmentAmount, debtsToPay, user_id_owner, group_id, category, userToPay, selectedGroup, i, installments);
            }
        } else {
            await handleBillCreation(mode, users, debts_list, bill_amount, debtsToPay, user_id_owner, group_id, category, userToPay, selectedGroup);
        }
        

        res.status(201).json({ success: true });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

async function handleBillCreation(mode, users, debts_list, bill_amount, debtsToPay, user_id_owner, group_id, category, userToPay, selectedGroup, installment = 1, totalInstallments = 1) {
    if (mode === "equitative") {
        await handleEquitativeMode(users, bill_amount, debtsToPay, user_id_owner, group_id, category, userToPay, selectedGroup, installment, totalInstallments);
    } else if (mode === "fixed" && debts_list) {
        await handleFixedMode(debts_list, bill_amount, debtsToPay, user_id_owner, group_id, category, userToPay, selectedGroup, installment, totalInstallments);
    } else if (mode === "percentage" && debts_list) {
        await handlePercentageMode(debts_list, bill_amount, debtsToPay, user_id_owner, group_id, category, userToPay, selectedGroup, installment, totalInstallments);
    } else {
        throw new Error('Invalid mode');
    }
}

async function handleEquitativeMode(users, bill_amount, debtsToPay, user_id_owner, group_id, category, userToPay, selectedGroup, installment = 1, totalInstallments = 1) {
    const bill = await Bill.create({
        amount: bill_amount,
        pendingDebts: debtsToPay,
        UserId: user_id_owner,
        GroupId: group_id,
        installment,
        totalInstallments,
        isInInstallments: totalInstallments > 1
    });
    await bill.setCategory(category);
    await bill.save();
    const sendNotification = installment <= 1;
    const equitativeAmount = bill_amount / users.length;
    for (const user of users) {
        if (user.id !== user_id_owner) {
            await Debts.create({
                amount: equitativeAmount,
                userFromId: user.id,
                userToId: user_id_owner,
                groupId: group_id,
                billId: bill.id,
            });
            if (sendNotification) {
                await handleDebtNotification(userToPay, equitativeAmount, selectedGroup, user);
            }
        }
    }
}

async function handleFixedMode(debts_list, bill_amount, debtsToPay, user_id_owner, group_id, category, userToPay, selectedGroup, installment = 1, totalInstallments = 1) {

    const totalDebtsAmount = debts_list.reduce((sum, debt) => sum + debt.amount, 0);

    const ownerDebt = debts_list.find(debt => debt.id === user_id_owner);
    if (ownerDebt) {
        if (totalDebtsAmount !== bill_amount) {
            throw new Error('The sum of debts_list amounts must be equal to bill_amount.');
        }
    } else {
        if (totalDebtsAmount > bill_amount) {
            throw new Error('The sum of debts_list amounts cannot exceed bill_amount.');
        }
    }

    const bill = await Bill.create({
        amount: bill_amount,
        pendingDebts: debtsToPay,
        UserId: user_id_owner,
        GroupId: group_id,
        installment,
        totalInstallments,
        isInInstallments: totalInstallments > 1
    });
    await bill.setCategory(category);
    await bill.save();
    const sendNotification = installment <= 1;
    for (const { id, amount } of debts_list) {
        if (id !==  user_id_owner) {
            await Debts.create({
                amount,
                userFromId: id,
                userToId: user_id_owner,
                groupId: group_id,
                billId: bill.id,
            });
    
            const userFrom = await findUserById(id);
            if (sendNotification) {
                await handleDebtNotification(userToPay, amount, selectedGroup, userFrom);
            }
        }        
    }
}

async function handleDebtNotification(userToPay, amount, selectedGroup, userFrom) {
    const notificationConfig = await UserConfig.findOne({ where: { UserId: userFrom.id, config_key: "allowNotifications" } });
    const showNotification = notificationConfig ? notificationConfig.config_value === 'true' : true;
    const emailNotificactionConfig = await UserConfig.findOne({ where: { UserId: userFrom.id, config_key: "allowEmailNotifications" } });
    const sendEmail = emailNotificactionConfig ? emailNotificactionConfig.config_value === 'true' : true;
    const notif = new DebtNotification(userToPay, amount, selectedGroup, userFrom, sendEmail);
    if (showNotification) {
        await notif.save();
    }
}

async function handlePercentageMode(debts_list, bill_amount, debtsToPay, user_id_owner, group_id, category, userToPay, selectedGroup, installment = 1, totalInstallments = 1) {

    const totalPercentageDebtsAmount = debts_list.reduce((sum, debt) => sum + debt.amount, 0);

    const ownerDebt = debts_list.find(debt => debt.id === user_id_owner);
    if (ownerDebt) {
        if (totalPercentageDebtsAmount !== 100) {
            throw new Error('The sum of debts_list amounts must be equal to 100% with the owner');
        }
    } else {
        if (totalPercentageDebtsAmount > 100) {
            throw new Error('The sum of the debts_list percentages cannot exceed 100%');
        }
    }

    const bill = await Bill.create({
        amount: bill_amount,
        pendingDebts: debtsToPay,
        UserId: user_id_owner,
        GroupId: group_id,
        installment,
        totalInstallments,
        isInInstallments: totalInstallments > 1
    });
    await bill.setCategory(category);
    await bill.save();
    const sendNotification = installment <= 1;
    for (const { id, amount } of debts_list) {
        if (id !==  user_id_owner) {
            total_amount  = bill_amount * amount / 100;

            await Debts.create({
                amount: total_amount,
                userFromId: id,
                userToId: user_id_owner,
                groupId: group_id,
                billId: bill.id
            });
    
            const userFrom = await findUserById(id);
            if (sendNotification) {
                await handleDebtNotification(userToPay, total_amount, selectedGroup, userFrom);
            }
        }        
    }
}


async function getAllDebts(req, res) {

    const { groupId } = req.params; 

    try {
        const selectedGroup = await Group.findByPk(groupId);
        if (!selectedGroup) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const debts = await Debts.findAll({
            where: {
                pending: true,
                groupId: groupId
            },
            include: [
                { model: User, as: 'UserFrom', attributes: ['id', 'first_name', 'last_name'] }, // Ajusta los atributos según lo que necesites
                { model: User, as: 'UserTo', attributes: ['id', 'first_name', 'last_name'] }    // Ajusta los atributos según lo que necesites
            ]
        });

        const result = debts.map(debt => ({
            userFromId: debt.userFromId,
            userToId: debt.userToId,
            amountDebt: debt.amount - debt.amountPaid,
            debtId: debt.id,
        }));
    
        res.status(200).json(result);

    } catch (error) {
        res.status(404).json({ error: error.message });
    }


    console.log(groupId)
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
    addBillToGroup,
    getAllDebts,
    setGroupAsFavorite,
    getGroupCategories,
    addCategoryToGroup
};
