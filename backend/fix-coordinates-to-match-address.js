import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PickupRequest from './models/PickupRequest.model.js';

dotenv.config();

const fixPickupCoordinates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Get all pickups to see their addresses
    const pickups = await PickupRequest.find({})
      .select('requestId pickupLocation status')
      .sort('-createdAt');

    console.log('\n📋 Current Pickups:');
    pickups.forEach(pickup => {
      console.log(`\n${pickup.requestId}:`);
      console.log(`  Address: ${pickup.pickupLocation.address}`);
      console.log(`  Coordinates: [${pickup.pickupLocation.coordinates[0]}, ${pickup.pickupLocation.coordinates[1]}]`);
      console.log(`  Status: ${pickup.status}`);
    });

    // The address "Siyambalanduwa-Damana-Ampara Road, Hingurana, Ampara District" 
    // is in Ampara District, Eastern Province
    // Approximate coordinates: [81.55, 7.15] (Ampara region)
    
    console.log('\n🔄 Updating coordinates to match actual addresses...');

    /// Update old Ampara demo pickups to Bengaluru
const result = await PickupRequest.updateMany(
  {
    'pickupLocation.address': { $regex: 'Ampara', $options: 'i' }
  },
  {
    $set: {
      'pickupLocation.coordinates': [77.5946, 12.9716],
      'pickupLocation.address':
        'MG Road, Bengaluru, Karnataka, 560001, India'
    }
  }
);

    console.log(`✅ Updated ${result.modifiedCount} old demo pickups to Bengaluru`);

    // Update old demo pickups with the sample address to Bengaluru
const result2 = await PickupRequest.updateMany(
  {
    'pickupLocation.address': { $regex: '123 Main St', $options: 'i' }
  },
  {
    $set: {
      'pickupLocation.coordinates': [77.5946, 12.9716],
      'pickupLocation.address':
        'MG Road, Bengaluru, Karnataka, 560001, India'
    }
  }
);

    // Show updated pickups
    const updatedPickups = await PickupRequest.find({})
      .select('requestId pickupLocation status')
      .sort('-createdAt')
      .limit(10);

    console.log('\n📍 Updated Pickups:');
    updatedPickups.forEach(pickup => {
      const [lng, lat] = pickup.pickupLocation.coordinates;
      console.log(`\n${pickup.requestId}:`);
      console.log(`  📍 ${pickup.pickupLocation.address}`);
      console.log(`  🗺️  Coordinates: Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`);
      console.log(`  Status: ${pickup.status}`);
    });

    console.log('\n✅ Coordinate fix complete!');
    console.log('🔄 Refresh the Routes page to see correct locations on map');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing coordinates:', error);
    process.exit(1);
  }
};

fixPickupCoordinates();
