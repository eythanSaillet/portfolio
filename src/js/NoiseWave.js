import * as THREE from 'three'
// Three.js fat lines exemple
import {LineGeometry} from './threeFatLinesExemple/LineGeometry'
import {LineMaterial} from './threeFatLinesExemple/LineMaterial'
import {Line2} from './threeFatLinesExemple/Line2'

import SimplexNoise from 'simplex-noise'


export default class NoiseWave
{
    constructor()
    {
        // System properties
        this.width = 20
        this.height = 50
        this.widthNumber = 20
        this.heightNumber = 50

        this.vectorMatrix = []
        this.group = new THREE.Group()
        this.linesGroup = new THREE.Group()

        // Setup noise
        this.noiseFactor = 7
        this.noiseScale = 0.12
        this.simplex = new SimplexNoise()
        this.zNoise = 0
        this.zNoiseSpeed = 0.003
        
        // Setup vectors
        this.setupVectorMatrix()
        
        // Apply noise to vetors
        this.applyNoiseOnVectors()

        // Draw plane from vectors
        this.createPlane()

        // Draw fake wireframe lines from vectors
        this.linesGroup = new THREE.Group()
        this.verticalLinesGroup = new THREE.Group()
        this.horizontalLinesGroup = new THREE.Group()
        this.createLines()

        // Place the group at the center of the scene
        this.group.position.set(- this.width / 2, - this.height / 2, 0)
        
        // Test shit
        // this.testGroup = new THREE.Group()
        // this.testMesh = null
        // this.test()
        // this.updateTest()
        
    }

    setupVectorMatrix()
    {
        // Create a vector field from the system properties
        for (let i = 0; i < this.widthNumber; i++)
        {
            let tab = []
            for (let j = 0; j < this.heightNumber; j++)
            {
                let point = new THREE.Vector3(i * this.width / this.widthNumber, j * this.height / this.heightNumber, 0)
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
        for (let i = 0; i < this.widthNumber; i++)
        {
            for (let j = 0; j < this.heightNumber; j++)
            {
                this.vectorMatrix[i][j].z = (this.simplex.noise3D(i * this.noiseScale, j * this.noiseScale, this.zNoise) + 1) * this.noiseFactor
            }
        }
    }

    createPlane()
    {
        // Setup plane mesh
        const planeMaterial = new THREE.MeshBasicMaterial({color: 0x182073, wireframe: false})
        const planeGeometry = new THREE.PlaneGeometry((this.widthNumber - 1) * this.width / this.widthNumber, (this.heightNumber - 1) * this.height / this.heightNumber, this.widthNumber - 1, this.heightNumber - 1)
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial)
        this.plane.rotation.z += Math.PI 
        this.plane.position.set(this.width / 2 - 0.5 * this.width / this.widthNumber, this.height / 2 - 0.5 * this.height / this.heightNumber, - 0.015)

        // Apply noise to its vertices
        for (let i = 0; i < this.heightNumber; i++)
        {
            for (let j = 0; j < this.widthNumber; j++)
            {
                this.plane.geometry.vertices[this.widthNumber * i + j].z = this.vectorMatrix[this.widthNumber - j - 1][i].z
            }
        }

        // Adding the plane to the group
        this.group.add(this.plane)
    }

    createLines()
    {
        // Create line material
        const lineMaterial = new LineMaterial(
        {
            color: 0x8e88cf,
            linewidth: 0.001,
            //resolution:  // to be set by renderer, eventually
        })

        // Vertical lines
        for (let i = 0; i < this.widthNumber; i++)
        {
            // Push all vectors in the geometry of the line
            const positions = []
            for (let j = 0; j < this.heightNumber; j++)
            {
                let point = this.vectorMatrix[i][j]
                positions.push(point.x, point.y, point.z)
            }

            // Create geometry from its vector array
            const lineGeometry = new LineGeometry()
            lineGeometry.setPositions(positions)

            // Create mesh and add it to lines group
            var lineMesh = new Line2(lineGeometry, lineMaterial)
            this.verticalLinesGroup.add(lineMesh)
        }
        this.linesGroup.add(this.verticalLinesGroup)

        // Horizontal lines
        for (let i = 0; i < this.heightNumber; i++)
        {
            // Push all vectors in the geometry of the line
            const positions = []
            for (let j = 0; j < this.widthNumber; j++)
            {
                let point = this.vectorMatrix[j][i]
                positions.push(point.x, point.y, point.z)
            }

            // Create geometry from its vector array
            const lineGeometry = new LineGeometry()
            lineGeometry.setPositions(positions)

            // Create mesh and add it to lines group
            var lineMesh = new Line2(lineGeometry, lineMaterial)
            this.horizontalLinesGroup.add(lineMesh)
        }
        this.linesGroup.add(this.horizontalLinesGroup)

        // Adding lines group to global group
        this.group.add(this.linesGroup)
    }

    updateLines()
    {
        // Vertical
        for (let i = 0; i < this.widthNumber; i++)
        {
            // Fill an array with new positions
            const positions = []
            for (let j = 0; j < this.heightNumber; j++)
            {
                let point = this.vectorMatrix[i][j]
                positions.push(point.x, point.y, point.z)
            }
            // Then apply it to the geometry
            this.verticalLinesGroup.children[i].geometry.setPositions(positions)
        }

        // Horizontal
        for (let i = 0; i < this.heightNumber; i++)
        {
            // Fill an array with new positions
            const positions = []
            for (let j = 0; j < this.widthNumber; j++)
            {
                let point = this.vectorMatrix[j][i]
                positions.push(point.x, point.y, point.z)
            }
            // Then apply it to the geometry
            this.horizontalLinesGroup.children[i].geometry.setPositions(positions)
        }
    }

    updatePlane()
    {
        // Update each vertices of the geometry
        for (let i = 0; i < this.heightNumber; i++)
        {
            for (let j = 0; j < this.widthNumber; j++)
            {
                this.plane.geometry.vertices[this.widthNumber * i + j].z = this.vectorMatrix[this.widthNumber - j - 1][i].z
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