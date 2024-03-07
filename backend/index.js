const express = require('express');
const axios = require('axios');
const PORT = 8080;
const app = express();

// app.use(bodyParser.json());
app.use(express.json());

require('dotenv').config();
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