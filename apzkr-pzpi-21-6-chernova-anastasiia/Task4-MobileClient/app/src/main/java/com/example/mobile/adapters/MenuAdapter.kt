package com.example.mobile.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.mobile.R
import com.example.mobile.model.Food

class MenuAdapter(private var menuItems: List<Food>) : RecyclerView.Adapter<MenuAdapter.MenuViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MenuViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_menu, parent, false)
        return MenuViewHolder(view)
    }

    override fun onBindViewHolder(holder: MenuViewHolder, position: Int) {
        val menuItem = menuItems[position]
        holder.bind(menuItem)
    }

    override fun getItemCount(): Int {
        return menuItems.size
    }

    fun updateMenuItems(newMenuItems: List<Food>) {
        menuItems = newMenuItems
        notifyDataSetChanged()
    }

    class MenuViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val nameTextView: TextView = itemView.findViewById(R.id.nameTextView)
        private val descriptionTextView: TextView = itemView.findViewById(R.id.descriptionTextView)
        private val priceTextView: TextView = itemView.findViewById(R.id.priceTextView)
        private val imageView: ImageView = itemView.findViewById(R.id.imageView)

        fun bind(menuItem: Food) {
            nameTextView.text = menuItem.name
            descriptionTextView.text = menuItem.description
            priceTextView.text = "${menuItem.price} UAH"
            Glide.with(itemView.context)
                .load(menuItem.imgURL)
                .into(imageView)
        }
    }
}
