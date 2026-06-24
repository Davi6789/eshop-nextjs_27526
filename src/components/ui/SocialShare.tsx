 // src/components/ui/SocialShare.tsx 

 "use client"

import { useState } from "react"

interface SocialShareProps {
  title: string
  url: string
  image?: string
  description?: string
}

export default function SocialShare({ title, url, image, description }: SocialShareProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDesc = encodeURIComponent(description || title)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${image}&description=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url)
    setShowTooltip(true)
    setTimeout(() => setShowTooltip(false), 2000)
  }

  const socialButtons = [
    { name: "Facebook", icon: "📘", color: "bg-[#1877f2]", link: shareLinks.facebook },
    { name: "Twitter", icon: "🐦", color: "bg-[#1da1f2]", link: shareLinks.twitter },
    { name: "WhatsApp", icon: "💬", color: "bg-[#25d366]", link: shareLinks.whatsapp },
    { name: "LinkedIn", icon: "🔗", color: "bg-[#0077b5]", link: shareLinks.linkedin },
    { name: "Pinterest", icon: "📌", color: "bg-[#bd081c]", link: shareLinks.pinterest },
    { name: "Email", icon: "📧", color: "bg-gray-600", link: shareLinks.email },
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Diesen Artikel teilen
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {socialButtons.map((social) => (
          <a
            key={social.name}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`${social.color} text-white px-3 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2 text-sm`}
          >
            <span>{social.icon}</span>
            <span className="hidden sm:inline">{social.name}</span>
          </a>
        ))}
        
        <button
          onClick={copyToClipboard}
          className="relative bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition flex items-center gap-2 text-sm"
        >
          <span>🔗</span>
          <span className="hidden sm:inline">Link kopieren</span>
          
          {showTooltip && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Kopiert! ✓
            </div>
          )}
        </button>
      </div>
    </div>
  )
}