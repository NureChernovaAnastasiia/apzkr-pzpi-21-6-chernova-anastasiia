package com.example.mobile.activity

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.mobile.api.ApiService
import com.example.mobile.model.User
import dagger.hilt.android.lifecycle.HiltViewModel
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import javax.inject.Inject

@HiltViewModel
class RegistrationViewModel @Inject constructor(
    private val apiService: ApiService
) : ViewModel() {

    private val _registrationResult = MutableLiveData<Boolean>()
    val registrationResult: LiveData<Boolean> = _registrationResult

    fun register(user: User) {
        apiService.register(user).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    _registrationResult.value = true
                } else {
                    _registrationResult.value = false
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                _registrationResult.value = false
            }
        })
    }
}
