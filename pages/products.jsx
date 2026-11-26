import { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { Box, Button, Flex, Grid, Select, Skeleton, Text, VStack } from '@chakra-ui/react'

import Meta from '../components/meta/Meta'
import ProductItem from '../components/product/ProductItem'
import { getProducts } from '../store/productsReducer'
import { CATEGORIES } from '../utils/categories'
import { priceLabel } from '../utils/productOptions'

const ProductsPage = ({ getProducts }) => {
    const [category, setCategory] = useState('')
    const { isFetching, isLoaded, error, data, lastVisible, endOfData } = useSelector((state) => state.products)
    const products = Object.values(data || {})

    useEffect(() => {
        getProducts(category, {}, null)
    }, [category, getProducts])

    return (
        <Box as="section" bg="gray.50" minH="70vh" px={{ base: 5, md: 10, lg: 16 }} py={{ base: 10, md: 14 }}>
            <Meta
                title="Shop Furniture | Cebu Urban Interiors"
                description="Explore handcrafted furniture for every room, made for the way you live."
            />

            <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'stretch', md: 'end' }} justify="space-between" gap={6}>
                <Box>
                    <Text color="gold.600" fontSize="xs" fontWeight="bold" letterSpacing="0.2em" textTransform="uppercase">
                        Made for your home
                    </Text>
                    <Text as="h1" color="gray.900" fontSize={{ base: '3xl', md: '5xl' }} fontWeight="semibold" letterSpacing="-0.04em" mt={2}>
                        Shop all furniture
                    </Text>
                    <Text color="gray.600" fontSize={{ base: 'sm', md: 'md' }} mt={3} maxW="xl">
                        Thoughtful pieces, crafted to bring warmth and character to every room.
                    </Text>
                </Box>

                <Select
                    aria-label="Filter products by category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    maxW={{ base: 'full', md: '260px' }}
                    bg="white"
                    borderColor="gray.300"
                    focusBorderColor="gold.500"
                >
                    <option value="">All categories</option>
                    {CATEGORIES.map((item) => (
                        <option key={item.slug} value={item.slug}>{item.title}</option>
                    ))}
                </Select>
            </Flex>

            <Flex justify="space-between" align="center" mt={10} mb={4}>
                <Text color="gray.600" fontSize="sm">
                    {isLoaded && !isFetching ? `${products.length} ${products.length === 1 ? 'piece' : 'pieces'}` : 'Explore the collection'}
                </Text>
            </Flex>

            {error ? (
                <Text role="alert" color="red.600" py={12}>We couldn&apos;t load the collection. Please try again.</Text>
            ) : isFetching && products.length === 0 ? (
                <Grid templateColumns={{ base: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }} gap={{ base: 4, md: 6 }}>
                    {Array.from({ length: 8 }, (_, index) => (
                        <VStack key={index} align="stretch" spacing={3}>
                            <Skeleton aspectRatio="1" borderRadius="lg" />
                            <Skeleton h="4" w="4/5" />
                            <Skeleton h="4" w="2/5" />
                        </VStack>
                    ))}
                </Grid>
            ) : products.length === 0 ? (
                <Text color="gray.600" py={16}>No products found in this category yet.</Text>
            ) : (
                <>
                    <Grid templateColumns={{ base: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }} gap={{ base: 4, md: 6 }}>
                        {products.map((product) => (
                            <ProductItem
                                key={product.pid}
                                productId={product.pid}
                                productTitle={product.productName}
                                productImg={product.images[0]}
                                productPrice={priceLabel(product)}
                                productCategory={product.category}
                            />
                        ))}
                    </Grid>

                    {!endOfData && (
                        <Flex justify="center" mt={10}>
                            <Button
                                variant="outline"
                                borderColor="gray.300"
                                isLoading={isFetching}
                                onClick={() => getProducts(category, data, lastVisible)}
                                _hover={{ borderColor: 'gold.500', color: 'gold.700' }}
                            >
                                Load more
                            </Button>
                        </Flex>
                    )}
                </>
            )}
        </Box>
    )
}

const mapDispatchToProps = (dispatch) => ({
    getProducts: (category, data, lastVisible) => dispatch(getProducts(category, data, lastVisible))
})

export default connect(null, mapDispatchToProps)(ProductsPage)
