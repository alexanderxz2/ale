'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const axios = require('axios');

exports.handler = async (event) => {
  // ID obtenido de event.pathParameters en lugar de event.id
  const id = event.pathParameters.id;
  const swapiEndpoint = `https://swapi.dev/api/people/${id}/`;

  try {
    const response = await axios.get(swapiEndpoint);
    const character = response.data;

    const item = {
      TableName: 'PeopleTable', 
      Item: {
        id: id,
        nombre: character.name,
        altura: character.height,
        peso: character.mass,
        color_de_pelo: character.hair_color,
        color_de_piel: character.skin_color,
        color_de_ojos: character.eye_color,
        año_de_nacimiento: character.birth_year,
        género: character.gender,
        mundo_natal: character.homeworld, 
        películas: character.films, 
        especies: character.species, 
        vehículos: character.vehicles, 
        naves_espaciales: character.starships, 
        creado: character.created, // Fecha de creación del registro en SWAPI
        editado: character.edited, // Fecha de la última edición del registro en SWAPI
        url: character.url // URL del personaje en SWAPI
      }
    };    

    await dynamoDb.put(item).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(item.Item)
    };
  } catch (error) {
    console.error("Error: ", error.message);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error procesando la solicitud' }) };
  }
};

exports.create = async (event) => {
  const data = JSON.parse(event.body); 

  // Traducir los atributos del inglés al español
  const translatedData = {
    id: data.id, 
    nombre: data.name, 
    altura: data.height,
    peso: data.mass, 
    color_de_pelo: data.hair_color, 
    color_de_piel: data.skin_color, 
    color_de_ojos: data.eye_color, 
    año_de_nacimiento: data.birth_year, 
    género: data.gender, 
    mundo_natal: data.homeworld, 
    películas: data.films, 
    especies: data.species, 
    vehículos: data.vehicles, 
    naves_espaciales: data.starships, 
    creado: data.created, 
    editado: data.edited, 
    url: data.url 
  };
  
  // Crear el objeto para insertar en DynamoDB
  const item = {
    TableName: 'PeopleTable',
    Item: translatedData
  };

  try {
    await dynamoDb.put(item).promise();
    return { statusCode: 201, body: JSON.stringify(item.Item) };
  } catch (error) {
    console.error("Error al crear el personaje: ", error.message);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error al crear el personaje' }) };
  }
};

exports.getPlanet = async (event) => {
  const id = event.pathParameters.id;
  const swapiEndpoint = `https://swapi.dev/api/planets/${id}/`;

  try {
    const response = await axios.get(swapiEndpoint);
    const planet = response.data;

    const translatedData = {
      nombre: planet.name,
      periodo_rotacion: planet.rotation_period,
      periodo_orbital: planet.orbital_period,
      diametro: planet.diameter,
      clima: planet.climate,
      gravedad: planet.gravity,
      terreno: planet.terrain,
      superficie_agua: planet.surface_water,
      poblacion: planet.population,
      residentes: planet.residents,
      peliculas: planet.films,
      creado: planet.created,
      editado: planet.edited,
      url: planet.url
    };

    const item = {
      TableName: 'PlanetsTable', 
      Item: translatedData
    };
    
    try {
      await dynamoDb.put(item).promise();
      console.log("Planeta guardado con éxito en DynamoDB", item.Item);
    } catch (dbError) {
      console.error("Error al guardar el planeta en DynamoDB:", dbError);
      
    }

    return {
      statusCode: 200,
      body: JSON.stringify(translatedData)
    };
  } catch (error) {
    console.error("Error: ", error.message);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error procesando la solicitud' }) };
  }
};


// intentos

