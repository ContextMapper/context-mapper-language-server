// adapted from https://github.com/ContextMapper/context-mapper-dsl/blob/master/org.contextmapper.dsl/src/org/contextmapper/dsl/generator/plantuml/PlantUMLComponentDiagramCreator.java

import { PlantUMLDiagramGenerator } from './PlantUMLDiagramGenerator.js'
import {
  BoundedContext,
  ContextMap,
  DownstreamRole,
  isCustomerSupplierRelationship,
  isPartnership,
  isSharedKernel,
  isSymmetricRelationship,
  isUpstreamDownstreamRelationship,
  Relationship,
  SymmetricRelationship,
  UpstreamDownstreamRelationship, UpstreamRole
} from '../../../generated/ast.js'
import { PlantUMLBuilder } from './PlantUMLBuilder.js'

export class ComponentDiagramGenerator implements PlantUMLDiagramGenerator<ContextMap> {
  private readonly plantUMLBuilder = new PlantUMLBuilder()

  private readonly usedInterfaceNames = new Set<string>()

  private readonly downstreamRolesToString = new Map<DownstreamRole, string>([
    ['ACL', 'ANTICORRUPTION_LAYER'],
    ['CF', 'CONFORMIST']
  ])

  private readonly upstreamRolesToString = new Map<UpstreamRole, string>([
    ['PL', 'PUBLISHED_LANGUAGE'],
    ['OHS', 'OPEN_HOST_SERVICE']
  ])

  createDiagram (node: ContextMap): string {
    if (node.boundedContexts.length === 0) {
      this.plantUMLBuilder.addEmptyDiagramNote('"Sorry, we cannot generate a component diagram. Your Context Map seems to be empty."')
      return this.plantUMLBuilder.build()
    }

    node.boundedContexts.forEach(bc => {
      this.printComponents(bc.ref!)
    })

    this.plantUMLBuilder.addLinebreak()

    node.relationships.forEach(rel => {
      if (isSymmetricRelationship(rel)) {
        this.printSymmetricRelationship(rel)
      } else if (isUpstreamDownstreamRelationship(rel)) {
        this.printUpstreamDownstreamRelationship(rel)
      }
    })

    return this.plantUMLBuilder.build()
  }

  private printComponents (bc: BoundedContext) {
    this.plantUMLBuilder.add(`component [${bc.name}]`)
    if (bc.domainVisionStatement.length === 1) {
      this.plantUMLBuilder.add(`note right of [${bc.name}]`)
      if (bc.domainVisionStatement[0].length > 30) {
        const words = bc.domainVisionStatement[0].split(' ')
        let charCount = 0
        let line = ''
        for (const word of words) {
          line += word + ' '
          charCount += word.length + 1
          if (charCount > 30) {
            this.plantUMLBuilder.add(line.trim())
            line = ''
            charCount = 0
          }
        }
        if (line.length > 0) {
          this.plantUMLBuilder.add(line.trim())
        }
      } else {
        this.plantUMLBuilder.add(bc.domainVisionStatement[0])
      }
      this.plantUMLBuilder.addLinebreak()
      this.plantUMLBuilder.add('end note')
    }
  }

  private printSymmetricRelationship (relationship: SymmetricRelationship) {
    this.plantUMLBuilder.add(`[${relationship.participant1.ref!.name}]<-->[${relationship.participant2.ref!.name}] : ${this.getSymmetricRelationshipLabel(relationship)}`)
    this.plantUMLBuilder.addLinebreak()
  }

  private printUpstreamDownstreamRelationship (relationship: UpstreamDownstreamRelationship) {
    const interfaceId = this.getUniqueInterfaceId(relationship.name, relationship.upstream.ref!.name, relationship.downstream.ref!.name)

    this.plantUMLBuilder.add(`interface "${this.getAsymmetricRelationshipLabel(relationship)}" as ${interfaceId}`)

    this.printInterfaceExposure(relationship, interfaceId)

    this.printInterfaceUsage(relationship, interfaceId)
    this.plantUMLBuilder.addLinebreak()
  }

  private getSymmetricRelationshipLabel (relationship: SymmetricRelationship) {
    const labelParts: string[] = []
    const hasName = relationship.name != null && relationship.name !== ''

    labelParts.push(hasName ? relationship.name! : this.getRelationshipTypeLabel(relationship))

    const hasImplTechnology = relationship.implementationTechnology != null && relationship.implementationTechnology !== ''
    if (hasName && hasImplTechnology) {
      labelParts.push(` (${this.getRelationshipTypeLabel(relationship)} implemented with ${relationship.implementationTechnology})`)
    } else if (hasImplTechnology) {
      labelParts.push(` (${relationship.implementationTechnology})`)
    } else if (hasName) {
      labelParts.push(` (${this.getRelationshipTypeLabel(relationship)})`)
    }
    return labelParts.join('')
  }

