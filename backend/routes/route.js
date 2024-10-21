// backend/routes/route.js

import express from 'express';
import fetch from 'node-fetch';
import * as turf from '@turf/turf';
import POI from '../models/poi.js'; // Modello Mongoose per i POI

const router = express.Router();
// const OSRM_SERVER_URL = 'http://0.0.0.0:5000'; // Aggiornato per utilizzare OSRM
const OSRM_SERVER_URL = 'http://osrm:5000';

// Funzione per ottenere il percorso tra due punti con OSRM
async function getOSRMRoute(start, destination) {
    const coordinates = `${start[1]},${start[0]};${destination[1]},${destination[0]}`;
    const url = `${OSRM_SERVER_URL}/route/v1/foot/${coordinates}?overview=full&geometries=geojson&alternatives=false&annotations=duration`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
        throw new Error('Nessun percorso trovato');
    }
    return data.routes[0];
}

// Endpoint per il calcolo del percorso
router.post('/calculateRoute', async (req, res) => {
    const { start, destination, poiPreference } = req.body;

    try {
        // 1. Calcolo del percorso principale con OSRM (il più veloce)
        const baseRoute = await getOSRMRoute(start, destination);

        // 2. Creazione di un buffer intorno al percorso principale
        const routeLine = turf.lineString(baseRoute.geometry.coordinates);
        const buffered = turf.buffer(routeLine, 0.5, { units: 'kilometers' });

        // 3. Query su MongoDB per ottenere i POI all'interno del buffer
        const pois = await POI.find({
            type: poiPreference,
            location: {
                $geoWithin: {
                    $geometry: buffered.geometry
                }
            }
        });

        let deviationRoutes = [];
        if (pois.length > 0) {
            // 4. Calcolo delle deviazioni per ogni POI con il percorso più veloce
            for (let poi of pois) {
                const poiCoords = [poi.location.coordinates[1], poi.location.coordinates[0]]; // [lat, lon]

                // Trova il punto del percorso principale più vicino al POI
                const nearestPointOnRoute = turf.nearestPointOnLine(routeLine, turf.point(poiCoords));
                const startToPOIRoute = await getOSRMRoute([nearestPointOnRoute.geometry.coordinates[1], nearestPointOnRoute.geometry.coordinates[0]], poiCoords);
                const poiToRouteRoute = await getOSRMRoute(poiCoords, [nearestPointOnRoute.geometry.coordinates[1], nearestPointOnRoute.geometry.coordinates[0]]);

                // Unisci i percorsi di andata e ritorno al POI
                deviationRoutes.push(startToPOIRoute.geometry);
                deviationRoutes.push(poiToRouteRoute.geometry);
            }
        }

        // 5. Invio della risposta al frontend
        const result = {
            mainRoute: baseRoute.geometry,
            deviations: deviationRoutes,
            pois: pois.map(poi => ({
                name: poi.name,
                type: poi.type,
                lat: poi.location.coordinates[1],
                lon: poi.location.coordinates[0],
            })),
        };

        res.json(result);

    } catch (error) {
        console.error('Errore in /api/calculateRoute:', error);
        res.status(500).json({ error: 'Errore nel calcolo del percorso.' });
    }
});


export default router;
