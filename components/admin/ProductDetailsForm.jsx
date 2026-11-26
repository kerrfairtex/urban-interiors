// Admin form section for the richer product details: view photos, 3D model,
// weight, wood and construction, and the priced option lists.
import { Box, Button, Grid, HStack, IconButton, Input, Select, Text, Textarea, VStack } from '@chakra-ui/react'
import { Plus, Trash } from 'phosphor-react'
import { MODEL_TYPES, VIEW_SLOTS } from '../../utils/productOptions'

export const emptyDetails = () => ({
    model: '',
    weight: '',
    wood: { species: '', construction: '' },
    size: [],
    variant: [],
    stain: [
        { name: 'Natural', swatch: '#C8955C', price: 0 },
        { name: 'Walnut', swatch: '#6B4226', price: 1500 }
    ],
    finish: [
        { name: 'Satin polyurethane', price: 0, note: '' },
        { name: 'Matte lacquer', price: 1500, note: '' }
    ]
})

// Turns the form's strings into the shape stored in the database.
export const detailsForSave = (d) => {
    const n = (v) => (v === '' || v === undefined ? undefined : Number(v))
    const rows = (list, extra) => list
        .filter(r => r.name && r.name.trim())
        .map(r => {
            const out = { name: r.name.trim(), price: Number(r.price) || 0 }
            if (r.swatch) out.swatch = r.swatch
            if (r.note) out.note = r.note
            for (const k of extra) if (n(r[k]) !== undefined) out[k] = n(r[k])
            return out
        })
    return {
        model: d.model,
        weight: n(d.weight),
        wood: {
            species: d.wood.species.trim(),
            construction: d.wood.construction.split('\n').map(s => s.trim()).filter(Boolean)
        },
        size: rows(d.size, ['width', 'depth', 'height', 'weight', 'seats']),
        variant: rows(d.variant, ['seats', 'bench']),
        stain: rows(d.stain, []),
        finish: rows(d.finish, [])
    }
}

const Label = ({ children, hint }) => (
    <Box>
        <Text textColor={'black'} fontWeight={'medium'} fontSize={'sm'}>{children}</Text>
        {hint && <Text fontSize={'xs'} textColor={'gray.600'}>{hint}</Text>}
    </Box>
)

// Editable rows for one option list. `fields` are extra columns besides name and price.
const ChoiceRows = ({ title, hint, rows, fields, onChange, template }) => {
    const update = (i, key, value) => onChange(rows.map((r, j) => (j === i ? { ...r, [key]: value } : r)))
    return (
        <VStack alignItems={'start'} w={'full'} spacing={2}>
            <Label hint={hint}>{title}</Label>
            {rows.map((row, i) => (
                <HStack key={i} w={'full'} spacing={2} alignItems={'center'} flexWrap={'wrap'}>
                    <Input size={'sm'} flex={'2 1 160px'} placeholder={'Name'} value={row.name} onChange={e => update(i, 'name', e.target.value)} />
                    <Input size={'sm'} flex={'1 1 90px'} type={'number'} placeholder={'± ₱'} value={row.price} onChange={e => update(i, 'price', e.target.value)} />
                    {fields.map(f => f.key === 'swatch' ?
                        <Input key={f.key} size={'sm'} w={'48px'} p={1} type={'color'} value={row.swatch || '#C8955C'} onChange={e => update(i, 'swatch', e.target.value)} title={f.label} />
                        :
                        <Input key={f.key} size={'sm'} flex={`1 1 ${f.w || 70}px`} type={f.type || 'number'} placeholder={f.label} value={row[f.key] ?? ''} onChange={e => update(i, f.key, e.target.value)} />
                    )}
                    <IconButton size={'sm'} variant={'ghost'} aria-label={'Remove'} icon={<Trash size={16} color={'#E53E3E'} />}
                        onClick={() => onChange(rows.filter((_, j) => j !== i))} />
                </HStack>
            ))}
            <Button size={'xs'} variant={'ghost'} borderWidth={1} leftIcon={<Plus size={12} />} onClick={() => onChange([...rows, { ...template }])}>
                Add {title.toLowerCase()}
            </Button>
        </VStack>
    )
}

