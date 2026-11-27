import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { CaretLeft, CaretRight } from "phosphor-react";
import { useEffect, useRef, useState } from "react";

import kaElton01 from "../../public/ka-elton/ka-elton-01.jpg";
import kaElton02 from "../../public/ka-elton/ka-elton-02.jpg";
import kaElton03 from "../../public/ka-elton/ka-elton-03.jpg";
import kaElton04 from "../../public/ka-elton/ka-elton-04.jpg";
import kaElton05 from "../../public/ka-elton/ka-elton-05.jpg";
import kaElton06 from "../../public/ka-elton/ka-elton-06.jpg";
import kaElton07 from "../../public/ka-elton/ka-elton-07.jpg";
import kaElton08 from "../../public/ka-elton/ka-elton-08.jpg";
import kaElton09 from "../../public/ka-elton/ka-elton-09.jpg";
import kaElton10 from "../../public/ka-elton/ka-elton-10.jpg";
import kaElton11 from "../../public/ka-elton/ka-elton-11.jpg";
import kaElton12 from "../../public/ka-elton/ka-elton-12.jpg";
import kaElton13 from "../../public/ka-elton/ka-elton-13.jpg";
import kaElton14 from "../../public/ka-elton/ka-elton-14.jpg";
import kaElton15 from "../../public/ka-elton/ka-elton-15.jpg";
import kaElton17 from "../../public/ka-elton/ka-elton-17.jpg";
import kaElton18 from "../../public/ka-elton/ka-elton-18.jpg";
import kaElton19 from "../../public/ka-elton/ka-elton-19.jpg";
import kaElton20 from "../../public/ka-elton/ka-elton-20.jpg";
import kaElton21 from "../../public/ka-elton/ka-elton-21.jpg";
import kaElton22 from "../../public/ka-elton/ka-elton-22.jpg";
import kaElton23 from "../../public/ka-elton/ka-elton-23.jpg";
import kaElton24 from "../../public/ka-elton/ka-elton-24.jpg";
import kaElton25 from "../../public/ka-elton/ka-elton-25.jpg";

const heroPhotos = [
    { src: kaElton01, alt: "Solid wood panelled door standing in the Ka Elton workshop" },
    { src: kaElton02, alt: "Curved wooden bedside cabinet with open shelves" },
    { src: kaElton03, alt: "Wooden bedside cabinets and shelving units awaiting finishing" },
    { src: kaElton04, alt: "Tall wooden wardrobe frame with open shelves" },
    { src: kaElton05, alt: "Craftsman fitting a wooden door with decorative inlay" },
    { src: kaElton06, alt: "Long wooden shoe rack with slatted shelves" },
    { src: kaElton07, alt: "Panelled wooden door with a warm varnish finish" },
    { src: kaElton08, alt: "Craftsman spray-varnishing a wooden door" },
    { src: kaElton09, alt: "Finished slatted wooden bed frame outside the workshop" },
    { src: kaElton10, alt: "Live-edge solid wood slabs ready for tabletops" },
    { src: kaElton11, alt: "Craftsmen planing timber boards in the workshop" },
    { src: kaElton12, alt: "Craftsman shaping a timber board at the planer" },
    { src: kaElton13, alt: "Craftsman cutting timber at the workshop saw" },
    { src: kaElton14, alt: "Stacks of timber in the open-air workshop" },
    { src: kaElton15, alt: "Craftsman finishing a long wooden shoe rack" },
    { src: kaElton17, alt: "Wooden shoe rack and shelving units in the workshop" },
    { src: kaElton18, alt: "Craftsman spray-varnishing a slatted wooden bed frame" },
    { src: kaElton19, alt: "Craftsman preparing a curved wooden bedside cabinet for finishing" },
    { src: kaElton20, alt: "Craftsman spray-finishing a curved wooden bedside cabinet" },
    { src: kaElton21, alt: "Curved wooden bedside cabinet with open shelves beside a matching side table" },
    { src: kaElton22, alt: "Craftsman varnishing a wooden bed with a panelled headboard" },
    { src: kaElton23, alt: "Row of new slatted wooden bed frames in the workshop yard" },
    { src: kaElton24, alt: "Finished wooden bed frames lined up outside the workshop" },
    { src: kaElton25, alt: "Boy sitting on a newly built wooden bed frame in the workshop yard" },
];

