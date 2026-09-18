'use client'

import { Camera, ExternalLink, X } from 'lucide-react'
import { useState } from 'react'

interface GalleryItem {
  title: string
  category: string
  image: string
  tag: string
}

export default function FoodGallery() {
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const galleryItems: GalleryItem[] = [
    {
      title: 'Royal Kabuli Pulao',
      category: 'Afghan Specialty',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=85',
      tag: 'Freshly Simmering',
    },
    {
      title: 'Wood-Fired Baby Lamb Chops',
      category: 'Charcoal Grill',
      image: 'https://plus.unsplash.com/premium_photo-1693221705288-7a2531eaa5e5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNoYXJjb2FsJTIwZ3JpbGx8ZW58MHx8MHx8fDA%3D',
      tag: 'Chef Secret Recipe',
    },
    {
      title: 'Hong Kong Mango Pomelo Sago',
      category: 'Artisanal Drink',
      image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=85',
      tag: 'Customer Favorite',
    },
    {
      title: 'Pan-Seared Atlantic Salmon',
      category: 'Seafood Masterpiece',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=85',
      tag: 'Ocean Fresh',
    },
    {
      title: 'Peshawari Beef Chapli Kebab',
      category: 'Pashtun Grill',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85',
      tag: 'Sizzling Hot',
    },
    {
      title: 'Paneer Loaded Fries',
      category: 'Signature Snacks',
      image: 'https://media.istockphoto.com/id/1142391723/photo/french-fries-with-mayonese-and-vegetables.webp?a=1&b=1&s=612x612&w=0&k=20&c=NPyVHwpyv9F90OBRzMxjsu612rwS8JCA1mkjm5xDUoM=',
      tag: 'Pure Veg Indulgence',
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
          <figure
            key={idx}
            className="gallery-item-card"
            role="button"
            tabIndex={0}
            aria-label={`View ${item.title} - ${item.category}`}
            onClick={() => setSelected(item)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setSelected(item)
              }
            }}
          >
            <img src={item.image} alt={item.title} className="gallery-img" loading="lazy" />
            <figcaption className="gallery-card-overlay">
              <span className="gallery-tag-pill">{item.tag}</span>
              <div className="gallery-info">
                <span className="gallery-cat">{item.category}</span>
                <h4 className="gallery-title">{item.title}</h4>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onClick={() => setSelected(null)}
        >
          <button
            className="close-btn"
            aria-label="Close gallery lightbox"
            onClick={() => setSelected(null)}
          >
            <X size={22} />
          </button>
          <img src={selected.image} alt={selected.title} className="gallery-lightbox-img" />
          <div className="gallery-lightbox-info">
            <span className="gallery-cat">{selected.category}</span>
            <h4>{selected.title}</h4>
          </div>
        </div>
      )}

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
