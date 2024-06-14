import React from 'react'

const Hero = ({title, imageUrl}) => {
  return (
    <div className='hero container'>
        <div className='banner'>
            <h1>{title}</h1>
            <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates reprehenderit aliquam veritatis eaque ullam ipsum ea unde optio suscipit sunt? Officiis dolorum magni reprehenderit enim eveniet tempore harum necessitatibus ratione?
            </p>
        </div>
    <div className='banner'>
        <img src={imageUrl} alt='hero' className='animated-image'></img>
        <span>
            <img src='/Vector.png' alt='vector'></img>
        </span>
    </div>
    </div>
  )
}

export default Hero