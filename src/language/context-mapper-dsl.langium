grammar ContextMapperDsl

terminal ID: /[_a-zA-Z][\w_]*/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal WS: /\s+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

entry ContextMappingModel:
	(
		(contextMap+=ContextMap) |
		(boundedContexts+=BoundedContext) |
		(domains+=Domain) |
		(userRequirements+=UserRequirement) |
		(stakeholders+=Stakeholders) |
		(valueRegisters+=ValueRegister)
	)*
;

/*
 Unordered groups may cause unreadable parsing errors. To resolve that, unordered groups can be replaced with a (A | B | C)* rule and enforce non-repetition of elements with a validator.
 https://github.com/eclipse-langium/langium/discussions/1903
 Also, unordered groups cause issues with autocomplete.
 Therefore all unordered group rules had to be converted to the recommended workaround from above.
 */

ContextMap:
	// {ContextMap} make sure there is always a context map
	'ContextMap' (name=ID)?
	'{'
		(
			('type' ('=')? type+=ContextMapType) |
			('state' ('=')? state+=ContextMapState)
		)*
		('contains' boundedContexts+=[BoundedContext] ("," boundedContexts+=[BoundedContext])*)*
		relationships+=Relationship*
	'}'
;

BoundedContext:
	'BoundedContext' name=ID (
		(
			('implements' (implementedDomainParts+=[DomainPart]) ("," implementedDomainParts+=[DomainPart])*) |
			('realizes' (realizedBoundedContexts+=[BoundedContext]) ("," realizedBoundedContexts+=[BoundedContext])*) |
			('refines' refinedBoundedContext+=[BoundedContext])
		)*
	)
	(
		'{'
			(
				('domainVisionStatement' ('=')? domainVisionStatement+=STRING) |
				('type' ('=')? type+=BoundedContextType) |
				(('responsibilities' ('=')? responsibilities+=STRING) ("," responsibilities+=STRING)*) |
				('implementationTechnology' ('=')? implementationTechnology+=STRING) |
				('knowledgeLevel' ('=')? knowledgeLevel+=KnowledgeLevel) |
				('businessModel' ('=')? businessModel+=STRING) |
				('evolution' ('=')? evolution+=Evolution)
			)*
			(
				(
					modules+=SculptorModule |
					aggregates+=Aggregate
				)* 
			)
		'}'
	)?
;

DomainPart:
	Domain | Subdomain
;

Domain:
	'Domain' name=ID
	(
		'{'
			(('domainVisionStatement' ('=')? domainVisionStatement=STRING)?
			(subdomains+=Subdomain)*)
		'}'
	)?
;

Subdomain:
	'Subdomain' name=ID ('supports' (supportedFeatures+=[UserRequirement]) ("," supportedFeatures+=[UserRequirement])*)?
	(
		'{'
			(
				('type' ('=')? type+=SubDomainType) |
				('domainVisionStatement' ('=')? domainVisionStatement+=STRING)
			)*
		'}'
	)?
;

Relationship:
	SymmetricRelationship | UpstreamDownstreamRelationship
;

SymmetricRelationship:
	Partnership | SharedKernel
;

Partnership:
	(
		(participant1=[BoundedContext] '[''P'']' '<->' '[''P'']' participant2=[BoundedContext]) |
		('[''P'']' participant1=[BoundedContext] '<->' '[''P'']' participant2=[BoundedContext]) |
		(participant1=[BoundedContext] '[''P'']' '<->' participant2=[BoundedContext] '[''P'']') |
		('[''P'']' participant1=[BoundedContext] '<->' participant2=[BoundedContext] '[''P'']') |
		(participant1=[BoundedContext] 'Partnership' participant2=[BoundedContext])
	)
	(':' name=ID)?
	('{'
		('implementationTechnology' ('=')? implementationTechnology=STRING)?
	'}')?
;

SharedKernel:
	(
		(participant1=[BoundedContext] '[''SK'']' '<->' '[''SK'']' participant2=[BoundedContext]) |
		('[''SK'']' participant1=[BoundedContext] '<->' '[''SK'']' participant2=[BoundedContext]) |
		(participant1=[BoundedContext] '[''SK'']' '<->' participant2=[BoundedContext] '[''SK'']') |
		('[''SK'']' participant1=[BoundedContext] '<->' participant2=[BoundedContext] '[''SK'']') |
		(participant1=[BoundedContext] 'Shared-Kernel' participant2=[BoundedContext]) |
		(participant1=[BoundedContext] '<->' participant2=[BoundedContext])
	)
	(':' name=ID)?
	('{'
		('implementationTechnology' ('=')? implementationTechnology=STRING)?
	'}')?
