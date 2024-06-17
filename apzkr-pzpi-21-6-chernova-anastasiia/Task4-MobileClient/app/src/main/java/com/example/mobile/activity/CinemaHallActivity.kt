package com.example.mobile.activity

import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.example.mobile.R
import com.example.mobile.api.ApiService
import com.example.mobile.model.Schedule
import com.example.mobile.model.Seat
import com.example.mobile.model.Hall
import com.example.mobile.model.Movie
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import javax.inject.Inject
import java.text.SimpleDateFormat
import java.util.Locale

@AndroidEntryPoint
class CinemaHallActivity : BaseActivity() {

    @Inject
    lateinit var apiService: ApiService

    private lateinit var tvHallName: TextView
    private lateinit var tvTotalSeats: TextView
    private lateinit var layoutSchedules: LinearLayout
    private lateinit var layoutHall: LinearLayout
    private lateinit var btnReturn: Button
    private lateinit var btnConfirmPurchase: Button

    private var hallId: Int = -1
    private lateinit var selectedHall: Hall
    private val selectedSeats = mutableListOf<Seat>()
    private val movieTitles = mutableMapOf<Int, String>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cinema_hall)

        tvHallName = findViewById(R.id.tvHallName)
        tvTotalSeats = findViewById(R.id.tvTotalSeats)
        layoutSchedules = findViewById(R.id.layoutSchedules)
        layoutHall = findViewById(R.id.layoutHall)
        btnReturn = findViewById(R.id.btnReturn)
        btnConfirmPurchase = findViewById(R.id.btnConfirmPurchase)

        hallId = intent.getIntExtra("HALL_ID", -1)
        if (hallId != -1) {
            fetchHallData(hallId)
        }

        btnReturn.setOnClickListener {
            finish()
        }

        btnConfirmPurchase.setOnClickListener {
            confirmPurchase()
        }
    }

    private fun fetchHallData(hallId: Int) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val hallData = apiService.getHallById(hallId)
                val seatsData = apiService.getSeatsByHallId(hallId)
                val schedulesData = apiService.getSchedules()
                val hallSchedules = schedulesData.filter { it.hallId == hallId }

                selectedHall = hallData
                runOnUiThread {
                    displayHallData(hallData, hallSchedules, seatsData)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
    private fun formatDateTime(dateString: String, timeString: String): String {
        val locale = Locale.getDefault()
        val dateFormat = SimpleDateFormat("yyyy-MM-dd", locale)
        val timeFormat = SimpleDateFormat("HH:mm:ss", locale)
        val outputDateFormat = SimpleDateFormat("dd MMM yyyy", locale)
        val outputTimeFormat = SimpleDateFormat("hh:mm a", locale)

        val date = dateFormat.parse(dateString)
        val time = timeFormat.parse(timeString)

        val formattedDate = outputDateFormat.format(date)
        val formattedTime = outputTimeFormat.format(time)

        return "$formattedDate, $formattedTime"
    }


    private fun displayHallData(hall: Hall, schedules: List<Schedule>, seats: List<Seat>) {
        tvHallName.text = hall.name
        tvTotalSeats.text = "Total Seats: ${hall.totalSeats}"

        layoutSchedules.removeAllViews()
        schedules.forEach { schedule ->
            CoroutineScope(Dispatchers.IO).launch {
                val movieTitle = fetchMovieTitle(schedule.movieId)
                withContext(Dispatchers.Main) {
                    val formattedDateTime = formatDateTime(schedule.date, schedule.startTime)
                    val scheduleText = TextView(this@CinemaHallActivity).apply {
                        text = "Date: $formattedDateTime, Movie: $movieTitle"
                    }
                    layoutSchedules.addView(scheduleText)
                }
            }
        }

        layoutHall.removeAllViews()

        // Add "Screen" label
        val screenLabel = TextView(this).apply {
            text = "Screen"
            textSize = 20f
            textAlignment = TextView.TEXT_ALIGNMENT_CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }
        layoutHall.addView(screenLabel)

        val seatsInRow = 10
        val totalSeats = hall.totalSeats
        val occupiedSeats = seats.map { it.seatNumber }

        for (i in 0 until totalSeats step seatsInRow) {
            val rowLayout = LinearLayout(this).apply {
                orientation = LinearLayout.HORIZONTAL
            }

            // Add row label
            val rowLabel = TextView(this).apply {
                text = "Row ${(i / seatsInRow) + 1}"
                textSize = 16f
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.MATCH_PARENT
                )
            }
            rowLayout.addView(rowLabel)

            for (j in 0 until seatsInRow) {
                val seatNumber = i + j + 1
                val seat = Seat(id = 0, seatNumber = seatNumber, rowNumber = (seatNumber - 1) / seatsInRow + 1, hallId = hallId)
                val seatButton = Button(this).apply {
                    text = seatNumber.toString()
                    isEnabled = !occupiedSeats.contains(seatNumber)
                    setOnClickListener {
                        if (selectedSeats.contains(seat)) {
                            selectedSeats.remove(seat)
                            setBackgroundResource(android.R.drawable.btn_default)
                        } else {
                            selectedSeats.add(seat)
                            setBackgroundResource(android.R.drawable.btn_default_small)
                        }
                        btnConfirmPurchase.isEnabled = selectedSeats.isNotEmpty()
                    }
                }
                rowLayout.addView(seatButton)
            }
            layoutHall.addView(rowLayout)
        }
    }


    private suspend fun fetchMovieTitle(movieId: Int): String {
        return movieTitles.getOrPut(movieId) {
            try {
                val movie = apiService.getMovieDetails(movieId)
                movie.title
            } catch (e: Exception) {
                e.printStackTrace()
                "Unknown"
            }
        }
    }

    private fun confirmPurchase() {
        val selectedSeatsText = selectedSeats.joinToString { "Row ${it.rowNumber}, Seat ${it.seatNumber}" }
        AlertDialog.Builder(this)
            .setTitle("Confirm Purchase")
            .setMessage("Selected Seats: $selectedSeatsText")
            .setPositiveButton("Confirm") { dialog, _ ->
                CoroutineScope(Dispatchers.IO).launch {
                    try {
                        selectedSeats.forEach { seat ->
                            apiService.createSeat(seat)
                        }
                        withContext(Dispatchers.Main) {
                            selectedSeats.clear()
                            btnConfirmPurchase.isEnabled = false
                            fetchHallData(hallId)
                            dialog.dismiss()
                        }
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            }
            .setNegativeButton("Cancel") { dialog, _ ->
                dialog.dismiss()
            }
            .show()
    }
}
