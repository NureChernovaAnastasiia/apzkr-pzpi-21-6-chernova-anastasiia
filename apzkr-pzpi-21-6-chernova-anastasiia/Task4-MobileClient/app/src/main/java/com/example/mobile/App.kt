package com.example.mobile

import android.app.Application
import com.example.mobile.api.ApiService
import dagger.hilt.android.HiltAndroidApp
import javax.inject.Inject

@HiltAndroidApp
class App : Application() {

    @Inject
    lateinit var apiService: ApiService

    override fun onCreate() {
        super.onCreate()

    }
}
