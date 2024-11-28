import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    if (global._mongoClientPromise) {
        clientPromise = global._mongoClientPromise;
    } else {
        global._mongoClientPromise = client.connect();
        clientPromise = global._mongoClientPromise;
    }
} else {
    clientPromise = client.connect();
}

export default clientPromise;
