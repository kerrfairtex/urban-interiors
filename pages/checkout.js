import { Box, Button, color, Divider, Flex, Input, Stack, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { CheckoutValidation } from '../utils/validate'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { fetchProductsByIds } from '../utils/api'
import { SHIPPING_FEE } from '../utils/constants'
import Meta from '../components/meta/Meta'
import { addOrder } from '../store/orderReducer'

const CartItem = ({ item }) => {

    return (
        <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            py={4}
            width={'full'}>

            <Flex
                rounded={'lg'}
                overflow={'hidden'}
                marginEnd={4}
                alignItems={'center'}>

                <Image
                    src={item.images[0]}
                    alt={''}
                    width={50}
                    height={50}
                />

                <VStack
                    alignItems={'start'}
                    marginStart={4}>
                    <Text
                        fontWeight={'normal'}
                        fontSize={'sm'}
                        textColor={'gray.800'}
                        textAlign={'start'}
                        overflow={'hidden'}
                        noOfLines={2}
                        maxWidth={'xs'}
                        textOverflow={'ellipsis'}>
                        {item.title}
                    </Text>

                    <Text
                        fontWeight={'medium'}
                        fontSize={'sm'}
                        textAlign={'start'}
                        textColor={'black'}>
                        {`₦${new Intl.NumberFormat().format(item.productPrice)}`}
                    </Text>

                </VStack>
            </Flex>
            <Text
                textAlign={'end'}
                fontWeight={'thin'}
                fontSize={'xl'}>
                {`x${item.quantity}`}
            </Text>
        </Flex>
    )
}

const Checkout = () => {

    const router = useRouter()
    const uid = useSelector((state) => state.session.auth.uid)
    const fullname = useSelector((state) => state.session.profile.displayName)
    const email = useSelector((state) => state.session.profile.email)
    const hasNotAuth = useSelector((state) => state.session.auth.isEmpty)

    const [userData, setUserData] = useState({
        uid,
        email,
        fullname,
        phone: '',
        state: '',
        city: '',
        address: ''
    })
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()

    const cart = useSelector((state) => state.session.profile.cart)
    const [product, setProduct] = useState([])
    const [placing, setPlacing] = useState(false)

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setUserData(data => ({ ...data, [name]: value }))
    }

    useEffect(() => {
        if (hasNotAuth) {
            router.replace('/signup')
            return
        }

        const items = cart ? cart.items : {}
        fetchProductsByIds(Object.keys(items))
            .then(products => setProduct(products
                .filter(p => items[p.pid])
                .map(p => ({
                    ...p,
                    quantity: items[p.pid].quantity,
                    colorName: items[p.pid].color?.name,
                    colorValue: items[p.pid].color?.value
                }))))
            .catch(() => setProduct([]))
    }, [cart])

    // No online payment: the order is recorded as Pending and the store follows up with the customer.
    const placeOrder = async () => {
        setPlacing(true)
        const order = await dispatch(addOrder(userData))
        setPlacing(false)
        if (order) router.push('/success')
    }

    if (hasNotAuth) return null // don't render any UI since auth state has not been verified

    return (
        <Flex
            as={'section'}
            paddingX={{ base: 6, lg: 12 }}
            paddingY={{ base: 6, lg: 8 }}
            flexDirection={'column'}>
            <Meta title={'Checkout | Fobath Woodwork'} />
            <ToastContainer />

            <Text
                color={'gold.500'}
                fontSize={'xl'}
                fontWeight={'semibold'}>
                Checkout
            </Text>

            <Stack
                direction={{ base: 'column-reverse', lg: 'row' }}>
                <Flex
                    width={{ base: 'full', lg: '60%' }}
                    flexDirection={'column'}>
                    <Text
                        marginTop={8}
                        color={'black'}
                        fontWeight={'normal'}>
                        Shipping Information
                    </Text>

                    <Divider mt={2} orientation='horizontal' h={'.1px'} bgColor={'gray.200'} />

                    <VStack
                        width={'full'}
                        alignItems={'start'}
                        marginTop={6}
                        spacing={'2px'}>
                        <Text
                            textColor={'black'}
                            fontWeight={'medium'}
                            fontSize={'sm'}>
                            Full name
                        </Text>

                        <Input
                            name={'fullname'}
                            placeholder={'Awesome User'}
                            _placeholder={{ fontSize: 'sm' }}
                            value={userData.fullname}
                            focusBorderColor={'gold.500'}
                            _focus={{ transform: 'scale(1.01)' }}
                            size={'md'}
                            onChange={handleFormChange}
                        />

                        {errors.fullname &&
                            <Text
                                textColor={'red.500'}
                                fontWeight={'light'}
                                fontSize={'xs'}>
                                {errors.fullname}
                            </Text>
                        }
                    </VStack>

                    <VStack
                        width={'full'}
                        alignItems={'start'}
                        marginTop={6}
                        spacing={'2px'}>
                        <Text
                            textColor={'black'}
                            fontWeight={'medium'}
                            fontSize={'sm'}>
                            Phone
                        </Text>

                        <Input
                            name={'phone'}
                            placeholder={'+2348123456789'}
                            _placeholder={{ fontSize: 'sm' }}
                            value={userData.phone}
                            focusBorderColor={'gold.500'}
                            _focus={{ transform: 'scale(1.01)' }}
                            size={'md'}
                            onChange={handleFormChange}
                        />

                        {errors.phone &&
                            <Text
                                textColor={'red.500'}
                                fontWeight={'light'}
                                fontSize={'xs'}>
                                {errors.phone}
                            </Text>
                        }
                    </VStack>

                    <Stack
                        direction={'row'}
                        marginTop={6}
                        spacing={{base: 3, lg: 6}}>
                        <VStack
                            width={'full'}
                            alignItems={'start'}
                            spacing={'2px'}>
                            <Text
                                textColor={'black'}
                                fontWeight={'medium'}
                                fontSize={'sm'}>
                                State
                            </Text>

                            <Input
                                name={'state'}
                                placeholder={'state of residence'}
                                _placeholder={{ fontSize: 'sm' }}
                                value={userData.state}
                                focusBorderColor={'gold.500'}
                                _focus={{ transform: 'scale(1.01)' }}
                                size={'md'}
                                onChange={handleFormChange}
                            />

                            {errors.state &&
                                <Text
                                    textColor={'red.500'}
                                    fontWeight={'light'}
                                    fontSize={'xs'}>
                                    {errors.state}
                                </Text>
                            }
                        </VStack>

                        <VStack
                            width={'full'}
                            alignItems={'start'}
                            spacing={'2px'}>
                            <Text
                                textColor={'black'}
                                fontWeight={'medium'}
                                fontSize={'sm'}>
                                City
                            </Text>

                            <Input
                                name={'city'}
                                placeholder={'city of residence'}
                                _placeholder={{ fontSize: 'sm' }}
                                value={userData.city}
                                focusBorderColor={'gold.500'}
                                _focus={{ transform: 'scale(1.01)' }}
                                size={'md'}
                                onChange={handleFormChange}
                            />

                            {errors.city &&
                                <Text
                                    textColor={'red.500'}
                                    fontWeight={'light'}
                                    fontSize={'xs'}>
                                    {errors.city}
                                </Text>
                            }
                        </VStack>
                    </Stack>

                    <VStack
                        width={'full'}
                        alignItems={'start'}
                        marginTop={6}
                        spacing={'2px'}>
                        <Text
                            textColor={'black'}
                            fontWeight={'medium'}
                            fontSize={'sm'}>
                            Address
                        </Text>

                        <Input
                            name={'address'}
                            placeholder={'street number, name, landmark, etc'}
                            _placeholder={{ fontSize: 'sm' }}
                            value={userData.address}
                            focusBorderColor={'gold.500'}
                            _focus={{ transform: 'scale(1.01)' }}
                            size={'md'}
                            onChange={handleFormChange}
                        />

                        {errors.address &&
                            <Text
                                textColor={'red.500'}
                                fontWeight={'light'}
                                fontSize={'xs'}>
                                {errors.address}
                            </Text>
                        }
                    </VStack>

                    <Button
                        isLoading={placing}
                        isDisabled={product.length === 0}
                        loadingText={'Placing order'}
                        variant={'solid'}
                        width={{base: 'full', lg: '40%'}}
                        marginTop={10}
                        paddingY={5}
                        onClick={(e) => {
                            e.preventDefault();
                            let errors = CheckoutValidation(
                                userData.fullname.trim(),
                                userData.phone.trim(),
                                userData.state.trim(),
                                userData.city.trim(),
                                userData.address.trim()
                            )
                            if (Object.keys(errors).length === 0) {
                                setErrors({})
                                placeOrder()
                            } else {
                                setErrors(errors);
                            }
                        }}>
                        Place order
                    </Button>
                </Flex>

                <Box>
                    <Divider orientation={'vertical'} mx={8} width={'.3px'} height={'full'} bgColor={'gray.200'} />
                </Box>

                <Flex
                    width={{ base: 'full', lg: '40%' }}
                    flexDirection={'column'}>
                    <Text
                        fontWeight={'normal'}
                        textColor={'black'}
                        marginTop={8}
                        textAlign={'start'}>
                        Summary
                    </Text>
                    <Divider mt={2} orientation={'horizontal'} bgColor={'gray.200'} height={'.1px'} />

                    {
                        product.map((item, i) => (
                            <Box key={item.pid}>
                                <CartItem
                                    item={item}
                                />
                                {i !== product.length - 1 &&
                                    <Divider orientation={'horizontal'}
                                        bgColor={'gray.200'} h={'.1px'} />
                                }
                            </Box>
                        ))
                    }

                    <Flex
                        justifyContent={'space-between'}
                        width={'full'}
                        py={2}
                        alignItems={'center'}>
                        <Text
                            fontWeight={'normal'}
                            textColor={'black'}
                            fontSize={'sm'}>
                            Subtotal
                        </Text>
                        <Text
                            fontWeight={'normal'}
                            textColor={'black'}
                            fontSize={'sm'}>
                            {`₦${new Intl.NumberFormat().format(cart?.totalPrice)}`}
                        </Text>
                    </Flex>
                    <Divider orientation={'horizontal'} bgColor={'gray.200'} height={'.1px'} />
                    <Flex
                        justifyContent={'space-between'}
                        width={'full'}
                        py={2}
                        alignItems={'center'}>
                        <Text
                            fontWeight={'normal'}
                            textColor={'black'}
                            fontSize={'sm'}>
                            Shipping
                        </Text>
                        <Text
                            fontWeight={'normal'}
                            textColor={'black'}
                            fontSize={'sm'}>
                            {`₦${new Intl.NumberFormat().format(SHIPPING_FEE)}`}
                        </Text>
                    </Flex>
                    <Divider orientation={'horizontal'} bgColor={'gray.200'} height={'.1px'} />
                    <Flex
                        justifyContent={'space-between'}
                        width={'full'}
                        py={2}
                        alignItems={'center'}>
                        <Text
                            fontWeight={'normal'}
                            textColor={'black'}
                            fontSize={'sm'}>
                            Total
                        </Text>
                        <Text
                            fontWeight={'medium'}
                            textColor={'black'}>
                            {`₦${new Intl.NumberFormat().format((cart?.totalPrice || 0) + SHIPPING_FEE)}`}
                        </Text>
                    </Flex>

                </Flex>
            </Stack>

        </Flex>
    )
}

export default Checkout
