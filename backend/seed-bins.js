import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SmartBin from './models/SmartBin.model.js';
import User from './models/User.model.js';
import connectDB from './config/db.js';

dotenv.config();

const seedBins = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Find an operator or admin user to use as createdBy
    let createdByUser = await User.findOne({ role: { $in: ['operator', 'admin'] } });
    
    if (!createdByUser) {
      console.log('⚠️  No operator or admin user found. Creating a system admin...');
      // Create a system admin for bin creation
      createdByUser = await User.create({
        firstName: 'System',
        lastName: 'Admin',
        email: 'system@ecotrack.com',
        password: 'System@123', // This will be hashed by the model
        phone: '0000000000',
        role: 'admin',
        address: {
  street: 'MG Road',
  city: 'Bengaluru',
  province: 'Karnataka',
  postalCode: '560001',
  coordinates: [77.5946, 12.9716]
}
        
      });
      console.log('✅ System admin created');
    }
    
    console.log(`Using user ${createdByUser.email} (${createdByUser.role}) as bin creator`);

    // Sample bins for each type
    const bins = [
      // General waste bins
      {
        binId: 'GEN-001',
        binType: 'general',
        capacity: 120,
        currentLevel: 0,
        status: 'available',
        createdBy: createdByUser._id,
        location: {
  type: 'Point',
  coordinates: [77.5946, 12.9716],
  address: 'MG Road, Bengaluru, Karnataka, India'
}
      },
      {
        binId: 'GEN-002',
        binType: 'general',
        capacity: 120,
        currentLevel: 0,
        status: 'available',
        createdBy: createdByUser._id,
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
          address: 'MG Road, Bengaluru, Karnataka, India'  
        }
      },
      {
        binId: 'GEN-003',
        binType: 'general',
        capacity: 120,
        currentLevel: 0,
        status: 'available',
        createdBy: createdByUser._id,
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
          address: 'MG Road, Bengaluru, Karnataka, India'
        }
      },
      
      // Recyclable bins
      {
        binId: 'REC-001',
        binType: 'recyclable',
        capacity: 120,
        currentLevel: 0,
        status: 'available',
        createdBy: createdByUser._id,
        location: {
          type: 'Point',
          coordinates: [77.6066, 12.9719],
          address: 'Brigade Road, Bengaluru, Karnataka, India'
        }
      },
      {
        binId: 'REC-002',
        binType: 'recyclable',
        capacity: 120,
        currentLevel: 0,
        status: 'available',
        createdBy: createdByUser._id,
        location: {
          type: 'Point',
          coordinates: [77.6066, 12.9719],
          address: 'Brigade Road, Bengaluru, Karnataka, India'
        }
      },
      {
        binId: 'REC-003',
        binType: 'recyclable',
        capacity: 120,
        currentLevel: 0,
        status: 'available',
        createdBy: createdByUser._id,
        location: {
          type: 'Point',
          coordinates: [77.6066, 12.9719],
          address: 'Brigade Road, Bengaluru, Karnataka, India'
        }
      },
      
      // Organic bins
      {
        binId: 'ORG-001',
        binType: 'organic',
        capacity: 100,
        currentLevel: 0,
        status: 'available',
        createdBy: createdByUser._id,
        location: {
          type: 'Point',
          coordinates: [77.5929, 12.9763],
          address: 'Cubbon Park, Bengaluru, Karnataka, India'
        }
      },
      {
        binId: 'ORG-002',
        binType: 'organic',
        capacity: 100,
        currentLevel: 0,
        status: 'available',
        createdBy: createdByUser._id,
        location: {
          type: 'Point',
          coordinates: [77.5929, 12.9763],
          address: 'Cubbon Park, Bengaluru, Karnataka, India'
        }
      },
      {
        binId: 'ORG-003',
        binType: 'organic',
        capacity: 100,
        currentLevel: 0,
        status: 'available',
        createdBy: createdByUser._id,
        location: {
          type: 'Point',
          coordinates: [77.5929, 12.9763],
          address: 'Cubbon Park, Bengaluru, Karnataka, India'
        }
      },
      
      // Hazardous bins
      {
        binId: 'HAZ-001',
        binType: 'hazardous',
        capacity: 80,
        currentLevel: 0,
        status: 'available',
        createdBy: createdByUser._id,
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
          address: 'Bengaluru, Karnataka, India'
        }
      },
      {
        binId: 'HAZ-002',
        binType: 'hazardous',
        capacity: 80,
        currentLevel: 0,
        status: 'available',
        createdBy: createdByUser._id,
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
          address: 'Bengaluru, Karnataka, India'
        }
      },
      {
        binId: 'HAZ-003',
        binType: 'hazardous',
        capacity: 80,
        currentLevel: 0,
        status: 'available',
        createdBy: createdByUser._id,
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
          address: 'Bengaluru, Karnataka, India'
        }
      },
      {
        binId: 'HAZ-004',
        binType: 'hazardous',
        capacity: 80,
        currentLevel: 0,
        status: 'available',
        createdBy: createdByUser._id,
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
          address: 'Bengaluru, Karnataka, India'
        }
      },
      {
        binId: 'HAZ-005',
        binType: 'hazardous',
        capacity: 80,
        currentLevel: 0,
        status: 'available',
        createdBy: createdByUser._id,
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
          address: 'Bengaluru, Karnataka, India'
        }
      }
    ];

    // Check if bins already exist
   
if (existingBins > 0) {
  console.log(`Database already has ${existingBins} bins.`);
  console.log('Seed cancelled to avoid duplicate bins.');
  return;
}


    // Insert bins
    const createdBins = await SmartBin.insertMany(bins);
    console.log(`✅ Successfully seeded ${createdBins.length} smart bins!`);
    
    // Show summary
    const summary = await SmartBin.aggregate([
      {
        $group: {
          _id: '$binType',
          count: { $sum: 1 },
          available: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
          }
        }
      }
    ]);
    
    console.log('\n📊 Bin Inventory Summary:');
    summary.forEach(item => {
      console.log(`   ${item._id}: ${item.count} total (${item.available} available)`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding bins:', error);
    process.exit(1);
  }
};

seedBins();
