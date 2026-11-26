import { useEffect, useState } from "react";
import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import hero from "../../public/hero.png";
import heritageBedroom from "../../public/bedroom-heritage.jpeg";

const slideLeftVariant = {
    fromLeft: { x: "-50vw" },
    toRight: {
        x: 0,
        transition: { delay: 0.6, type: "spring", stiffness: 85, when: "beforeChildren" },
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
    visible: { opacity: 1, y: 0, transition: { type: "tween", duration: 1 } },
};

const slides = [
    { src: hero, alt: "Colorful modern sofa in a bright interior" },
    { src: heritageBedroom, alt: "Handcrafted dark wood bed in a warm, heritage-style room" },
];

const Hero = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return undefined;

        const timer = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, 5000);

        return () => window.clearInterval(timer);
    }, [isPaused]);

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
                minW={{ base: "100%", lg: "55%" }}
                justifyContent="end"
                variants={slideRightVariant}
                initial="fromRight"
                animate="toLeft"
            >
                <Box
                    position="relative"
                    width="100%"
                    maxWidth={{ base: "640px", lg: "760px" }}
                    aspectRatio={{ base: "4 / 3", lg: "1.25 / 1" }}
                    overflow="hidden"
                    borderRadius="xl"
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Featured furniture"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onFocus={() => setIsPaused(true)}
                    onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
                    }}
                >
                    <AnimatePresence mode="wait">
                        <Box
                            as={motion.div}
                            key={activeSlide}
                            position="absolute"
                            inset={0}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.65 }}
                        >
                            <Image
                                src={slides[activeSlide].src}
                                alt={slides[activeSlide].alt}
                                fill
                                priority={activeSlide === 0}
                                sizes="(max-width: 768px) 100vw, 55vw"
                                style={{ objectFit: "cover" }}
                            />
                        </Box>
                    </AnimatePresence>

                    <Flex
                        position="absolute"
                        bottom={4}
                        left="50%"
                        transform="translateX(-50%)"
                        alignItems="center"
                        gap={2}
                        padding={2}
                        borderRadius="full"
                        background="rgba(24, 18, 15, 0.48)"
                    >
                        {slides.map((slide, index) => (
                            <Button
                                key={slide.alt}
                                aria-label={`Show image ${index + 1}: ${slide.alt}`}
                                aria-current={activeSlide === index ? "true" : undefined}
                                onClick={() => setActiveSlide(index)}
                                minWidth={activeSlide === index ? 7 : 2}
                                width={activeSlide === index ? 7 : 2}
                                height={2}
                                padding={0}
                                borderRadius="full"
                                background={activeSlide === index ? "white" : "whiteAlpha.600"}
                                _hover={{ background: "white" }}
                                _focusVisible={{ outline: "2px solid white", outlineOffset: "2px" }}
                            />
                        ))}
                        <Button
                            aria-label={isPaused ? "Play image rotation" : "Pause image rotation"}
                            onClick={() => setIsPaused((paused) => !paused)}
                            minWidth={8}
                            height={8}
                            padding={0}
                            color="white"
                            background="transparent"
                            _hover={{ background: "whiteAlpha.300" }}
                            fontSize="xs"
                        >
                            {isPaused ? "Play" : "Pause"}
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Hero;
