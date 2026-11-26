// Interactive 3D model of a furniture set, built in the browser from the selected options
// (size, variant, stain, color). Drag to rotate, scroll/pinch to zoom, or use the view buttons.
// Loaded with next/dynamic (ssr: false) because three.js needs the DOM.
import { Box, Button, HStack, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const VIEWS = ['Front', 'Back', 'Side', 'Top']

// ---------- materials ----------

const shade = (hex, amount) => {
    const c = new THREE.Color(hex)
    const hsl = {}
    c.getHSL(hsl)
    c.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l + amount)))
    return `#${c.getHexString()}`
}

// Procedural wood grain tinted with the chosen stain.
const woodTexture = (stain) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = stain
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    let seed = 7
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < 140; i++) {
        const y = rand() * canvas.height
        const amp = 2 + rand() * 6
        const freq = 0.004 + rand() * 0.01
        ctx.strokeStyle = shade(stain, (rand() - 0.6) * 0.16)
        ctx.globalAlpha = 0.25 + rand() * 0.45
        ctx.lineWidth = 0.6 + rand() * 2.4
        ctx.beginPath()
        for (let x = 0; x <= canvas.width; x += 8)
            ctx.lineTo(x, y + Math.sin(x * freq + i) * amp)
        ctx.stroke()
    }
    // A few knots
    for (let k = 0; k < 3; k++) {
        const x = rand() * canvas.width
        const y = rand() * canvas.height
        for (let r = 14; r > 2; r -= 3) {
            ctx.globalAlpha = 0.35
            ctx.strokeStyle = shade(stain, -0.12)
            ctx.beginPath()
            ctx.ellipse(x, y, r * 2.2, r * 0.7, 0, 0, Math.PI * 2)
            ctx.stroke()
        }
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    return texture
}

const makeMaterials = ({ stain, accent, finish }) => {
    const glossy = /gloss/i.test(finish || '')
    const oiled = /oil|matte/i.test(finish || '')
    const roughness = glossy ? 0.18 : oiled ? 0.75 : 0.45
    const map = woodTexture(stain)
    return {
        wood: new THREE.MeshStandardMaterial({ map, roughness, metalness: 0 }),
        accent: new THREE.MeshStandardMaterial({ color: accent, roughness: 0.6 }),
        fabric: new THREE.MeshStandardMaterial({ color: '#d9cfc0', roughness: 0.95 }),
        upholstery: new THREE.MeshStandardMaterial({ color: '#4b3e3a', roughness: 1 }),
        steel: new THREE.MeshStandardMaterial({ color: accent, roughness: 0.4, metalness: 0.6 }),
        textures: [map]
    }
}

// ---------- geometry helpers ----------

const box = (w, h, d, material, x, y, z) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
    mesh.position.set(x, y, z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    return mesh
}

const cylinder = (rTop, rBottom, h, material, x, y, z, segments = 48) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, h, segments), material)
    mesh.position.set(x, y, z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    return mesh
}

// A dining chair facing -z (towards the table) at its local origin.
const chair = (m, { painted, upholsteredBack }) => {
    const g = new THREE.Group()
    const frame = painted ? m.accent : m.wood
    const seatH = 0.46
    const leg = 0.04
    const s = 0.44
    for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        const isBack = z === 1
        const h = isBack ? 0.95 : seatH
        g.add(box(leg, h, leg, frame, x * (s / 2 - leg / 2), h / 2, z * (s / 2 - leg / 2)))
    }
    g.add(box(s, 0.035, s, frame, 0, seatH, 0))
    g.add(box(s - 0.04, 0.05, s - 0.04, upholsteredBack ? m.upholstery : m.fabric, 0, seatH + 0.04, 0))
    if (upholsteredBack) {
        g.add(box(s - 0.08, 0.38, 0.03, m.upholstery, 0, seatH + 0.28, s / 2 - leg / 2))
    } else {
        for (let i = 0; i < 3; i++)
            g.add(box(s - 0.08, 0.05, 0.02, frame, 0, seatH + 0.16 + i * 0.12, s / 2 - leg / 2))
    }
    return g
}

