import React from 'react'
import { Nav } from './Navabar'
import { Heading } from './Heading'


const Hero = () => {
    return (
        <div>
            <div className='sticky top-0 z-50'>

            <Nav/>
            </div>
            <div className=''>
            <Heading/>
            </div>
        </div>
    )
}
export default Hero 