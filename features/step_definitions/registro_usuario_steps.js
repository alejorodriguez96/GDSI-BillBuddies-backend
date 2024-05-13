const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const registerRoute = require('../../routes/register');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/register', registerRoute);
const supertest = require('supertest')
const request = supertest(app)

Given('un mail que no existe en el sistema', async function () {
    this.mail = "test_registro_exitoso@mail.com";
});

When('me registro usando ese mail y una contraseña', async function () {
    const RegisterData = { email: this.mail,
                           password: "MarceSFIUBA2024",
                           first_name: "Marcelo",
                           last_name: "Schenone" };
    this.response = await request.post('/register').send(RegisterData);
});

Then('veo un mensaje de registro exitoso', async function () {
    assert.equal(this.response.status, 201);
    assert.equal(this.response.body.email, this.mail);
});

Given('un mail que ya existe en el sistema', function () {
    return 'pending';
});

Then('veo un mensaje de usuario ya existente', function () {
    return 'pending';
});