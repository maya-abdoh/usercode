package io.educative.models

import org.litote.kmongo.coroutine.coroutine
import org.litote.kmongo.reactivestreams.KMongo

class Database {
    val db = KMongo.createClient(
        connectionString = "<YOUR CONNECTION STRING>"
    ).coroutine
        .getDatabase("fingenius")
}