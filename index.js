import express from'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const APIKEY = 'use-your-api-key';

app.get("/", async (req, res) => {  
    try{
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', { params: { q: 'kolkata', appid: APIKEY, units: 'metric' } });
        const weatherData = response.data;
        res.render('index.ejs', {data: weatherData, units: 'metric', error: null});
    }
    catch(err){
        console.error("Failed to request",err.message);
        res.render('index.ejs',{error: err.message, units: 'metric', data: null});
    }
});


app.post('/', async (req, res) => {
    const city = req.body.city;
    const units = req.body.units;
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', { params: { q: city, appid: APIKEY, units: units } });
        const weatherData = response.data;
        res.render('index.ejs', { data: weatherData, units: units, error: null });

    }catch(err){
        console.error("Failed to request",err.message);
       if(err.response && err.response.status === 404){
            res.render('index.ejs', { error: 'City not found. Please try again.', units: units, data: null });
        }
         else{  
            res.render('index.ejs', { error: 'An error occurred while fetching the weather data. Please try again later.', units: units, data: null });
        }
    }
})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);  
})
