package com.example.mobile.activity

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.example.mobile.MainActivity
import com.example.mobile.R
import com.example.mobile.api.ApiService
import com.example.mobile.model.User
import dagger.hilt.android.AndroidEntryPoint
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import javax.inject.Inject

@AndroidEntryPoint
class RegistrationActivity : BaseActivity() {

    @Inject
    lateinit var apiService: ApiService

    private lateinit var emailEditText: EditText
    private lateinit var passwordEditText: EditText
    private lateinit var registerButton: Button

    private val viewModel: RegistrationViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_registration)

        emailEditText = findViewById(R.id.editTextEmail)
        passwordEditText = findViewById(R.id.editTextPassword)
        registerButton = findViewById(R.id.buttonRegister)

        registerButton.setOnClickListener {
            val email = emailEditText.text.toString()
            val password = passwordEditText.text.toString()

            val user = User(email = email, password = password)

            viewModel.register(user)
        }

        observeRegistrationResult()
    }

    private fun observeRegistrationResult() {
        viewModel.registrationResult.observe(this) { result ->
            if (result) {
                Toast.makeText(this@RegistrationActivity, "Registration successful", Toast.LENGTH_SHORT).show()
                startActivity(Intent(this@RegistrationActivity, MainActivity::class.java))
                finish()
            } else {
                Toast.makeText(this@RegistrationActivity, "Registration failed", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
