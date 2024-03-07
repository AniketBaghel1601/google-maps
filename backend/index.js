require('dotenv').config();
const express = require('express');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc =  require('swagger-jsdoc');
const PORT = 8080;
const app = express();

app.use(express.json());



const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Distance Between Locations',
        version: '1.0.0',
        description: 'Calculating Distance between two locations',
      },
      servers: [
        {
          url: 'http://localhost:8080',
        },
      ],
    },
    apis: ['./index.js'],
  };

  const specs = swaggerJsDoc(options);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * /calculate-distance:
 *   post:
 *     summary: Calculate distance between two locations
 *     description: Checks both distance and time of two locations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location1:
 *                 type: string
 *                 description: The first location.
 *               location2:
 *                 type: string
 *                 description: The second location.
 *     responses:
 *       '200':
 *         description: Distance and time calculated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 calcDistance:
 *                   type: string
 *                   description: The calculated distance.
 *                 calcTime:
 *                   type: string
 *                   description: The estimated travel time.
 */



app.post('/calculate-distance',async(req,res)=>{
    try {
        const {location1,location2} = req.body;
        const googleRes = await axios.get("https://maps.googleapis.com/maps/api/distancematrix/json",{
            params : {
                origins : location1,
                destinations : location2,
                key : process.env.APIKey
            }
        })
        console.log(process.env.APIKey)
        const calcDistance = googleRes.data.rows[0].elements[0].distance.text;
        const calcTime = googleRes.data.rows[0].elements[0].duration.text;
        res.send({calcDistance,calcTime});
        // console.log(googleRes.data.rows[0].elements[0].distance.text); // distance;
        // console.log(googleRes.data.rows[0].elements[0].duration.text); // time
    } catch (error) {
        res.status(400).json({error});
    }


})

app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
})