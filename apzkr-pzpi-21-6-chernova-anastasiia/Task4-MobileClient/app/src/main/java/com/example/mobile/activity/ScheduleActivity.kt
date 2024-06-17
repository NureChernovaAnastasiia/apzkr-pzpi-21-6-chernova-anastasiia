package com.example.mobile.activity

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.R
import com.example.mobile.adapters.ScheduleAdapter
import com.example.mobile.api.ApiService
import com.example.mobile.model.Schedule
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.text.SimpleDateFormat
import java.util.*
import javax.inject.Inject

@AndroidEntryPoint
class ScheduleActivity : BaseActivity(), ScheduleAdapter.OnHallClickListener {

    @Inject
    lateinit var apiService: ApiService

    private lateinit var recyclerView: RecyclerView
    private lateinit var scheduleAdapter: ScheduleAdapter
    private var scheduleList: List<Schedule> = listOf()

    private lateinit var searchEditText: EditText
    private lateinit var sortButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_schedule)

        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        recyclerView = findViewById(R.id.recyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)
        scheduleAdapter = ScheduleAdapter(emptyList(), apiService, this) // Pass `this` as the listener
        recyclerView.adapter = scheduleAdapter

        searchEditText = findViewById(R.id.searchEditText)
        sortButton = findViewById(R.id.sortButton)
        sortButton.setOnClickListener { sortScheduleByDateTime() }

        fetchData()
    }

    private fun fetchData() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val scheduleData = apiService.getSchedules()
                withContext(Dispatchers.Main) {
                    scheduleList = scheduleData
                    scheduleAdapter.updateData(scheduleList)
                    Log.d("ScheduleActivity", "Fetched schedules: $scheduleData")
                }
            } catch (e: Exception) {
                e.printStackTrace()
                Log.e("ScheduleActivity", "Error fetching schedules", e)
            }
        }
    }

    private fun sortScheduleByDateTime() {
        scheduleList = scheduleList.sortedWith(compareBy {
            val sdf = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
            sdf.parse("${it.date} ${it.startTime}")
        })
        scheduleAdapter.updateData(scheduleList)
    }

    // Implement interface method
    override fun onHallClick(schedule: Schedule) {
        val intent = Intent(this, CinemaHallActivity::class.java)
        intent.putExtra("HALL_ID", schedule.Hall.id)
        startActivity(intent)
    }
}