  private getAsymmetricRelationshipLabel (relationship: UpstreamDownstreamRelationship) {
    const labelParts: string[] = []
    const hasName = relationship.name != null && relationship.name !== ''
    if (hasName) {
      labelParts.push(relationship.name!)
    } else if (isCustomerSupplierRelationship(relationship)) {
      labelParts.push(this.getRelationshipTypeLabel(relationship))
    }

    const hasImplTechnology = relationship.implementationTechnology.length === 1 && relationship.implementationTechnology[0] !== ''
    if (labelParts.length === 0 && hasImplTechnology) {
      labelParts.push(relationship.implementationTechnology[0])
    } else if (hasImplTechnology) {
      labelParts.push(` (${relationship.implementationTechnology[0]})`)
    }

    if (labelParts.length === 0) {
      labelParts.push(this.getRelationshipTypeLabel(relationship))
    }
    return labelParts.join('')
  }

  private getRelationshipTypeLabel (relationship: Relationship) {
    if (isPartnership(relationship)) {
      return 'Partnership'
    } else if (isSharedKernel(relationship)) {
      return 'Shared Kernel'
    } else if (isCustomerSupplierRelationship(relationship)) {
      return 'Customer-Supplier'
    } else {
      return 'Upstream-Downstream'
    }
  }

  private getUniqueInterfaceId (name: string | undefined, upstreamName: string, downstreamName: string): string {
    if (name != null && !this.usedInterfaceNames.has(name)) {
      this.usedInterfaceNames.add(name)
      return name
    }

    const upstreamDownstreamName = `${downstreamName}_to_${upstreamName}`
    if (!this.usedInterfaceNames.has(upstreamDownstreamName)) {
      this.usedInterfaceNames.add(upstreamDownstreamName)
      return upstreamDownstreamName
    }

    const interfaceName = `Interface_${this.usedInterfaceNames.size}`
    this.usedInterfaceNames.add(interfaceName)
    return interfaceName
  }

  private printInterfaceExposure (relationship: UpstreamDownstreamRelationship, interfaceId: string) {
    const exposureParts: string[] = []
    const upstreamRoles = relationship.upstreamRoles.map(r => this.upstreamRolesToString.get(r)).join(', ')

    if (isCustomerSupplierRelationship(relationship)) {
      exposureParts.push(`[${relationship.upstream.ref!.name}] --> ${interfaceId} : Supplier`)

      if (relationship.upstreamRoles.length > 0) {
        exposureParts.push(` of ${upstreamRoles}`)
      }
    } else {
      exposureParts.push(`[${relationship.upstream.ref!.name}] --> ${interfaceId}`)
      if (relationship.upstreamRoles.length > 0) {
        exposureParts.push(` : ${upstreamRoles}`)
      }
    }
    this.plantUMLBuilder.add(exposureParts.join(''))
  }

  private printInterfaceUsage (relationship: UpstreamDownstreamRelationship, interfaceId: string) {
    const interfaceParts: string[] = []
    const downstreamRole = this.getDownstreamRole(relationship.downstreamRoles)

    interfaceParts.push(`${interfaceId} <.. [${relationship.downstream.ref!.name}] : `)
    if (isCustomerSupplierRelationship(relationship)) {
      interfaceParts.push('Customer ')
    } else if (relationship.upstreamExposedAggregates.length === 0 && downstreamRole === '') {
      interfaceParts.push('consume')
    } else {
      interfaceParts.push('use ')
    }

    if (relationship.upstreamExposedAggregates.length > 0) {
      if (isCustomerSupplierRelationship(relationship)) {
        interfaceParts.push('of ')
      }
      interfaceParts.push(relationship.upstreamExposedAggregates.length > 1 ? 'Aggregates ' : 'Aggregate ')
      interfaceParts.push(relationship.upstreamExposedAggregates.map(a => a.ref!.name).join(', '))
      interfaceParts.push(' ')
    }

    if (downstreamRole !== '') {
      interfaceParts.push(downstreamRole)
    }
    this.plantUMLBuilder.add(interfaceParts.join(''))
  }

  private getDownstreamRole (roles: DownstreamRole[]): string {
    if (roles.length === 0) return ''

    // currently CML only supports one downstream role (ACL or CONFORMIST)
    const role = roles[0]
    if (role === 'ACL') {
      return 'via ' + this.downstreamRolesToString.get(role)
    } else {
      return 'as ' + this.downstreamRolesToString.get(role)
    }
  }
}