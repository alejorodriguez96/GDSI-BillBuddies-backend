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
        "id": "7e19c962-4757-4cae-ac78-4d426263a441"
    }],
    "rls": []
};

async function getDashboardToken(req, res) {
    try {
        const accessToken = await authenticateWithPreset();
        const response = await axios.post(
            "https://api.app.preset.io/v1/teams/3d97b21e/workspaces/41860ebc/guest-token/",
            userDashboardTokenPayload,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        console.log(response);
        res.status(200).json({ token: response.data.payload.token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getDashboardToken
};
