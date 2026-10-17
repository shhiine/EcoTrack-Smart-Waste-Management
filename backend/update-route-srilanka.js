
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Route from './models/Route.model.js';
import SmartBin from './models/SmartBin.model.js';

dotenv.config();

const updateRouteWithIndianBins = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing from backend/.env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const route = await Route.findOne({ routeCode: 'RT001' });

    if (!route) {
      console.log('Route RT001 not found. No changes made.');
      return;
    }

    console.log(`Found route: ${route.routeName}`);

    // Find demo bins whose addresses mention Bengaluru or Bangalore.
    const bins = await SmartBin.find({
      $or: [
        { 'location.address': /Bengaluru/i },
        { 'location.address': /Bangalore/i }
      ]
    }).select('_id binId location binType currentLevel');

    if (bins.length === 0) {
      console.log('No Bengaluru bins found. No route changes made.');
      return;
    }

    console.log(`Found ${bins.length} Bengaluru bins`);

    bins.forEach(bin => {
      console.log(`- ${bin.binId}: ${bin.location?.address}`);
      console.log(`  Coordinates [lng, lat]: ${bin.location?.coordinates}`);
    });

    route.bins = bins.map(bin => bin._id);
    route.totalBins = bins.length;
    route.area = 'Central Bengaluru, Karnataka';
    route.routeName = 'Bengaluru City Route';
    route.notes = 'Demo collection route covering Bengaluru, Karnataka';

    await route.save();

    console.log('Route updated successfully!');
    console.log(`Route: ${route.routeName}`);
    console.log(`Area: ${route.area}`);
    console.log(`Bins: ${route.totalBins}`);
  } catch (error) {
    console.error('Error updating route:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
};

updateRouteWithIndianBins();
