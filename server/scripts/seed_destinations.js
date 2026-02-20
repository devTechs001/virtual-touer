#!/usr/bin/env node
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Destination from '../models/Destination.js';

dotenv.config();

async function seed() {
  await connectDB();

  const items = [
    // Africa - North
    { name: 'Cairo', description: 'Ancient capital with pyramids of Giza.', shortDescription: 'Pyramids and Nile.', location: { type: 'Point', coordinates: [31.2357, 30.0444], city: 'Cairo', country: 'Egypt', continent: 'Africa' }, highlights: ['Pyramids', 'Egyptian Museum'], language: 'Arabic', currency: 'EGP' },
    { name: 'Chefchaouen', description: 'Blue-washed town in the Rif Mountains.', shortDescription: 'Blue alleys and mountains.', location: { type: 'Point', coordinates: [-5.2684, 35.1686], city: 'Chefchaouen', country: 'Morocco', continent: 'Africa' }, highlights: ['Old medina'], language: 'Arabic', currency: 'MAD' },

    // Africa - South
    { name: 'Cape Town', description: 'Iconic coastal city at the foot of Table Mountain.', shortDescription: 'Table Mountain vistas.', location: { type: 'Point', coordinates: [18.4241, -33.9249], city: 'Cape Town', country: 'South Africa', continent: 'Africa' }, highlights: ['Table Mountain', 'Robben Island'], language: 'English', currency: 'ZAR' },

    // Africa - East
    { name: 'Zanzibar', description: 'Spice island with historic Stone Town.', shortDescription: 'Beaches and spice tours.', location: { type: 'Point', coordinates: [39.2083, -6.1659], city: 'Stone Town', country: 'Tanzania', continent: 'Africa' }, highlights: ['Stone Town', 'Prison Island'], language: 'Swahili', currency: 'TZS' },

    // Africa - Central
    { name: 'Okavango Delta', description: 'Unique inland delta teeming with wildlife.', shortDescription: 'Wildlife safaris in waterways.', location: { type: 'Point', coordinates: [22.9105, -19.0196], city: 'Maun', country: 'Botswana', continent: 'Africa' }, highlights: ['Safari', 'Mokoro rides'], language: 'English', currency: 'BWP' },

    // Mystical/remote
    { name: 'Socotra', description: 'Isolated island with alien-looking flora.', shortDescription: 'Dragon\'s Blood trees and dunes.', location: { type: 'Point', coordinates: [53.9939, 12.4634], city: 'Hadibu', country: 'Yemen', continent: 'Asia' }, highlights: ['Dragon\'s Blood Tree'], language: 'Arabic', currency: 'YER' },
    { name: 'Easter Island', description: 'Remote island with large Moai statues.', shortDescription: 'Moai and mystique.', location: { type: 'Point', coordinates: [-109.3497, -27.1127], city: 'Hanga Roa', country: 'Chile', continent: 'Oceania' }, highlights: ['Moai statues'], language: 'Spanish', currency: 'CLP' }
  ];

  const ops = items.map(d => ({ updateOne: { filter: { name: d.name }, update: { $set: d }, upsert: true } }));
  const res = await Destination.bulkWrite(ops);
  console.log('Seed complete:', res.result || res);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