const bench = (m, length) => {
    const g = new THREE.Group()
    const h = 0.45
    g.add(box(length, 0.04, 0.36, m.wood, 0, h, 0))
    for (const x of [-1, 1]) {
        g.add(box(0.06, h, 0.3, m.wood, x * (length / 2 - 0.12), h / 2, 0))
    }
    g.add(box(length - 0.3, 0.05, 0.05, m.wood, 0, 0.12, 0))
    return g
}

// Wavy-edged slab for live-edge tables.
const liveEdgeTop = (w, d, thickness, material) => {
    const shape = new THREE.Shape()
    const steps = 40
    const wobble = (i, side) => Math.sin(i * 0.9 + side) * 0.025 + Math.sin(i * 0.37 + side * 2) * 0.03
    shape.moveTo(-w / 2, -d / 2 + wobble(0, 1))
    for (let i = 0; i <= steps; i++) shape.lineTo(-w / 2 + (w * i) / steps, -d / 2 + wobble(i, 1))
    for (let i = steps; i >= 0; i--) shape.lineTo(-w / 2 + (w * i) / steps, d / 2 + wobble(i, 4))
    shape.closePath()
    const geo = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2 })
    geo.rotateX(-Math.PI / 2)
    const uv = geo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 1.2, uv.getY(i) / 1.2)
    const mesh = new THREE.Mesh(geo, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    return mesh
}

// ---------- furniture sets ----------

const placeRectChairs = (group, m, W, D, seats, benches, chairOpts) => {
    const freeSides = []
    if (benches < 2) freeSides.push(-1)
    if (benches < 1) freeSides.push(1)
    for (let b = 0; b < benches; b++) {
        const side = b === 0 ? 1 : -1
        const piece = bench(m, Math.max(0.8, W - 0.25))
        piece.position.set(0, 0, side * (D / 2 + 0.25))
        group.add(piece)
    }
    let ends = 0
    if (seats >= 6 || (benches > 0 && seats >= 2) || !freeSides.length) ends = Math.min(2, seats)
    let remaining = seats - ends
    for (let e = 0; e < ends; e++) {
        const side = e === 0 ? -1 : 1
        const c = chair(m, chairOpts)
        c.position.set(side * (W / 2 + 0.3), 0, 0)
        c.rotation.y = side * Math.PI / 2
        group.add(c)
    }
    if (!freeSides.length) return
    const perSide = Math.ceil(remaining / freeSides.length)
    freeSides.forEach((side) => {
        const n = Math.min(perSide, remaining)
        remaining -= n
        for (let i = 0; i < n; i++) {
            const x = n === 1 ? 0 : -W / 2 + 0.35 + (i * (W - 0.7)) / (n - 1)
            const c = chair(m, chairOpts)
            c.position.set(x, 0, side * (D / 2 + 0.22))
            c.rotation.y = side === 1 ? 0 : Math.PI
            group.add(c)
        }
    })
}

