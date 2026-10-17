
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';
import SmartBin from './models/SmartBin.model.js';
import Route from './models/Route.model.js';
import Ticket from './models/Ticket.model.js';

dotenv.config();

const seedData = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing from backend/.env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Safety check: never delete existing project data.
    const [userCount, binCount, routeCount, ticketCount] =
      await Promise.all([
        User.countDocuments(),
        SmartBin.countDocuments(),
        Route.countDocuments(),
        Ticket.countDocuments(),
      ]);

    if (userCount + binCount + routeCount + ticketCount > 0) {
      console.log('Seed cancelled: existing data was found.');
      console.log({ userCount, binCount, routeCount, ticketCount });
      console.log('No records were deleted or changed.');
      return;
    }

    // Create demo accounts.
    const users = await User.create([
      {
        firstName: 'John',
        lastName: 'Resident',
        email: 'resident@test.com',
        password: 'password123',
        phone: '+919876543211',
        role: 'resident',
        address: {
          street: 'MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          zipCode: '560001',
        },
      },
      {
        firstName: 'Mike',
        lastName: 'Collector',
        email: 'collector@test.com',
        password: 'password123',
        phone: '+919876543212',
        role: 'collector',
      },
      {
        firstName: 'Sarah',
        lastName: 'Authority',
        email: 'authority@test.com',
        password: 'password123',
        phone: '+919876543213',
        role: 'authority',
      },
      {
        firstName: 'Tom',
        lastName: 'Operator',
        email: 'operator@test.com',
        password: 'password123',
        phone: '+919876543214',
        role: 'operator',
      },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@test.com',
        password: 'password123',
        phone: '+919876543215',
        role: 'admin',
      },
    ]);

    console.log('Demo users created.');

    // Create sample smart bins.
    const bins = await SmartBin.create([
      {
        binId: 'BIN001',
        qrCode: 'QR001',
        rfidTag: 'RFID001',
        assignedTo: users[0]._id,
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
          address: 'MG Road, Bengaluru, Karnataka, India',
        },
        capacity: 100,
        currentLevel: 45,
        binType: 'general',
        status: 'active',
      },
      {
        binId: 'BIN002',
        qrCode: 'QR002',
        rfidTag: 'RFID002',
        assignedTo: users[0]._id,
        location: {
          type: 'Point',
          coordinates: [77.6066, 12.9719],
          address: 'Brigade Road, Bengaluru, Karnataka, India',
        },
        capacity: 100,
        currentLevel: 75,
        binType: 'recyclable',
        status: 'active',
      },
      {
        binId: 'BIN003',
        qrCode: 'QR003',
        rfidTag: 'RFID003',
        location: {
          type: 'Point',
          coordinates: [77.5929, 12.9763],
          address: ' Cubbon Park, Bengaluru, Karnataka, India',
        },
        capacity: 100,
        currentLevel: 20,
        binType: 'general',
        status: 'available',
      },
    ]);

    // Create a collection route.
    const routes = await Route.create([
      {
        routeName: 'Downtown Route',
        routeCode: 'RT001',
        assignedCollector: users[1]._id,
        area: 'Central Bengaluru, Karnataka',
        bins: [bins[0]._id, bins[1]._id],
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledTime: {
          start: '09:00',
          end: '12:00',
        },
        status: 'pending',
        priority: 'medium',
        totalBins: 2,
      },
    ]);

    // Create sample support tickets.
    await Ticket.create([
      {
        ticketNumber: 'TKT000001',
        title: 'Damaged bin needs replacement',
        description:
          'My recycling bin has a crack on the side and cannot hold waste properly.',
        category: 'damaged-bin',
        priority: 'high',
        status: 'open',
        reporter: users[0]._id,
        relatedBin: bins[0]._id,
      },
      {
        ticketNumber: 'TKT000002',
        title: 'Missed pickup last week',
        description:
          'The waste collection was scheduled but the team did not show up.',
        category: 'missed-pickup',
        priority: 'medium',
        status: 'in-progress',
        reporter: users[0]._id,
        assignedTo: users[2]._id,
      },
    ]);

    console.log('Demo data created successfully.');
    console.log({
      users: users.length,
      bins: bins.length,
      routes: routes.length,
      tickets: 2,
    });
    console.log('Demo login password: password123');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedData();
