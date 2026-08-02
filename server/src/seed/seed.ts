import { connect, disconnect } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '..', '..', '.env') });
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/claimora';

async function seed() {
  console.log(`Connecting to MongoDB Atlas/DB at: ${MONGO_URI.replace(/:([^:@]+)@/, ':****@')} ...`);
  const conn = await connect(MONGO_URI);

  const db = conn.connection.db;

  // Clear existing collections for fresh seed
  try {
    await db.collection('users').deleteMany({});
    await db.collection('claims').deleteMany({});
    console.log('Cleared existing collections.');
  } catch (err) {
    console.log('Collections did not exist yet.');
  }

  const passwordHash = await bcrypt.hash('demo123', 10);

  // Seed Users
  const users = await db.collection('users').insertMany([
    {
      name: 'Rahul Sharma',
      email: 'patient@aarogya.com',
      passwordHash,
      role: 'patient',
      createdAt: new Date(),
    },
    {
      name: 'Priya Verma',
      email: 'priya@example.com',
      passwordHash,
      role: 'patient',
      createdAt: new Date(),
    },
    {
      name: 'Sonali D',
      email: 'insurer@aarogya.com',
      passwordHash,
      role: 'insurer',
      createdAt: new Date(),
    },
  ]);

  console.log('Users seeded:', Object.keys(users.insertedIds).length);

  // Seed Claims
  await db.collection('claims').insertMany([
    {
      claimId: 'CLM-1042',
      patientName: 'Rahul Sharma',
      patientEmail: 'patient@aarogya.com',
      claimAmount: 15000,
      approvedAmount: 0,
      description: 'Consultation and prescription medicines for viral fever and blood tests at Max Healthcare.',
      documentUrl: '/uploads/sample-receipt.pdf',
      documentOriginalName: 'max_hospital_receipt.pdf',
      status: 'Pending',
      insurerComments: '',
      submissionDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
    },
    {
      claimId: 'CLM-1089',
      patientName: 'Rahul Sharma',
      patientEmail: 'patient@aarogya.com',
      claimAmount: 4500,
      approvedAmount: 4500,
      description: 'Dental X-Ray and cavity filling treatment bill.',
      documentUrl: '/uploads/sample-receipt.pdf',
      documentOriginalName: 'dental_prescription.pdf',
      status: 'Approved',
      insurerComments: 'Verified and approved as per dental coverage limit.',
      submissionDate: new Date(Date.now() - 86400000 * 5),
      reviewedAt: new Date(Date.now() - 86400000 * 4),
    },
    {
      claimId: 'CLM-1120',
      patientName: 'Priya Verma',
      patientEmail: 'priya@example.com',
      claimAmount: 28000,
      approvedAmount: 0,
      description: 'Cosmetic dermatological treatment invoice.',
      documentUrl: '/uploads/sample-receipt.pdf',
      documentOriginalName: 'dermatology_invoice.pdf',
      status: 'Rejected',
      insurerComments: 'Cosmetic procedures are excluded under section 4.2 of policy terms.',
      submissionDate: new Date(Date.now() - 86400000 * 7),
      reviewedAt: new Date(Date.now() - 86400000 * 6),
    },
  ]);

  console.log('Sample claims seeded successfully.');
  await disconnect();
  console.log('Seeding complete!');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
