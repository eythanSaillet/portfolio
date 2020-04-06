import './style/main.styl'

// Library
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from './js/Stats'


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
camera.position.z = 4
camera.position.y = 2
scene.add(camera)

/**
 * Object
 */

// Debug object
scene.add(new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshNormalMaterial()))

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

    // Render
    renderer.render(scene, camera)
}
loop()