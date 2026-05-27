import { AlbumBanner } from '@/app/(customer)/album/[ma_album]/components/AlbumBanner'
import React from 'react'

const PhotographerDetailAlbum = () => {
  return (
    <div>
      <AlbumBanner
        ten_alb="Album Title"
        totalPhotos={100}
        totalFavorites={50}
        totalFeedback={10}
        kicker="Album của tôi"
        description="Description Text"
      />
    </div>
  )
}

export default PhotographerDetailAlbum
