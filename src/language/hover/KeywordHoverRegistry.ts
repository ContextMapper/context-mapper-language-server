export class KeywordHoverRegistry {
  private readonly _registry: Map<string, string> = new Map([
    [
      'BoundedContext',
      `**Bounded Context**: A description of a boundary (typically a subsystem, or the work of a particular team) within which a particular model is defined and applicable. \
      
      Find all DDD pattern descriptions in the DDD reference under [https://domainlanguage.com/ddd/reference/](https://domainlanguage.com/ddd/reference/)`
    ],
    [
      'ContextMap',
      `**Context Map**: A model describing bounded contexts and especially their relationships. Brandolini provides a very good introduction into context mapping here:
      [https://www.infoq.com/articles/ddd-contextmapping/](https://www.infoq.com/articles/ddd-contextmapping/) \
      
      Find all DDD pattern descriptions in the DDD reference under [https://domainlanguage.com/ddd/reference/](https://domainlanguage.com/ddd/reference/)`
    ],
    [
      'U',
      `**U**pstream in the upstream-downstream relationship. \
      
      **upstream-downstream**: A relationship between two bounded contexts
      in which the “upstream” contexts’s actions affect project success of the “downstream” context, but
      the actions of the downstream do not significantly affect projects upstream. (e.g. If two cities
      are along the same river, the upstream city’s pollution primarily affects the downstream city.)
      The upstream team may succeed independently of the fate of the downstream team. \
      
      Find all DDD pattern descriptions in the DDD reference under
      [https://domainlanguage.com/ddd/reference/](https://domainlanguage.com/ddd/reference/)`
    ],
    [
      'D',
      `**D**ownstream in the upstream-downstream relationship.\
      
      **upstream-downstream**: A relationship between two bounded contexts
      in which the “upstream” contexts’s actions affect project success of the “downstream” context, but
      the actions of the downstream do not significantly affect projects upstream. (e.g. If two cities
      are along the same river, the upstream city’s pollution primarily affects the downstream city.)
      The upstream team may succeed independently of the fate of the downstream team. \
      
      Find all DDD pattern descriptions in the DDD reference under
      [https://domainlanguage.com/ddd/reference/](https://domainlanguage.com/ddd/reference/)`
    ],
    [
      'S',
      `**S**upplier in the customer-supplier relationship.
      **customer-supplier**: \
      
      Describes an upstream-downstream relationship
      where one bounded context is customer and the other supplier which work closely together.
      The supplier prioritizes the implementation with respect to the customers requirements. \
      
      Find all DDD pattern descriptions in the DDD reference under
      [https://domainlanguage.com/ddd/reference/](https://domainlanguage.com/ddd/reference/)`
    ],
    [
      'C',
      `**C**ustomer in the customer-supplier relationship.
      **customer-supplier**: \
      
      Describes an upstream-downstream relationship
      where one bounded context is customer and the other supplier which work closely together.
      The supplier prioritizes the implementation with respect to the customers requirements. \
      
      Find all DDD pattern descriptions in the DDD reference under
      [https://domainlanguage.com/ddd/reference/](https://domainlanguage.com/ddd/reference/)`
    ],
    [
      'OHS',
      `**Open Host Service (OHS)**: Describes a role of a
      bounded context which is providing certain functionality needed by many other contexts.
      Because of the broad usage, a public API is provided. \
      
      Find all DDD pattern descriptions in the DDD reference under
      [https://domainlanguage.com/ddd/reference/](https://domainlanguage.com/ddd/reference/)`
    ],
    [
      'PL',
      `**Published Language (PL)**: The published language describes
      the shared knowledge two bounded contexts need for their interaction. Typically defined by the
      upstream providing an Open Host Service. \
      
      Find all DDD pattern descriptions in the DDD reference under
      [https://domainlanguage.com/ddd/reference/](https://domainlanguage.com/ddd/reference/)`
    ],
    [
      'ACL',
      `**Anticorruption Layer (ACL)**: Describes a mechanism used
      by downstreams in order to protect themselves from changes of the upstream. \
      
      Find all DDD pattern descriptions in the DDD reference under
      [https://domainlanguage.com/ddd/reference/](https://domainlanguage.com/ddd/reference/)`
    ],
    [
      'CF',
      `**Conformist (CF)**: Describes a role of a bounded context in
      an upstream-downstream relationship. Since there is no influence on the upstream, the downstream
      team has to deal with what they get and "conform" to it. \
      
      Find all DDD pattern descriptions in the DDD reference under
      [https://domainlanguage.com/ddd/reference/](https://domainlanguage.com/ddd/reference/)`
    ],
    [
      'Aggregate',
      `**Aggregate**: An Aggregate is a cluster of domain
      objects (such as Entities, Value Objects, etc.) which is kept consistent with respect to specific
      invariants and typically also represents a boundary regarding transactions. \
      
      Find all DDD pattern descriptions in the DDD reference under
      [https://domainlanguage.com/ddd/reference/](https://domainlanguage.com/ddd/reference/)`
    ],
    [
      'Domain',
      `**Domain**: The domain describes the world within your
      organization is working. This is not a pattern in the original DDD book of Evans, but still a very
      important term related to the patterns Subdomain and Bounded Context as described by
      [Vernon](https://www.amazon.de/Implementing-Domain-Driven-Design-Vaughn-Vernon/dp/0321834577) \
      
      Find all DDD pattern descriptions in the DDD reference under [https://domainlanguage.com/ddd/reference/](https://domainlanguage.com/ddd/reference/)`
    ],
    [
      'Subdomain',
      `**Subdomain (Core, Supporting, Generic)**: A subdomain
      is a part of the domain. Regarding subdomains we differentiate between Core Domains, Supporting
      Subdomains and Generic Subdomains. A bounded context implements parts of one or multiple subdomains. \
      
      Find all DDD pattern descriptions in the DDD reference under [https://domainlanguage.com/ddd/reference/](https://domainlanguage.com/ddd/reference/)`
    ],
    [
      'P',
      `**Partnership (P)**: The partnership pattern describes an
      intimate relationship between two bounded contexts. Their domain models somehow relate and have
      to be evolved together. \
      
      Find all DDD pattern descriptions in the DDD reference under
      [https://domainlanguage.com/ddd/reference/](https://domainlanguage.com/ddd/reference/)`
    ],
    [
      'SK',
      `**Shared Kernel (SK)**: Desribes an intimate relationship
      between two bounded contexts which share a common part of the domain model and manage it as a
      common library. \
      
      Find all DDD pattern descriptions in the DDD reference under
      [https://domainlanguage.com/ddd/reference/](https://domainlanguage.com/ddd/reference/)`
    ]
  ])

  getKeywordDocumentation (keyword: string): string | undefined {
    return this._registry.get(keyword)
  }
}
