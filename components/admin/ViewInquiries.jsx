import { Badge, Box, Button, HStack, Link, Spinner, Stack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { api } from '../../utils/api'
import { describeSelection, peso } from '../../utils/productOptions'

const COLORS = { New: 'orange', Replied: 'blue', Closed: 'gray' }

const ViewInquiries = () => {
    const [inquiries, setInquiries] = useState(null)

    const load = () => api('/api/admin/inquiries')
        .then(r => setInquiries(r.inquiries))
        .catch(e => { toast.error(e.message); setInquiries([]) })

    useEffect(() => { load() }, [])

    const setStatus = async (id, status) => {
        try {
            const { inquiry } = await api('/api/admin/inquiries', { method: 'PATCH', body: { id, status } })
            setInquiries(list => list.map(i => (i.id === id ? inquiry : i)))
        } catch (e) {
            toast.error(e.message)
        }
    }

    if (!inquiries) return <Spinner />
    if (!inquiries.length) return <Text>No inquiries yet.</Text>

    return (
        <Stack spacing={4}>
            {inquiries.map(q => (
                <Box key={q.id} borderWidth={1} rounded={'md'} p={4}>
                    <HStack justify={'space-between'} align={'start'} flexWrap={'wrap'}>
                        <Box>
                            <Text fontWeight={'semibold'}>{q.productName}</Text>
                            <Text fontSize={'xs'} textColor={'gray.600'}>{describeSelection(q.selection)}</Text>
                            {q.quotedPrice !== null && <Text fontSize={'sm'}>Quoted: {peso(q.quotedPrice)}</Text>}
                        </Box>
                        <Badge colorScheme={COLORS[q.status] || 'gray'}>{q.status}</Badge>
                    </HStack>
                    <Text mt={3} fontSize={'sm'}>
                        <b>{q.name}</b>
                        {q.phone && <> · <Link href={`tel:${q.phone}`} color={'gold.500'}>{q.phone}</Link></>}
                        {q.email && <> · <Link href={`mailto:${q.email}`} color={'gold.500'}>{q.email}</Link></>}
                    </Text>
                    {q.message && <Text mt={2} fontSize={'sm'} whiteSpace={'pre-wrap'}>{q.message}</Text>}
                    <HStack mt={3} justify={'space-between'} flexWrap={'wrap'}>
                        <Text fontSize={'xs'} textColor={'gray.500'}>{new Date(q.createdAt).toLocaleString('en-PH')}</Text>
                        <HStack>
                            {['New', 'Replied', 'Closed'].map(s => (
                                <Button key={s} size={'xs'} variant={q.status === s ? 'solid' : 'ghost'} borderWidth={1}
                                    onClick={() => setStatus(q.id, s)}>{s}</Button>
                            ))}
                        </HStack>
                    </HStack>
                </Box>
            ))}
        </Stack>
    )
}

export default ViewInquiries
