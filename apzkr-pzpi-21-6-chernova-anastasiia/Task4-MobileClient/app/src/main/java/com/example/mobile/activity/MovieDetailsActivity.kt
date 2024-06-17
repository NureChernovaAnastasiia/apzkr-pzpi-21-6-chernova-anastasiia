package com.example.mobile.activity

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import androidx.activity.ComponentActivity
import androidx.appcompat.app.AppCompatActivity  // Ensure you import AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.content.ContextCompat  // Import ContextCompat if needed
import androidx.core.view.get

import com.bumptech.glide.Glide
import com.example.mobile.databinding.ActivityMovieDetailsBinding
import com.example.mobile.model.Movie
import com.example.mobile.MainActivity
import com.example.mobile.R
import com.example.mobile.api.ApiService
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import javax.inject.Inject

@AndroidEntryPoint
class MovieDetailsActivity :BaseActivity() {

    @Inject
    lateinit var apiService: ApiService

    private lateinit var binding: ActivityMovieDetailsBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMovieDetailsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportActionBar?.apply {
            setDisplayHomeAsUpEnabled(true)  // Ensure setDisplayHomeAsUpEnabled is accessible
            setDisplayShowHomeEnabled(true)
        }

        // Load movie details based on movie ID passed from intent
        val movieId = intent.getIntExtra(EXTRA_MOVIE_ID, -1)
        if (movieId == -1) {
            // Handle error: Invalid movie ID
            finish()
        } else {
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val movie = apiService.getMovieDetails(movieId)
                    runOnUiThread {
                        displayMovieDetails(movie)
                    }
                } catch (e: Exception) {
                    // Handle error: API call failed
                    e.printStackTrace()
                }
            }
        }

        binding.buttonReturn.setOnClickListener {
            returnToMainPage()
        }
    }

    private fun displayMovieDetails(movie: Movie) {
        binding.apply {
            textViewTitle.text = movie.title
            textViewDescription.text = movie.description
            textViewGenre.text = "Genre: ${movie.genre}"
            textViewRating.text = "Rating: ${movie.rating}"

            // Load poster image using Glide
            Glide.with(this@MovieDetailsActivity)
                .load(movie.posterURL)
                .into(imageViewPoster)

            // Set click listener for trailer button
            buttonTrailer.setOnClickListener {
                if (movie.trailerURL.isNotBlank()) {
                    // Open trailer URL in a web browser or video player
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(movie.trailerURL))
                    startActivity(intent)
                }
            }
        }
    }

    private fun returnToMainPage() {
        val intent = Intent(this, MainActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK)
        startActivity(intent)
        finish()
    }

    companion object {
        const val EXTRA_MOVIE_ID = "extra_movie_id"
    }
}