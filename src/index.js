import './style/main.styl'

// Library
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from './js/Stats'

// Class
import NoiseWave from './js/NoiseWave'


/**
 * Cursor
 */

const cursor = { x: 0, y: 0}
window.addEventListener('mousemove', (_event) =>
{
    cursor.x = _event.clientX / sizes.width - 0.5
    cursor.y = _event.clientY / sizes.height - 0.5
})


/**
 * Sizes
 */

const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight


/**
 * Scene
 */

const scene = new THREE.Scene()


/**
 * Stats framerate
 */

function createStats()
{
    var stats = new Stats()
    stats.setMode(0)

    stats.domElement.style.position = 'absolute'
    stats.domElement.style.left = '0'
    stats.domElement.style.top = '0'

    return stats
}

let stats = createStats()
document.body.appendChild( stats.domElement )


/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 10
scene.add(camera)

/**
 * Object
 */

// Debug object
// scene.add(new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshNormalMaterial()))

// Noise wave
let topNoiseWave = new NoiseWave(30, 30, 15, 15, new THREE.Vector3(0, -0.8, 0), new THREE.Vector3(Math.PI / 2, 0, Math.PI / 4 * 3))
let bottomNoiseWave = new NoiseWave(30, 30, 15, 15, new THREE.Vector3(0, 3.5, 0), new THREE.Vector3(Math.PI / 2, 0, Math.PI / 4 * 3))
scene.add(topNoiseWave.group)
scene.add(bottomNoiseWave.group)
// scene.add(noiseWave.testGroup)

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({antialias: false})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor( 0x282073, 1)
document.body.appendChild(renderer.domElement)
renderer.render(scene, camera)


/**
 * Camera Controls
 */

const cameraControls = new OrbitControls(camera, renderer.domElement)
cameraControls.zoomSpeed = 0.7
cameraControls.enableDamping = true


/**
 * Resize
 */

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
})


/**
 * Loop
 */

const loop = () =>
{
    window.requestAnimationFrame(loop)
    
    // CAMERA
    cameraControls.update()

    // Update framerate info
    stats.update()

    // Update noise wave
    // Top
    topNoiseWave.applyNoiseOnVectors()
    topNoiseWave.updatePlane()
    // Bottom
    bottomNoiseWave.applyNoiseOnVectors()
    bottomNoiseWave.updatePlane()

    // Render
    renderer.render(scene, camera)
}
loop()