/*
exports.handler = async (event) => {
  const id = event.id; // ID obtenido del path
  const swapiEndpoint = `https://swapi.dev/api/people/${id}/`;

  try {
    console.log("peticion a: ", swapiEndpoint)
    const response = await axios.get(swapiEndpoint);
    const persona  = response.data;
    console.log("peticion b: ", response.data)

    const personaM = {
      statusCode:200,
      body:JSON.stringify ({
        nombre:persona.name
      }),
    };
    return personaM;
    }catch(error){
      console.error("peticion c: ", swapiEndpoint)
      return { statusCode: 500, body: JSON.stringify({ error: 'Error al obtener el personaje' }) };

    }
};
*/
/*
module.exports.handler = async (event) => {
  const id = event.pathParameters.id; 
  const params = {
    TableName: 'PeopleTable', 
    Key: {
      'id': id // Usa el ID para buscar el personaje
    }
  };

  try {
    const result = await dynamoDb.get(params).promise();
    if (result.Item) {
      return { statusCode: 200, body: JSON.stringify(result.Item) };
    } else {
      return { statusCode: 404, body: JSON.stringify({ error: 'Personaje no encontrado' }) };
    }
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error al obtener el personaje' }) };
  }
};
*/

/*
// Función para crear un nuevo personaje en DynamoDB utilizando datos de SWAPI
module.exports.get = async (event) => {
  // Suponiendo que el ID del personaje viene como parte del pathParameters en el evento
  const id = event.pathParameters.id;

  try {
    const swapiResponse = await axios.get(`https://swapi.dev/api/people/${id}`);
    const character = swapiResponse.data;

    const params = {
        id: id, // ID del personaje, probablemente extraído de la URL de SWAPI
        nombre: character.name, // Nombre del personaje
        altura: character.height, // Altura del personaje
        peso: character.mass, // Peso del personaje
        color_de_pelo: character.hair_color, // Color de pelo
        color_de_piel: character.skin_color, // Color de piel
        color_de_ojos: character.eye_color, // Color de ojos
        año_de_nacimiento: character.birth_year, // Año de nacimiento
        género: character.gender, // Género
        mundo_natal: character.homeworld, // URL del mundo natal, podrías necesitar otra llamada a SWAPI para obtener el nombre
        películas: character.films, // Array de URLs de películas en las que aparece el personaje
        especies: character.species, // Array de URLs de especies a las que pertenece el personaje
        vehículos: character.vehicles, // Array de URLs de vehículos que usa el personaje
        naves_espaciales: character.starships, // Array de URLs de naves espaciales que pilota el personaje
        creado: character.created, // Fecha de creación del registro en SWAPI
        editado: character.edited, // Fecha de la última edición del registro en SWAPI
        url: character.url // URL del personaje en SWAPI
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al crear el personaje.' }),
    };
  }
};

// Función para actualizar un personaje existente
module.exports.update = async (event) => {
  const data = JSON.parse(event.body);
  const id = event.pathParameters.id; // ID del personaje a actualizar

  const params = {
    TableName: 'PeopleTable',
    Key: { id },
    UpdateExpression: 'set nombre = :n, altura = :a, peso = :p, color_de_pelo = :cp, color_de_piel = :cpi, color_de_ojos = :co, año_de_nacimiento = :an, género = :g, mundo_natal = :mn, películas = :pel, especies = :esp, vehículos = :v, naves_espaciales = :ne, creado = :cr, editado = :ed, url = :url',
    ExpressionAttributeValues: {
      ':n': data.nombre,
      ':a': data.altura,
      ':p': data.peso,
      ':cp': data.color_de_pelo,
      ':cpi': data.color_de_piel,
      ':co': data.color_de_ojos,
      ':an': data.año_de_nacimiento,
      ':g': data.género,
      ':mn': data.mundo_natal,
      ':pel': data.películas,
      ':esp': data.especies,
      ':v': data.vehículos,
      ':ne': data.naves_espaciales,
      ':cr': data.creado,
      ':ed': data.editado,
      ':url': data.url
    },
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    const result = await dynamoDb.update(params).promise();
    return { statusCode: 200, body: JSON.stringify(result.Attributes) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Error al actualizar el personaje.' }) };
  }
};

// Función para eliminar un personaje
module.exports.delete = async (event) => {
  const id = event.pathParameters.id; // ID del personaje a eliminar

  const params = {
    TableName: 'PeopleTable',
    Key: { id },
  };

  try {
    await dynamoDb.delete(params).promise();
    return { statusCode: 200, body: JSON.stringify({ message: 'Personaje eliminado con éxito.' }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Error al eliminar el personaje.' }) };
  }
};
*/