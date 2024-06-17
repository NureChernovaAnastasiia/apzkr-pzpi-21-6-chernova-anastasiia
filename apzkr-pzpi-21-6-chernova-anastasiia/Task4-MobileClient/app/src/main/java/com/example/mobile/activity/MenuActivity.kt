package com.example.mobile.activity

import android.os.Bundle
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.R
import com.example.mobile.adapters.MenuAdapter
import com.example.mobile.api.ApiService
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import javax.inject.Inject

@AndroidEntryPoint
class MenuActivity : BaseActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: MenuAdapter

    @Inject
    lateinit var apiService: ApiService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_menu)

        recyclerView = findViewById(R.id.recyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)
        adapter = MenuAdapter(emptyList())
        recyclerView.adapter = adapter

        fetchMenuItems()
    }

    private fun fetchMenuItems() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val menuItems = apiService.getFood()
                withContext(Dispatchers.Main) {
                    adapter.updateMenuItems(menuItems)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
