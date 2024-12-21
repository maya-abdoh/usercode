const { MongoClient } = require('mongodb');
const fs = require('fs');

// Connection URL for the MongoDB Atlas cluster
const url = 'mongodb+srv://mayaabdo2002:FoOLJ47LyLEAOkn0@cluster0.mn8sw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Database name
const dbName = 'fingenius2';

// Define an array of objects, each containing the collection name and JSON file path
const collectionsToImport = [
  { collectionName: 'partners', jsonFilePath: 'fingenius.partners.json' },
  { collectionName: 'products', jsonFilePath: 'fingenius.products.json' },
  { collectionName: 'invoices', jsonFilePath: 'fingenius.invoices.json' },
  { collectionName: 'transactions', jsonFilePath: 'fingenius.transactions.json' }
];

async function importCollection(collectionName, jsonFilePath) {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Read the JSON file for the specific collection
    const jsonContent = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    // Insert the JSON data into the collection
    const result = await collection.insertMany(jsonContent);
    console.log(`Imported ${result.insertedCount} documents into ${collectionName} in ${dbName}`);
  } catch (err) {
    console.error(`Error importing data for collection ${collectionName}:`, err);
  } finally {
    client.close();
  }
}

async function importAllCollections() {
  for (const { collectionName, jsonFilePath } of collectionsToImport) {
    await importCollection(collectionName, jsonFilePath);
  }
}

importAllCollections();
