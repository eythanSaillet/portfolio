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
        this.width = 50
        this.height = 50
        this.widthNumber = 50
        this.heightNumber = 50

        this.vectorMatrix = []
        this.group = new THREE.Group()
        this.linesGroup = new THREE.Group()

        // Setup noise
        this.noiseFactor = 7
        this.noiseScale = 0.04
        this.simplex = new SimplexNoise()
        
        // Setup vectors
        this.setupVectorMatrix()
        
        // Apply noise to vetors
        this.applyNoise()

        // Draw plane from vectors
        this.createPlane()

        // Draw fake wireframe lines from vectors
        this.linesGroup = new THREE.Group()
        this.createLines()

        // Place the group at the center of the scene
        this.group.position.set(- this.width / 2, - this.height / 2, 0)

        // this.test()
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

    applyNoise()
    {
        // Apply simplex noise on the vector field
        for (let i = 0; i < this.vectorMatrix.length; i++)
        {
            for (let j = 0; j < this.vectorMatrix[i].length; j++)
            {
                this.vectorMatrix[i][j].z = (this.simplex.noise3D(i * this.noiseScale, j * this.noiseScale, 0) + 1) * this.noiseFactor
            }
        }
    }

    createPlane()
    {
        // Setup plane mesh
        const planeMaterial = new THREE.MeshBasicMaterial({color: 0x282073, wireframe: false})
        const planeGeometry = new THREE.PlaneGeometry((this.widthNumber - 1) * this.height / this.heightNumber, (this.heightNumber - 1) * this.width / this.widthNumber, this.widthNumber - 1, this.heightNumber - 1)
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
        planeMesh.rotation.z += Math.PI / 2
        planeMesh.position.set(this.width / 2 - 0.5 * this.width / this.widthNumber, this.height / 2 - 0.5 * this.height / this.heightNumber, - 0.01)

        // Apply noise to its vertices
        let x = 0
        for (let i = 0; i < this.widthNumber; i++)
        {
            for (let j = 0; j < this.heightNumber; j++)
            {
                planeMesh.geometry.vertices[this.widthNumber * x + j].z = this.vectorMatrix[i][j].z
            }
            x++
        }

        // Adding the plane to the group
        this.group.add(planeMesh)
    }

    test()
    {
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
        for (let i = 0; i < this.vectorMatrix.length; i++)
        {
            // Push all vectors in the geometry of the line
            const positions = []
            for (let j = 0; j < this.vectorMatrix[i].length; j++)
            {
                let point = this.vectorMatrix[i][j]
                positions.push(point.x, point.y, point.z)
            }

            // Create geometry from its vector array
            const lineGeometry = new LineGeometry()
            lineGeometry.setPositions(positions)

            // Create mesh and add it to lines group
            var lineMesh = new Line2(lineGeometry, lineMaterial)
            this.linesGroup.add(lineMesh)
        }

        // Horizontal lines
        for (let i = 0; i < this.vectorMatrix.length; i++)
        {
            // Push all vectors in the geometry of the line
            const positions = []
            for (let j = 0; j < this.vectorMatrix[i].length; j++)
            {
                let point = this.vectorMatrix[j][i]
                positions.push(point.x, point.y, point.z)
            }

            // Create geometry from its vector array
            const lineGeometry = new LineGeometry()
            lineGeometry.setPositions(positions)

            // Create mesh and add it to lines group
            var lineMesh = new Line2(lineGeometry, lineMaterial)
            this.linesGroup.add(lineMesh)
        }

        // Adding lines group to global group
        this.group.add(this.linesGroup)
    }
}