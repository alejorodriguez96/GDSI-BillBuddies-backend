const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

Given('un mail que no existe en el sistema', function () {
    this.mail = "test_registro_exitoso@mail.com";
});

When('me registro usando ese mail y una contraseña', function () {
    this.nombre = "Marcelo";
    this.apellido = "Schenone";
    this.contraseña = "MarceSFIUBA2024";
});

Then('veo un mensaje de registro exitoso', function () {
    // Viendo como pegarle a los enpoints durante el testeo
    return 'pending';
});

Given('un mail que ya existe en el sistema', function () {
    return 'pending';
});

Then('veo un mensaje de usuario ya existente', function () {
    return 'pending';
});