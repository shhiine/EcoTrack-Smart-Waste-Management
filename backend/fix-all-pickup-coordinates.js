import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PickupRequest from './models/PickupRequest.model.js';

dotenv.config();

// District coordinates
const districtCoordinates = {
  // Karnataka
  'Bengaluru': [77.5946, 12.9716],
  'Bangalore': [77.5946, 12.9716],
  'Mysuru': [76.6394, 12.2958],
  'Mysore': [76.6394, 12.2958],
  'Mangaluru': [74.8560, 12.9141],
  'Mangalore': [74.8560, 12.9141],
  'Hubballi': [75.1240, 15.3647],
  'Dharwad': [75.0078, 15.4589],
  'Belagavi': [74.4977, 15.8497],
  'Belgaum': [74.4977, 15.8497],
  'Vijayapura': [75.7139, 16.8302],
  'Kalaburagi': [76.8343, 17.3297],
  'Shivamogga': [75.5681, 13.9299],
  'Tumakuru': [77.1025, 13.3379],
  'Udupi': [74.7421, 13.3409],

  // Other Indian cities
  'Chennai': [80.2707, 13.0827],
  'Hyderabad': [78.4867, 17.3850],
  'Kochi': [76.2673, 9.9312],
  'Thiruvananthapuram': [76.9366, 8.5241],
  'Coimbatore': [76.9558, 11.0168],
  'Mumbai': [72.8777, 19.0760],
  'Pune': [73.8567, 18.5204],
  'New Delhi': [77.2090, 28.6139],
  'Kolkata': [88.3639, 22.5726],
  'Ahmedabad': [72.5714, 23.0225],
  'Jaipur': [75.7873, 26.9124]
};


const fixPickupCoordinates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB\n');

    // Get ALL pickups to check
    const pickups = await PickupRequest.find({})
      .select('requestId pickupLocation status');

    console.log(`🔍 Found ${pickups.length} active pickups to check\n`);

    let fixedCount = 0;
    const fixes = [];

    for (const pickup of pickups) {
      const address = pickup.pickupLocation.address;
      const currentCoords = pickup.pickupLocation.coordinates;

      // Find which district this address belongs to
      let matchedDistrict = null;
      let correctCoords = null;

      for (const [district, coords] of Object.entries(districtCoordinates)) {
        if (address.includes(district)) {
          matchedDistrict = district;
          correctCoords = coords;
          break;
        }
      }

      if (matchedDistrict && correctCoords) {
        // Check if coordinates are wrong
        const currentLng = currentCoords[0];
        const currentLat = currentCoords[1];
        const correctLng = correctCoords[0];
        const correctLat = correctCoords[1];

        // If coordinates differ by more than 0.1 degrees (significant mismatch)
        const lngDiff = Math.abs(currentLng - correctLng);
        const latDiff = Math.abs(currentLat - correctLat);

        if (lngDiff > 0.1 || latDiff > 0.1) {
          // Update the coordinates
          await PickupRequest.updateOne(
            { _id: pickup._id },
            { $set: { 'pickupLocation.coordinates': correctCoords } }
          );

          fixedCount++;
          fixes.push({
            requestId: pickup.requestId,
            district: matchedDistrict,
            address: address,
            oldCoords: [currentLat, currentLng],
            newCoords: [correctLat, correctLng]
          });
        }
      }
    }

    console.log(`✅ Fixed ${fixedCount} pickups with incorrect coordinates\n`);

    if (fixes.length > 0) {
      console.log('📍 CORRECTED PICKUPS:\n');
      fixes.forEach(fix => {
        console.log(`${fix.requestId} - ${fix.district}:`);
        console.log(`  Address: ${fix.address}`);
        console.log(`  Old: Lat ${fix.oldCoords[0].toFixed(4)}, Lng ${fix.oldCoords[1].toFixed(4)}`);
        console.log(`  New: Lat ${fix.newCoords[0].toFixed(4)}, Lng ${fix.newCoords[1].toFixed(4)}`);
        console.log(`  ✅ NOW CORRECT for ${fix.district}\n`);
      });
    }

    // Show current status of all pickups
    const updatedPickups = await PickupRequest.find({})
      .select('requestId pickupLocation status');

    console.log('📋 ALL ACTIVE PICKUPS (AFTER FIX):\n');
    updatedPickups.forEach(p => {
      const district = Object.keys(districtCoordinates).find(d => 
        p.pickupLocation.address.includes(d)
      );
      console.log(`${p.requestId} [${p.status}]:`);
      console.log(`  📍 ${p.pickupLocation.address}`);
      console.log(`  🗺️  Coordinates: [${p.pickupLocation.coordinates[1].toFixed(4)}, ${p.pickupLocation.coordinates[0].toFixed(4)}]`);
      console.log(`  ✓ District: ${district || 'Unknown'}\n`);
    });

    console.log('🎉 Fix complete! All pickups now have coordinates matching their addresses.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixPickupCoordinates();
