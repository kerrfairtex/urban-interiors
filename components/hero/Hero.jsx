import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

import hero01 from "../../public/hero/hero-01.jpg";
import hero02 from "../../public/hero/hero-02.jpg";
import hero03 from "../../public/hero/hero-03.jpg";
import hero04 from "../../public/hero/hero-04.jpg";
import hero05 from "../../public/hero/hero-05.jpg";
import hero06 from "../../public/hero/hero-06.jpg";
import hero07 from "../../public/hero/hero-07.jpg";
import hero08 from "../../public/hero/hero-08.jpg";
import hero09 from "../../public/hero/hero-09.jpg";
import hero10 from "../../public/hero/hero-10.jpg";
import heritageBedroom from "../../public/bedroom-heritage.jpeg";

const heroPhotos = [
    { src: hero01, alt: "Sofa: leather sofa with a solid wood side table" },
    { src: hero02, alt: "Bed: wooden bed frame in a wood-panelled bedroom" },
    { src: heritageBedroom, alt: "Handcrafted dark wood bed frame in a warm, heritage-style room" },
    { src: hero03, alt: "TV console: light wood TV console with open shelving" },
    { src: hero04, alt: "Table and chair: modern wooden dining table with chairs" },
    { src: hero05, alt: "Wardrobe: open wooden wardrobe with drawers and shelves" },
    { src: hero06, alt: "Shelf: tall wooden bookshelf with a library ladder" },
    { src: hero07, alt: "Shoe rack: rustic wooden shoe rack" },
    { src: hero08, alt: "Doors: wooden doors in wood-panelled walls" },
    { src: hero09, alt: "Sofa: minimalist sofa beside a wooden sideboard" },
    { src: hero10, alt: "Table and chair: live-edge wooden dining table with chairs" },
];

const SLIDE_INTERVAL_MS = 3000;

const HeroSlideshow = () => {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return undefined;

        const timer = window.setInterval(
            () => setCurrent((index) => (index + 1) % heroPhotos.length),
            SLIDE_INTERVAL_MS
        );
        return () => window.clearInterval(timer);
    }, [isPaused]);

    return (
        <Box
            position="relative"
            width="full"
            maxWidth="720px"
            overflow="hidden"
            rounded="2xl"
            boxShadow="xl"
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured furniture"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
            }}
            style={{ aspectRatio: "3 / 2" }}
        >
            {heroPhotos.map((photo, index) => (
                <Box
                    key={photo.alt}
                    as={motion.div}
                    position="absolute"
                    inset={0}
                    initial={false}
                    animate={{
                        opacity: index === current ? 1 : 0,
                        scale: index === current ? 1 : 1.08,
                    }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    aria-hidden={index !== current}
                >
                    <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 992px) 100vw, 55vw"
                        style={{ objectFit: "cover" }}
                        placeholder="blur"
                        priority={index === 0}
                    />
                </Box>
            ))}

            <Flex
                position="absolute"
                bottom={3}
                left={0}
                right={0}
                justifyContent="center"
                alignItems="center"
                gap={2}
            >
                {heroPhotos.map((photo, index) => (
                    <Box
                        key={photo.alt}
                        as="button"
                        type="button"
                        aria-label={`Show photo ${index + 1}: ${photo.alt}`}
                        aria-current={index === current ? "true" : undefined}
                        onClick={() => setCurrent(index)}
                        width={index === current ? 6 : 2}
                        height={2}
                        rounded="full"
                        bgColor={index === current ? "white" : "whiteAlpha.600"}
                        transition="all .4s"
                        _focusVisible={{ outline: "2px solid white", outlineOffset: "2px" }}
                    />
                ))}
                <Button
                    type="button"
                    aria-label={isPaused ? "Play image rotation" : "Pause image rotation"}
                    onClick={() => setIsPaused((paused) => !paused)}
                    minWidth={8}
                    height={8}
                    padding={0}
                    color="white"
                    background="blackAlpha.600"
                    _hover={{ background: "blackAlpha.800" }}
                    fontSize="xs"
                >
                    {isPaused ? "Play" : "Pause"}
                </Button>
            </Flex>
        </Box>
    );
};

const slideLeftVariant = {
    fromLeft: { x: "-50vw" },
    toRight: {
        x: 0,
        transition: {
            delay: 0.6,
            type: "spring",
            stiffness: 85,
            when: "beforeChildren",
        },
    },
};

const slideRightVariant = {
    fromRight: { x: "100vw" },
    toLeft: {
        x: 0,
        transition: { delay: 1, type: "spring", stiffness: 85 },
    },
};

const fadeInVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "tween", duration: 1 },
    },
};

const Hero = () => {
    return (
        <Flex
            as="section"
            minHeight={{ base: "70vh", lg: "85vh" }}
            paddingX={{ base: 6, lg: 12 }}
            justifyContent={{ base: "start", lg: "space-between" }}
            alignItems="center"
            flexDirection={{ base: "column-reverse", lg: "row" }}
        >
            <VStack
                as={motion.div}
                flexDirection="column"
                alignItems="start"
                justifyContent="space-evenly"
                mt={{ base: 8, lg: 0 }}
                maxWidth={{ base: "100%", lg: "45%" }}
                spacing={8}
                variants={slideLeftVariant}
                initial="fromLeft"
                animate="toRight"
            >
                <Text
                    as="h1"
                    fontWeight="black"
                    fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                    textColor="black"
                    lineHeight="shorter"
                >
                    Discover innovative ways to <Text as="span" color="accent.500" fontStyle="italic">decorate</Text>
                </Text>

                <Text textColor="gray.700" maxWidth="md" fontWeight="medium">
                    We are passionate about creating beautiful spaces that inspire and delight.
                    Shop with us to get amazing offers.
                </Text>

                <Button
                    as={motion.div}
                    variants={fadeInVariant}
                    initial="hidden"
                    animate="visible"
                    variant="solid"
                    onClick={() => {
                        const element = document.getElementById("products");
                        element?.scrollIntoView({ behavior: "smooth" });
                    }}
                >
                    Start shopping
                </Button>
            </VStack>

            <Flex
                as={motion.div}
                minW="55%"
                w={{ base: "full", lg: "auto" }}
                mt={{ base: 4, lg: 0 }}
                justifyContent={{ base: "center", lg: "end" }}
                variants={slideRightVariant}
                initial="fromRight"
                animate="toLeft"
            >
                <HeroSlideshow />
            </Flex>
        </Flex>
    );
};

export default Hero;
