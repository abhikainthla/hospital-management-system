import React from 'react'

const Biography = ({imageUrl}) => {
  return (
    <div className='container biography'>
        <div className='banner'>
            <img src={imageUrl} alt='about-img'></img>
        </div>
        <div className='banner'>
            <p>Biogrphy</p>
            <h3>Who We Are</h3>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus libero suscipit nulla alias exercitationem, saepe quam quos corrupti, magni provident doloribus sunt ratione, neque quia unde harum odit vitae non.
            </p>
            <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit praesentium neque dolor accusantium quasi quaerat officia repellat voluptas beatae, vero ducimus fuga enim commodi aspernatur provident magni eum suscipit necessitatibus?
            </p>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatem!
            </p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti perspiciatis totam illum officiis ab odit, dolorem, autem rerum nam harum, debitis blanditiis error. Sunt sit dignissimos distinctio veniam assumenda vel.</p>
            <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit consectetur, quis cum soluta veniam dolore, laudantium et fuga voluptas pariatur facilis at rem corrupti debitis minima temporibus necessitatibus esse magnam.
            </p>
            <p>Lorem ipsum dolor</p>

        </div>
    </div>
  )
}

export default Biography