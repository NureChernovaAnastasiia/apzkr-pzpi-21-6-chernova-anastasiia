package com.example.mobile.activity

import android.content.Intent
import android.os.Bundle
import android.view.Menu
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import com.example.mobile.MainActivity
import com.example.mobile.R

open class BaseActivity : AppCompatActivity() {

    private var isLoggedIn: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        menuInflater.inflate(R.menu.menu_main, menu)
        updateMenuItemsVisibility(menu)
        return true
    }

    override fun onOptionsItemSelected(item: android.view.MenuItem): Boolean {
        when (item.itemId) {
            R.id.menu_home -> {
                startActivity(Intent(this, MainActivity::class.java))
                return true
            }
            R.id.menu_schedule -> {
                startActivity(Intent(this, ScheduleActivity::class.java))
                return true
            }
            R.id.menu_menu -> {
                startActivity(Intent(this, MenuActivity::class.java))
                return true
            }
            R.id.menu_login -> {
                startActivity(Intent(this, LoginActivity::class.java))
                return true
            }
            R.id.menu_register -> {
                startActivity(Intent(this, RegistrationActivity::class.java))
                return true
            }
            R.id.menu_logout -> {
                isLoggedIn = false
                invalidateOptionsMenu()
                // Handle logout actions, e.g., clear user session or data
                return true
            }
        }
        return super.onOptionsItemSelected(item)
    }

    private fun updateMenuItemsVisibility(menu: Menu?) {
        val loginItem = menu?.findItem(R.id.menu_login)
        val registerItem = menu?.findItem(R.id.menu_register)
        val logoutItem = menu?.findItem(R.id.menu_logout)

        if (isLoggedIn) {
            loginItem?.isVisible = false
            registerItem?.isVisible = false
            logoutItem?.isVisible = true
        } else {
            loginItem?.isVisible = true
            registerItem?.isVisible = true
            logoutItem?.isVisible = false
        }
    }

    override fun setContentView(layoutResID: Int) {
        super.setContentView(layoutResID)
        val toolbar: Toolbar? = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
    }
}
