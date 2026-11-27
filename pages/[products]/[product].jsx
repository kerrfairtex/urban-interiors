import {
    Badge, Box, Breadcrumb, BreadcrumbItem, Button, Divider, Flex, FormControl, FormLabel, HStack, Input,
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton,
    Stack, Tab, Table, TabList, TabPanel, TabPanels, Tabs, Tbody, Td, Text, Textarea, Th, Tr, useDisclosure,
    VStack, Wrap, WrapItem
} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CaretRight, ChatCircleText, Heart, MessengerLogo, Minus, Phone, Plus, ShoppingCart } from 'phosphor-react'
import { connect, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import { addToCart, decreaseQuantity, increaseQuantity } from '../../store/cartReducer'
import { addToWishlist } from '../../store/wishlistReducer'
import { getProduct } from '../../store/productReducer'
import Meta from '../../components/meta/Meta'
import { api } from '../../utils/api'
import { categoryTitle } from '../../utils/categories'
import {
    chosen, describeSelection, getDimensions, getGroups, normalizeSelection, peso, priceLabel, unitPrice, VIEW_SLOTS
} from '../../utils/productOptions'

const Product3D = dynamic(() => import('../../components/product/Product3D'), {
    ssr: false,
    loading: () => <Skeleton w={'full'} h={{ base: '320px', md: '440px' }} rounded={'lg'} />
})

const STORE_PHONE = '09637130812'
// Facebook Page username for the "Message us" button (m.me/<username>).
const MESSENGER_PAGE = 'kerrkerr711'
// m.me ignores prefilled text on most phones, so the button also copies the message
// (with the product link, which Messenger previews with the photo) for the customer to paste.
const messengerText = (product, selection, price) => {
    const url = typeof window !== 'undefined' ? window.location.href.split('#')[0] : ''
    return `Hi! I'm interested in the ${product.productName} (${describeSelection(selection)}) - ${peso(price)}. Is it available?\n${url}`
}
const messengerLink = (text) => `https://m.me/${MESSENGER_PAGE}?text=${encodeURIComponent(text)}`
const copyText = (text) => {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok ? Promise.resolve() : Promise.reject(new Error('copy failed'))
}

const LoadingSkeleton = () => (
    <Flex marginY={8} gap={10} width={'full'} flexDirection={{ base: 'column', lg: 'row' }}>
        <Stack w={{ base: 'full', lg: '55%' }} spacing={3}>
            <Skeleton w={'full'} h={'440px'} rounded={'lg'} />
            <HStack>{[0, 1, 2, 3, 4].map(i => <Skeleton key={i} boxSize={'72px'} rounded={'md'} />)}</HStack>
        </Stack>
        <Stack w={{ base: 'full', lg: '45%' }} spacing={3}>
            <Skeleton w={'60%'} h={'32px'} />
            <Skeleton w={'30%'} h={'24px'} />
            <Skeleton w={'full'} h={'90px'} />
            <Skeleton w={'full'} h={'160px'} />
            <Skeleton w={'full'} h={'44px'} />
        </Stack>
    </Flex>
)

// Labelled photos: the five standard views first, then any other product photos.
const buildPhotos = (product) => {
    const views = product.details?.views || {}
    const photos = []
    const used = new Set()
    for (const { key, label } of VIEW_SLOTS) {
        if (views[key]) {
            photos.push({ label, src: views[key] })
            used.add(views[key])
        }
    }
    const extras = (product.images || []).filter(src => !used.has(src))
    extras.forEach((src, i) => photos.unshift({ label: extras.length > 1 ? `Photo ${extras.length - i}` : 'Main photo', src }))
    return photos
}

const PhotoGallery = ({ product, photos }) => {
    const [index, setIndex] = useState(0)
    const current = photos[Math.min(index, photos.length - 1)]
    if (!current) return null
    return (
        <Box w={'full'}>
            <Box position={'relative'} w={'full'} h={{ base: '320px', md: '440px' }} rounded={'lg'} overflow={'hidden'} bgColor={'gray.50'}>
                <Image
                    src={current.src}
                    alt={`${product.productName}: ${current.label}`}
                    fill
                    sizes={'(max-width: 992px) 100vw, 55vw'}
                    style={{ objectFit: 'contain' }}
                    priority
                />
                <Badge position={'absolute'} top={3} left={3} bgColor={'blackAlpha.700'} textColor={'white'} px={2} py={1} rounded={'md'}>
                    {current.label}
                </Badge>
            </Box>
            <Wrap mt={3} spacing={2}>
                {photos.map((p, i) => (
                    <WrapItem key={p.src + i}>
                        <VStack spacing={1} as={'button'} onClick={() => setIndex(i)} aria-label={`Show ${p.label}`}>
                            <Box
                                position={'relative'}
                                boxSize={{ base: '60px', md: '72px' }}
                                rounded={'md'}
                                overflow={'hidden'}
                                borderWidth={2}
                                borderColor={i === index ? 'gold.500' : 'gray.100'}>
                                <Image src={p.src} alt={''} fill sizes={'72px'} style={{ objectFit: 'cover' }} />
                            </Box>
                            <Text fontSize={'2xs'} textColor={'gray.600'}>{p.label}</Text>
                        </VStack>
                    </WrapItem>
                ))}
            </Wrap>
        </Box>
    )
}

const OptionGroup = ({ group, value, onChange }) => (
    <Box w={'full'}>
        <Text fontWeight={'semibold'} fontSize={'sm'} textColor={'gray.900'} mb={2}>
            {group.label}: <Text as={'span'} fontWeight={'normal'}>{value}</Text>
        </Text>
        <Wrap spacing={2}>
            {group.choices.map(choice => {
                const active = choice.name === value
                return (
                    <WrapItem key={choice.name}>
                        <Button
                            size={'sm'}
                            height={'auto'}
                            minH={'36px'}
                            py={2}
                            variant={'ghost'}
                            borderWidth={active ? 2 : 1}
                            borderColor={active ? 'gold.500' : 'gray.300'}
                            bgColor={active ? 'orange.50' : 'white'}
                            fontWeight={active ? 'semibold' : 'normal'}
                            textTransform={'none'}
                            whiteSpace={'normal'}
                            title={choice.note || undefined}
                            aria-pressed={active}
                            onClick={() => onChange(group.key, choice.name)}
                            leftIcon={choice.swatch ? (
                                <Box boxSize={'18px'} rounded={'full'} bgColor={choice.swatch} borderWidth={1} borderColor={'blackAlpha.400'} />
                            ) : undefined}>
                            <Text as={'span'} textTransform={'capitalize'}>{choice.name}</Text>
                            {Number(choice.price) !== 0 &&
                                <Text as={'span'} ml={1} fontSize={'xs'} textColor={'gray.600'}>
                                    {choice.price > 0 ? `+${peso(choice.price)}` : `−${peso(-choice.price)}`}
                                </Text>}
                        </Button>
                    </WrapItem>
                )
            })}
        </Wrap>
        {chosenNote(group, value) &&
            <Text fontSize={'xs'} textColor={'gray.600'} mt={1}>{chosenNote(group, value)}</Text>}
    </Box>
)

const chosenNote = (group, value) => group.choices.find(c => c.name === value)?.note

const SpecRow = ({ label, children }) => (
    <Tr>
        <Th px={0} py={2} fontSize={'xs'} textTransform={'none'} letterSpacing={'normal'} textColor={'gray.600'} w={'40%'} verticalAlign={'top'}>
            {label}
        </Th>
        <Td px={0} py={2} fontSize={'sm'} textColor={'gray.900'}>{children}</Td>
    </Tr>
)

const InquiryModal = ({ isOpen, onClose, product, selection, price, profile }) => {
    const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
    const [sending, setSending] = useState(false)

    useEffect(() => {
        if (isOpen) setForm(f => ({
            ...f,
            name: f.name || profile?.displayName || '',
            email: f.email || profile?.email || '',
            message: f.message || `Hi, I'm interested in the ${product.productName} (${describeSelection(selection)}). Is it available, and how long is delivery to my area?`
        }))
    }, [isOpen])

    const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const send = async () => {
        if (form.name.trim().length < 2) return toast.error('Please enter your name')
        if (!form.phone.trim() && !form.email.trim()) return toast.error('Please enter a phone number or email so we can reply')
        setSending(true)
        try {
            await api('/api/inquiries', { method: 'POST', body: { productId: product.pid, selection, ...form } })
            toast.success('Inquiry sent! We will get back to you soon.')
            setForm(f => ({ ...f, message: '' }))
            onClose()
        } catch (e) {
            toast.error(e.message)
        } finally {
            setSending(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'lg'}>
            <ModalOverlay />
            <ModalContent mx={4}>
                <ModalHeader>Send an inquiry</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box bgColor={'gray.50'} rounded={'md'} p={3} mb={4}>
                        <Text fontWeight={'semibold'} fontSize={'sm'}>{product.productName}</Text>
                        <Text fontSize={'xs'} textColor={'gray.700'}>{describeSelection(selection)}</Text>
                        <Text fontSize={'sm'} mt={1}>Quoted price: <b>{peso(price)}</b></Text>
                    </Box>
                    <Stack spacing={3}>
                        <FormControl isRequired>
                            <FormLabel fontSize={'sm'}>Your name</FormLabel>
                            <Input name={'name'} value={form.name} onChange={set} focusBorderColor={'gold.500'} />
                        </FormControl>
                        <HStack align={'start'}>
                            <FormControl>
                                <FormLabel fontSize={'sm'}>Phone</FormLabel>
                                <Input name={'phone'} type={'tel'} value={form.phone} onChange={set} placeholder={'09XX XXX XXXX'} focusBorderColor={'gold.500'} />
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize={'sm'}>Email</FormLabel>
                                <Input name={'email'} type={'email'} value={form.email} onChange={set} focusBorderColor={'gold.500'} />
                            </FormControl>
                        </HStack>
                        <FormControl>
                            <FormLabel fontSize={'sm'}>Message</FormLabel>
                            <Textarea name={'message'} rows={4} value={form.message} onChange={set} focusBorderColor={'gold.500'} />
                        </FormControl>
                    </Stack>
                </ModalBody>
                <ModalFooter gap={2}>
                    <Button variant={'ghost'} borderWidth={1} onClick={onClose}>Cancel</Button>
                    <Button variant={'solid'} isLoading={sending} onClick={send}>Send inquiry</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

const ProductDetail =
    ({ getProduct, addToCart, increaseItemQuantity, decreaseItemQuantity, addToWishlist }) => {
        const router = useRouter()
        // The product id is in the URL; fall back to the last clicked product for older links.
        const pid = router.query.product ||
            (typeof window !== 'undefined' ? localStorage.getItem('PRODUCT_REF') : null)

        const { isLoading, error, data } = useSelector((state) => state.product)
        const profile = useSelector((state) => state.session.profile)
        const hasNotAuth = profile.isEmpty
        const cart = profile.cart
        const wishlist = profile.wishlist
        const cartProduct = cart?.items?.[pid]

        const inquiry = useDisclosure()
        const [selection, setSelection] = useState({})
        const [adding, setAdding] = useState(false)

        useEffect(() => {
            if (pid) getProduct(pid)
        }, [pid])

        const product = !isLoading && data && data.pid === pid ? data : null

        // Start from what's already in the cart, otherwise the first choice of each option.
        useEffect(() => {
            if (product) setSelection(normalizeSelection(product, cartProduct?.options))
        }, [product?.pid])

        const groups = useMemo(() => (product ? getGroups(product) : []), [product])
        const sel = product ? normalizeSelection(product, selection) : {}
        const price = product ? unitPrice(product, sel) : 0
        const dims = product ? getDimensions(product, sel) : null
        const photos = useMemo(() => (product ? buildPhotos(product) : []), [product])
        const details = product?.details || {}
        const sameAsCart = cartProduct && describeSelection(normalizeSelection(product, cartProduct.options)) === describeSelection(sel)

        const variant = product && chosen(product, sel, 'variant')
        const size = product && chosen(product, sel, 'size')
        const stain = product && chosen(product, sel, 'stain')
        const finish = product && chosen(product, sel, 'finish')
        const color = product && chosen(product, sel, 'color')
        const model3d = details.model ? {
            model: details.model,
            width: dims.width || 150,
            depth: dims.depth || 90,
            height: dims.height || 76,
            seats: variant?.seats ?? size?.seats ?? 4,
            benches: variant?.bench ?? 0,
            stain: stain?.swatch || '#9a6a3c',
            finish: finish?.name || '',
            accent: details.model === 'live-edge'
                ? (color && color.swatch !== '#8B4513' ? color.swatch : '#1d1d1d')
                : (color?.swatch || '#8B4513'),
            paintedChairs: !!color && color.swatch !== '#8B4513' && details.model !== 'live-edge',
            upholsteredBack: details.model === 'dining-round-upholstered'
        } : null

        const onPick = (key, name) => setSelection(s => ({ ...s, [key]: name }))

        const handleAdd = async () => {
            if (hasNotAuth) {
                router.push('/signup')
                return
            }
            setAdding(true)
            await addToCart(pid, sel, cart)
            setAdding(false)
        }

        const missingViews = VIEW_SLOTS.filter(v => v.key !== 'detail' && !details.views?.[v.key]).length > 0

        return (
            <Flex
                as={'section'}
                paddingX={{ base: 4, lg: 12 }}
                paddingY={{ base: 4, lg: 8 }}
                flexDirection={'column'}
                alignItems={'start'}>

                <Meta title={product ? `${product.productName} | Cebu Urban Interiors` : 'Please wait... | Cebu Urban Interiors'} />
                <ToastContainer />

                <Breadcrumb
                    spacing={2}
                    separator={<CaretRight color={'#3e3e3e'} weight={'bold'} size={14} />}
                    fontWeight={'medium'}
                    fontSize={'sm'}>
                    <BreadcrumbItem textColor={'gray.600'} _hover={{ color: 'gold.500' }}>
                        <Link href='/'>Home</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem textColor={'gray.600'} textTransform={'capitalize'} _hover={{ color: 'gold.500' }}>
                        <Link href={`/${router.query.products || ''}`}>{categoryTitle(router.query.products || '')}</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem textColor={'gray.900'} isCurrentPage>
                        <Text noOfLines={1}>{product?.productName}</Text>
                    </BreadcrumbItem>
                </Breadcrumb>

                {!product && error && <Text mt={10}>Sorry, this product could not be found.</Text>}
                {!product && !error && <LoadingSkeleton />}

                {product &&
                    <Flex
                        marginY={{ base: 4, lg: 8 }}
                        gap={{ base: 8, lg: 12 }}
                        alignItems={'start'}
                        width={'full'}
                        flexDirection={{ base: 'column', lg: 'row' }}>

                        {/* Media: labelled photos and the interactive 3D model */}
                        <Box w={{ base: 'full', lg: '55%' }} position={{ lg: 'sticky' }} top={{ lg: 4 }}>
                            <Tabs variant={'soft-rounded'} colorScheme={'orange'} size={'sm'} isLazy>
                                <TabList mb={3} gap={2}>
                                    <Tab>Photos ({photos.length})</Tab>
                                    {model3d && <Tab>3D model · 360°</Tab>}
                                </TabList>
                                <TabPanels>
                                    <TabPanel p={0}>
                                        <PhotoGallery product={product} photos={photos} />
                                        {model3d && missingViews &&
                                            <Text fontSize={'xs'} textColor={'gray.600'} mt={2}>
                                                See this piece from the front, back, side and top in the <b>3D model</b> tab.
                                            </Text>}
                                    </TabPanel>
                                    {model3d &&
                                        <TabPanel p={0}>
                                            <Product3D {...model3d} />
                                        </TabPanel>}
                                </TabPanels>
                            </Tabs>
                        </Box>

                        {/* Info, options, price and actions */}
                        <VStack w={{ base: 'full', lg: '45%' }} alignItems={'start'} spacing={5}>
                            <Box>
                                <Badge colorScheme={'orange'} variant={'subtle'} mb={2} textTransform={'none'}>
                                    {categoryTitle(product.category)}
                                </Badge>
                                <Text as={'h1'} fontWeight={'bold'} fontSize={{ base: '2xl', lg: '3xl' }} textColor={'black'} lineHeight={'short'}>
                                    {product.productName}
                                </Text>
                                <Text fontWeight={'bold'} fontSize={'2xl'} textColor={'gray.900'} mt={2} aria-live={'polite'}>
                                    {peso(price)}
                                </Text>
                                {groups.length > 0 &&
                                    <Text fontSize={'xs'} textColor={'gray.600'}>Price updates with the options you choose</Text>}
                            </Box>

                            <Text textColor={'gray.800'}>{product.desc}</Text>

                            {groups.map(group => (
                                <OptionGroup key={group.key} group={group} value={sel[group.key]} onChange={onPick} />
                            ))}

                            <Box w={'full'}>
                                <Text fontWeight={'semibold'} fontSize={'md'} textColor={'gray.900'} mb={1}>Specifications</Text>
                                <Table size={'sm'} variant={'simple'}>
                                    <Tbody>
                                        <SpecRow label={'Width'}>{dims.width} cm ({(dims.width / 2.54).toFixed(0)} in)</SpecRow>
                                        <SpecRow label={'Depth'}>{dims.depth} cm ({(dims.depth / 2.54).toFixed(0)} in)</SpecRow>
                                        <SpecRow label={'Height'}>{dims.height} cm ({(dims.height / 2.54).toFixed(0)} in)</SpecRow>
                                        <SpecRow label={'Weight'}>{dims.weight ? `approx. ${dims.weight} kg` : 'Ask us'}</SpecRow>
                                        <SpecRow label={'Wood species'}>{details.wood?.species || 'Ask us'}</SpecRow>
                                        {finish && <SpecRow label={'Finish'}>{finish.name}{finish.note ? ` — ${finish.note}` : ''}</SpecRow>}
                                        {details.wood?.construction?.length > 0 &&
                                            <SpecRow label={'Construction'}>
                                                <Box as={'ul'} pl={4}>
                                                    {details.wood.construction.map(c => <li key={c}>{c}</li>)}
                                                </Box>
                                            </SpecRow>}
                                    </Tbody>
                                </Table>
                            </Box>

                            <Divider />

                            <VStack w={'full'} spacing={3}>
                                {cartProduct &&
                                    <HStack w={'full'} justifyContent={'space-between'} bgColor={'gray.50'} rounded={'md'} px={3} py={2}>
                                        <Text fontSize={'sm'}>In your cart</Text>
                                        <HStack spacing={4}>
                                            <Button size={'sm'} variant={'ghost'} borderWidth={1} aria-label={'Decrease quantity'}
                                                onClick={() => cartProduct.quantity > 1 && decreaseItemQuantity(pid, cart)}>
                                                <Minus size={14} weight={'bold'} />
                                            </Button>
                                            <Text fontWeight={'semibold'}>{cartProduct.quantity}</Text>
                                            <Button size={'sm'} variant={'ghost'} borderWidth={1} aria-label={'Increase quantity'}
                                                onClick={() => increaseItemQuantity(pid, cart)}>
                                                <Plus size={14} weight={'bold'} />
                                            </Button>
                                        </HStack>
                                    </HStack>}

                                {cartProduct && sameAsCart ?
                                    <Button w={'full'} variant={'solid'} leftIcon={<ShoppingCart size={18} />} onClick={() => router.push('/cart')}>
                                        Go to cart
                                    </Button>
                                    :
                                    <Button w={'full'} variant={'solid'} isLoading={adding} leftIcon={<ShoppingCart size={18} />} onClick={handleAdd}>
                                        {cartProduct ? `Update cart to this selection · ${peso(price)}` : `Add to cart · ${peso(price)}`}
                                    </Button>}

                                <HStack w={'full'}>
                                    <Button flex={1} variant={'ghost'} borderWidth={1} borderColor={'gray.300'} leftIcon={<ChatCircleText size={18} />} onClick={inquiry.onOpen}>
                                        Send inquiry
                                    </Button>
                                    <Button as={'a'} href={`tel:${STORE_PHONE}`} flex={1} variant={'ghost'} borderWidth={1} borderColor={'gray.300'} leftIcon={<Phone size={18} />}>
                                        Call us
                                    </Button>
                                </HStack>

                                <Button
                                    as={'a'}
                                    href={messengerLink(messengerText(product, sel, price))}
                                    onClick={() => {
                                        // Runs in the tap itself, so the browser allows the copy; the link then opens Messenger.
                                        copyText(messengerText(product, sel, price))
                                            .then(() => toast.info('Message copied - paste it in the Messenger chat and send', { autoClose: 6000 }))
                                            .catch(() => {})
                                    }}
                                    target={'_blank'}
                                    rel={'noopener noreferrer'}
                                    w={'full'}
                                    color={'white'}
                                    bgColor={'#0866FF'}
                                    _hover={{ bgColor: '#0757D9' }}
                                    _active={{ bgColor: '#0649B5' }}
                                    leftIcon={<MessengerLogo size={20} weight={'fill'} />}>
                                    Message us on Messenger
                                </Button>

                                <Button
                                    w={'full'}
                                    variant={'ghost'}
                                    borderWidth={1}
                                    borderColor={'gray.300'}
                                    leftIcon={<Heart size={16} color={wishlist?.includes(pid) ? '#E53E3E' : '#B4BABE'} weight={'fill'} />}
                                    onClick={() => (hasNotAuth ? router.push('/signup') : addToWishlist(pid, wishlist))}>
                                    {wishlist?.includes(pid) ? 'In your wishlist' : 'Add to wishlist'}
                                </Button>
                            </VStack>
                        </VStack>

                        <InquiryModal
                            isOpen={inquiry.isOpen}
                            onClose={inquiry.onClose}
                            product={product}
                            selection={sel}
                            price={price}
                            profile={profile}
                        />
                    </Flex>
                }
            </Flex>
        )
    }

export const matchDispatchToProps = dispatch => ({
    getProduct: (productId) => dispatch(getProduct(productId)),
    addToCart: (productId, selection, prevCart) => dispatch(addToCart(productId, selection, prevCart)),
    increaseItemQuantity: (productId) => dispatch(increaseQuantity(productId)),
    decreaseItemQuantity: (productId) => dispatch(decreaseQuantity(productId)),
    addToWishlist: (productId, prevWishlist) => dispatch(addToWishlist(productId, prevWishlist))
})

// Link-preview tags for Messenger/Facebook. The page itself renders in the browser,
// so the product is loaded here too and _app writes the og: tags into the HTML.
export const getServerSideProps = async ({ params, req }) => {
    try {
        const { db, isUuid, toProduct } = await import('../../lib/db')
        if (!isUuid(params.product)) return { props: {} }
        const sql = await db()
        const rows = await sql`SELECT * FROM products WHERE id = ${params.product}`
        if (!rows.length) return { props: {} }
        const product = toProduct(rows[0])
        const host = req.headers['x-forwarded-host'] || req.headers.host
        const site = `https://${host}`
        const image = (product.images || [])[0] || ''
        return {
            props: {
                og: {
                    title: `${product.productName} - ${priceLabel(product)}`,
                    description: (product.desc || '').slice(0, 200),
                    image: !image ? '' : /^https?:\/\//.test(image) ? image : `${site}${image}`,
                    url: `${site}/${params.products}/${params.product}`
                }
            }
        }
    } catch (e) {
        console.error(e)
        return { props: {} }
    }
}

export default connect(null, matchDispatchToProps)(ProductDetail)
