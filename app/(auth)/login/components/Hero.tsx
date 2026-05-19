import React from 'react'
import HeroContent from './HeroContent'
import HeroFeatureList from './HeroFeatureList'

const Hero = () => {
  return (
    <div className="px-[72px] py-[56px] flex flex-col justify-between">
      <img src={"/images/logo.png"} className='w-[150px] h-auto'/>
      <HeroContent/>
      <HeroFeatureList/>
    </div>
  )
}

export default Hero