;

UpstreamDownstreamRelationship:
	CustomerSupplierRelationship |
	(
		(
			(upstream=[BoundedContext] (('[''U'']') | ('['('U'',')?(upstreamRoles+=UpstreamRole) ("," upstreamRoles+=UpstreamRole)*)']')? '->' (('[''D'']') | ('['('D'',')?(downstreamRoles+=DownstreamRole) ("," downstreamRoles+=DownstreamRole)*)']')? downstream=[BoundedContext]) |
			(downstream=[BoundedContext] (('[''D'']') | ('['('D'',')?(downstreamRoles+=DownstreamRole) ("," downstreamRoles+=DownstreamRole)*)']')? '<-' (('[''U'']') | ('['('U'',')?(upstreamRoles+=UpstreamRole) ("," upstreamRoles+=UpstreamRole)*)']')? upstream=[BoundedContext]) |
			(upstream=[BoundedContext] ('['((upstreamRoles+=UpstreamRole) ("," upstreamRoles+=UpstreamRole)*)?']')?'Upstream-Downstream'('['((downstreamRoles+=DownstreamRole) ("," downstreamRoles+=DownstreamRole)*)?']')? downstream=[BoundedContext]) |
			(downstream=[BoundedContext] ('['((downstreamRoles+=DownstreamRole) ("," downstreamRoles+=DownstreamRole)*)?']')?'Downstream-Upstream'('['((upstreamRoles+=UpstreamRole) ("," upstreamRoles+=UpstreamRole)*)?']')? upstream=[BoundedContext])
		)
		(':' name=ID)?
		('{' 
			(
				('implementationTechnology' ('=')? implementationTechnology+=STRING) |
				(('exposedAggregates' ('=')? upstreamExposedAggregates+=[Aggregate]) ("," upstreamExposedAggregates+=[Aggregate])*) |
				('downstreamRights' ('=')? downstreamGovernanceRights+=DownstreamGovernanceRights)
			)*
		'}')?
	)
;

CustomerSupplierRelationship:
	(
		(
			(upstream=[BoundedContext] '['('U'',')?'S'(','(upstreamRoles+=UpstreamRole) ("," upstreamRoles+=UpstreamRole)*)?']' '->' '['('D'',')?'C'(','(downstreamRoles+=DownstreamRole) ("," downstreamRoles+=DownstreamRole)*)?']' downstream=[BoundedContext]) |
			(downstream=[BoundedContext] '['('D'',')?'C'(','(downstreamRoles+=DownstreamRole) ("," downstreamRoles+=DownstreamRole)*)?']' '<-' '['('U'',')?'S'(','(upstreamRoles+=UpstreamRole) ("," upstreamRoles+=UpstreamRole)*)?']' upstream=[BoundedContext]) |
			(downstream=[BoundedContext] ('['((downstreamRoles+=DownstreamRole) ("," downstreamRoles+=DownstreamRole)*)?']')?'Customer-Supplier'('['((upstreamRoles+=UpstreamRole) ("," upstreamRoles+=UpstreamRole)*)?']')? upstream=[BoundedContext]) |
			(upstream=[BoundedContext] ('['((upstreamRoles+=UpstreamRole) ("," upstreamRoles+=UpstreamRole)*)?']')?'Supplier-Customer'('['((downstreamRoles+=DownstreamRole) ("," downstreamRoles+=DownstreamRole)*)?']')? downstream=[BoundedContext])
		)
		(':' name=ID)?
		('{' 
			(
				('implementationTechnology' ('=')? implementationTechnology+=STRING) |
				(('exposedAggregates' ('=')? upstreamExposedAggregates+=[Aggregate]) ("," upstreamExposedAggregates+=[Aggregate])*) |
				('downstreamRights' ('=')? downstreamGovernanceRights+=DownstreamGovernanceRights)
			)*
		'}')?
	)
;

Aggregate:
	(doc=STRING)?
  "Aggregate" name=ID ('{'
    (
    	(('responsibilities' ('=')? responsibilities+=STRING) ("," responsibilities+=STRING)*) |
		(('useCases' ('=')? useCases+=[UseCase]) ("," useCases+=[UseCase])*) |
		(('userStories' ('=')? userStories+=[UserStory]) ("," userStories+=[UserStory])*) |
		((('features' | 'userRequirements') ('=')? userRequirements+=[UserRequirement]) ("," userRequirements+=[UserRequirement])*) |
    	('owner' ('=')? owner+=[BoundedContext]) |
    	('knowledgeLevel' ('=')? knowledgeLevel+=KnowledgeLevel) |
    	(('likelihoodForChange' | 'structuralVolatility') ('=')? likelihoodForChange+=Volatility) |
    	('contentVolatility' ('=')? contentVolatility+=Volatility) |
    	('availabilityCriticality' ('=')? availabilityCriticality+=Criticality) |
    	('consistencyCriticality' ('=')? consistencyCriticality+=Criticality) |
    	('storageSimilarity' ('=')? storageSimilarity+=Similarity) |
    	('securityCriticality' ('=')? securityCriticality+=Criticality) |
    	('securityZone' ('=')? securityZone+=STRING) |
    	('securityAccessGroup' ('=')? securityAccessGroup+=STRING)
    )*
  '}')?
