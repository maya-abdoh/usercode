package io.educative.models

import org.litote.kmongo.coroutine.coroutine
import org.litote.kmongo.reactivestreams.KMongo

class Database {
    val db = KMongo.createClient(
        connectionString = "mongodb+srv://mayaabdo2002:FoOLJ47LyLEAOkn0@cluster0.mn8sw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    ).coroutine
        .getDatabase("fingenius")
}
