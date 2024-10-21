import mongoose from 'mongoose';
import POI from '../models/poi.js';

mongoose.set('strictQuery', true);

// Connessione a MongoDB usando il nome del servizio Docker
mongoose.connect('mongodb://mongodb:27017/tourist-route', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connesso a MongoDB');
  return POI.insertMany(pois);
})
.then(() => {
  console.log('POI inseriti con successo!');
})
.catch((err) => {
  console.error('Errore:', err);
})
.finally(() => {
  mongoose.connection.close();
});

// Lista dei POI
const pois = [
  {
    name: 'Duomo di Catania',
    type: 'storici',
    location: {
      type: 'Point',
      coordinates: [15.087269, 37.502669],
    },
  },
  {
    name: 'Teatro Romano di Catania',
    type: 'culturali',
    location: {
      type: 'Point',
      coordinates: [15.087579, 37.503451],
    },
  },
  {
    name: 'Villa Bellini',
    type: 'parchi',
    location: {
      type: 'Point',
      coordinates: [15.088654, 37.507667],
    },
  },
  {
    name: 'Castello Ursino',
    type: 'storici',
    location: {
      type: 'Point',
      coordinates: [15.088321, 37.500693],
    },
  },
  {
    name: 'Anfiteatro Romano',
    type: 'storici',
    location: {
      type: 'Point',
      coordinates: [15.083725, 37.505948],
    },
  },
  {
    name: 'Monastero dei Benedettini',
    type: 'storici',
    location: {
      type: 'Point',
      coordinates: [15.078794, 37.502358],
    },
  },
  {
    name: 'Museo Civico Belliniano',
    type: 'culturali',
    location: {
      type: 'Point',
      coordinates: [15.085831, 37.503373],
    },
  },
  {
    name: 'Palazzo Biscari',
    type: 'storici',
    location: {
      type: 'Point',
      coordinates: [15.090718, 37.501753],
    },
  },
  {
    name: 'Piazza del Duomo',
    type: 'piazze',
    location: {
      type: 'Point',
      coordinates: [15.087358, 37.502666],
    },
  },
  {
    name: "Fontana dell'Elefante",
    type: 'monumenti',
    location: {
      type: 'Point',
      coordinates: [15.087154, 37.502717],
    },
  },
  {
    name: 'Museo Emilio Greco',
    type: 'culturali',
    location: {
      type: 'Point',
      coordinates: [15.087640, 37.502580],
    },
  },
  {
    name: 'Giardino Pacini',
    type: 'parchi',
    location: {
      type: 'Point',
      coordinates: [15.090507, 37.500456],
    },
  },
  {
    name: 'Porta Uzeda',
    type: 'storici',
    location: {
      type: 'Point',
      coordinates: [15.087931, 37.502116],
    },
  },
  {
    name: 'Mercato della Pescheria',
    type: 'mercati',
    location: {
      type: 'Point',
      coordinates: [15.087566, 37.502270],
    },
  },
  {
    name: 'Chiesa della Badia di Sant\'Agata',
    type: 'storici',
    location: {
      type: 'Point',
      coordinates: [15.087920, 37.503018],
    },
  },
  {
    name: 'Piazza Università',
    type: 'piazze',
    location: {
      type: 'Point',
      coordinates: [15.086446, 37.503293],
    },
  },
  {
    name: 'Via Etnea',
    type: 'strade',
    location: {
      type: 'Point',
      coordinates: [15.086588, 37.504437],
    },
  },
  {
    name: 'Museo Diocesano',
    type: 'culturali',
    location: {
      type: 'Point',
      coordinates: [15.087619, 37.502359],
    },
  },
  {
    name: 'Palazzo degli Elefanti',
    type: 'storici',
    location: {
      type: 'Point',
      coordinates: [15.087158, 37.502939],
    },
  },
  {
    name: 'Museo del Cinema',
    type: 'culturali',
    location: {
      type: 'Point',
      coordinates: [15.090203, 37.502068],
    },
  },
];