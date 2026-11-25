import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image"
import { useEffect, useState } from "react";

import hero01 from '../../public/hero/hero-01.jpg'
import hero02 from '../../public/hero/hero-02.jpg'
import hero03 from '../../public/hero/hero-03.jpg'
import hero04 from '../../public/hero/hero-04.jpg'
import hero05 from '../../public/hero/hero-05.jpg'
import hero06 from '../../public/hero/hero-06.jpg'
import hero07 from '../../public/hero/hero-07.jpg'
import hero08 from '../../public/hero/hero-08.jpg'
import hero09 from '../../public/hero/hero-09.jpg'
import hero10 from '../../public/hero/hero-10.jpg'

// CC0 interior photos of wooden furniture; sources in ./photo-sources.md
const heroPhotos = [
    { src: hero01, alt: 'Bedroom with a warm wooden headboard wall' },
    { src: hero02, alt: 'Living room with a rustic wooden coffee table' },
    { src: hero03, alt: 'Solid wood dining table with a wooden bench' },
    { src: hero04, alt: 'Lounge with wood-panelled walls overlooking a lake' },
    { src: hero05, alt: 'Patterned armchair with a wooden side table' },
    { src: hero06, alt: 'Living room with a dark wooden coffee table and fireplace' },
    { src: hero07, alt: 'Modern lounge with wooden-framed chairs' },
    { src: hero08, alt: 'Sunroom with a wooden ceiling and furniture' },
    { src: hero09, alt: 'Grey sofa with a wooden coffee table' },
    { src: hero10, alt: 'Dining room with a wooden table and upholstered chairs' }
]

const SLIDE_INTERVAL_MS = 3000

// Rotates through the photos every 3 seconds with a crossfade and slow zoom.
// All images stay mounted so each change is instant once they have loaded.
const HeroSlideshow = () => {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(
            () => setCurrent(i => (i + 1) % heroPhotos.length),
            SLIDE_INTERVAL_MS
        )
        return () => clearInterval(timer)
    }, [])

    return (
        <Box
            position={'relative'}
            width={'full'}
            maxWidth={'720px'}
            overflow={'hidden'}
            rounded={'2xl'}
            boxShadow={'xl'}
            style={{ aspectRatio: '3 / 2' }}>
            {heroPhotos.map((photo, i) => (
                <Box
                    key={i}
                    as={motion.div}
                    position={'absolute'}
                    inset={0}
                    initial={false}
                    animate={{
                        opacity: i === current ? 1 : 0,
                        scale: i === current ? 1 : 1.08
                    }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    aria-hidden={i !== current}>
                    <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes={'(max-width: 992px) 100vw, 55vw'}
                        style={{ objectFit: 'cover' }}
                        placeholder={'blur'}
                        priority={i === 0}
                    />
                </Box>
            ))}

            <Flex
                position={'absolute'}
                bottom={3}
                left={0}
                right={0}
                justifyContent={'center'}
                gap={2}>
                {heroPhotos.map((_, i) => (
                    <Box
                        key={i}
                        as={'button'}
                        aria-label={`Show photo ${i + 1}`}
                        onClick={() => setCurrent(i)}
                        width={i === current ? 6 : 2}
                        height={2}
                        rounded={'full'}
                        bgColor={i === current ? 'white' : 'whiteAlpha.600'}
                        transition={'all .4s'}
                    />
                ))}
            </Flex>
        </Box>
    )
}

const slideLeftVariant = {
    fromLeft: {
        x: '-50vw'
    },
    toRight: {
        x: 0,
        transition: {
            delay: 0.6,
            type: 'spring',
            stiffness: 85,
            when: 'beforeChildren'
        }
    }
}

const slideRightVariant = {
    fromRight: {
        x: '100vw'
    },
    toLeft: {
        x: 0,
        transition: {
            delay: 1,
            type: 'spring',
            stiffness: 85
        }
    }
}

const fadeInVariant = {
    hidden: {
        opacity: 0,
        y: 10
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'tween',
            duration: 1
        }
    }
}

const Hero = () => {
    return (
        <Flex
            as={'section'}
            minHeight={{base: '70vh', lg: '85vh'}}
            paddingX={{base: 6, lg: 12}}
            justifyContent={{base: 'start', lg: 'space-between'}}
            alignItems={'center'}
            flexDirection={{base: 'column-reverse', lg: 'row'}}>

            <VStack
                as={motion.div}
                flexDirection={'column'}
                alignItems={'start'}
                justifyContent={'space-evenly'}
                mt={{base: 8, lg: 0}}
                maxWidth={{base: '100%', lg: '45%'}}
                spacing={8}
                variants={slideLeftVariant}
                initial={'fromLeft'}
                animate={'toRight'}>

                <Text
                    as={'h1'}
                    fontWeight={'black'}
                    fontSize={{base: '3xl', md: '4xl', lg: '5xl'}}
                    textColor={'black'}
                    lineHeight={'shorter'}>
                    Discover innovative ways to <Text as={'span'} color={'accent.500'} fontStyle={'italic'}>decorate</Text>
                </Text>

                <Text
                    textColor={'gray.700'}
                    maxWidth={'md'}
                    fontWeight={'medium'}>
                    We are passionate about creating beautiful spaces that inspire and delight.
                    Shop with us to get amazing offers.
                </Text>

                <Button
                    as={motion.div}
                    variants={fadeInVariant}
                    initial={'hidden'}
                    animate={'visible'}
                    variant={'solid'}
                    onClick={() => {
                        const element = document.getElementById('products')
                        element?.scrollIntoView({
                            behavior: 'smooth'
                        })
                    }}>
                    Start shopping
                </Button>
            </VStack>

            <Flex
                as={motion.div}
                minW={'55%'}
                w={{ base: 'full', lg: 'auto' }}
                mt={{ base: 4, lg: 0 }}
                justifyContent={{ base: 'center', lg: 'end' }}
                variants={slideRightVariant}
                initial={'fromRight'}
                animate={'toLeft'}>
                <HeroSlideshow />
            </Flex>

        </Flex>
    )
}

export default Hero