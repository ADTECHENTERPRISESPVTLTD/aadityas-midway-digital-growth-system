'use client'

import { Camera, ExternalLink, Flame, Sparkles } from 'lucide-react'

export default function FoodGallery() {
  const galleryItems = [
    {
      title: 'Royal Kabuli Pulao',
      category: 'Afghan Specialty',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=85',
      tag: '🔥 Freshly Simmering',
    },
    {
      title: 'Wood-Fired Baby Lamb Chops',
      category: 'Charcoal Grill',
      image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=85',
      tag: '👑 Chef Secret Recipe',
    },
    {
      title: 'Hong Kong Mango Pomelo Sago',
      category: 'Artisanal Drink',
      image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=85',
      tag: '✨ Customer Favorite',
    },
    {
      title: 'Pan-Seared Atlantic Salmon',
      category: 'Seafood Masterpiece',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=85',
      tag: '🌊 Ocean Fresh',
    },
    {
      title: 'Peshawari Beef Chapli Kebab',
      category: 'Pashtun Grill',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85',
      tag: '🌶 Sizzling Hot',
    },
    {
      title: 'Paneer Loaded Fries',
      category: 'Signature Snacks',
      image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=85',
      tag: '☘ Pure Veg Indulgence',
    },
  ]

  return (
    <section className="luxury-section">
      <div className="section-head">
        <span className="gold-eyebrow">APPETITE & VISUAL GALLERY</span>
        <h2>A Feast For Your Eyes & Palate</h2>
        <p>Explore live culinary preparations and view official menu showcases on our Instagram</p>
      </div>

      {/* Gallery Grid */}
      <div className="gallery-grid-animated">
        {galleryItems.map((item, idx) => (
          <div key={idx} className="gallery-item-card">
            <img src={item.image} alt={item.title} className="gallery-img" />
            <div className="gallery-card-overlay">
              <span className="gallery-tag-pill">{item.tag}</span>
              <div className="gallery-info">
                <span className="gallery-cat">{item.category}</span>
                <h4 className="gallery-title">{item.title}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instagram Official Menu Links */}
      <div className="menu-insta-banner mt-4">
        <div className="banner-left">
          <Camera size={24} className="gold-icon" />
          <div>
            <strong>Follow Aaditya&apos;s Midway on Instagram</strong>
            <p>View live culinary stories, seasonal menus, and customer highlights.</p>
          </div>
        </div>

        <div className="banner-right">
          <a
            href="https://www.instagram.com/p/DZDgEFcGvZ5/?stkn=MTRtM3JhYjVrdnd1cQ=="
            target="_blank"
            rel="noreferrer"
            className="btn-luxury-outline"
          >
            Menu Post 1 <ExternalLink size={14} />
          </a>
          <a
            href="https://www.instagram.com/p/DJFVPpHI9hn/?stkn=eGUwb294cWZweHow"
            target="_blank"
            rel="noreferrer"
            className="btn-luxury-gold"
          >
            Menu Post 2 <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
