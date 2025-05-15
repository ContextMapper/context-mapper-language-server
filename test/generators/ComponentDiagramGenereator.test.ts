// adapted from https://github.com/ContextMapper/context-mapper-dsl/blob/master/org.contextmapper.dsl.tests/src/org/contextmapper/dsl/generators/plantuml/PlantUMLComponentDiagramCreatorTest.java

import { ComponentDiagramGenerator } from '../../src/language/generators/plantuml/ComponentDiagramGenerator.js'
import { beforeEach, describe, expect, test } from 'vitest'
import {
  Aggregate,
  BoundedContext,
  ContextMap,
  CustomerSupplierRelationship,
  DownstreamGovernanceRights,
  DownstreamRole,
  Partnership,
  Relationship,
  SharedKernel,
  UpstreamDownstreamRelationship,
  UpstreamRole
} from '../../src/language/generated/ast.js'
import { Reference } from 'langium'

let generator: ComponentDiagramGenerator

beforeEach(() => {
  generator = new ComponentDiagramGenerator()
})

describe('Component diagram generator tests', () => {
  test('check bounded context', () => {
    const boundedContext = {
      name: 'mySuperBoundedContext',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContextRef = {
      ref: boundedContext
    } as Reference<BoundedContext>

    const node = {
      boundedContexts: [boundedContextRef],
      relationships: [] as Relationship[]
    } as ContextMap

    const diagram = generator.createDiagram(node)

    const expectedResult = `
@startuml

component [mySuperBoundedContext]

@enduml`.trim()

    expect(diagram).toEqual(expectedResult)
  })

  test('check partnership relationship', () => {
    const boundedContext1 = {
      name: 'myContext1',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext1Ref = {
      ref: boundedContext1
    } as Reference<BoundedContext>

    const boundedContext2 = {
      name: 'myContext2',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext2Ref = {
      ref: boundedContext2
    } as Reference<BoundedContext>

    const node = {
      boundedContexts: [boundedContext1Ref, boundedContext2Ref],
      relationships: [
        {
          participant1: boundedContext1Ref,
          participant2: boundedContext2Ref,
          implementationTechnology: 'ourTechnology',
          $type: 'Partnership'
        } as Partnership
      ]
    } as ContextMap

    const diagram = generator.createDiagram(node)

    const expectedResult = `
@startuml

component [myContext1]
component [myContext2]

[myContext1]<-->[myContext2] : Partnership (ourTechnology)

@enduml`.trim()

    expect(diagram).toEqual(expectedResult)
  })

  test('check partnership relationship with name', () => {
    const boundedContext1 = {
      name: 'myContext1',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext1Ref = {
      ref: boundedContext1
    } as Reference<BoundedContext>

    const boundedContext2 = {
      name: 'myContext2',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext2Ref = {
      ref: boundedContext2
    }

    const node = {
      boundedContexts: [boundedContext1Ref, boundedContext2Ref],
      relationships: [
        {
          participant1: boundedContext1Ref,
          participant2: boundedContext2Ref,
          implementationTechnology: 'ourTechnology',
          name: 'myPartnershipTest',
          $type: 'Partnership'
        } as Partnership
      ]
    } as ContextMap

    const diagram = generator.createDiagram(node)

    const expectedResult = `
@startuml

component [myContext1]
component [myContext2]

[myContext1]<-->[myContext2] : myPartnershipTest (Partnership implemented with ourTechnology)

@enduml`.trim()

    expect(diagram).toEqual(expectedResult)
  })

  test('check shared kernel relationship', () => {
    const boundedContext1 = {
      name: 'myContext1',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext1Ref = {
      ref: boundedContext1
    } as Reference<BoundedContext>

    const boundedContext2 = {
      name: 'myContext2',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext2Ref = {
      ref: boundedContext2
    } as Reference<BoundedContext>

    const node = {
      boundedContexts: [boundedContext1Ref, boundedContext2Ref],
      relationships: [
        {
          participant1: boundedContext1Ref,
          participant2: boundedContext2Ref,
          implementationTechnology: 'ourTechnology',
          $type: 'SharedKernel'
        } as SharedKernel
      ]
    } as ContextMap

    const diagram = generator.createDiagram(node)

    const expectedResult = `
@startuml

component [myContext1]
component [myContext2]

[myContext1]<-->[myContext2] : Shared Kernel (ourTechnology)

@enduml`.trim()

    expect(diagram).toEqual(expectedResult)
  })

  test('check shared kernel relationship with name', () => {
    const boundedContext1 = {
      name: 'myContext1',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext1Ref = {
      ref: boundedContext1
    } as Reference<BoundedContext>

    const boundedContext2 = {
      name: 'myContext2',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext2Ref = {
      ref: boundedContext2
    } as Reference<BoundedContext>

    const node = {
      boundedContexts: [boundedContext1Ref, boundedContext2Ref],
      relationships: [
        {
          participant1: boundedContext1Ref,
          participant2: boundedContext2Ref,
          implementationTechnology: 'ourTechnology',
          name: 'mySharedKernel',
          $type: 'SharedKernel'
        } as SharedKernel
      ]
    } as ContextMap

    const diagram = generator.createDiagram(node)

    const expectedResult = `
@startuml

component [myContext1]
component [myContext2]

[myContext1]<-->[myContext2] : mySharedKernel (Shared Kernel implemented with ourTechnology)

@enduml`.trim()

    expect(diagram).toEqual(expectedResult)
  })

  test('check shared kernel relationship with name but no technology', () => {
    const boundedContext1 = {
      name: 'myContext1',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext1Ref = {
      ref: boundedContext1
    } as Reference<BoundedContext>

    const boundedContext2 = {
      name: 'myContext2',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext2Ref = {
      ref: boundedContext2
    } as Reference<BoundedContext>

    const node = {
      boundedContexts: [boundedContext1Ref, boundedContext2Ref],
      relationships: [
        {
          participant1: boundedContext1Ref,
          participant2: boundedContext2Ref,
          implementationTechnology: undefined,
          name: 'mySharedKernel',
          $type: 'SharedKernel'
        } as SharedKernel
      ]
    } as ContextMap

    const diagram = generator.createDiagram(node)

    const expectedResult = `
@startuml

component [myContext1]
component [myContext2]

[myContext1]<-->[myContext2] : mySharedKernel (Shared Kernel)

@enduml`.trim()

    expect(diagram).toEqual(expectedResult)
  })

  test('check upstream-downstream relationship', () => {
    const boundedContext1 = {
      name: 'myContext1',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext1Ref = {
      ref: boundedContext1
    } as Reference<BoundedContext>

    const boundedContext2 = {
      name: 'myContext2',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext2Ref = {
      ref: boundedContext2
    } as Reference<BoundedContext>

    const node = {
      boundedContexts: [boundedContext1Ref, boundedContext2Ref],
      relationships: [
        {
          upstream: boundedContext1Ref,
          upstreamRoles: ['OHS'],
          upstreamExposedAggregates: [],
          downstream: boundedContext2Ref,
          downstreamRoles: ['ACL'],
          downstreamGovernanceRights: [],
          implementationTechnology: ['SOAP'],
          $type: 'UpstreamDownstreamRelationship'
        } as UpstreamDownstreamRelationship
      ]
    } as ContextMap

    const diagram = generator.createDiagram(node)

    const expectedResult = `
@startuml

component [myContext1]
component [myContext2]

interface "SOAP" as myContext2_to_myContext1
[myContext1] --> myContext2_to_myContext1 : OPEN_HOST_SERVICE
myContext2_to_myContext1 <.. [myContext2] : use via ANTICORRUPTION_LAYER

@enduml
`.trim()

    expect(diagram).toEqual(expectedResult)
  })

  test('check upstream-downstream relationship with name', () => {
    const boundedContext1 = {
      name: 'myContext1',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext1Ref = {
      ref: boundedContext1
    } as Reference<BoundedContext>

    const boundedContext2 = {
      name: 'myContext2',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext2Ref = {
      ref: boundedContext2
    } as Reference<BoundedContext>

    const node = {
      boundedContexts: [boundedContext1Ref, boundedContext2Ref],
      relationships: [
        {
          upstream: boundedContext1Ref,
          upstreamRoles: ['OHS'],
          upstreamExposedAggregates: [],
          downstream: boundedContext2Ref,
          downstreamRoles: ['CF'],
          downstreamGovernanceRights: [],
          implementationTechnology: ['SOAP'],
          name: 'myRel',
          $type: 'UpstreamDownstreamRelationship'
        } as UpstreamDownstreamRelationship
      ]
    } as ContextMap

    const diagram = generator.createDiagram(node)

    const expectedResult = `
@startuml

component [myContext1]
component [myContext2]

interface "myRel (SOAP)" as myRel
[myContext1] --> myRel : OPEN_HOST_SERVICE
myRel <.. [myContext2] : use as CONFORMIST

@enduml`.trim()

    expect(diagram).toEqual(expectedResult)
  })

  test('check multiple relationships', () => {
    const boundedContext1 = {
      name: 'myContext1',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext1Ref = {
      ref: boundedContext1
    } as Reference<BoundedContext>

    const boundedContext2 = {
      name: 'myContext2',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext2Ref = {
      ref: boundedContext2
    } as Reference<BoundedContext>

    const rel = {
      upstream: boundedContext1Ref,
      upstreamRoles: ['OHS'],
      upstreamExposedAggregates: [],
      downstream: boundedContext2Ref,
      downstreamRoles: ['ACL'],
      downstreamGovernanceRights: [],
      implementationTechnology: ['SOAP'],
      name: 'myRel',
      $type: 'UpstreamDownstreamRelationship'
    } as UpstreamDownstreamRelationship

    const node = {
      boundedContexts: [boundedContext1Ref, boundedContext2Ref],
      relationships: [
        rel,
        rel,
        rel
      ]
    } as ContextMap

    const diagram = generator.createDiagram(node)

    const expectedResult = `
@startuml

component [myContext1]
component [myContext2]

interface "myRel (SOAP)" as myRel
[myContext1] --> myRel : OPEN_HOST_SERVICE
myRel <.. [myContext2] : use via ANTICORRUPTION_LAYER

interface "myRel (SOAP)" as myContext2_to_myContext1
[myContext1] --> myContext2_to_myContext1 : OPEN_HOST_SERVICE
myContext2_to_myContext1 <.. [myContext2] : use via ANTICORRUPTION_LAYER

interface "myRel (SOAP)" as Interface_2
[myContext1] --> Interface_2 : OPEN_HOST_SERVICE
Interface_2 <.. [myContext2] : use via ANTICORRUPTION_LAYER

@enduml`.trim()

    expect(diagram).toEqual(expectedResult)
  })

  test('check customer-supplier relationship', () => {
    const boundedContext1 = {
      name: 'myContext1',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext1Ref = {
      ref: boundedContext1
    } as Reference<BoundedContext>

    const boundedContext2 = {
      name: 'myContext2',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext2Ref = {
      ref: boundedContext2
    } as Reference<BoundedContext>

    const node = {
      boundedContexts: [boundedContext1Ref, boundedContext2Ref],
      relationships: [
        {
          upstream: boundedContext1Ref,
          upstreamRoles: ['OHS'],
          upstreamExposedAggregates: [] as Reference<Aggregate>[],
          downstream: boundedContext2Ref,
          downstreamRoles: ['ACL'],
          downstreamGovernanceRights: [] as DownstreamGovernanceRights[],
          implementationTechnology: ['SOAP'],
          $type: 'CustomerSupplierRelationship'
        } as CustomerSupplierRelationship
      ]
    } as ContextMap

    const diagram = generator.createDiagram(node)

    const expectedResult = `
@startuml

component [myContext1]
component [myContext2]

interface "Customer-Supplier (SOAP)" as myContext2_to_myContext1
[myContext1] --> myContext2_to_myContext1 : Supplier of OPEN_HOST_SERVICE
myContext2_to_myContext1 <.. [myContext2] : Customer via ANTICORRUPTION_LAYER

@enduml`.trim()

    expect(diagram).toEqual(expectedResult)
  })

  test('check customer-supplier relationship with name', () => {
    const boundedContext1 = {
      name: 'myContext1',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext1Ref = {
      ref: boundedContext1
    } as Reference<BoundedContext>

    const boundedContext2 = {
      name: 'myContext2',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext2Ref = {
      ref: boundedContext2
    } as Reference<BoundedContext>

    const node = {
      boundedContexts: [boundedContext1Ref, boundedContext2Ref],
      relationships: [
        {
          upstream: boundedContext1Ref,
          upstreamRoles: ['OHS'],
          upstreamExposedAggregates: [] as Reference<Aggregate>[],
          downstream: boundedContext2Ref,
          downstreamRoles: ['CF'],
          downstreamGovernanceRights: [] as DownstreamGovernanceRights[],
          implementationTechnology: ['SOAP'],
          name: 'MyCS',
          $type: 'CustomerSupplierRelationship'
        } as CustomerSupplierRelationship
      ]
    } as ContextMap

    const diagram = generator.createDiagram(node)

    const expectedResult = `
@startuml

component [myContext1]
component [myContext2]

interface "MyCS (SOAP)" as MyCS
[myContext1] --> MyCS : Supplier of OPEN_HOST_SERVICE
MyCS <.. [myContext2] : Customer as CONFORMIST

@enduml`.trim()

    expect(diagram).toEqual(expectedResult)
  })

  test('check upstream-downstream relationship without name and technology', () => {
    const boundedContext1 = {
      name: 'myContext1',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext1Ref = {
      ref: boundedContext1
    } as Reference<BoundedContext>

    const boundedContext2 = {
      name: 'myContext2',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext2Ref = {
      ref: boundedContext2
    } as Reference<BoundedContext>

    const node = {
      boundedContexts: [boundedContext1Ref, boundedContext2Ref],
      relationships: [
        {
          upstream: boundedContext1Ref,
          upstreamRoles: [],
          upstreamExposedAggregates: [],
          downstream: boundedContext2Ref,
          downstreamRoles: [],
          downstreamGovernanceRights: [],
          implementationTechnology: [],
          $type: 'UpstreamDownstreamRelationship'
        } as UpstreamDownstreamRelationship
      ]
    } as ContextMap

    const diagram = generator.createDiagram(node)

    const expectedResult = `
@startuml

component [myContext1]
component [myContext2]

interface "Upstream-Downstream" as myContext2_to_myContext1
[myContext1] --> myContext2_to_myContext1
myContext2_to_myContext1 <.. [myContext2] : consume

@enduml`.trim()

    expect(diagram).toEqual(expectedResult)
  })

  test('check exposed aggregates in service usage', () => {
    const aggregate1 = {
      name: 'ExposedAggregate1'
    } as Aggregate
    const aggregate1Ref = {
      ref: aggregate1
    } as Reference<Aggregate>
    const aggregate2 = {
      name: 'ExposedAggregate2'
    } as Aggregate
    const aggregate2Ref = {
      ref: aggregate2
    } as Reference<Aggregate>

    const boundedContext1 = {
      name: 'myContext1',
      domainVisionStatement: [] as string[],
      aggregates: [
        aggregate1,
        aggregate2
      ] as Aggregate[]
    } as BoundedContext
    const boundedContext1Ref = {
      ref: boundedContext1
    } as Reference<BoundedContext>

    const boundedContext2 = {
      name: 'myContext2',
      domainVisionStatement: [] as string[]
    } as BoundedContext
    const boundedContext2Ref = {
      ref: boundedContext2
    } as Reference<BoundedContext>

    const node = {
      boundedContexts: [boundedContext1Ref, boundedContext2Ref],
      relationships: [
        {
          upstream: boundedContext1Ref,
          upstreamExposedAggregates: [aggregate1Ref, aggregate2Ref],
          upstreamRoles: [] as UpstreamRole[],
          downstream: boundedContext2Ref,
          downstreamRoles: [] as DownstreamRole[],
          downstreamGovernanceRights: [] as DownstreamGovernanceRights[],
          implementationTechnology: [],
          $type: 'UpstreamDownstreamRelationship'
        } as UpstreamDownstreamRelationship
      ]
    } as ContextMap

    const diagram = generator.createDiagram(node)

    const expectedResult = `
@startuml

component [myContext1]
component [myContext2]

interface "Upstream-Downstream" as myContext2_to_myContext1
[myContext1] --> myContext2_to_myContext1
myContext2_to_myContext1 <.. [myContext2] : use Aggregates ExposedAggregate1, ExposedAggregate2 

@enduml`.trim()

    expect(diagram).toEqual(expectedResult)
  })

  test('check exposed aggregates in customer supplier relationship', () => {
    const aggregate1 = {
      name: 'ExposedAggregate1'
    } as Aggregate
    const aggregate1Ref = {
      ref: aggregate1
    } as Reference<Aggregate>

    const boundedContext1 = {
      name: 'myContext1',
      domainVisionStatement: [] as string[],
      aggregates: [
        aggregate1
      ]
    }
    const boundedContext1Ref = {
      ref: boundedContext1
    } as Reference<BoundedContext>

    const boundedContext2 = {
      name: 'myContext2',
      domainVisionStatement: [] as string[]
    }
    const boundedContext2Ref = {
      ref: boundedContext2
    } as Reference<BoundedContext>

    const node = {
      boundedContexts: [boundedContext1Ref, boundedContext2Ref],
      relationships: [
        {
          upstream: boundedContext1Ref,
          upstreamExposedAggregates: [aggregate1Ref],
          upstreamRoles: [],
          downstream: boundedContext2Ref,
          downstreamRoles: [],
          downstreamGovernanceRights: [],
          implementationTechnology: [],
          $type: 'CustomerSupplierRelationship'
        } as CustomerSupplierRelationship
      ]
    } as ContextMap

    const diagram = generator.createDiagram(node)

    const expectedResult = `
@startuml

component [myContext1]
component [myContext2]

interface "Customer-Supplier" as myContext2_to_myContext1
[myContext1] --> myContext2_to_myContext1 : Supplier
myContext2_to_myContext1 <.. [myContext2] : Customer of Aggregate ExposedAggregate1 

@enduml`.trim()

    expect(diagram).toEqual(expectedResult)
  })

  test('check empty diagram', () => {
    const node = {
      relationships: [] as Relationship[],
      boundedContexts: [] as BoundedContext[]
    } as unknown as ContextMap

    const diagram = generator.createDiagram(node)

    const expectedResult = `
@startuml

note "Sorry, we cannot generate a component diagram. Your Context Map seems to be empty." as EmptyDiagramError

@enduml`.trim()

    expect(diagram).toEqual(expectedResult)
  })

  test('check domain vision statement of bounded context', () => {
    const boundedContext = {
      name: 'mySuperBoundedContext',
      domainVisionStatement: ['this is my super test vision statement']
    } as BoundedContext
    const boundedContextRef = {
      ref: boundedContext
    } as Reference<BoundedContext>

    const node = {
      boundedContexts: [boundedContextRef],
      relationships: [] as Relationship[]
    } as ContextMap

    const diagram = generator.createDiagram(node)

    const expectedResult = `
@startuml

component [mySuperBoundedContext]
note right of [mySuperBoundedContext]
this is my super test vision statement

end note

@enduml`.trim()

    expect(diagram).toEqual(expectedResult)
  })

  test('check long domain vision statement of bounded context', () => {
    const boundedContext = {
      name: 'mySuperBoundedContext',
      domainVisionStatement: ['this is my super and very long test vision statement']
    } as BoundedContext
    const boundedContextRef = {
      ref: boundedContext
    } as Reference<BoundedContext>

    const node = {
      boundedContexts: [boundedContextRef],
      relationships: [] as Relationship[]
    } as ContextMap

    const diagram = generator.createDiagram(node)

    const expectedResult = `
@startuml

component [mySuperBoundedContext]
note right of [mySuperBoundedContext]
this is my super and very long
test vision statement

end note

@enduml`.trim()

    expect(diagram).toEqual(expectedResult)
  })
})