;

UserRequirement:
	UseCase | UserStory
;

UseCase:
	'UseCase' name=ID ('{'
		(
			('actor' ('=')? role+=STRING) |
			('secondaryActors' ('=')? secondaryActors+=STRING ("," secondaryActors+=STRING)*) |
			('interactions' ('=')? features+=Feature ("," features+=Feature)*) |
			('benefit' ('=')? benefit+=STRING) |
			('scope' ('=')? scope+=STRING) |
			('level' ('=')? level+=STRING)
		)*
	'}')?
;

UserStory:
	'UserStory' name=ID ('split by' splittingStory=[UserStory])? ('{'
		(('As a' | 'As an') role=STRING (features+=Feature)+ 'so that' benefit=STRING (valuation=StoryValuation)?)?
	'}')?
;

Feature:
	NormalFeature | StoryFeature
;

NormalFeature:
	verb=(UserActivityDefaultVerb | STRING) (entityArticle='a' | entityArticle='an' | entityArticle='the')? entity=STRING ((entityAttributesPreposition='with its' | entityAttributesPreposition='with their') entityAttributes+=STRING ("," entityAttributes+=STRING)*)? ((containerEntityPreposition='in' | containerEntityPreposition='for' | containerEntityPreposition='to')(containerEntityArticle='a' | containerEntityArticle='an')? containerEntity=STRING)?
;

StoryFeature:
	'I want to' verb=(UserActivityDefaultVerb | STRING) (entityArticle='a' | entityArticle='an' | entityArticle='the')? entity=STRING ((entityAttributesPreposition='with its' | entityAttributesPreposition='with their') entityAttributes+=STRING ("," entityAttributes+=STRING)*)? ((containerEntityPreposition='in' | containerEntityPreposition='for' | containerEntityPreposition='to')(containerEntityArticle='a' | containerEntityArticle='an')? containerEntity=STRING)?
;

StoryValuation:
	'and that' promotedValues+=STRING (',' promotedValues+=STRING)* ('is' | 'are') 'promoted' (',')?
	'accepting that' harmedValues+=STRING (',' harmedValues+=STRING)* ('is' | 'are') ('reduced' | 'harmed')
;

UserActivityDefaultVerb returns string:
	'create' | 'read' | 'update' | 'delete'
;

SculptorModule:
    (doc=STRING)?
	'Module' name=ID  (
		'{' 
			(
				(external+='external') |
				('basePackage' '=' basePackage+=JavaIdentifier) |
				('hint' '=' hint+=STRING)
			)*
			(
				(aggregates+=Aggregate) 
			)*
		'}' 
	)?  
;

JavaIdentifier returns string:
    (ID ("." ID )* ) 
;

Stakeholders:
	// {Stakeholders}
	'Stakeholders' ('of' (contexts+=[BoundedContext]) (',' contexts+=[BoundedContext])*)? ('{'
		(
			(stakeholders+=AbstractStakeholder)*
		)
	'}')?
;

AbstractStakeholder:
	StakeholderGroup | Stakeholder
;

StakeholderGroup:
	'StakeholderGroup' name=ID ('{'
		(
			(stakeholders+=Stakeholder)*	
		)
	'}')?
;

Stakeholder:
	'Stakeholder' name=ID ('{'
		(
			('influence' ('=')? influence+=INFLUENCE) |
			('interest' ('=')? interest+=INTEREST) |
			('description' ('=')? description+=STRING)
		)*
	'}')?
;

ValueRegister:
	'ValueRegister' name=ID ('for' context=[BoundedContext])? ('{'
		(
			(valueClusters+=ValueCluster) |
			(values+=Value) |
			(valueEpics+=ValueEpic) |
			(valueNarratives+=ValueNarrative) |
			(valueWeightings+=ValueWeighting)
		)*
	'}')?
;