const buildSet = (opts, m) => {
    const group = new THREE.Group()
    const W = opts.width / 100
    const D = opts.depth / 100
    const H = opts.height / 100
    const top = 0.035
    const chairOpts = { painted: opts.paintedChairs, upholsteredBack: opts.upholsteredBack }

    if (opts.model === 'dining-round' || opts.model === 'dining-round-upholstered') {
        const r = W / 2
        group.add(cylinder(r, r, top, m.wood, 0, H - top / 2, 0, 72))
        if (opts.model === 'dining-round-upholstered') {
            const inset = r * 0.55
            for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]])
                group.add(box(0.06, H - top, 0.06, m.wood, x * inset, (H - top) / 2, z * inset))
        } else {
            group.add(cylinder(0.06, 0.07, H - top, m.accent, 0, (H - top) / 2, 0))
            group.add(cylinder(r * 0.45, r * 0.5, 0.04, m.accent, 0, 0.02, 0))
        }
        const n = opts.seats
        for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2 + Math.PI / 4
            const c = chair(m, chairOpts)
            c.position.set(Math.sin(a) * (r + 0.2), 0, Math.cos(a) * (r + 0.2))
            c.rotation.y = a
            group.add(c)
        }
        return group
    }

    if (opts.model === 'live-edge') {
        const slab = 0.05
        const t = liveEdgeTop(W, D, slab, m.wood)
        t.position.y = H - slab
        group.add(t)
        for (const x of [-1, 1]) {
            const lx = x * (W / 2 - 0.25)
            const legH = H - slab
            group.add(box(0.06, legH, 0.06, m.steel, lx, legH / 2, -D / 2 + 0.12))
            group.add(box(0.06, legH, 0.06, m.steel, lx, legH / 2, D / 2 - 0.12))
            group.add(box(0.06, 0.06, D - 0.18, m.steel, lx, legH - 0.03, 0))
            group.add(box(0.06, 0.06, D - 0.18, m.steel, lx, 0.03, 0))
        }
        placeRectChairs(group, m, W, D, opts.seats, 0, { ...chairOpts, painted: false })
        return group
    }

    // Rectangular dining table (default)
    group.add(box(W, top, D, m.wood, 0, H - top / 2, 0))
    const leg = 0.075
    const legH = H - top
    for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]])
        group.add(box(leg, legH, leg, m.wood, x * (W / 2 - 0.08), legH / 2, z * (D / 2 - 0.08)))
    group.add(box(W - 0.2, 0.09, 0.025, m.wood, 0, H - top - 0.045, D / 2 - 0.08))
    group.add(box(W - 0.2, 0.09, 0.025, m.wood, 0, H - top - 0.045, -D / 2 + 0.08))
    group.add(box(0.025, 0.09, D - 0.2, m.wood, W / 2 - 0.08, H - top - 0.045, 0))
    group.add(box(0.025, 0.09, D - 0.2, m.wood, -W / 2 + 0.08, H - top - 0.045, 0))
    placeRectChairs(group, m, W, D, opts.seats, opts.benches, chairOpts)
    return group
}

const disposeGroup = (group) => {
    group.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
    })
}

// ---------- component ----------

