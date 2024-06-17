package com.example.mobile.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.R
import com.example.mobile.api.ApiService
import com.example.mobile.model.Schedule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.text.SimpleDateFormat
import java.util.*

class ScheduleAdapter(
    private var scheduleList: List<Schedule>,
    private val apiService: ApiService,
    private val onHallClickListener: OnHallClickListener // Interface for click listener
) : RecyclerView.Adapter<ScheduleAdapter.ScheduleViewHolder>() {

    fun updateData(newScheduleList: List<Schedule>) {
        scheduleList = newScheduleList
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ScheduleViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_schedule, parent, false)
        return ScheduleViewHolder(view, apiService, onHallClickListener)
    }

    override fun onBindViewHolder(holder: ScheduleViewHolder, position: Int) {
        val schedule = scheduleList[position]
        holder.bind(schedule)
    }

    override fun getItemCount(): Int = scheduleList.size

    // Interface for click listener
    interface OnHallClickListener {
        fun onHallClick(schedule: Schedule)
    }

    inner class ScheduleViewHolder(
        itemView: View,
        private val apiService: ApiService,
        private val onHallClickListener: OnHallClickListener
    ) : RecyclerView.ViewHolder(itemView) {
        private val cardView: CardView = itemView.findViewById(R.id.cardView)
        private val textViewDate: TextView = itemView.findViewById(R.id.textViewDate)
        private val textViewTime: TextView = itemView.findViewById(R.id.textViewTime)
        private val textViewMovie: TextView = itemView.findViewById(R.id.textViewMovie)
        private val textViewHall: TextView = itemView.findViewById(R.id.textViewHall)
        private val btnGoToHall: Button = itemView.findViewById(R.id.btnGoToHall) // Button for hall

        fun bind(schedule: Schedule) {
            textViewDate.text = formatDate(schedule.date)
            textViewTime.text = "${schedule.startTime}"
            textViewMovie.text = schedule.Movie.title
            textViewHall.text = schedule.Hall.name

            // Handle button click
            btnGoToHall.setOnClickListener {
                onHallClickListener.onHallClick(schedule)
            }
        }

        private fun formatDate(dateString: String): String {
            val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
            val outputFormat = SimpleDateFormat("dd MMMM yyyy", Locale.getDefault())
            val date = inputFormat.parse(dateString)
            return outputFormat.format(date!!)
        }
    }
}
