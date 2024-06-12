const axios = require('axios');

async function authenticateWithPreset() {
    const apiToken = process.env.API_TOKEN;
    const apiSecret = process.env.API_SECRET;
    const response = await axios.post("https://api.app.preset.io/v1/auth/", { name: apiToken, secret: apiSecret });
    return response.data.payload.access_token;
};

const userDashboardTokenPayload = {
    "user": {
        "username": "example_username",
        "first_name": "First",
        "last_name": "Last"
    },
    "resources": [{
        "type": "dashboard",
        "id": "f7264cbc-3ae6-4cd1-a931-8fe050692b42"
    }],
    "rls": []
};

async function getToken(payload) {
    try {
        const accessToken = await authenticateWithPreset();
        const response = await axios.post(
            "https://api.app.preset.io/v1/teams/3d97b21e/workspaces/41860ebc/guest-token/",
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        return response.data.payload.token;
    } catch (error) {
        return error.message;
    }

}

async function getDashboardToken(req, res) {
    try {
        const token = await getToken(userDashboardTokenPayload);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const userSlimDashboardTokenPayload = {
    "user": {
        "username": "example_username",
        "first_name": "First",
        "last_name": "Last"
    },
    "resources": [{
        "type": "dashboard",
        "id": "a31da8a0-9cef-43c7-8515-85169511ade6"
    }],
    "rls": []
};

async function getSlimDashboardToken(req, res) {
    try {
        const token = await getToken(userSlimDashboardTokenPayload);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const groupDashboardTokenPayload = {
    "user": {
        "username": "example_username",
        "first_name": "First",
        "last_name": "Last"
    },
    "resources": [{
        "type": "dashboard",
        "id": "c0f8a3e9-c671-4ac3-9570-c8083e9c803e"
    }],
    "rls": []
};

async function getGroupDashboardToken(req, res) {
    try {
        const token = await getToken(groupDashboardTokenPayload);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    getDashboardToken,
    getSlimDashboardToken,
    getGroupDashboardToken
};
