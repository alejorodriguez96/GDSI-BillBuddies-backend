# language: es

Característica: 1 - Registro de usuario

  Escenario: 1.01 Registro exitoso de usuario nuevo
    Dado un mail que no existe en el sistema
    Cuando me registro usando ese mail y una contraseña
    Entonces veo un mensaje de registro exitoso

  Escenario: 1.02 Registro fallido de usuario ya existente
    Dado un mail que ya existe en el sistema
    Cuando me registro usando ese mail y una contraseña
    Entonces veo un mensaje de usuario ya existente