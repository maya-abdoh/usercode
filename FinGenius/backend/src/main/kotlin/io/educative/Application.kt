package io.educative

import io.educative.modules.*
import io.educative.plugins.*
import io.ktor.server.application.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureSerialization()
    configureHTTP()
    partnerModule()
    productModule()
    invoiceModule()
    transactionModule()
    ledgerModule()
}