const ProductDetailsForm = ({ details, setDetails, viewFiles, setViewFiles }) => {
    const set = (key, value) => setDetails(d => ({ ...d, [key]: value }))
    const setWood = (key, value) => setDetails(d => ({ ...d, wood: { ...d.wood, [key]: value } }))

    return (
        <VStack alignItems={'start'} spacing={6} w={'full'} mt={8} pt={6} borderTopWidth={1}>
            <Text fontWeight={'bold'} fontSize={'lg'} textColor={'black'}>Photos by view, 3D and specifications</Text>

            <VStack alignItems={'start'} w={'full'} spacing={2}>
                <Label hint={'Optional. Each photo is labelled on the product page.'}>View photos</Label>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={3} w={'full'}>
                    {VIEW_SLOTS.map(v => (
                        <HStack key={v.key}>
                            <Text fontSize={'sm'} w={'60px'}>{v.label}</Text>
                            <Input size={'sm'} type={'file'} accept={'image/png, image/jpeg, image/webp'}
                                onChange={e => setViewFiles(f => ({ ...f, [v.key]: e.target.files[0] }))} />
                        </HStack>
                    ))}
                </Grid>
                {Object.values(viewFiles).filter(Boolean).length > 0 &&
                    <Text fontSize={'xs'} textColor={'gray.600'}>{Object.values(viewFiles).filter(Boolean).length} view photo(s) selected</Text>}
            </VStack>

            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} w={'full'}>
                <VStack alignItems={'start'} spacing={1}>
                    <Label hint={'Shows a rotatable 360° model'}>3D model</Label>
                    <Select size={'sm'} value={details.model} onChange={e => set('model', e.target.value)}>
                        {MODEL_TYPES.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
                    </Select>
                </VStack>
                <VStack alignItems={'start'} spacing={1}>
                    <Label hint={'Used when no sizes are listed'}>Weight (kg)</Label>
                    <Input size={'sm'} type={'number'} value={details.weight} onChange={e => set('weight', e.target.value)} />
                </VStack>
                <VStack alignItems={'start'} spacing={1}>
                    <Label hint={'e.g. Narra, Mahogany, Acacia'}>Wood species</Label>
                    <Input size={'sm'} value={details.wood.species} onChange={e => setWood('species', e.target.value)} />
                </VStack>
            </Grid>

            <VStack alignItems={'start'} w={'full'} spacing={1}>
                <Label hint={'One detail per line, e.g. "Mortise-and-tenon joints"'}>Construction details</Label>
                <Textarea size={'sm'} rows={4} value={details.wood.construction} onChange={e => setWood('construction', e.target.value)} />
            </VStack>

            <ChoiceRows
                title={'Sizes'}
                hint={'Price is added to (or taken from) the base price. Dimensions in cm, weight in kg.'}
                rows={details.size}
                onChange={rows => set('size', rows)}
                template={{ name: '', price: 0, width: '', depth: '', height: '', weight: '', seats: '' }}
                fields={[{ key: 'width', label: 'W cm' }, { key: 'depth', label: 'D cm' }, { key: 'height', label: 'H cm' }, { key: 'weight', label: 'kg' }, { key: 'seats', label: 'Seats' }]}
            />
            <ChoiceRows
                title={'Design variants'}
                hint={'Seats and benches control the 3D model (e.g. "Table + 6 chairs" → 6 seats).'}
                rows={details.variant}
                onChange={rows => set('variant', rows)}
                template={{ name: '', price: 0, seats: '', bench: '' }}
                fields={[{ key: 'seats', label: 'Seats' }, { key: 'bench', label: 'Benches' }]}
            />
            <ChoiceRows
                title={'Stains'}
                rows={details.stain}
                onChange={rows => set('stain', rows)}
                template={{ name: '', price: 0, swatch: '#C8955C' }}
                fields={[{ key: 'swatch', label: 'Stain color' }]}
            />
            <ChoiceRows
                title={'Finishes'}
                rows={details.finish}
                onChange={rows => set('finish', rows)}
                template={{ name: '', price: 0, note: '' }}
                fields={[{ key: 'note', label: 'Short note', type: 'text', w: 200 }]}
            />
        </VStack>
    )
}

export default ProductDetailsForm
