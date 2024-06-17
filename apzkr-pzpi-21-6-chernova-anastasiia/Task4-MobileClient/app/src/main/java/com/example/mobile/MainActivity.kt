package com.example.mobile

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import android.view.Menu
import android.view.MenuItem
import com.example.mobile.activity.*
import com.example.mobile.adapters.MovieAdapter
import com.example.mobile.api.ApiService
import com.example.mobile.model.Movie
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : BaseActivity(), MovieAdapter.OnItemClickListener {

    @Inject
    lateinit var apiService: ApiService

    private lateinit var recyclerView: RecyclerView
    private lateinit var movieAdapter: MovieAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Set up Toolbar
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)

        // Initialize RecyclerView and its adapter
        recyclerView = findViewById(R.id.recyclerView)
        movieAdapter = MovieAdapter(emptyList(), this) // Pass this as listener
        recyclerView.adapter = movieAdapter
        recyclerView.layoutManager = LinearLayoutManager(this)

        // Fetch movie data from API and update the RecyclerView
        CoroutineScope(Dispatchers.IO).launch {
            val list = apiService.getAllMovies()
            runOnUiThread {
                movieAdapter.movies = list // Update the list of movies
                movieAdapter.notifyDataSetChanged() // Notify adapter of data change
            }
        }
    }

    override fun onItemClick(movie: Movie) {
        val intent = Intent(this, MovieDetailsActivity::class.java)
        intent.putExtra(MovieDetailsActivity.EXTRA_MOVIE_ID, movie.id)
        startActivity(intent)
    }
}