ValueCluster:
	'ValueCluster' name=ID ('{'
		// required value first, then optional values
		(('core' ('=')? coreValue7000=CoreValue) | ('core' ('=')? coreValue=STRING))
		(
			('demonstrator' ('=')? demonstrators+=STRING) |
			('relatedValue' ('=')? relatedValues+=STRING) |
			('opposingValue' ('=')? opposingValues+=STRING) |
			(values+=Value) |
			(elicitations+=ValueElicitation)
		)*
	'}')?
;

Value:
	'Value' name=ID ('{'
		(
			(coreValue+='isCore') |
			('demonstrator' ('=')? demonstrators+=STRING) |
			('relatedValue' ('=')? relatedValues+=STRING) |
			('opposingValue' ('=')? opposingValues+=STRING) |
			(elicitations+=ValueElicitation)
		)*
	'}')?
;

ValueElicitation:
	('Stakeholder'|'Stakeholders') stakeholder=[AbstractStakeholder] ('{'
		(
			('priority' ('=')? priority+=PRIORITY) |
			('impact' ('=')? impact+=IMPACT) |
			('consequences' (consequences+=Consequence)+)
		)*
	'}')?
;


ValueEpic:
	'ValueEpic' name=ID ('{'
    	(
    		'As a' stakeholder=[AbstractStakeholder] 'I value' value=STRING 'as demonstrated in' 
    		(
				('realization of' realizedValues+=STRING)+ |
    			('reduction of' reducedValues+=STRING)+
			)*
    	)
	'}')?
;

ValueNarrative:
	'ValueNarrative' name=ID ('{'
		(
			'When the SOI executes' feature=STRING ','
	    	'stakeholders expect it to promote, protect or create' promotedValues=STRING ','
	    	'possibly degrading or prohibiting' harmedValues=STRING 
	    	'with the following externally observable and/or internally auditable behavior:' preAndPostConditions=STRING	
		)
	'}')
;

ValueWeighting:
	'ValueWeighting' name=ID ('{'
		(
			'In the context of the SOI,' 
    		'stakeholder' stakeholder=[AbstractStakeholder] 'values' value1=STRING 'more than' value2=STRING
    		'expecting benefits such as' benefits=STRING 
    		'running the risk of harms such as' harms=STRING	
		)
	'}')
;

Consequence:
	(type='good'|type='bad'|type='neutral') consequence=STRING action=Action?
;

Action:
	'action' action=STRING type=('ACT'|'MONITOR'|STRING)
;


UpstreamRole returns string:
	'PL'| 'OHS'
;

DownstreamRole returns string:
	'ACL' | 'CF'
;

ContextMapState returns string:
	'UNDEFINED' | 'AS_IS' | 'TO_BE'
;

ContextMapType returns string:
	'UNDEFINED' | 'SYSTEM_LANDSCAPE' | 'ORGANIZATIONAL'
;

BoundedContextType returns string:
	'UNDEFINED' | 'FEATURE' | 'APPLICATION' | 'SYSTEM' | 'TEAM'
;

SubDomainType returns string:
	'UNDEFINED' | 'CORE_DOMAIN' | 'SUPPORTING_DOMAIN' | 'GENERIC_SUBDOMAIN'
;

DownstreamGovernanceRights returns string:
	'INFLUENCER' | 'OPINION_LEADER' | 'VETO_RIGHT' | 'DECISION_MAKER' | 'MONOPOLIST'
;

KnowledgeLevel returns string:
	"META" | "CONCRETE"
;

Volatility returns string:
	'UNDEFINED' | 'NORMAL' | 'RARELY' | 'OFTEN'
;

Criticality returns string:
	'UNDEFINED' | 'NORMAL' | 'HIGH' | 'LOW'
;

Similarity returns string:
	'UNDEFINED' | 'NORMAL' | 'HUGE' | 'TINY'
;

Evolution returns string:
	'UNDEFINED' | 'GENESIS' | 'CUSTOM_BUILT' | 'PRODUCT' | 'COMMODITY'
;

INFLUENCE returns string:
	'UNDEFINED' | 'HIGH' | 'MEDIUM' | 'LOW'
;

INTEREST returns string:
	'UNDEFINED' | 'HIGH' | 'MEDIUM' | 'LOW'
;

PRIORITY returns string:
	'UNDEFINED' | 'HIGH' | 'MEDIUM' | 'LOW'
;

IMPACT returns string:
	'UNDEFINED' | 'HIGH' | 'MEDIUM' | 'LOW'
;

CoreValue returns string:
	'UNDEFINED' | 'AUTONOMY' | 'CARE' | 'CONTROL' | 'FAIRNESS' | 'INCLUSIVENESS' | 'INNOVATION' | 'PERFECTION' | 'PRIVACY' | 'RESPECT' | 'SUSTAINABILITY' | 'TRANSPARENCY' | 'TRUST'
;
