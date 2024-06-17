package com.example.mobile.model

data class Movie(
    val id: Int,
    val title: String,
    val description: String,
    val genre: String,
    val rating: Float,
    val posterURL: String,
    val trailerURL: String
)
data class User(
    val email: String,
    val password: String
)
data class Schedule(
    val id: Int,
    val movieId: Int,
    val hallId: Int,
    val startTime: String,
    val endTime: String,
    val date: String,
    val Movie: Movie,
    val Hall: Hall
)

data class Hall(
    val id: Int,
    val name: String,
    val totalSeats: Int
)
data class Food(
    val id: Int,
    val name: String,
    val description: String,
    val price: Int,
    val imgURL: String
)

data class Seat(
    val id: Int,
    val seatNumber: Int,
    val rowNumber: Int,
    val hallId: Int
)