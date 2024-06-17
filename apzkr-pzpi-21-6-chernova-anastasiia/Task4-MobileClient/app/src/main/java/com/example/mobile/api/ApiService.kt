package com.example.mobile.api

import com.example.mobile.model.Food
import com.example.mobile.model.Schedule
import com.example.mobile.model.Hall
import com.example.mobile.model.User
import com.example.mobile.model.Movie
import com.example.mobile.model.Seat
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Body
import retrofit2.http.Path

interface ApiService {
    @GET("api/movie")
    suspend fun getAllMovies(): List<Movie>

    @GET("api/movie/{movieId}")
    suspend fun getMovieDetails(@Path("movieId") movieId: Int): Movie

    @POST("/api/user/registration")
    fun register(@Body user: User): Call<Void>

    @POST("api/user/login")
    fun login(@Body user: User): Call<Void>

    @GET("api/schedule")
    suspend fun getSchedules(): List<Schedule>

    @GET("api/schedule/{scheduleId}")
    suspend fun getSchedules(@Path("scheduleId") scheduleId: Int): Schedule

    @GET("api/halls/{hallId}")
    suspend fun getHallById(@Path("hallId") hallId: Int): Hall

    @GET("api/food")
    suspend fun getFood(): List<Food>

    @GET("api/halls/{hallId}/seats")
    suspend fun getSeatsByHallId(@Path("hallId") hallId: Int): List<Seat>

    @POST("api/seats")
    suspend fun createSeat(@Body seat: Seat): Seat
}