const Product3D = (props) => {
    const mountRef = useRef(null)
    const ctxRef = useRef(null)
    const [autoRotate, setAutoRotate] = useState(true)
    const [webglError, setWebglError] = useState(false)

    // Scene setup, once.
    useEffect(() => {
        const mount = mountRef.current
        let renderer
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: false })
        } catch (e) {
            setWebglError(true)
            return
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        mount.appendChild(renderer.domElement)

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 50)
        scene.add(new THREE.HemisphereLight('#fff8ef', '#b9a58c', 1.4))
        const sun = new THREE.DirectionalLight('#ffffff', 2.2)
        sun.position.set(2.5, 4, 3)
        sun.castShadow = true
        sun.shadow.mapSize.set(2048, 2048)
        sun.shadow.camera.left = sun.shadow.camera.bottom = -3
        sun.shadow.camera.right = sun.shadow.camera.top = 3
        sun.shadow.radius = 4
        scene.add(sun)
        const floor = new THREE.Mesh(
            new THREE.CircleGeometry(4, 64),
            new THREE.ShadowMaterial({ opacity: 0.22 })
        )
        floor.rotation.x = -Math.PI / 2
        floor.receiveShadow = true
        scene.add(floor)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.enablePan = false
        controls.autoRotate = true
        controls.autoRotateSpeed = 1.6
        controls.minDistance = 1.2
        controls.maxDistance = 9
        controls.maxPolarAngle = Math.PI / 2 - 0.02

        const resize = () => {
            const w = mount.clientWidth
            const h = mount.clientHeight
            renderer.setSize(w, h, false)
            renderer.domElement.style.width = '100%'
            renderer.domElement.style.height = '100%'
            camera.aspect = w / h
            camera.updateProjectionMatrix()
        }
        const observer = new ResizeObserver(resize)
        observer.observe(mount)
        resize()

        const ctx = { renderer, scene, camera, controls, group: null, materials: null, tween: null, radius: 2 }
        ctxRef.current = ctx

        let frame
        const loop = (time) => {
            frame = requestAnimationFrame(loop)
            if (ctx.tween) {
                const t = Math.min(1, (time - ctx.tween.start) / 700)
                const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
                camera.position.lerpVectors(ctx.tween.from, ctx.tween.to, e)
                if (t >= 1) ctx.tween = null
            }
            controls.update()
            renderer.render(scene, camera)
        }
        frame = requestAnimationFrame(loop)

        return () => {
            cancelAnimationFrame(frame)
            observer.disconnect()
            controls.dispose()
            if (ctx.group) disposeGroup(ctx.group)
            if (ctx.materials) ctx.materials.textures.forEach(t => t.dispose())
            renderer.dispose()
            mount.removeChild(renderer.domElement)
            ctxRef.current = null
        }
    }, [])

    // Rebuild the furniture when any option changes.
    const { model, width, depth, height, seats, benches, stain, accent, finish, paintedChairs, upholsteredBack } = props
    useEffect(() => {
        const ctx = ctxRef.current
        if (!ctx) return
        if (ctx.group) {
            ctx.scene.remove(ctx.group)
            disposeGroup(ctx.group)
        }
        if (ctx.materials) ctx.materials.textures.forEach(t => t.dispose())
        const materials = makeMaterials({ stain, accent, finish })
        const group = buildSet({ model, width, depth, height, seats, benches, paintedChairs, upholsteredBack }, materials)
        ctx.scene.add(group)
        ctx.group = group
        ctx.materials = materials

        const bounds = new THREE.Box3().setFromObject(group)
        const size = bounds.getSize(new THREE.Vector3())
        const radius = Math.max(size.x, size.z, size.y) * 0.5
        const firstBuild = ctx.radius === 2 && !ctx.built
        ctx.radius = radius
        ctx.controls.target.set(0, size.y * 0.4, 0)
        if (firstBuild) {
            ctx.built = true
            const dist = radius * 3.2
            ctx.camera.position.set(dist * 0.7, dist * 0.55, dist * 0.7)
        }
    }, [model, width, depth, height, seats, benches, stain, accent, finish, paintedChairs, upholsteredBack])

    useEffect(() => {
        if (ctxRef.current) ctxRef.current.controls.autoRotate = autoRotate
    }, [autoRotate])

    const goTo = (view) => {
        const ctx = ctxRef.current
        if (!ctx) return
        setAutoRotate(false)
        const dist = ctx.radius * 3.2
        const y = ctx.controls.target.y
        const to = {
            Front: new THREE.Vector3(0, y + dist * 0.25, dist),
            Back: new THREE.Vector3(0, y + dist * 0.25, -dist),
            Side: new THREE.Vector3(dist, y + dist * 0.25, 0),
            Top: new THREE.Vector3(0, dist * 1.1, 0.001)
        }[view]
        ctx.tween = { from: ctx.camera.position.clone(), to, start: performance.now() }
    }

    if (webglError) {
        return (
            <Box p={6} bgColor={'gray.50'} rounded={'lg'} textAlign={'center'}>
                <Text fontSize={'sm'}>3D view is not supported on this device.</Text>
            </Box>
        )
    }

    return (
        <Box w={'full'}>
            <Box
                ref={mountRef}
                position={'relative'}
                w={'full'}
                h={{ base: '320px', md: '440px' }}
                rounded={'lg'}
                bgGradient={'radial(white, gray.100)'}
                cursor={'grab'}
                _active={{ cursor: 'grabbing' }}
                style={{ touchAction: 'none' }}
                aria-label={'Interactive 3D model. Drag to rotate, scroll or pinch to zoom.'}
                role={'img'}
            />
            <Wrap mt={3} spacing={2} justify={'center'}>
                {VIEWS.map(v => (
                    <WrapItem key={v}>
                        <Button size={'sm'} variant={'ghost'} borderWidth={1} borderColor={'gray.300'} onClick={() => goTo(v)}>
                            {v}
                        </Button>
                    </WrapItem>
                ))}
                <WrapItem>
                    <Button
                        size={'sm'}
                        variant={autoRotate ? 'solid' : 'ghost'}
                        borderWidth={1}
                        borderColor={'gray.300'}
                        onClick={() => setAutoRotate(r => !r)}>
                        360° spin {autoRotate ? 'on' : 'off'}
                    </Button>
                </WrapItem>
            </Wrap>
            <HStack justify={'center'} mt={2}>
                <Text fontSize={'xs'} textColor={'gray.500'}>
                    Drag to rotate · pinch or scroll to zoom · model updates with your selection
                </Text>
            </HStack>
        </Box>
    )
}

export default Product3D