const SLIDE_INTERVAL_MS = 5000;
const SWIPE_THRESHOLD_PX = 40;

const arrowButtonProps = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    minWidth: 10,
    height: 10,
    padding: 0,
    rounded: "full",
    color: "white",
    background: "blackAlpha.500",
    _hover: { background: "blackAlpha.700" },
    _active: { background: "blackAlpha.800" },
};

const HeroSlideshow = () => {
    const prefersReducedMotion = useReducedMotion();
    const [current, setCurrent] = useState(0);
    // Rotation pauses while a mouse hovers or keyboard focus is inside.
    const [isHovered, setIsHovered] = useState(false);
    const [hasFocus, setHasFocus] = useState(false);
    const touchStartX = useRef(null);

    // Autoplay even when the device asks for reduced motion (Android turns that on
    // with "Remove animations" and often Battery Saver): slides then just crossfade
    // without the zoom.
    const isRotating = !isHovered && !hasFocus;

    // Restart the countdown after every slide change, so a manual change
    // gets the full interval before the next automatic one.
    useEffect(() => {
        if (!isRotating) return undefined;

        const timer = window.setTimeout(
            () => setCurrent((index) => (index + 1) % heroPhotos.length),
            SLIDE_INTERVAL_MS
        );
        return () => window.clearTimeout(timer);
    }, [isRotating, current]);

    const total = heroPhotos.length;
    const showPrevious = () => setCurrent((index) => (index - 1 + total) % total);
    const showNext = () => setCurrent((index) => (index + 1) % total);

    return (
        <Box
            position="relative"
            width="full"
            maxWidth={{ base: "360px", md: "420px", lg: "480px" }}
            overflow="hidden"
            rounded="2xl"
            boxShadow="xl"
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured furniture"
            // Pointer events let us ignore the fake "hover" a tap creates on touch screens.
            onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setIsHovered(true);
            }}
            onPointerLeave={(event) => {
                if (event.pointerType === "mouse") setIsHovered(false);
            }}
            onFocus={(event) => {
                if (event.target.matches(":focus-visible")) setHasFocus(true);
            }}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false);
            }}
            onKeyDown={(event) => {
                if (event.key === "ArrowLeft") showPrevious();
                if (event.key === "ArrowRight") showNext();
            }}
            onTouchStart={(event) => {
                touchStartX.current = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
                if (touchStartX.current === null) return;
                const distance = event.changedTouches[0].clientX - touchStartX.current;
                touchStartX.current = null;
                if (distance > SWIPE_THRESHOLD_PX) showPrevious();
                if (distance < -SWIPE_THRESHOLD_PX) showNext();
            }}
            style={{ aspectRatio: "3 / 4", touchAction: "pan-y" }}
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
                        scale: index === current || prefersReducedMotion ? 1 : 1.08,
                    }}
                    transition={{ duration: prefersReducedMotion ? 0.2 : 1.2, ease: "easeInOut" }}
                    aria-hidden={index !== current}
                >
                    <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 768px) 360px, (max-width: 992px) 420px, 480px"
                        style={{ objectFit: "cover" }}
                        placeholder="blur"
                        priority={index === 0}
                    />
                </Box>
            ))}

            <Button
                type="button"
                aria-label="Previous photo"
                onClick={showPrevious}
                left={3}
                {...arrowButtonProps}
            >
                <CaretLeft size={22} weight="bold" aria-hidden />
            </Button>
            <Button
                type="button"
                aria-label="Next photo"
                onClick={showNext}
                right={3}
                {...arrowButtonProps}
            >
                <CaretRight size={22} weight="bold" aria-hidden />
            </Button>

            <Flex
                position="absolute"
                bottom={2}
                left={0}
                right={0}
                justifyContent="center"
                alignItems="center"
            >
                <Text
                    paddingX={3}
                    paddingY={1}
                    rounded="full"
                    background="blackAlpha.600"
                    color="white"
                    fontSize="xs"
                    fontWeight="semibold"
                >
                    {current + 1} / {total}
                </Text>
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
