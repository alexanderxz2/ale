const axios = require('axios');
const AWS = require('aws-sdk');
// Si estás usando MySQL:
const mysql = require('mysql');


async function fetchSwapiData() {
  try {
    const response = await axios.get('https://swapi.py4e.com/api/people/');
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching SWAPI data:', error);
  }
}

fetchSwapiData();
