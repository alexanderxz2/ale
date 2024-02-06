const AWS = require('aws-sdk');
const axios = require('axios');
// Si estás usando MySQL:
const mysql = require('mysql');


// Reemplaza 'tu-región' con el código de tu región preferida, por ejemplo, 'us-east-1'
AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB();

const params = {
    TableName: 'Personajes',  // Puedes cambiar 'Personajes' por el nombre que desees para tu tabla
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
};

dynamodb.createTable(params, (err, data) => {
    if (err) {
        console.error('Error al crear la tabla', err);
    } else {
        console.log('Tabla creada', data);
    }
});
