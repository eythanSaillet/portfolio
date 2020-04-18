import * as THREE from 'three'
// Three.js fat lines exemple
import {LineGeometry} from './threeFatLinesExemple/LineGeometry'
import {LineMaterial} from './threeFatLinesExemple/LineMaterial'
import {Line2} from './threeFatLinesExemple/Line2'

import SimplexNoise from 'simplex-noise'


export default class NoiseWave
{
    constructor(width, height, widthSegments, heightSegments, position, rotation)
    {
        // System properties
        this.width = width
        this.height = height
        this.widthSegments = widthSegments
        this.heightSegments = heightSegments

        this.position = position
        this.rotation = rotation

        this.vectorMatrix = []
        this.group = new THREE.Group()

        // Setup noise
        this.noiseFactor = 1
        this.noiseScale = 0.2
        this.simplex = new SimplexNoise()
        this.zNoise = 0
        this.zNoiseSpeed = 0.003
        
        // Setup vectors
        this.setupVectorMatrix()
        
        // Apply noise to vetors
        this.applyNoiseOnVectors()

        // Draw plane from vectors
        this.createPlane()

        this.group.position.set(position.x, position.y, position.z)
        this.group.rotation.set(rotation.x, rotation.y, rotation.z)
        
        // Test shit
        // this.testGroup = new THREE.Group()
        // this.testMesh = null
        // this.test()
        // this.updateTest()
        
    }

    setupVectorMatrix()
    {
        // Create a vector field from the system properties
        for (let i = 0; i < this.widthSegments; i++)
        {
            let tab = []
            for (let j = 0; j < this.heightSegments; j++)
            {
                let point = new THREE.Vector3(i * this.width / this.widthSegments, j * this.height / this.heightSegments, 0)
                tab.push(point)
            }
            this.vectorMatrix.push(tab)
        }
    }

    applyNoiseOnVectors()
    {
        // Update noise on z dimension
        this.zNoise += this.zNoiseSpeed

        // Apply simplex noise on the vector field
        for (let i = 0; i < this.widthSegments; i++)
        {
            for (let j = 0; j < this.heightSegments; j++)
            {
                this.vectorMatrix[i][j].z = (this.simplex.noise3D(i * this.noiseScale, j * this.noiseScale, this.zNoise) + 1) * this.noiseFactor
            }
        }
    }

    createPlane()
    {
        // Setup plane mesh
        const planeMaterial = new THREE.MeshBasicMaterial({color: 0xB43BED, wireframe: true})
        const planeGeometry = new THREE.PlaneGeometry((this.widthSegments - 1) * this.width / this.widthSegments, (this.heightSegments - 1) * this.height / this.heightSegments, this.widthSegments - 1, this.heightSegments - 1)
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial)

        // Apply noise to its vertices
        for (let i = 0; i < this.heightSegments; i++)
        {
            for (let j = 0; j < this.widthSegments; j++)
            {
                this.plane.geometry.vertices[this.widthSegments * i + j].z = this.vectorMatrix[this.widthSegments - j - 1][i].z
            }
        }

        // Adding the plane to the group
        this.group.add(this.plane)
    }

    updatePlane()
    {
        // Update each vertices of the geometry
        for (let i = 0; i < this.heightSegments; i++)
        {
            for (let j = 0; j < this.widthSegments; j++)
            {
                this.plane.geometry.vertices[this.widthSegments * i + j].z = this.vectorMatrix[this.widthSegments - j - 1][i].z
            }
        }
        // Make it update
        this.plane.geometry.verticesNeedUpdate = true
    }

    test()
    {
    }

    updateTest()
    {
    }
}