package com.example.mobile.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.mobile.databinding.ItemMovieBinding
import com.example.mobile.model.Movie

class MovieAdapter(var movies: List<Movie>, private val listener: OnItemClickListener) : RecyclerView.Adapter<MovieAdapter.MovieViewHolder>() {

    interface OnItemClickListener {
        fun onItemClick(movie: Movie)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MovieViewHolder {
        val binding = ItemMovieBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return MovieViewHolder(binding)
    }

    override fun onBindViewHolder(holder: MovieViewHolder, position: Int) {
        val movie = movies[position]
        holder.bind(movie)
        holder.itemView.setOnClickListener {
            listener.onItemClick(movie)
        }
    }

    override fun getItemCount(): Int = movies.size

    inner class MovieViewHolder(private val binding: ItemMovieBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(movie: Movie) {
            binding.apply {
                textViewTitle.text = movie.title
                textViewDescription.text = movie.description

                Glide.with(root.context)
                    .load(movie.posterURL)
                    .into(imageViewPoster)

                buttonDetails.setOnClickListener {
                    listener.onItemClick(movie)
                }
            }
        }
    }
}
