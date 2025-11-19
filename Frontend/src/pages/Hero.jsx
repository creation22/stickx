import React from 'react'
import { Heading } from './Heading'
import AccordionUsage from './Questions.jsx'
import TweetGrid from './Tweets'
import { Results } from './Results'

const Hero = () => {
    return (
        <div className='relative z-10'>
            <Heading />
            <Results />
            <AccordionUsage />
            <TweetGrid />
        </div>
    )
}

export default Hero
