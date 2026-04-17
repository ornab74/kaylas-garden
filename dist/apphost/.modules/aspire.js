"use strict";
// aspire.ts - Capability-based Aspire SDK
// This SDK uses the ATS (Aspire Type System) capability API.
// Capabilities are endpoints like 'Aspire.Hosting/createBuilder'.
//
// GENERATED CODE - DO NOT EDIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationPromise = exports.Configuration = exports.UpdateCommandStateContext = exports.ResourceUrlsCallbackContext = exports.ResourceStoppedEvent = exports.ResourceReadyEvent = exports.ResourceNotificationServicePromise = exports.ResourceNotificationService = exports.ResourceLoggerServicePromise = exports.ResourceLoggerService = exports.ResourceEndpointsAllocatedEvent = exports.ReferenceExpressionBuilderPromise = exports.ReferenceExpressionBuilder = exports.ProjectResourceOptions = exports.PipelineSummaryPromise = exports.PipelineSummary = exports.PipelineStepFactoryContext = exports.PipelineStepContext = exports.PipelineStepPromise = exports.PipelineStep = exports.PipelineContext = exports.PipelineConfigurationContextPromise = exports.PipelineConfigurationContext = exports.InitializeResourceEvent = exports.ExecuteCommandContext = exports.EnvironmentCallbackContext = exports.EndpointReferenceExpression = exports.EndpointReferencePromise = exports.EndpointReference = exports.DistributedApplicationModelPromise = exports.DistributedApplicationModel = exports.DistributedApplicationExecutionContext = exports.DistributedApplicationPromise = exports.DistributedApplication = exports.ConnectionStringAvailableEvent = exports.CommandLineArgsCallbackContext = exports.BeforeStartEvent = exports.BeforeResourceStartedEvent = exports.AfterResourcesCreatedEvent = exports.WaitBehavior = exports.UrlDisplayLocation = exports.ProtocolType = exports.ProbeType = exports.OtlpProtocol = exports.ImagePullPolicy = exports.IconVariant = exports.EndpointProperty = exports.DistributedApplicationOperation = exports.ContainerLifetime = exports.CertificateTrustScope = void 0;
exports.ResourceWithArgsPromise = exports.ResourceWithArgs = exports.ResourcePromise = exports.Resource = exports.ContainerFilesDestinationResourcePromise = exports.ContainerFilesDestinationResource = exports.ComputeResourcePromise = exports.ComputeResource = exports.ViteAppResourcePromise = exports.ViteAppResource = exports.ProjectResourcePromise = exports.ProjectResource = exports.ParameterResourcePromise = exports.ParameterResource = exports.NodeAppResourcePromise = exports.NodeAppResource = exports.JavaScriptAppResourcePromise = exports.JavaScriptAppResource = exports.ExternalServiceResourcePromise = exports.ExternalServiceResource = exports.ExecutableResourcePromise = exports.ExecutableResource = exports.DotnetToolResourcePromise = exports.DotnetToolResource = exports.CSharpAppResourcePromise = exports.CSharpAppResource = exports.ContainerResourcePromise = exports.ContainerResource = exports.ContainerRegistryResourcePromise = exports.ContainerRegistryResource = exports.ConnectionStringResourcePromise = exports.ConnectionStringResource = exports.UserSecretsManagerPromise = exports.UserSecretsManager = exports.ServiceProviderPromise = exports.ServiceProvider = exports.ReportingTaskPromise = exports.ReportingTask = exports.ReportingStepPromise = exports.ReportingStep = exports.LoggerFactoryPromise = exports.LoggerFactory = exports.LoggerPromise = exports.Logger = exports.HostEnvironmentPromise = exports.HostEnvironment = exports.DistributedApplicationEventingPromise = exports.DistributedApplicationEventing = exports.DistributedApplicationBuilderPromise = exports.DistributedApplicationBuilder = void 0;
exports.ReferenceExpression = exports.refExpr = exports.registerCallback = exports.CapabilityError = exports.CancellationToken = exports.AppHostUsageError = exports.Handle = exports.ResourceWithWaitSupportPromise = exports.ResourceWithWaitSupport = exports.ResourceWithEnvironmentPromise = exports.ResourceWithEnvironment = exports.ResourceWithEndpointsPromise = exports.ResourceWithEndpoints = exports.ResourceWithContainerFilesPromise = exports.ResourceWithContainerFiles = exports.ResourceWithConnectionStringPromise = exports.ResourceWithConnectionString = void 0;
exports.connect = connect;
exports.createBuilder = createBuilder;
const transport_js_1 = require("./transport.js");
const base_js_1 = require("./base.js");
// ============================================================================
// Enum Types
// ============================================================================
/** Enum type for CertificateTrustScope */
var CertificateTrustScope;
(function (CertificateTrustScope) {
    CertificateTrustScope["None"] = "None";
    CertificateTrustScope["Append"] = "Append";
    CertificateTrustScope["Override"] = "Override";
    CertificateTrustScope["System"] = "System";
})(CertificateTrustScope || (exports.CertificateTrustScope = CertificateTrustScope = {}));
/** Enum type for ContainerLifetime */
var ContainerLifetime;
(function (ContainerLifetime) {
    ContainerLifetime["Session"] = "Session";
    ContainerLifetime["Persistent"] = "Persistent";
})(ContainerLifetime || (exports.ContainerLifetime = ContainerLifetime = {}));
/** Enum type for DistributedApplicationOperation */
var DistributedApplicationOperation;
(function (DistributedApplicationOperation) {
    DistributedApplicationOperation["Run"] = "Run";
    DistributedApplicationOperation["Publish"] = "Publish";
})(DistributedApplicationOperation || (exports.DistributedApplicationOperation = DistributedApplicationOperation = {}));
/** Enum type for EndpointProperty */
var EndpointProperty;
(function (EndpointProperty) {
    EndpointProperty["Url"] = "Url";
    EndpointProperty["Host"] = "Host";
    EndpointProperty["IPV4Host"] = "IPV4Host";
    EndpointProperty["Port"] = "Port";
    EndpointProperty["Scheme"] = "Scheme";
    EndpointProperty["TargetPort"] = "TargetPort";
    EndpointProperty["HostAndPort"] = "HostAndPort";
    EndpointProperty["TlsEnabled"] = "TlsEnabled";
})(EndpointProperty || (exports.EndpointProperty = EndpointProperty = {}));
/** Enum type for IconVariant */
var IconVariant;
(function (IconVariant) {
    IconVariant["Regular"] = "Regular";
    IconVariant["Filled"] = "Filled";
})(IconVariant || (exports.IconVariant = IconVariant = {}));
/** Enum type for ImagePullPolicy */
var ImagePullPolicy;
(function (ImagePullPolicy) {
    ImagePullPolicy["Default"] = "Default";
    ImagePullPolicy["Always"] = "Always";
    ImagePullPolicy["Missing"] = "Missing";
    ImagePullPolicy["Never"] = "Never";
})(ImagePullPolicy || (exports.ImagePullPolicy = ImagePullPolicy = {}));
/** Enum type for OtlpProtocol */
var OtlpProtocol;
(function (OtlpProtocol) {
    OtlpProtocol["Grpc"] = "Grpc";
    OtlpProtocol["HttpProtobuf"] = "HttpProtobuf";
    OtlpProtocol["HttpJson"] = "HttpJson";
})(OtlpProtocol || (exports.OtlpProtocol = OtlpProtocol = {}));
/** Enum type for ProbeType */
var ProbeType;
(function (ProbeType) {
    ProbeType["Startup"] = "Startup";
    ProbeType["Readiness"] = "Readiness";
    ProbeType["Liveness"] = "Liveness";
})(ProbeType || (exports.ProbeType = ProbeType = {}));
/** Enum type for ProtocolType */
var ProtocolType;
(function (ProtocolType) {
    ProtocolType["IP"] = "IP";
    ProtocolType["IPv6HopByHopOptions"] = "IPv6HopByHopOptions";
    ProtocolType["Unspecified"] = "Unspecified";
    ProtocolType["Icmp"] = "Icmp";
    ProtocolType["Igmp"] = "Igmp";
    ProtocolType["Ggp"] = "Ggp";
    ProtocolType["IPv4"] = "IPv4";
    ProtocolType["Tcp"] = "Tcp";
    ProtocolType["Pup"] = "Pup";
    ProtocolType["Udp"] = "Udp";
    ProtocolType["Idp"] = "Idp";
    ProtocolType["IPv6"] = "IPv6";
    ProtocolType["IPv6RoutingHeader"] = "IPv6RoutingHeader";
    ProtocolType["IPv6FragmentHeader"] = "IPv6FragmentHeader";
    ProtocolType["IPSecEncapsulatingSecurityPayload"] = "IPSecEncapsulatingSecurityPayload";
    ProtocolType["IPSecAuthenticationHeader"] = "IPSecAuthenticationHeader";
    ProtocolType["IcmpV6"] = "IcmpV6";
    ProtocolType["IPv6NoNextHeader"] = "IPv6NoNextHeader";
    ProtocolType["IPv6DestinationOptions"] = "IPv6DestinationOptions";
    ProtocolType["ND"] = "ND";
    ProtocolType["Raw"] = "Raw";
    ProtocolType["Ipx"] = "Ipx";
    ProtocolType["Spx"] = "Spx";
    ProtocolType["SpxII"] = "SpxII";
    ProtocolType["Unknown"] = "Unknown";
})(ProtocolType || (exports.ProtocolType = ProtocolType = {}));
/** Enum type for UrlDisplayLocation */
var UrlDisplayLocation;
(function (UrlDisplayLocation) {
    UrlDisplayLocation["SummaryAndDetails"] = "SummaryAndDetails";
    UrlDisplayLocation["DetailsOnly"] = "DetailsOnly";
})(UrlDisplayLocation || (exports.UrlDisplayLocation = UrlDisplayLocation = {}));
/** Enum type for WaitBehavior */
var WaitBehavior;
(function (WaitBehavior) {
    WaitBehavior["WaitOnResourceUnavailable"] = "WaitOnResourceUnavailable";
    WaitBehavior["StopOnResourceUnavailable"] = "StopOnResourceUnavailable";
})(WaitBehavior || (exports.WaitBehavior = WaitBehavior = {}));
// ============================================================================
// AfterResourcesCreatedEvent
// ============================================================================
/**
 * Type class for AfterResourcesCreatedEvent.
 */
class AfterResourcesCreatedEvent {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the Services property */
    services = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/AfterResourcesCreatedEvent.services', { context: this._handle });
            return new ServiceProvider(handle, this._client);
        },
    };
    /** Gets the Model property */
    model = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/AfterResourcesCreatedEvent.model', { context: this._handle });
            return new DistributedApplicationModel(handle, this._client);
        },
    };
}
exports.AfterResourcesCreatedEvent = AfterResourcesCreatedEvent;
// ============================================================================
// BeforeResourceStartedEvent
// ============================================================================
/**
 * Type class for BeforeResourceStartedEvent.
 */
class BeforeResourceStartedEvent {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the Resource property */
    resource = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/BeforeResourceStartedEvent.resource', { context: this._handle });
            return new Resource(handle, this._client);
        },
    };
    /** Gets the Services property */
    services = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/BeforeResourceStartedEvent.services', { context: this._handle });
            return new ServiceProvider(handle, this._client);
        },
    };
}
exports.BeforeResourceStartedEvent = BeforeResourceStartedEvent;
// ============================================================================
// BeforeStartEvent
// ============================================================================
/**
 * Type class for BeforeStartEvent.
 */
class BeforeStartEvent {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the Services property */
    services = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/BeforeStartEvent.services', { context: this._handle });
            return new ServiceProvider(handle, this._client);
        },
    };
    /** Gets the Model property */
    model = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/BeforeStartEvent.model', { context: this._handle });
            return new DistributedApplicationModel(handle, this._client);
        },
    };
}
exports.BeforeStartEvent = BeforeStartEvent;
// ============================================================================
// CommandLineArgsCallbackContext
// ============================================================================
/**
 * Type class for CommandLineArgsCallbackContext.
 */
class CommandLineArgsCallbackContext {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the Args property */
    _args;
    get args() {
        if (!this._args) {
            this._args = new base_js_1.AspireList(this._handle, this._client, 'Aspire.Hosting.ApplicationModel/CommandLineArgsCallbackContext.args', 'Aspire.Hosting.ApplicationModel/CommandLineArgsCallbackContext.args');
        }
        return this._args;
    }
    /** Gets the CancellationToken property */
    cancellationToken = {
        get: async () => {
            const result = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/CommandLineArgsCallbackContext.cancellationToken', { context: this._handle });
            return transport_js_1.CancellationToken.fromValue(result);
        },
    };
    /** Gets the ExecutionContext property */
    executionContext = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/CommandLineArgsCallbackContext.executionContext', { context: this._handle });
            return new DistributedApplicationExecutionContext(handle, this._client);
        },
    };
    /** Gets the Logger property */
    logger = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/CommandLineArgsCallbackContext.logger', { context: this._handle });
            return new Logger(handle, this._client);
        },
    };
    /** Gets the Resource property */
    resource = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/CommandLineArgsCallbackContext.resource', { context: this._handle });
            return new Resource(handle, this._client);
        },
    };
}
exports.CommandLineArgsCallbackContext = CommandLineArgsCallbackContext;
// ============================================================================
// ConnectionStringAvailableEvent
// ============================================================================
/**
 * Type class for ConnectionStringAvailableEvent.
 */
class ConnectionStringAvailableEvent {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the Resource property */
    resource = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ConnectionStringAvailableEvent.resource', { context: this._handle });
            return new Resource(handle, this._client);
        },
    };
    /** Gets the Services property */
    services = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ConnectionStringAvailableEvent.services', { context: this._handle });
            return new ServiceProvider(handle, this._client);
        },
    };
}
exports.ConnectionStringAvailableEvent = ConnectionStringAvailableEvent;
// ============================================================================
// DistributedApplication
// ============================================================================
/**
 * Type class for DistributedApplication.
 */
class DistributedApplication {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Runs the distributed application */
    /** @internal */
    async _runInternal(cancellationToken) {
        const rpcArgs = { context: this._handle };
        if (cancellationToken !== undefined)
            rpcArgs.cancellationToken = transport_js_1.CancellationToken.fromValue(cancellationToken);
        await this._client.invokeCapability('Aspire.Hosting/run', rpcArgs);
        return this;
    }
    run(options) {
        const cancellationToken = options?.cancellationToken;
        return new DistributedApplicationPromise(this._runInternal(cancellationToken));
    }
}
exports.DistributedApplication = DistributedApplication;
/**
 * Thenable wrapper for DistributedApplication that enables fluent chaining.
 */
class DistributedApplicationPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Runs the distributed application */
    run(options) {
        return new DistributedApplicationPromise(this._promise.then(obj => obj.run(options)));
    }
}
exports.DistributedApplicationPromise = DistributedApplicationPromise;
// ============================================================================
// DistributedApplicationExecutionContext
// ============================================================================
/**
 * Type class for DistributedApplicationExecutionContext.
 */
class DistributedApplicationExecutionContext {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the PublisherName property */
    publisherName = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting/DistributedApplicationExecutionContext.publisherName', { context: this._handle });
        },
        set: async (value) => {
            await this._client.invokeCapability('Aspire.Hosting/DistributedApplicationExecutionContext.setPublisherName', { context: this._handle, value });
        }
    };
    /** Gets the Operation property */
    operation = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting/DistributedApplicationExecutionContext.operation', { context: this._handle });
        },
    };
    /** Gets the ServiceProvider property */
    serviceProvider = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting/DistributedApplicationExecutionContext.serviceProvider', { context: this._handle });
            return new ServiceProvider(handle, this._client);
        },
    };
    /** Gets the IsPublishMode property */
    isPublishMode = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting/DistributedApplicationExecutionContext.isPublishMode', { context: this._handle });
        },
    };
    /** Gets the IsRunMode property */
    isRunMode = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting/DistributedApplicationExecutionContext.isRunMode', { context: this._handle });
        },
    };
}
exports.DistributedApplicationExecutionContext = DistributedApplicationExecutionContext;
// ============================================================================
// DistributedApplicationModel
// ============================================================================
/**
 * Type class for DistributedApplicationModel.
 */
class DistributedApplicationModel {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets resources from the distributed application model */
    async getResources() {
        const rpcArgs = { model: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/getResources', rpcArgs);
    }
    /** Finds a resource by name */
    /** @internal */
    async _findResourceByNameInternal(name) {
        const rpcArgs = { model: this._handle, name };
        const result = await this._client.invokeCapability('Aspire.Hosting/findResourceByName', rpcArgs);
        return new Resource(result, this._client);
    }
    findResourceByName(name) {
        return new ResourcePromise(this._findResourceByNameInternal(name));
    }
}
exports.DistributedApplicationModel = DistributedApplicationModel;
/**
 * Thenable wrapper for DistributedApplicationModel that enables fluent chaining.
 */
class DistributedApplicationModelPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Gets resources from the distributed application model */
    getResources() {
        return this._promise.then(obj => obj.getResources());
    }
    /** Finds a resource by name */
    findResourceByName(name) {
        return new ResourcePromise(this._promise.then(obj => obj.findResourceByName(name)));
    }
}
exports.DistributedApplicationModelPromise = DistributedApplicationModelPromise;
// ============================================================================
// EndpointReference
// ============================================================================
/**
 * Type class for EndpointReference.
 */
class EndpointReference {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the Resource property */
    resource = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReference.resource', { context: this._handle });
            return new ResourceWithEndpoints(handle, this._client);
        },
    };
    /** Gets the EndpointName property */
    endpointName = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReference.endpointName', { context: this._handle });
        },
    };
    /** Gets the ErrorMessage property */
    errorMessage = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReference.errorMessage', { context: this._handle });
        },
        set: async (value) => {
            await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReference.setErrorMessage', { context: this._handle, value });
        }
    };
    /** Gets the IsAllocated property */
    isAllocated = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReference.isAllocated', { context: this._handle });
        },
    };
    /** Gets the Exists property */
    exists = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReference.exists', { context: this._handle });
        },
    };
    /** Gets the IsHttp property */
    isHttp = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReference.isHttp', { context: this._handle });
        },
    };
    /** Gets the IsHttps property */
    isHttps = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReference.isHttps', { context: this._handle });
        },
    };
    /** Gets the TlsEnabled property */
    tlsEnabled = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReference.tlsEnabled', { context: this._handle });
        },
    };
    /** Gets the ExcludeReferenceEndpoint property */
    excludeReferenceEndpoint = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReference.excludeReferenceEndpoint', { context: this._handle });
        },
    };
    /** Gets the Port property */
    port = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReference.port', { context: this._handle });
        },
    };
    /** Gets the TargetPort property */
    targetPort = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReference.targetPort', { context: this._handle });
        },
    };
    /** Gets the Host property */
    host = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReference.host', { context: this._handle });
        },
    };
    /** Gets the Scheme property */
    scheme = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReference.scheme', { context: this._handle });
        },
    };
    /** Gets the Url property */
    url = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReference.url', { context: this._handle });
        },
    };
    /** Gets the URL of the endpoint asynchronously */
    async getValueAsync(options) {
        const cancellationToken = options?.cancellationToken;
        const rpcArgs = { context: this._handle };
        if (cancellationToken !== undefined)
            rpcArgs.cancellationToken = transport_js_1.CancellationToken.fromValue(cancellationToken);
        return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/getValueAsync', rpcArgs);
    }
    /** Gets a conditional expression that resolves to the enabledValue when TLS is enabled on the endpoint, or to the disabledValue otherwise. */
    async getTlsValue(enabledValue, disabledValue) {
        const rpcArgs = { context: this._handle, enabledValue, disabledValue };
        return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReference.getTlsValue', rpcArgs);
    }
}
exports.EndpointReference = EndpointReference;
/**
 * Thenable wrapper for EndpointReference that enables fluent chaining.
 */
class EndpointReferencePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Gets the URL of the endpoint asynchronously */
    getValueAsync(options) {
        return this._promise.then(obj => obj.getValueAsync(options));
    }
    /** Gets a conditional expression that resolves to the enabledValue when TLS is enabled on the endpoint, or to the disabledValue otherwise. */
    getTlsValue(enabledValue, disabledValue) {
        return this._promise.then(obj => obj.getTlsValue(enabledValue, disabledValue));
    }
}
exports.EndpointReferencePromise = EndpointReferencePromise;
// ============================================================================
// EndpointReferenceExpression
// ============================================================================
/**
 * Type class for EndpointReferenceExpression.
 */
class EndpointReferenceExpression {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the Endpoint property */
    endpoint = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReferenceExpression.endpoint', { context: this._handle });
            return new EndpointReference(handle, this._client);
        },
    };
    /** Gets the Property property */
    property = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReferenceExpression.property', { context: this._handle });
        },
    };
    /** Gets the ValueExpression property */
    valueExpression = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EndpointReferenceExpression.valueExpression', { context: this._handle });
        },
    };
}
exports.EndpointReferenceExpression = EndpointReferenceExpression;
// ============================================================================
// EnvironmentCallbackContext
// ============================================================================
/**
 * Type class for EnvironmentCallbackContext.
 */
class EnvironmentCallbackContext {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the EnvironmentVariables property */
    _environmentVariables;
    get environmentVariables() {
        if (!this._environmentVariables) {
            this._environmentVariables = new base_js_1.AspireDict(this._handle, this._client, 'Aspire.Hosting.ApplicationModel/EnvironmentCallbackContext.environmentVariables', 'Aspire.Hosting.ApplicationModel/EnvironmentCallbackContext.environmentVariables');
        }
        return this._environmentVariables;
    }
    /** Gets the CancellationToken property */
    cancellationToken = {
        get: async () => {
            const result = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EnvironmentCallbackContext.cancellationToken', { context: this._handle });
            return transport_js_1.CancellationToken.fromValue(result);
        },
    };
    /** Gets the Logger property */
    logger = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EnvironmentCallbackContext.logger', { context: this._handle });
            return new Logger(handle, this._client);
        },
    };
    /** Gets the Resource property */
    resource = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EnvironmentCallbackContext.resource', { context: this._handle });
            return new Resource(handle, this._client);
        },
    };
    /** Gets the ExecutionContext property */
    executionContext = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/EnvironmentCallbackContext.executionContext', { context: this._handle });
            return new DistributedApplicationExecutionContext(handle, this._client);
        },
    };
}
exports.EnvironmentCallbackContext = EnvironmentCallbackContext;
// ============================================================================
// ExecuteCommandContext
// ============================================================================
/**
 * Type class for ExecuteCommandContext.
 */
class ExecuteCommandContext {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the ServiceProvider property */
    serviceProvider = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ExecuteCommandContext.serviceProvider', { context: this._handle });
            return new ServiceProvider(handle, this._client);
        },
    };
    /** Gets the ResourceName property */
    resourceName = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ExecuteCommandContext.resourceName', { context: this._handle });
        },
        set: async (value) => {
            await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ExecuteCommandContext.setResourceName', { context: this._handle, value });
        }
    };
    /** Gets the CancellationToken property */
    cancellationToken = {
        get: async () => {
            const result = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ExecuteCommandContext.cancellationToken', { context: this._handle });
            return transport_js_1.CancellationToken.fromValue(result);
        },
        set: async (value) => {
            await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ExecuteCommandContext.setCancellationToken', { context: this._handle, value: transport_js_1.CancellationToken.fromValue(value) });
        }
    };
}
exports.ExecuteCommandContext = ExecuteCommandContext;
// ============================================================================
// InitializeResourceEvent
// ============================================================================
/**
 * Type class for InitializeResourceEvent.
 */
class InitializeResourceEvent {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the Resource property */
    resource = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/InitializeResourceEvent.resource', { context: this._handle });
            return new Resource(handle, this._client);
        },
    };
    /** Gets the Eventing property */
    eventing = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/InitializeResourceEvent.eventing', { context: this._handle });
            return new DistributedApplicationEventing(handle, this._client);
        },
    };
    /** Gets the Logger property */
    logger = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/InitializeResourceEvent.logger', { context: this._handle });
            return new Logger(handle, this._client);
        },
    };
    /** Gets the Notifications property */
    notifications = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/InitializeResourceEvent.notifications', { context: this._handle });
            return new ResourceNotificationService(handle, this._client);
        },
    };
    /** Gets the Services property */
    services = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/InitializeResourceEvent.services', { context: this._handle });
            return new ServiceProvider(handle, this._client);
        },
    };
}
exports.InitializeResourceEvent = InitializeResourceEvent;
// ============================================================================
// PipelineConfigurationContext
// ============================================================================
/**
 * Type class for PipelineConfigurationContext.
 */
class PipelineConfigurationContext {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the Services property */
    services = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineConfigurationContext.services', { context: this._handle });
            return new ServiceProvider(handle, this._client);
        },
    };
    /** Gets the Steps property */
    steps = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineConfigurationContext.steps', { context: this._handle });
        },
        set: async (value) => {
            await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineConfigurationContext.setSteps', { context: this._handle, value });
        }
    };
    /** Gets the Model property */
    model = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineConfigurationContext.model', { context: this._handle });
            return new DistributedApplicationModel(handle, this._client);
        },
    };
    /** Gets pipeline steps with the specified tag */
    async getStepsByTag(tag) {
        const rpcArgs = { context: this._handle, tag };
        return await this._client.invokeCapability('Aspire.Hosting.Pipelines/getStepsByTag', rpcArgs);
    }
}
exports.PipelineConfigurationContext = PipelineConfigurationContext;
/**
 * Thenable wrapper for PipelineConfigurationContext that enables fluent chaining.
 */
class PipelineConfigurationContextPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Gets pipeline steps with the specified tag */
    getStepsByTag(tag) {
        return this._promise.then(obj => obj.getStepsByTag(tag));
    }
}
exports.PipelineConfigurationContextPromise = PipelineConfigurationContextPromise;
// ============================================================================
// PipelineContext
// ============================================================================
/**
 * Type class for PipelineContext.
 */
class PipelineContext {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the Model property */
    model = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineContext.model', { context: this._handle });
            return new DistributedApplicationModel(handle, this._client);
        },
    };
    /** Gets the ExecutionContext property */
    executionContext = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineContext.executionContext', { context: this._handle });
            return new DistributedApplicationExecutionContext(handle, this._client);
        },
    };
    /** Gets the Services property */
    services = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineContext.services', { context: this._handle });
            return new ServiceProvider(handle, this._client);
        },
    };
    /** Gets the Logger property */
    logger = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineContext.logger', { context: this._handle });
            return new Logger(handle, this._client);
        },
    };
    /** Gets the CancellationToken property */
    cancellationToken = {
        get: async () => {
            const result = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineContext.cancellationToken', { context: this._handle });
            return transport_js_1.CancellationToken.fromValue(result);
        },
        set: async (value) => {
            await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineContext.setCancellationToken', { context: this._handle, value: transport_js_1.CancellationToken.fromValue(value) });
        }
    };
    /** Gets the Summary property */
    summary = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineContext.summary', { context: this._handle });
            return new PipelineSummary(handle, this._client);
        },
    };
}
exports.PipelineContext = PipelineContext;
// ============================================================================
// PipelineStep
// ============================================================================
/**
 * Type class for PipelineStep.
 */
class PipelineStep {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the Name property */
    name = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineStep.name', { context: this._handle });
        },
        set: async (value) => {
            await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineStep.setName', { context: this._handle, value });
        }
    };
    /** Gets the Description property */
    description = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineStep.description', { context: this._handle });
        },
        set: async (value) => {
            await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineStep.setDescription', { context: this._handle, value });
        }
    };
    /** Gets the DependsOnSteps property */
    _dependsOnSteps;
    get dependsOnSteps() {
        if (!this._dependsOnSteps) {
            this._dependsOnSteps = new base_js_1.AspireList(this._handle, this._client, 'Aspire.Hosting.Pipelines/PipelineStep.dependsOnSteps', 'Aspire.Hosting.Pipelines/PipelineStep.dependsOnSteps');
        }
        return this._dependsOnSteps;
    }
    /** Gets the RequiredBySteps property */
    _requiredBySteps;
    get requiredBySteps() {
        if (!this._requiredBySteps) {
            this._requiredBySteps = new base_js_1.AspireList(this._handle, this._client, 'Aspire.Hosting.Pipelines/PipelineStep.requiredBySteps', 'Aspire.Hosting.Pipelines/PipelineStep.requiredBySteps');
        }
        return this._requiredBySteps;
    }
    /** Gets the Tags property */
    _tags;
    get tags() {
        if (!this._tags) {
            this._tags = new base_js_1.AspireList(this._handle, this._client, 'Aspire.Hosting.Pipelines/PipelineStep.tags', 'Aspire.Hosting.Pipelines/PipelineStep.tags');
        }
        return this._tags;
    }
    /** Gets the Resource property */
    resource = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineStep.resource', { context: this._handle });
            return new Resource(handle, this._client);
        },
    };
    /** Adds a dependency on another step by name */
    /** @internal */
    async _dependsOnInternal(stepName) {
        const rpcArgs = { context: this._handle, stepName };
        await this._client.invokeCapability('Aspire.Hosting.Pipelines/dependsOn', rpcArgs);
        return this;
    }
    dependsOn(stepName) {
        return new PipelineStepPromise(this._dependsOnInternal(stepName));
    }
    /** Specifies that another step requires this step by name */
    /** @internal */
    async _requiredByInternal(stepName) {
        const rpcArgs = { context: this._handle, stepName };
        await this._client.invokeCapability('Aspire.Hosting.Pipelines/requiredBy', rpcArgs);
        return this;
    }
    requiredBy(stepName) {
        return new PipelineStepPromise(this._requiredByInternal(stepName));
    }
}
exports.PipelineStep = PipelineStep;
/**
 * Thenable wrapper for PipelineStep that enables fluent chaining.
 */
class PipelineStepPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Adds a dependency on another step by name */
    dependsOn(stepName) {
        return new PipelineStepPromise(this._promise.then(obj => obj.dependsOn(stepName)));
    }
    /** Specifies that another step requires this step by name */
    requiredBy(stepName) {
        return new PipelineStepPromise(this._promise.then(obj => obj.requiredBy(stepName)));
    }
}
exports.PipelineStepPromise = PipelineStepPromise;
// ============================================================================
// PipelineStepContext
// ============================================================================
/**
 * Type class for PipelineStepContext.
 */
class PipelineStepContext {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the PipelineContext property */
    pipelineContext = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineStepContext.pipelineContext', { context: this._handle });
            return new PipelineContext(handle, this._client);
        },
    };
    /** Gets the ReportingStep property */
    reportingStep = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineStepContext.reportingStep', { context: this._handle });
            return new ReportingStep(handle, this._client);
        },
    };
    /** Gets the Model property */
    model = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineStepContext.model', { context: this._handle });
            return new DistributedApplicationModel(handle, this._client);
        },
    };
    /** Gets the ExecutionContext property */
    executionContext = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineStepContext.executionContext', { context: this._handle });
            return new DistributedApplicationExecutionContext(handle, this._client);
        },
    };
    /** Gets the Services property */
    services = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineStepContext.services', { context: this._handle });
            return new ServiceProvider(handle, this._client);
        },
    };
    /** Gets the Logger property */
    logger = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineStepContext.logger', { context: this._handle });
            return new Logger(handle, this._client);
        },
    };
    /** Gets the CancellationToken property */
    cancellationToken = {
        get: async () => {
            const result = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineStepContext.cancellationToken', { context: this._handle });
            return transport_js_1.CancellationToken.fromValue(result);
        },
    };
    /** Gets the Summary property */
    summary = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineStepContext.summary', { context: this._handle });
            return new PipelineSummary(handle, this._client);
        },
    };
}
exports.PipelineStepContext = PipelineStepContext;
// ============================================================================
// PipelineStepFactoryContext
// ============================================================================
/**
 * Type class for PipelineStepFactoryContext.
 */
class PipelineStepFactoryContext {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the PipelineContext property */
    pipelineContext = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineStepFactoryContext.pipelineContext', { context: this._handle });
            return new PipelineContext(handle, this._client);
        },
    };
    /** Gets the Resource property */
    resource = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineStepFactoryContext.resource', { context: this._handle });
            return new Resource(handle, this._client);
        },
    };
}
exports.PipelineStepFactoryContext = PipelineStepFactoryContext;
// ============================================================================
// PipelineSummary
// ============================================================================
/**
 * Type class for PipelineSummary.
 */
class PipelineSummary {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Invokes the Add method */
    /** @internal */
    async _addInternal(key, value) {
        const rpcArgs = { context: this._handle, key, value };
        await this._client.invokeCapability('Aspire.Hosting.Pipelines/PipelineSummary.add', rpcArgs);
        return this;
    }
    add(key, value) {
        return new PipelineSummaryPromise(this._addInternal(key, value));
    }
    /** Adds a Markdown-formatted value to the pipeline summary */
    /** @internal */
    async _addMarkdownInternal(key, markdownString) {
        const rpcArgs = { summary: this._handle, key, markdownString };
        await this._client.invokeCapability('Aspire.Hosting/addMarkdown', rpcArgs);
        return this;
    }
    addMarkdown(key, markdownString) {
        return new PipelineSummaryPromise(this._addMarkdownInternal(key, markdownString));
    }
}
exports.PipelineSummary = PipelineSummary;
/**
 * Thenable wrapper for PipelineSummary that enables fluent chaining.
 */
class PipelineSummaryPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Invokes the Add method */
    add(key, value) {
        return new PipelineSummaryPromise(this._promise.then(obj => obj.add(key, value)));
    }
    /** Adds a Markdown-formatted value to the pipeline summary */
    addMarkdown(key, markdownString) {
        return new PipelineSummaryPromise(this._promise.then(obj => obj.addMarkdown(key, markdownString)));
    }
}
exports.PipelineSummaryPromise = PipelineSummaryPromise;
// ============================================================================
// ProjectResourceOptions
// ============================================================================
/**
 * Type class for ProjectResourceOptions.
 */
class ProjectResourceOptions {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the LaunchProfileName property */
    launchProfileName = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting/ProjectResourceOptions.launchProfileName', { context: this._handle });
        },
        set: async (value) => {
            await this._client.invokeCapability('Aspire.Hosting/ProjectResourceOptions.setLaunchProfileName', { context: this._handle, value });
        }
    };
    /** Gets the ExcludeLaunchProfile property */
    excludeLaunchProfile = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting/ProjectResourceOptions.excludeLaunchProfile', { context: this._handle });
        },
        set: async (value) => {
            await this._client.invokeCapability('Aspire.Hosting/ProjectResourceOptions.setExcludeLaunchProfile', { context: this._handle, value });
        }
    };
    /** Gets the ExcludeKestrelEndpoints property */
    excludeKestrelEndpoints = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting/ProjectResourceOptions.excludeKestrelEndpoints', { context: this._handle });
        },
        set: async (value) => {
            await this._client.invokeCapability('Aspire.Hosting/ProjectResourceOptions.setExcludeKestrelEndpoints', { context: this._handle, value });
        }
    };
}
exports.ProjectResourceOptions = ProjectResourceOptions;
// ============================================================================
// ReferenceExpressionBuilder
// ============================================================================
/**
 * Type class for ReferenceExpressionBuilder.
 */
class ReferenceExpressionBuilder {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the IsEmpty property */
    isEmpty = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ReferenceExpressionBuilder.isEmpty', { context: this._handle });
        },
    };
    /** Appends a literal string to the reference expression */
    /** @internal */
    async _appendLiteralInternal(value) {
        const rpcArgs = { context: this._handle, value };
        await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/appendLiteral', rpcArgs);
        return this;
    }
    appendLiteral(value) {
        return new ReferenceExpressionBuilderPromise(this._appendLiteralInternal(value));
    }
    /** Appends a formatted string value to the reference expression */
    /** @internal */
    async _appendFormattedInternal(value, format) {
        const rpcArgs = { context: this._handle, value };
        if (format !== undefined)
            rpcArgs.format = format;
        await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/appendFormatted', rpcArgs);
        return this;
    }
    appendFormatted(value, options) {
        const format = options?.format;
        return new ReferenceExpressionBuilderPromise(this._appendFormattedInternal(value, format));
    }
    /** Appends a value provider to the reference expression */
    /** @internal */
    async _appendValueProviderInternal(valueProvider, format) {
        const rpcArgs = { context: this._handle, valueProvider };
        if (format !== undefined)
            rpcArgs.format = format;
        await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/appendValueProvider', rpcArgs);
        return this;
    }
    appendValueProvider(valueProvider, options) {
        const format = options?.format;
        return new ReferenceExpressionBuilderPromise(this._appendValueProviderInternal(valueProvider, format));
    }
    /** Builds the reference expression */
    async build() {
        const rpcArgs = { context: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/build', rpcArgs);
    }
}
exports.ReferenceExpressionBuilder = ReferenceExpressionBuilder;
/**
 * Thenable wrapper for ReferenceExpressionBuilder that enables fluent chaining.
 */
class ReferenceExpressionBuilderPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Appends a literal string to the reference expression */
    appendLiteral(value) {
        return new ReferenceExpressionBuilderPromise(this._promise.then(obj => obj.appendLiteral(value)));
    }
    /** Appends a formatted string value to the reference expression */
    appendFormatted(value, options) {
        return new ReferenceExpressionBuilderPromise(this._promise.then(obj => obj.appendFormatted(value, options)));
    }
    /** Appends a value provider to the reference expression */
    appendValueProvider(valueProvider, options) {
        return new ReferenceExpressionBuilderPromise(this._promise.then(obj => obj.appendValueProvider(valueProvider, options)));
    }
    /** Builds the reference expression */
    build() {
        return this._promise.then(obj => obj.build());
    }
}
exports.ReferenceExpressionBuilderPromise = ReferenceExpressionBuilderPromise;
// ============================================================================
// ResourceEndpointsAllocatedEvent
// ============================================================================
/**
 * Type class for ResourceEndpointsAllocatedEvent.
 */
class ResourceEndpointsAllocatedEvent {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the Resource property */
    resource = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ResourceEndpointsAllocatedEvent.resource', { context: this._handle });
            return new Resource(handle, this._client);
        },
    };
    /** Gets the Services property */
    services = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ResourceEndpointsAllocatedEvent.services', { context: this._handle });
            return new ServiceProvider(handle, this._client);
        },
    };
}
exports.ResourceEndpointsAllocatedEvent = ResourceEndpointsAllocatedEvent;
// ============================================================================
// ResourceLoggerService
// ============================================================================
/**
 * Type class for ResourceLoggerService.
 */
class ResourceLoggerService {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Completes the log stream for a resource */
    /** @internal */
    async _completeLogInternal(resource) {
        const rpcArgs = { loggerService: this._handle, resource };
        await this._client.invokeCapability('Aspire.Hosting/completeLog', rpcArgs);
        return this;
    }
    completeLog(resource) {
        return new ResourceLoggerServicePromise(this._completeLogInternal(resource));
    }
    /** Completes the log stream by resource name */
    /** @internal */
    async _completeLogByNameInternal(resourceName) {
        const rpcArgs = { loggerService: this._handle, resourceName };
        await this._client.invokeCapability('Aspire.Hosting/completeLogByName', rpcArgs);
        return this;
    }
    completeLogByName(resourceName) {
        return new ResourceLoggerServicePromise(this._completeLogByNameInternal(resourceName));
    }
}
exports.ResourceLoggerService = ResourceLoggerService;
/**
 * Thenable wrapper for ResourceLoggerService that enables fluent chaining.
 */
class ResourceLoggerServicePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Completes the log stream for a resource */
    completeLog(resource) {
        return new ResourceLoggerServicePromise(this._promise.then(obj => obj.completeLog(resource)));
    }
    /** Completes the log stream by resource name */
    completeLogByName(resourceName) {
        return new ResourceLoggerServicePromise(this._promise.then(obj => obj.completeLogByName(resourceName)));
    }
}
exports.ResourceLoggerServicePromise = ResourceLoggerServicePromise;
// ============================================================================
// ResourceNotificationService
// ============================================================================
/**
 * Type class for ResourceNotificationService.
 */
class ResourceNotificationService {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Waits for a resource to reach a specified state */
    /** @internal */
    async _waitForResourceStateInternal(resourceName, targetState) {
        const rpcArgs = { notificationService: this._handle, resourceName };
        if (targetState !== undefined)
            rpcArgs.targetState = targetState;
        await this._client.invokeCapability('Aspire.Hosting/waitForResourceState', rpcArgs);
        return this;
    }
    waitForResourceState(resourceName, options) {
        const targetState = options?.targetState;
        return new ResourceNotificationServicePromise(this._waitForResourceStateInternal(resourceName, targetState));
    }
    /** Waits for a resource to reach one of the specified states */
    async waitForResourceStates(resourceName, targetStates) {
        const rpcArgs = { notificationService: this._handle, resourceName, targetStates };
        return await this._client.invokeCapability('Aspire.Hosting/waitForResourceStates', rpcArgs);
    }
    /** Waits for a resource to become healthy */
    async waitForResourceHealthy(resourceName) {
        const rpcArgs = { notificationService: this._handle, resourceName };
        return await this._client.invokeCapability('Aspire.Hosting/waitForResourceHealthy', rpcArgs);
    }
    /** Waits for all dependencies of a resource to be ready */
    /** @internal */
    async _waitForDependenciesInternal(resource) {
        const rpcArgs = { notificationService: this._handle, resource };
        await this._client.invokeCapability('Aspire.Hosting/waitForDependencies', rpcArgs);
        return this;
    }
    waitForDependencies(resource) {
        return new ResourceNotificationServicePromise(this._waitForDependenciesInternal(resource));
    }
    /** Tries to get the current state of a resource */
    async tryGetResourceState(resourceName) {
        const rpcArgs = { notificationService: this._handle, resourceName };
        return await this._client.invokeCapability('Aspire.Hosting/tryGetResourceState', rpcArgs);
    }
    /** Publishes an update for a resource's state */
    /** @internal */
    async _publishResourceUpdateInternal(resource, state, stateStyle) {
        const rpcArgs = { notificationService: this._handle, resource };
        if (state !== undefined)
            rpcArgs.state = state;
        if (stateStyle !== undefined)
            rpcArgs.stateStyle = stateStyle;
        await this._client.invokeCapability('Aspire.Hosting/publishResourceUpdate', rpcArgs);
        return this;
    }
    publishResourceUpdate(resource, options) {
        const state = options?.state;
        const stateStyle = options?.stateStyle;
        return new ResourceNotificationServicePromise(this._publishResourceUpdateInternal(resource, state, stateStyle));
    }
}
exports.ResourceNotificationService = ResourceNotificationService;
/**
 * Thenable wrapper for ResourceNotificationService that enables fluent chaining.
 */
class ResourceNotificationServicePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Waits for a resource to reach a specified state */
    waitForResourceState(resourceName, options) {
        return new ResourceNotificationServicePromise(this._promise.then(obj => obj.waitForResourceState(resourceName, options)));
    }
    /** Waits for a resource to reach one of the specified states */
    waitForResourceStates(resourceName, targetStates) {
        return this._promise.then(obj => obj.waitForResourceStates(resourceName, targetStates));
    }
    /** Waits for a resource to become healthy */
    waitForResourceHealthy(resourceName) {
        return this._promise.then(obj => obj.waitForResourceHealthy(resourceName));
    }
    /** Waits for all dependencies of a resource to be ready */
    waitForDependencies(resource) {
        return new ResourceNotificationServicePromise(this._promise.then(obj => obj.waitForDependencies(resource)));
    }
    /** Tries to get the current state of a resource */
    tryGetResourceState(resourceName) {
        return this._promise.then(obj => obj.tryGetResourceState(resourceName));
    }
    /** Publishes an update for a resource's state */
    publishResourceUpdate(resource, options) {
        return new ResourceNotificationServicePromise(this._promise.then(obj => obj.publishResourceUpdate(resource, options)));
    }
}
exports.ResourceNotificationServicePromise = ResourceNotificationServicePromise;
// ============================================================================
// ResourceReadyEvent
// ============================================================================
/**
 * Type class for ResourceReadyEvent.
 */
class ResourceReadyEvent {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the Resource property */
    resource = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ResourceReadyEvent.resource', { context: this._handle });
            return new Resource(handle, this._client);
        },
    };
    /** Gets the Services property */
    services = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ResourceReadyEvent.services', { context: this._handle });
            return new ServiceProvider(handle, this._client);
        },
    };
}
exports.ResourceReadyEvent = ResourceReadyEvent;
// ============================================================================
// ResourceStoppedEvent
// ============================================================================
/**
 * Type class for ResourceStoppedEvent.
 */
class ResourceStoppedEvent {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the Resource property */
    resource = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ResourceStoppedEvent.resource', { context: this._handle });
            return new Resource(handle, this._client);
        },
    };
    /** Gets the Services property */
    services = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ResourceStoppedEvent.services', { context: this._handle });
            return new ServiceProvider(handle, this._client);
        },
    };
}
exports.ResourceStoppedEvent = ResourceStoppedEvent;
// ============================================================================
// ResourceUrlsCallbackContext
// ============================================================================
/**
 * Type class for ResourceUrlsCallbackContext.
 */
class ResourceUrlsCallbackContext {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the Resource property */
    resource = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ResourceUrlsCallbackContext.resource', { context: this._handle });
            return new Resource(handle, this._client);
        },
    };
    /** Gets the Urls property */
    _urls;
    get urls() {
        if (!this._urls) {
            this._urls = new base_js_1.AspireList(this._handle, this._client, 'Aspire.Hosting.ApplicationModel/ResourceUrlsCallbackContext.urls', 'Aspire.Hosting.ApplicationModel/ResourceUrlsCallbackContext.urls');
        }
        return this._urls;
    }
    /** Gets the CancellationToken property */
    cancellationToken = {
        get: async () => {
            const result = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ResourceUrlsCallbackContext.cancellationToken', { context: this._handle });
            return transport_js_1.CancellationToken.fromValue(result);
        },
    };
    /** Gets the Logger property */
    logger = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ResourceUrlsCallbackContext.logger', { context: this._handle });
            return new Logger(handle, this._client);
        },
    };
    /** Gets the ExecutionContext property */
    executionContext = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/ResourceUrlsCallbackContext.executionContext', { context: this._handle });
            return new DistributedApplicationExecutionContext(handle, this._client);
        },
    };
}
exports.ResourceUrlsCallbackContext = ResourceUrlsCallbackContext;
// ============================================================================
// UpdateCommandStateContext
// ============================================================================
/**
 * Type class for UpdateCommandStateContext.
 */
class UpdateCommandStateContext {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the ServiceProvider property */
    serviceProvider = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/UpdateCommandStateContext.serviceProvider', { context: this._handle });
            return new ServiceProvider(handle, this._client);
        },
    };
}
exports.UpdateCommandStateContext = UpdateCommandStateContext;
// ============================================================================
// Configuration
// ============================================================================
/**
 * Type class for Configuration.
 */
class Configuration {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets a configuration value by key */
    async getConfigValue(key) {
        const rpcArgs = { configuration: this._handle, key };
        return await this._client.invokeCapability('Aspire.Hosting/getConfigValue', rpcArgs);
    }
    /** Gets a connection string by name */
    async getConnectionString(name) {
        const rpcArgs = { configuration: this._handle, name };
        return await this._client.invokeCapability('Aspire.Hosting/getConnectionString', rpcArgs);
    }
    /** Gets a configuration section by key */
    async getSection(key) {
        const rpcArgs = { configuration: this._handle, key };
        return await this._client.invokeCapability('Aspire.Hosting/getSection', rpcArgs);
    }
    /** Gets child configuration sections */
    async getChildren() {
        const rpcArgs = { configuration: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/getChildren', rpcArgs);
    }
    /** Checks whether a configuration section exists */
    async exists(key) {
        const rpcArgs = { configuration: this._handle, key };
        return await this._client.invokeCapability('Aspire.Hosting/exists', rpcArgs);
    }
}
exports.Configuration = Configuration;
/**
 * Thenable wrapper for Configuration that enables fluent chaining.
 */
class ConfigurationPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Gets a configuration value by key */
    getConfigValue(key) {
        return this._promise.then(obj => obj.getConfigValue(key));
    }
    /** Gets a connection string by name */
    getConnectionString(name) {
        return this._promise.then(obj => obj.getConnectionString(name));
    }
    /** Gets a configuration section by key */
    getSection(key) {
        return this._promise.then(obj => obj.getSection(key));
    }
    /** Gets child configuration sections */
    getChildren() {
        return this._promise.then(obj => obj.getChildren());
    }
    /** Checks whether a configuration section exists */
    exists(key) {
        return this._promise.then(obj => obj.exists(key));
    }
}
exports.ConfigurationPromise = ConfigurationPromise;
// ============================================================================
// DistributedApplicationBuilder
// ============================================================================
/**
 * Type class for DistributedApplicationBuilder.
 */
class DistributedApplicationBuilder {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the AppHostDirectory property */
    appHostDirectory = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting/IDistributedApplicationBuilder.appHostDirectory', { context: this._handle });
        },
    };
    /** Gets the Environment property */
    environment = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting/IDistributedApplicationBuilder.environment', { context: this._handle });
            return new HostEnvironment(handle, this._client);
        },
    };
    /** Gets the Eventing property */
    eventing = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting/IDistributedApplicationBuilder.eventing', { context: this._handle });
            return new DistributedApplicationEventing(handle, this._client);
        },
    };
    /** Gets the ExecutionContext property */
    executionContext = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting/IDistributedApplicationBuilder.executionContext', { context: this._handle });
            return new DistributedApplicationExecutionContext(handle, this._client);
        },
    };
    /** Gets the UserSecretsManager property */
    userSecretsManager = {
        get: async () => {
            const handle = await this._client.invokeCapability('Aspire.Hosting/IDistributedApplicationBuilder.userSecretsManager', { context: this._handle });
            return new UserSecretsManager(handle, this._client);
        },
    };
    /** Builds the distributed application */
    /** @internal */
    async _buildInternal() {
        const rpcArgs = { context: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/build', rpcArgs);
        return new DistributedApplication(result, this._client);
    }
    build() {
        return new DistributedApplicationPromise(this._buildInternal());
    }
    /** Adds a connection string with a reference expression */
    /** @internal */
    async _addConnectionStringExpressionInternal(name, connectionStringExpression) {
        const rpcArgs = { builder: this._handle, name, connectionStringExpression };
        const result = await this._client.invokeCapability('Aspire.Hosting/addConnectionStringExpression', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    addConnectionStringExpression(name, connectionStringExpression) {
        return new ConnectionStringResourcePromise(this._addConnectionStringExpressionInternal(name, connectionStringExpression));
    }
    /** Adds a connection string with a builder callback */
    /** @internal */
    async _addConnectionStringBuilderInternal(name, connectionStringBuilder) {
        const connectionStringBuilderId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ReferenceExpressionBuilder(objHandle, this._client);
            await connectionStringBuilder(obj);
        });
        const rpcArgs = { builder: this._handle, name, connectionStringBuilder: connectionStringBuilderId };
        const result = await this._client.invokeCapability('Aspire.Hosting/addConnectionStringBuilder', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    addConnectionStringBuilder(name, connectionStringBuilder) {
        return new ConnectionStringResourcePromise(this._addConnectionStringBuilderInternal(name, connectionStringBuilder));
    }
    /** Adds a container registry resource */
    /** @internal */
    async _addContainerRegistryInternal(name, endpoint, repository) {
        const rpcArgs = { builder: this._handle, name, endpoint };
        if (repository !== undefined)
            rpcArgs.repository = repository;
        const result = await this._client.invokeCapability('Aspire.Hosting/addContainerRegistry', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    addContainerRegistry(name, endpoint, options) {
        const repository = options?.repository;
        return new ContainerRegistryResourcePromise(this._addContainerRegistryInternal(name, endpoint, repository));
    }
    /** Adds a container registry with string endpoint */
    /** @internal */
    async _addContainerRegistryFromStringInternal(name, endpoint, repository) {
        const rpcArgs = { builder: this._handle, name, endpoint };
        if (repository !== undefined)
            rpcArgs.repository = repository;
        const result = await this._client.invokeCapability('Aspire.Hosting/addContainerRegistryFromString', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    addContainerRegistryFromString(name, endpoint, options) {
        const repository = options?.repository;
        return new ContainerRegistryResourcePromise(this._addContainerRegistryFromStringInternal(name, endpoint, repository));
    }
    /** Adds a container resource */
    /** @internal */
    async _addContainerInternal(name, image) {
        const rpcArgs = { builder: this._handle, name, image };
        const result = await this._client.invokeCapability('Aspire.Hosting/addContainer', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    addContainer(name, image) {
        return new ContainerResourcePromise(this._addContainerInternal(name, image));
    }
    /** Adds a container resource built from a Dockerfile */
    /** @internal */
    async _addDockerfileInternal(name, contextPath, dockerfilePath, stage) {
        const rpcArgs = { builder: this._handle, name, contextPath };
        if (dockerfilePath !== undefined)
            rpcArgs.dockerfilePath = dockerfilePath;
        if (stage !== undefined)
            rpcArgs.stage = stage;
        const result = await this._client.invokeCapability('Aspire.Hosting/addDockerfile', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    addDockerfile(name, contextPath, options) {
        const dockerfilePath = options?.dockerfilePath;
        const stage = options?.stage;
        return new ContainerResourcePromise(this._addDockerfileInternal(name, contextPath, dockerfilePath, stage));
    }
    /** Adds a .NET tool resource */
    /** @internal */
    async _addDotnetToolInternal(name, packageId) {
        const rpcArgs = { builder: this._handle, name, packageId };
        const result = await this._client.invokeCapability('Aspire.Hosting/addDotnetTool', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    addDotnetTool(name, packageId) {
        return new DotnetToolResourcePromise(this._addDotnetToolInternal(name, packageId));
    }
    /** Adds an executable resource */
    /** @internal */
    async _addExecutableInternal(name, command, workingDirectory, args) {
        const rpcArgs = { builder: this._handle, name, command, workingDirectory, args };
        const result = await this._client.invokeCapability('Aspire.Hosting/addExecutable', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    addExecutable(name, command, workingDirectory, args) {
        return new ExecutableResourcePromise(this._addExecutableInternal(name, command, workingDirectory, args));
    }
    /** Adds an external service resource */
    /** @internal */
    async _addExternalServiceInternal(name, url) {
        const rpcArgs = { builder: this._handle, name, url };
        const result = await this._client.invokeCapability('Aspire.Hosting/addExternalService', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    addExternalService(name, url) {
        return new ExternalServiceResourcePromise(this._addExternalServiceInternal(name, url));
    }
    /** Adds an external service with a URI */
    /** @internal */
    async _addExternalServiceUriInternal(name, uri) {
        const rpcArgs = { builder: this._handle, name, uri };
        const result = await this._client.invokeCapability('Aspire.Hosting/addExternalServiceUri', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    addExternalServiceUri(name, uri) {
        return new ExternalServiceResourcePromise(this._addExternalServiceUriInternal(name, uri));
    }
    /** Adds an external service with a parameter URL */
    /** @internal */
    async _addExternalServiceParameterInternal(name, urlParameter) {
        const rpcArgs = { builder: this._handle, name, urlParameter };
        const result = await this._client.invokeCapability('Aspire.Hosting/addExternalServiceParameter', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    addExternalServiceParameter(name, urlParameter) {
        return new ExternalServiceResourcePromise(this._addExternalServiceParameterInternal(name, urlParameter));
    }
    /** Adds a parameter resource */
    /** @internal */
    async _addParameterInternal(name, secret) {
        const rpcArgs = { builder: this._handle, name };
        if (secret !== undefined)
            rpcArgs.secret = secret;
        const result = await this._client.invokeCapability('Aspire.Hosting/addParameter', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    addParameter(name, options) {
        const secret = options?.secret;
        return new ParameterResourcePromise(this._addParameterInternal(name, secret));
    }
    /** Adds a parameter with a default value */
    /** @internal */
    async _addParameterWithValueInternal(name, value, publishValueAsDefault, secret) {
        const rpcArgs = { builder: this._handle, name, value };
        if (publishValueAsDefault !== undefined)
            rpcArgs.publishValueAsDefault = publishValueAsDefault;
        if (secret !== undefined)
            rpcArgs.secret = secret;
        const result = await this._client.invokeCapability('Aspire.Hosting/addParameterWithValue', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    addParameterWithValue(name, value, options) {
        const publishValueAsDefault = options?.publishValueAsDefault;
        const secret = options?.secret;
        return new ParameterResourcePromise(this._addParameterWithValueInternal(name, value, publishValueAsDefault, secret));
    }
    /** Adds a parameter sourced from configuration */
    /** @internal */
    async _addParameterFromConfigurationInternal(name, configurationKey, secret) {
        const rpcArgs = { builder: this._handle, name, configurationKey };
        if (secret !== undefined)
            rpcArgs.secret = secret;
        const result = await this._client.invokeCapability('Aspire.Hosting/addParameterFromConfiguration', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    addParameterFromConfiguration(name, configurationKey, options) {
        const secret = options?.secret;
        return new ParameterResourcePromise(this._addParameterFromConfigurationInternal(name, configurationKey, secret));
    }
    /** Adds a parameter with a generated default value */
    /** @internal */
    async _addParameterWithGeneratedValueInternal(name, value, secret, persist) {
        const rpcArgs = { builder: this._handle, name, value };
        if (secret !== undefined)
            rpcArgs.secret = secret;
        if (persist !== undefined)
            rpcArgs.persist = persist;
        const result = await this._client.invokeCapability('Aspire.Hosting/addParameterWithGeneratedValue', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    addParameterWithGeneratedValue(name, value, options) {
        const secret = options?.secret;
        const persist = options?.persist;
        return new ParameterResourcePromise(this._addParameterWithGeneratedValueInternal(name, value, secret, persist));
    }
    /** Adds a connection string resource */
    /** @internal */
    async _addConnectionStringInternal(name, environmentVariableName) {
        const rpcArgs = { builder: this._handle, name };
        if (environmentVariableName !== undefined)
            rpcArgs.environmentVariableName = environmentVariableName;
        const result = await this._client.invokeCapability('Aspire.Hosting/addConnectionString', rpcArgs);
        return new ResourceWithConnectionString(result, this._client);
    }
    addConnectionString(name, options) {
        const environmentVariableName = options?.environmentVariableName;
        return new ResourceWithConnectionStringPromise(this._addConnectionStringInternal(name, environmentVariableName));
    }
    /** Adds a .NET project resource without a launch profile */
    /** @internal */
    async _addProjectWithoutLaunchProfileInternal(name, projectPath) {
        const rpcArgs = { builder: this._handle, name, projectPath };
        const result = await this._client.invokeCapability('Aspire.Hosting/addProjectWithoutLaunchProfile', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    addProjectWithoutLaunchProfile(name, projectPath) {
        return new ProjectResourcePromise(this._addProjectWithoutLaunchProfileInternal(name, projectPath));
    }
    /** Adds a .NET project resource */
    /** @internal */
    async _addProjectInternal(name, projectPath, launchProfileName) {
        const rpcArgs = { builder: this._handle, name, projectPath, launchProfileName };
        const result = await this._client.invokeCapability('Aspire.Hosting/addProject', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    addProject(name, projectPath, launchProfileName) {
        return new ProjectResourcePromise(this._addProjectInternal(name, projectPath, launchProfileName));
    }
    /** Adds a project resource with configuration options */
    /** @internal */
    async _addProjectWithOptionsInternal(name, projectPath, configure) {
        const configureId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ProjectResourceOptions(objHandle, this._client);
            await configure(obj);
        });
        const rpcArgs = { builder: this._handle, name, projectPath, configure: configureId };
        const result = await this._client.invokeCapability('Aspire.Hosting/addProjectWithOptions', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    addProjectWithOptions(name, projectPath, configure) {
        return new ProjectResourcePromise(this._addProjectWithOptionsInternal(name, projectPath, configure));
    }
    /** Adds a C# application resource */
    /** @internal */
    async _addCSharpAppInternal(name, path) {
        const rpcArgs = { builder: this._handle, name, path };
        const result = await this._client.invokeCapability('Aspire.Hosting/addCSharpApp', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    addCSharpApp(name, path) {
        return new ProjectResourcePromise(this._addCSharpAppInternal(name, path));
    }
    /** Adds a C# application resource with configuration options */
    /** @internal */
    async _addCSharpAppWithOptionsInternal(name, path, configure) {
        const configureId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ProjectResourceOptions(objHandle, this._client);
            await configure(obj);
        });
        const rpcArgs = { builder: this._handle, name, path, configure: configureId };
        const result = await this._client.invokeCapability('Aspire.Hosting/addCSharpAppWithOptions', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    addCSharpAppWithOptions(name, path, configure) {
        return new CSharpAppResourcePromise(this._addCSharpAppWithOptionsInternal(name, path, configure));
    }
    /** Gets the application configuration */
    /** @internal */
    async _getConfigurationInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/getConfiguration', rpcArgs);
        return new Configuration(result, this._client);
    }
    getConfiguration() {
        return new ConfigurationPromise(this._getConfigurationInternal());
    }
    /** Subscribes to the BeforeStart event */
    async subscribeBeforeStart(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new BeforeStartEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        return await this._client.invokeCapability('Aspire.Hosting/subscribeBeforeStart', rpcArgs);
    }
    /** Subscribes to the AfterResourcesCreated event */
    async subscribeAfterResourcesCreated(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new AfterResourcesCreatedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        return await this._client.invokeCapability('Aspire.Hosting/subscribeAfterResourcesCreated', rpcArgs);
    }
    /** Adds a Node.js application resource */
    /** @internal */
    async _addNodeAppInternal(name, appDirectory, scriptPath) {
        const rpcArgs = { builder: this._handle, name, appDirectory, scriptPath };
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/addNodeApp', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    addNodeApp(name, appDirectory, scriptPath) {
        return new NodeAppResourcePromise(this._addNodeAppInternal(name, appDirectory, scriptPath));
    }
    /** Adds a JavaScript application resource */
    /** @internal */
    async _addJavaScriptAppInternal(name, appDirectory, runScriptName) {
        const rpcArgs = { builder: this._handle, name, appDirectory };
        if (runScriptName !== undefined)
            rpcArgs.runScriptName = runScriptName;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/addJavaScriptApp', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    addJavaScriptApp(name, appDirectory, options) {
        const runScriptName = options?.runScriptName;
        return new JavaScriptAppResourcePromise(this._addJavaScriptAppInternal(name, appDirectory, runScriptName));
    }
    /** Adds a Vite application resource */
    /** @internal */
    async _addViteAppInternal(name, appDirectory, runScriptName) {
        const rpcArgs = { builder: this._handle, name, appDirectory };
        if (runScriptName !== undefined)
            rpcArgs.runScriptName = runScriptName;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/addViteApp', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    addViteApp(name, appDirectory, options) {
        const runScriptName = options?.runScriptName;
        return new ViteAppResourcePromise(this._addViteAppInternal(name, appDirectory, runScriptName));
    }
}
exports.DistributedApplicationBuilder = DistributedApplicationBuilder;
/**
 * Thenable wrapper for DistributedApplicationBuilder that enables fluent chaining.
 */
class DistributedApplicationBuilderPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Builds the distributed application */
    build() {
        return new DistributedApplicationPromise(this._promise.then(obj => obj.build()));
    }
    /** Adds a connection string with a reference expression */
    addConnectionStringExpression(name, connectionStringExpression) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.addConnectionStringExpression(name, connectionStringExpression)));
    }
    /** Adds a connection string with a builder callback */
    addConnectionStringBuilder(name, connectionStringBuilder) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.addConnectionStringBuilder(name, connectionStringBuilder)));
    }
    /** Adds a container registry resource */
    addContainerRegistry(name, endpoint, options) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.addContainerRegistry(name, endpoint, options)));
    }
    /** Adds a container registry with string endpoint */
    addContainerRegistryFromString(name, endpoint, options) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.addContainerRegistryFromString(name, endpoint, options)));
    }
    /** Adds a container resource */
    addContainer(name, image) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.addContainer(name, image)));
    }
    /** Adds a container resource built from a Dockerfile */
    addDockerfile(name, contextPath, options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.addDockerfile(name, contextPath, options)));
    }
    /** Adds a .NET tool resource */
    addDotnetTool(name, packageId) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.addDotnetTool(name, packageId)));
    }
    /** Adds an executable resource */
    addExecutable(name, command, workingDirectory, args) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.addExecutable(name, command, workingDirectory, args)));
    }
    /** Adds an external service resource */
    addExternalService(name, url) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.addExternalService(name, url)));
    }
    /** Adds an external service with a URI */
    addExternalServiceUri(name, uri) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.addExternalServiceUri(name, uri)));
    }
    /** Adds an external service with a parameter URL */
    addExternalServiceParameter(name, urlParameter) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.addExternalServiceParameter(name, urlParameter)));
    }
    /** Adds a parameter resource */
    addParameter(name, options) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.addParameter(name, options)));
    }
    /** Adds a parameter with a default value */
    addParameterWithValue(name, value, options) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.addParameterWithValue(name, value, options)));
    }
    /** Adds a parameter sourced from configuration */
    addParameterFromConfiguration(name, configurationKey, options) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.addParameterFromConfiguration(name, configurationKey, options)));
    }
    /** Adds a parameter with a generated default value */
    addParameterWithGeneratedValue(name, value, options) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.addParameterWithGeneratedValue(name, value, options)));
    }
    /** Adds a connection string resource */
    addConnectionString(name, options) {
        return new ResourceWithConnectionStringPromise(this._promise.then(obj => obj.addConnectionString(name, options)));
    }
    /** Adds a .NET project resource without a launch profile */
    addProjectWithoutLaunchProfile(name, projectPath) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.addProjectWithoutLaunchProfile(name, projectPath)));
    }
    /** Adds a .NET project resource */
    addProject(name, projectPath, launchProfileName) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.addProject(name, projectPath, launchProfileName)));
    }
    /** Adds a project resource with configuration options */
    addProjectWithOptions(name, projectPath, configure) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.addProjectWithOptions(name, projectPath, configure)));
    }
    /** Adds a C# application resource */
    addCSharpApp(name, path) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.addCSharpApp(name, path)));
    }
    /** Adds a C# application resource with configuration options */
    addCSharpAppWithOptions(name, path, configure) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.addCSharpAppWithOptions(name, path, configure)));
    }
    /** Gets the application configuration */
    getConfiguration() {
        return new ConfigurationPromise(this._promise.then(obj => obj.getConfiguration()));
    }
    /** Subscribes to the BeforeStart event */
    subscribeBeforeStart(callback) {
        return this._promise.then(obj => obj.subscribeBeforeStart(callback));
    }
    /** Subscribes to the AfterResourcesCreated event */
    subscribeAfterResourcesCreated(callback) {
        return this._promise.then(obj => obj.subscribeAfterResourcesCreated(callback));
    }
    /** Adds a Node.js application resource */
    addNodeApp(name, appDirectory, scriptPath) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.addNodeApp(name, appDirectory, scriptPath)));
    }
    /** Adds a JavaScript application resource */
    addJavaScriptApp(name, appDirectory, options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.addJavaScriptApp(name, appDirectory, options)));
    }
    /** Adds a Vite application resource */
    addViteApp(name, appDirectory, options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.addViteApp(name, appDirectory, options)));
    }
}
exports.DistributedApplicationBuilderPromise = DistributedApplicationBuilderPromise;
// ============================================================================
// DistributedApplicationEventing
// ============================================================================
/**
 * Type class for DistributedApplicationEventing.
 */
class DistributedApplicationEventing {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Invokes the Unsubscribe method */
    /** @internal */
    async _unsubscribeInternal(subscription) {
        const rpcArgs = { context: this._handle, subscription };
        await this._client.invokeCapability('Aspire.Hosting.Eventing/IDistributedApplicationEventing.unsubscribe', rpcArgs);
        return this;
    }
    unsubscribe(subscription) {
        return new DistributedApplicationEventingPromise(this._unsubscribeInternal(subscription));
    }
}
exports.DistributedApplicationEventing = DistributedApplicationEventing;
/**
 * Thenable wrapper for DistributedApplicationEventing that enables fluent chaining.
 */
class DistributedApplicationEventingPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Invokes the Unsubscribe method */
    unsubscribe(subscription) {
        return new DistributedApplicationEventingPromise(this._promise.then(obj => obj.unsubscribe(subscription)));
    }
}
exports.DistributedApplicationEventingPromise = DistributedApplicationEventingPromise;
// ============================================================================
// HostEnvironment
// ============================================================================
/**
 * Type class for HostEnvironment.
 */
class HostEnvironment {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Checks if running in Development environment */
    async isDevelopment() {
        const rpcArgs = { environment: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/isDevelopment', rpcArgs);
    }
    /** Checks if running in Production environment */
    async isProduction() {
        const rpcArgs = { environment: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/isProduction', rpcArgs);
    }
    /** Checks if running in Staging environment */
    async isStaging() {
        const rpcArgs = { environment: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/isStaging', rpcArgs);
    }
    /** Checks if the environment matches the specified name */
    async isEnvironment(environmentName) {
        const rpcArgs = { environment: this._handle, environmentName };
        return await this._client.invokeCapability('Aspire.Hosting/isEnvironment', rpcArgs);
    }
}
exports.HostEnvironment = HostEnvironment;
/**
 * Thenable wrapper for HostEnvironment that enables fluent chaining.
 */
class HostEnvironmentPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Checks if running in Development environment */
    isDevelopment() {
        return this._promise.then(obj => obj.isDevelopment());
    }
    /** Checks if running in Production environment */
    isProduction() {
        return this._promise.then(obj => obj.isProduction());
    }
    /** Checks if running in Staging environment */
    isStaging() {
        return this._promise.then(obj => obj.isStaging());
    }
    /** Checks if the environment matches the specified name */
    isEnvironment(environmentName) {
        return this._promise.then(obj => obj.isEnvironment(environmentName));
    }
}
exports.HostEnvironmentPromise = HostEnvironmentPromise;
// ============================================================================
// Logger
// ============================================================================
/**
 * Type class for Logger.
 */
class Logger {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Logs an information message */
    /** @internal */
    async _logInformationInternal(message) {
        const rpcArgs = { logger: this._handle, message };
        await this._client.invokeCapability('Aspire.Hosting/logInformation', rpcArgs);
        return this;
    }
    logInformation(message) {
        return new LoggerPromise(this._logInformationInternal(message));
    }
    /** Logs a warning message */
    /** @internal */
    async _logWarningInternal(message) {
        const rpcArgs = { logger: this._handle, message };
        await this._client.invokeCapability('Aspire.Hosting/logWarning', rpcArgs);
        return this;
    }
    logWarning(message) {
        return new LoggerPromise(this._logWarningInternal(message));
    }
    /** Logs an error message */
    /** @internal */
    async _logErrorInternal(message) {
        const rpcArgs = { logger: this._handle, message };
        await this._client.invokeCapability('Aspire.Hosting/logError', rpcArgs);
        return this;
    }
    logError(message) {
        return new LoggerPromise(this._logErrorInternal(message));
    }
    /** Logs a debug message */
    /** @internal */
    async _logDebugInternal(message) {
        const rpcArgs = { logger: this._handle, message };
        await this._client.invokeCapability('Aspire.Hosting/logDebug', rpcArgs);
        return this;
    }
    logDebug(message) {
        return new LoggerPromise(this._logDebugInternal(message));
    }
    /** Logs a message with specified level */
    /** @internal */
    async _logInternal(level, message) {
        const rpcArgs = { logger: this._handle, level, message };
        await this._client.invokeCapability('Aspire.Hosting/log', rpcArgs);
        return this;
    }
    log(level, message) {
        return new LoggerPromise(this._logInternal(level, message));
    }
}
exports.Logger = Logger;
/**
 * Thenable wrapper for Logger that enables fluent chaining.
 */
class LoggerPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Logs an information message */
    logInformation(message) {
        return new LoggerPromise(this._promise.then(obj => obj.logInformation(message)));
    }
    /** Logs a warning message */
    logWarning(message) {
        return new LoggerPromise(this._promise.then(obj => obj.logWarning(message)));
    }
    /** Logs an error message */
    logError(message) {
        return new LoggerPromise(this._promise.then(obj => obj.logError(message)));
    }
    /** Logs a debug message */
    logDebug(message) {
        return new LoggerPromise(this._promise.then(obj => obj.logDebug(message)));
    }
    /** Logs a message with specified level */
    log(level, message) {
        return new LoggerPromise(this._promise.then(obj => obj.log(level, message)));
    }
}
exports.LoggerPromise = LoggerPromise;
// ============================================================================
// LoggerFactory
// ============================================================================
/**
 * Type class for LoggerFactory.
 */
class LoggerFactory {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Creates a logger for a category */
    /** @internal */
    async _createLoggerInternal(categoryName) {
        const rpcArgs = { loggerFactory: this._handle, categoryName };
        const result = await this._client.invokeCapability('Aspire.Hosting/createLogger', rpcArgs);
        return new Logger(result, this._client);
    }
    createLogger(categoryName) {
        return new LoggerPromise(this._createLoggerInternal(categoryName));
    }
}
exports.LoggerFactory = LoggerFactory;
/**
 * Thenable wrapper for LoggerFactory that enables fluent chaining.
 */
class LoggerFactoryPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Creates a logger for a category */
    createLogger(categoryName) {
        return new LoggerPromise(this._promise.then(obj => obj.createLogger(categoryName)));
    }
}
exports.LoggerFactoryPromise = LoggerFactoryPromise;
// ============================================================================
// ReportingStep
// ============================================================================
/**
 * Type class for ReportingStep.
 */
class ReportingStep {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Creates a reporting task with plain-text status text */
    /** @internal */
    async _createTaskInternal(statusText, cancellationToken) {
        const rpcArgs = { reportingStep: this._handle, statusText };
        if (cancellationToken !== undefined)
            rpcArgs.cancellationToken = transport_js_1.CancellationToken.fromValue(cancellationToken);
        const result = await this._client.invokeCapability('Aspire.Hosting/createTask', rpcArgs);
        return new ReportingTask(result, this._client);
    }
    createTask(statusText, options) {
        const cancellationToken = options?.cancellationToken;
        return new ReportingTaskPromise(this._createTaskInternal(statusText, cancellationToken));
    }
    /** Creates a reporting task with Markdown-formatted status text */
    /** @internal */
    async _createMarkdownTaskInternal(markdownString, cancellationToken) {
        const rpcArgs = { reportingStep: this._handle, markdownString };
        if (cancellationToken !== undefined)
            rpcArgs.cancellationToken = transport_js_1.CancellationToken.fromValue(cancellationToken);
        const result = await this._client.invokeCapability('Aspire.Hosting/createMarkdownTask', rpcArgs);
        return new ReportingTask(result, this._client);
    }
    createMarkdownTask(markdownString, options) {
        const cancellationToken = options?.cancellationToken;
        return new ReportingTaskPromise(this._createMarkdownTaskInternal(markdownString, cancellationToken));
    }
    /** Logs a plain-text message for the reporting step */
    /** @internal */
    async _logStepInternal(level, message) {
        const rpcArgs = { reportingStep: this._handle, level, message };
        await this._client.invokeCapability('Aspire.Hosting/logStep', rpcArgs);
        return this;
    }
    logStep(level, message) {
        return new ReportingStepPromise(this._logStepInternal(level, message));
    }
    /** Logs a Markdown-formatted message for the reporting step */
    /** @internal */
    async _logStepMarkdownInternal(level, markdownString) {
        const rpcArgs = { reportingStep: this._handle, level, markdownString };
        await this._client.invokeCapability('Aspire.Hosting/logStepMarkdown', rpcArgs);
        return this;
    }
    logStepMarkdown(level, markdownString) {
        return new ReportingStepPromise(this._logStepMarkdownInternal(level, markdownString));
    }
    /** Completes the reporting step with plain-text completion text */
    /** @internal */
    async _completeStepInternal(completionText, completionState, cancellationToken) {
        const rpcArgs = { reportingStep: this._handle, completionText };
        if (completionState !== undefined)
            rpcArgs.completionState = completionState;
        if (cancellationToken !== undefined)
            rpcArgs.cancellationToken = transport_js_1.CancellationToken.fromValue(cancellationToken);
        await this._client.invokeCapability('Aspire.Hosting/completeStep', rpcArgs);
        return this;
    }
    completeStep(completionText, options) {
        const completionState = options?.completionState;
        const cancellationToken = options?.cancellationToken;
        return new ReportingStepPromise(this._completeStepInternal(completionText, completionState, cancellationToken));
    }
    /** Completes the reporting step with Markdown-formatted completion text */
    /** @internal */
    async _completeStepMarkdownInternal(markdownString, completionState, cancellationToken) {
        const rpcArgs = { reportingStep: this._handle, markdownString };
        if (completionState !== undefined)
            rpcArgs.completionState = completionState;
        if (cancellationToken !== undefined)
            rpcArgs.cancellationToken = transport_js_1.CancellationToken.fromValue(cancellationToken);
        await this._client.invokeCapability('Aspire.Hosting/completeStepMarkdown', rpcArgs);
        return this;
    }
    completeStepMarkdown(markdownString, options) {
        const completionState = options?.completionState;
        const cancellationToken = options?.cancellationToken;
        return new ReportingStepPromise(this._completeStepMarkdownInternal(markdownString, completionState, cancellationToken));
    }
}
exports.ReportingStep = ReportingStep;
/**
 * Thenable wrapper for ReportingStep that enables fluent chaining.
 */
class ReportingStepPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Creates a reporting task with plain-text status text */
    createTask(statusText, options) {
        return new ReportingTaskPromise(this._promise.then(obj => obj.createTask(statusText, options)));
    }
    /** Creates a reporting task with Markdown-formatted status text */
    createMarkdownTask(markdownString, options) {
        return new ReportingTaskPromise(this._promise.then(obj => obj.createMarkdownTask(markdownString, options)));
    }
    /** Logs a plain-text message for the reporting step */
    logStep(level, message) {
        return new ReportingStepPromise(this._promise.then(obj => obj.logStep(level, message)));
    }
    /** Logs a Markdown-formatted message for the reporting step */
    logStepMarkdown(level, markdownString) {
        return new ReportingStepPromise(this._promise.then(obj => obj.logStepMarkdown(level, markdownString)));
    }
    /** Completes the reporting step with plain-text completion text */
    completeStep(completionText, options) {
        return new ReportingStepPromise(this._promise.then(obj => obj.completeStep(completionText, options)));
    }
    /** Completes the reporting step with Markdown-formatted completion text */
    completeStepMarkdown(markdownString, options) {
        return new ReportingStepPromise(this._promise.then(obj => obj.completeStepMarkdown(markdownString, options)));
    }
}
exports.ReportingStepPromise = ReportingStepPromise;
// ============================================================================
// ReportingTask
// ============================================================================
/**
 * Type class for ReportingTask.
 */
class ReportingTask {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Updates the reporting task with plain-text status text */
    /** @internal */
    async _updateTaskInternal(statusText, cancellationToken) {
        const rpcArgs = { reportingTask: this._handle, statusText };
        if (cancellationToken !== undefined)
            rpcArgs.cancellationToken = transport_js_1.CancellationToken.fromValue(cancellationToken);
        await this._client.invokeCapability('Aspire.Hosting/updateTask', rpcArgs);
        return this;
    }
    updateTask(statusText, options) {
        const cancellationToken = options?.cancellationToken;
        return new ReportingTaskPromise(this._updateTaskInternal(statusText, cancellationToken));
    }
    /** Updates the reporting task with Markdown-formatted status text */
    /** @internal */
    async _updateTaskMarkdownInternal(markdownString, cancellationToken) {
        const rpcArgs = { reportingTask: this._handle, markdownString };
        if (cancellationToken !== undefined)
            rpcArgs.cancellationToken = transport_js_1.CancellationToken.fromValue(cancellationToken);
        await this._client.invokeCapability('Aspire.Hosting/updateTaskMarkdown', rpcArgs);
        return this;
    }
    updateTaskMarkdown(markdownString, options) {
        const cancellationToken = options?.cancellationToken;
        return new ReportingTaskPromise(this._updateTaskMarkdownInternal(markdownString, cancellationToken));
    }
    /** Completes the reporting task with plain-text completion text */
    /** @internal */
    async _completeTaskInternal(completionMessage, completionState, cancellationToken) {
        const rpcArgs = { reportingTask: this._handle };
        if (completionMessage !== undefined)
            rpcArgs.completionMessage = completionMessage;
        if (completionState !== undefined)
            rpcArgs.completionState = completionState;
        if (cancellationToken !== undefined)
            rpcArgs.cancellationToken = transport_js_1.CancellationToken.fromValue(cancellationToken);
        await this._client.invokeCapability('Aspire.Hosting/completeTask', rpcArgs);
        return this;
    }
    completeTask(options) {
        const completionMessage = options?.completionMessage;
        const completionState = options?.completionState;
        const cancellationToken = options?.cancellationToken;
        return new ReportingTaskPromise(this._completeTaskInternal(completionMessage, completionState, cancellationToken));
    }
    /** Completes the reporting task with Markdown-formatted completion text */
    /** @internal */
    async _completeTaskMarkdownInternal(markdownString, completionState, cancellationToken) {
        const rpcArgs = { reportingTask: this._handle, markdownString };
        if (completionState !== undefined)
            rpcArgs.completionState = completionState;
        if (cancellationToken !== undefined)
            rpcArgs.cancellationToken = transport_js_1.CancellationToken.fromValue(cancellationToken);
        await this._client.invokeCapability('Aspire.Hosting/completeTaskMarkdown', rpcArgs);
        return this;
    }
    completeTaskMarkdown(markdownString, options) {
        const completionState = options?.completionState;
        const cancellationToken = options?.cancellationToken;
        return new ReportingTaskPromise(this._completeTaskMarkdownInternal(markdownString, completionState, cancellationToken));
    }
}
exports.ReportingTask = ReportingTask;
/**
 * Thenable wrapper for ReportingTask that enables fluent chaining.
 */
class ReportingTaskPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Updates the reporting task with plain-text status text */
    updateTask(statusText, options) {
        return new ReportingTaskPromise(this._promise.then(obj => obj.updateTask(statusText, options)));
    }
    /** Updates the reporting task with Markdown-formatted status text */
    updateTaskMarkdown(markdownString, options) {
        return new ReportingTaskPromise(this._promise.then(obj => obj.updateTaskMarkdown(markdownString, options)));
    }
    /** Completes the reporting task with plain-text completion text */
    completeTask(options) {
        return new ReportingTaskPromise(this._promise.then(obj => obj.completeTask(options)));
    }
    /** Completes the reporting task with Markdown-formatted completion text */
    completeTaskMarkdown(markdownString, options) {
        return new ReportingTaskPromise(this._promise.then(obj => obj.completeTaskMarkdown(markdownString, options)));
    }
}
exports.ReportingTaskPromise = ReportingTaskPromise;
// ============================================================================
// ServiceProvider
// ============================================================================
/**
 * Type class for ServiceProvider.
 */
class ServiceProvider {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the distributed application eventing service from the service provider */
    /** @internal */
    async _getEventingInternal() {
        const rpcArgs = { serviceProvider: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/getEventing', rpcArgs);
        return new DistributedApplicationEventing(result, this._client);
    }
    getEventing() {
        return new DistributedApplicationEventingPromise(this._getEventingInternal());
    }
    /** Gets the logger factory from the service provider */
    /** @internal */
    async _getLoggerFactoryInternal() {
        const rpcArgs = { serviceProvider: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/getLoggerFactory', rpcArgs);
        return new LoggerFactory(result, this._client);
    }
    getLoggerFactory() {
        return new LoggerFactoryPromise(this._getLoggerFactoryInternal());
    }
    /** Gets the resource logger service from the service provider */
    /** @internal */
    async _getResourceLoggerServiceInternal() {
        const rpcArgs = { serviceProvider: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/getResourceLoggerService', rpcArgs);
        return new ResourceLoggerService(result, this._client);
    }
    getResourceLoggerService() {
        return new ResourceLoggerServicePromise(this._getResourceLoggerServiceInternal());
    }
    /** Gets the distributed application model from the service provider */
    /** @internal */
    async _getDistributedApplicationModelInternal() {
        const rpcArgs = { serviceProvider: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/getDistributedApplicationModel', rpcArgs);
        return new DistributedApplicationModel(result, this._client);
    }
    getDistributedApplicationModel() {
        return new DistributedApplicationModelPromise(this._getDistributedApplicationModelInternal());
    }
    /** Gets the resource notification service from the service provider */
    /** @internal */
    async _getResourceNotificationServiceInternal() {
        const rpcArgs = { serviceProvider: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/getResourceNotificationService', rpcArgs);
        return new ResourceNotificationService(result, this._client);
    }
    getResourceNotificationService() {
        return new ResourceNotificationServicePromise(this._getResourceNotificationServiceInternal());
    }
    /** Gets the user secrets manager from the service provider */
    /** @internal */
    async _getUserSecretsManagerInternal() {
        const rpcArgs = { serviceProvider: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/getUserSecretsManager', rpcArgs);
        return new UserSecretsManager(result, this._client);
    }
    getUserSecretsManager() {
        return new UserSecretsManagerPromise(this._getUserSecretsManagerInternal());
    }
}
exports.ServiceProvider = ServiceProvider;
/**
 * Thenable wrapper for ServiceProvider that enables fluent chaining.
 */
class ServiceProviderPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Gets the distributed application eventing service from the service provider */
    getEventing() {
        return new DistributedApplicationEventingPromise(this._promise.then(obj => obj.getEventing()));
    }
    /** Gets the logger factory from the service provider */
    getLoggerFactory() {
        return new LoggerFactoryPromise(this._promise.then(obj => obj.getLoggerFactory()));
    }
    /** Gets the resource logger service from the service provider */
    getResourceLoggerService() {
        return new ResourceLoggerServicePromise(this._promise.then(obj => obj.getResourceLoggerService()));
    }
    /** Gets the distributed application model from the service provider */
    getDistributedApplicationModel() {
        return new DistributedApplicationModelPromise(this._promise.then(obj => obj.getDistributedApplicationModel()));
    }
    /** Gets the resource notification service from the service provider */
    getResourceNotificationService() {
        return new ResourceNotificationServicePromise(this._promise.then(obj => obj.getResourceNotificationService()));
    }
    /** Gets the user secrets manager from the service provider */
    getUserSecretsManager() {
        return new UserSecretsManagerPromise(this._promise.then(obj => obj.getUserSecretsManager()));
    }
}
exports.ServiceProviderPromise = ServiceProviderPromise;
// ============================================================================
// UserSecretsManager
// ============================================================================
/**
 * Type class for UserSecretsManager.
 */
class UserSecretsManager {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    /** Serialize for JSON-RPC transport */
    toJSON() { return this._handle.toJSON(); }
    /** Gets the IsAvailable property */
    isAvailable = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting/IUserSecretsManager.isAvailable', { context: this._handle });
        },
    };
    /** Gets the FilePath property */
    filePath = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting/IUserSecretsManager.filePath', { context: this._handle });
        },
    };
    /** Attempts to set a user secret value */
    async trySetSecret(name, value) {
        const rpcArgs = { context: this._handle, name, value };
        return await this._client.invokeCapability('Aspire.Hosting/IUserSecretsManager.trySetSecret', rpcArgs);
    }
    /** Saves state to user secrets from a JSON string */
    /** @internal */
    async _saveStateJsonInternal(json, cancellationToken) {
        const rpcArgs = { userSecretsManager: this._handle, json };
        if (cancellationToken !== undefined)
            rpcArgs.cancellationToken = transport_js_1.CancellationToken.fromValue(cancellationToken);
        await this._client.invokeCapability('Aspire.Hosting/saveStateJson', rpcArgs);
        return this;
    }
    saveStateJson(json, options) {
        const cancellationToken = options?.cancellationToken;
        return new UserSecretsManagerPromise(this._saveStateJsonInternal(json, cancellationToken));
    }
    /** Gets a secret value if it exists, or sets it to the provided value if it does not */
    /** @internal */
    async _getOrSetSecretInternal(resourceBuilder, name, value) {
        const rpcArgs = { userSecretsManager: this._handle, resourceBuilder, name, value };
        await this._client.invokeCapability('Aspire.Hosting/getOrSetSecret', rpcArgs);
        return this;
    }
    getOrSetSecret(resourceBuilder, name, value) {
        return new UserSecretsManagerPromise(this._getOrSetSecretInternal(resourceBuilder, name, value));
    }
}
exports.UserSecretsManager = UserSecretsManager;
/**
 * Thenable wrapper for UserSecretsManager that enables fluent chaining.
 */
class UserSecretsManagerPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Attempts to set a user secret value */
    trySetSecret(name, value) {
        return this._promise.then(obj => obj.trySetSecret(name, value));
    }
    /** Saves state to user secrets from a JSON string */
    saveStateJson(json, options) {
        return new UserSecretsManagerPromise(this._promise.then(obj => obj.saveStateJson(json, options)));
    }
    /** Gets a secret value if it exists, or sets it to the provided value if it does not */
    getOrSetSecret(resourceBuilder, name, value) {
        return new UserSecretsManagerPromise(this._promise.then(obj => obj.getOrSetSecret(resourceBuilder, name, value)));
    }
}
exports.UserSecretsManagerPromise = UserSecretsManagerPromise;
// ============================================================================
// ConnectionStringResource
// ============================================================================
class ConnectionStringResource extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _withContainerRegistryInternal(registry) {
        const rpcArgs = { builder: this._handle, registry };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerRegistry', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ConnectionStringResourcePromise(this._withContainerRegistryInternal(registry));
    }
    /** @internal */
    async _withDockerfileBaseImageInternal(buildImage, runtimeImage) {
        const rpcArgs = { builder: this._handle };
        if (buildImage !== undefined)
            rpcArgs.buildImage = buildImage;
        if (runtimeImage !== undefined)
            rpcArgs.runtimeImage = runtimeImage;
        const result = await this._client.invokeCapability('Aspire.Hosting/withDockerfileBaseImage', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        const buildImage = options?.buildImage;
        const runtimeImage = options?.runtimeImage;
        return new ConnectionStringResourcePromise(this._withDockerfileBaseImageInternal(buildImage, runtimeImage));
    }
    /** @internal */
    async _withRequiredCommandInternal(command, helpLink) {
        const rpcArgs = { builder: this._handle, command };
        if (helpLink !== undefined)
            rpcArgs.helpLink = helpLink;
        const result = await this._client.invokeCapability('Aspire.Hosting/withRequiredCommand', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        const helpLink = options?.helpLink;
        return new ConnectionStringResourcePromise(this._withRequiredCommandInternal(command, helpLink));
    }
    /** @internal */
    async _withConnectionPropertyInternal(name, value) {
        const rpcArgs = { builder: this._handle, name, value };
        const result = await this._client.invokeCapability('Aspire.Hosting/withConnectionProperty', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Adds a connection property with a string or reference expression value */
    withConnectionProperty(name, value) {
        return new ConnectionStringResourcePromise(this._withConnectionPropertyInternal(name, value));
    }
    /** @internal */
    async _withConnectionPropertyValueInternal(name, value) {
        const rpcArgs = { builder: this._handle, name, value };
        const result = await this._client.invokeCapability('Aspire.Hosting/withConnectionPropertyValue', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Adds a connection property with a string value */
    withConnectionPropertyValue(name, value) {
        return new ConnectionStringResourcePromise(this._withConnectionPropertyValueInternal(name, value));
    }
    /** Gets a connection property by key */
    async getConnectionProperty(key) {
        const rpcArgs = { resource: this._handle, key };
        return await this._client.invokeCapability('Aspire.Hosting/getConnectionProperty', rpcArgs);
    }
    /** @internal */
    async _withUrlsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ResourceUrlsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallback', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ConnectionStringResourcePromise(this._withUrlsCallbackInternal(callback));
    }
    /** @internal */
    async _withUrlsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceUrlsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallbackAsync', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ConnectionStringResourcePromise(this._withUrlsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withUrlInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrl', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        const displayText = options?.displayText;
        return new ConnectionStringResourcePromise(this._withUrlInternal(url, displayText));
    }
    /** @internal */
    async _withUrlExpressionInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlExpression', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        const displayText = options?.displayText;
        return new ConnectionStringResourcePromise(this._withUrlExpressionInternal(url, displayText));
    }
    /** @internal */
    async _withUrlForEndpointInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const obj = (0, transport_js_1.wrapIfHandle)(objData);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpoint', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ConnectionStringResourcePromise(this._withUrlForEndpointInternal(endpointName, callback));
    }
    /** @internal */
    async _excludeFromManifestInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromManifest', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ConnectionStringResourcePromise(this._excludeFromManifestInternal());
    }
    /** @internal */
    async _waitForInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResource', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new ConnectionStringResourcePromise(this._waitForInternal(dependency));
    }
    /** @internal */
    async _waitForWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForWithBehavior', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new ConnectionStringResourcePromise(this._waitForWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _waitForStartInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceStart', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new ConnectionStringResourcePromise(this._waitForStartInternal(dependency));
    }
    /** @internal */
    async _waitForStartWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForStartWithBehavior', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new ConnectionStringResourcePromise(this._waitForStartWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _withExplicitStartInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExplicitStart', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ConnectionStringResourcePromise(this._withExplicitStartInternal());
    }
    /** @internal */
    async _waitForCompletionInternal(dependency, exitCode) {
        const rpcArgs = { builder: this._handle, dependency };
        if (exitCode !== undefined)
            rpcArgs.exitCode = exitCode;
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceCompletion', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        const exitCode = options?.exitCode;
        return new ConnectionStringResourcePromise(this._waitForCompletionInternal(dependency, exitCode));
    }
    /** @internal */
    async _withHealthCheckInternal(key) {
        const rpcArgs = { builder: this._handle, key };
        const result = await this._client.invokeCapability('Aspire.Hosting/withHealthCheck', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ConnectionStringResourcePromise(this._withHealthCheckInternal(key));
    }
    /** @internal */
    async _withCommandInternal(name, displayName, executeCommand, commandOptions) {
        const executeCommandId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ExecuteCommandContext(argHandle, this._client);
            return await executeCommand(arg);
        });
        const rpcArgs = { builder: this._handle, name, displayName, executeCommand: executeCommandId };
        if (commandOptions !== undefined)
            rpcArgs.commandOptions = commandOptions;
        const result = await this._client.invokeCapability('Aspire.Hosting/withCommand', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        const commandOptions = options?.commandOptions;
        return new ConnectionStringResourcePromise(this._withCommandInternal(name, displayName, executeCommand, commandOptions));
    }
    /** @internal */
    async _withRelationshipInternal(resourceBuilder, type) {
        const rpcArgs = { builder: this._handle, resourceBuilder, type };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderRelationship', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ConnectionStringResourcePromise(this._withRelationshipInternal(resourceBuilder, type));
    }
    /** @internal */
    async _withParentRelationshipInternal(parent) {
        const rpcArgs = { builder: this._handle, parent };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderParentRelationship', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ConnectionStringResourcePromise(this._withParentRelationshipInternal(parent));
    }
    /** @internal */
    async _withChildRelationshipInternal(child) {
        const rpcArgs = { builder: this._handle, child };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderChildRelationship', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ConnectionStringResourcePromise(this._withChildRelationshipInternal(child));
    }
    /** @internal */
    async _withIconNameInternal(iconName, iconVariant) {
        const rpcArgs = { builder: this._handle, iconName };
        if (iconVariant !== undefined)
            rpcArgs.iconVariant = iconVariant;
        const result = await this._client.invokeCapability('Aspire.Hosting/withIconName', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        const iconVariant = options?.iconVariant;
        return new ConnectionStringResourcePromise(this._withIconNameInternal(iconName, iconVariant));
    }
    /** @internal */
    async _excludeFromMcpInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromMcp', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ConnectionStringResourcePromise(this._excludeFromMcpInternal());
    }
    /** @internal */
    async _withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineStepContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, stepName, callback: callbackId };
        if (dependsOn !== undefined)
            rpcArgs.dependsOn = dependsOn;
        if (requiredBy !== undefined)
            rpcArgs.requiredBy = requiredBy;
        if (tags !== undefined)
            rpcArgs.tags = tags;
        if (description !== undefined)
            rpcArgs.description = description;
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineStepFactory', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        const dependsOn = options?.dependsOn;
        const requiredBy = options?.requiredBy;
        const tags = options?.tags;
        const description = options?.description;
        return new ConnectionStringResourcePromise(this._withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description));
    }
    /** @internal */
    async _withPipelineConfigurationAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineConfigurationContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfigurationAsync', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ConnectionStringResourcePromise(this._withPipelineConfigurationAsyncInternal(callback));
    }
    /** @internal */
    async _withPipelineConfigurationInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new PipelineConfigurationContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfiguration', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ConnectionStringResourcePromise(this._withPipelineConfigurationInternal(callback));
    }
    /** Gets the resource name */
    async getResourceName() {
        const rpcArgs = { resource: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/getResourceName', rpcArgs);
    }
    /** @internal */
    async _onBeforeResourceStartedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new BeforeResourceStartedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onBeforeResourceStarted', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ConnectionStringResourcePromise(this._onBeforeResourceStartedInternal(callback));
    }
    /** @internal */
    async _onResourceStoppedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceStoppedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceStopped', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ConnectionStringResourcePromise(this._onResourceStoppedInternal(callback));
    }
    /** @internal */
    async _onConnectionStringAvailableInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ConnectionStringAvailableEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onConnectionStringAvailable', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Subscribes to the ConnectionStringAvailable event */
    onConnectionStringAvailable(callback) {
        return new ConnectionStringResourcePromise(this._onConnectionStringAvailableInternal(callback));
    }
    /** @internal */
    async _onInitializeResourceInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new InitializeResourceEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onInitializeResource', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ConnectionStringResourcePromise(this._onInitializeResourceInternal(callback));
    }
    /** @internal */
    async _onResourceReadyInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceReadyEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceReady', rpcArgs);
        return new ConnectionStringResource(result, this._client);
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ConnectionStringResourcePromise(this._onResourceReadyInternal(callback));
    }
}
exports.ConnectionStringResource = ConnectionStringResource;
/**
 * Thenable wrapper for ConnectionStringResource that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class ConnectionStringResourcePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withContainerRegistry(registry)));
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withDockerfileBaseImage(options)));
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withRequiredCommand(command, options)));
    }
    /** Adds a connection property with a string or reference expression value */
    withConnectionProperty(name, value) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withConnectionProperty(name, value)));
    }
    /** Adds a connection property with a string value */
    withConnectionPropertyValue(name, value) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withConnectionPropertyValue(name, value)));
    }
    /** Gets a connection property by key */
    getConnectionProperty(key) {
        return this._promise.then(obj => obj.getConnectionProperty(key));
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withUrlsCallback(callback)));
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withUrlsCallbackAsync(callback)));
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withUrl(url, options)));
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withUrlExpression(url, options)));
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withUrlForEndpoint(endpointName, callback)));
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.excludeFromManifest()));
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.waitFor(dependency)));
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.waitForWithBehavior(dependency, waitBehavior)));
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.waitForStart(dependency)));
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.waitForStartWithBehavior(dependency, waitBehavior)));
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withExplicitStart()));
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.waitForCompletion(dependency, options)));
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withHealthCheck(key)));
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withCommand(name, displayName, executeCommand, options)));
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withRelationship(resourceBuilder, type)));
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withParentRelationship(parent)));
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withChildRelationship(child)));
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withIconName(iconName, options)));
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.excludeFromMcp()));
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withPipelineStepFactory(stepName, callback, options)));
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withPipelineConfigurationAsync(callback)));
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.withPipelineConfiguration(callback)));
    }
    /** Gets the resource name */
    getResourceName() {
        return this._promise.then(obj => obj.getResourceName());
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.onBeforeResourceStarted(callback)));
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.onResourceStopped(callback)));
    }
    /** Subscribes to the ConnectionStringAvailable event */
    onConnectionStringAvailable(callback) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.onConnectionStringAvailable(callback)));
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.onInitializeResource(callback)));
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ConnectionStringResourcePromise(this._promise.then(obj => obj.onResourceReady(callback)));
    }
}
exports.ConnectionStringResourcePromise = ConnectionStringResourcePromise;
// ============================================================================
// ContainerRegistryResource
// ============================================================================
class ContainerRegistryResource extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _withContainerRegistryInternal(registry) {
        const rpcArgs = { builder: this._handle, registry };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerRegistry', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ContainerRegistryResourcePromise(this._withContainerRegistryInternal(registry));
    }
    /** @internal */
    async _withDockerfileBaseImageInternal(buildImage, runtimeImage) {
        const rpcArgs = { builder: this._handle };
        if (buildImage !== undefined)
            rpcArgs.buildImage = buildImage;
        if (runtimeImage !== undefined)
            rpcArgs.runtimeImage = runtimeImage;
        const result = await this._client.invokeCapability('Aspire.Hosting/withDockerfileBaseImage', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        const buildImage = options?.buildImage;
        const runtimeImage = options?.runtimeImage;
        return new ContainerRegistryResourcePromise(this._withDockerfileBaseImageInternal(buildImage, runtimeImage));
    }
    /** @internal */
    async _withRequiredCommandInternal(command, helpLink) {
        const rpcArgs = { builder: this._handle, command };
        if (helpLink !== undefined)
            rpcArgs.helpLink = helpLink;
        const result = await this._client.invokeCapability('Aspire.Hosting/withRequiredCommand', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        const helpLink = options?.helpLink;
        return new ContainerRegistryResourcePromise(this._withRequiredCommandInternal(command, helpLink));
    }
    /** @internal */
    async _withUrlsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ResourceUrlsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallback', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ContainerRegistryResourcePromise(this._withUrlsCallbackInternal(callback));
    }
    /** @internal */
    async _withUrlsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceUrlsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallbackAsync', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ContainerRegistryResourcePromise(this._withUrlsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withUrlInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrl', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        const displayText = options?.displayText;
        return new ContainerRegistryResourcePromise(this._withUrlInternal(url, displayText));
    }
    /** @internal */
    async _withUrlExpressionInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlExpression', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        const displayText = options?.displayText;
        return new ContainerRegistryResourcePromise(this._withUrlExpressionInternal(url, displayText));
    }
    /** @internal */
    async _withUrlForEndpointInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const obj = (0, transport_js_1.wrapIfHandle)(objData);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpoint', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ContainerRegistryResourcePromise(this._withUrlForEndpointInternal(endpointName, callback));
    }
    /** @internal */
    async _excludeFromManifestInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromManifest', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ContainerRegistryResourcePromise(this._excludeFromManifestInternal());
    }
    /** @internal */
    async _withExplicitStartInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExplicitStart', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ContainerRegistryResourcePromise(this._withExplicitStartInternal());
    }
    /** @internal */
    async _withHealthCheckInternal(key) {
        const rpcArgs = { builder: this._handle, key };
        const result = await this._client.invokeCapability('Aspire.Hosting/withHealthCheck', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ContainerRegistryResourcePromise(this._withHealthCheckInternal(key));
    }
    /** @internal */
    async _withCommandInternal(name, displayName, executeCommand, commandOptions) {
        const executeCommandId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ExecuteCommandContext(argHandle, this._client);
            return await executeCommand(arg);
        });
        const rpcArgs = { builder: this._handle, name, displayName, executeCommand: executeCommandId };
        if (commandOptions !== undefined)
            rpcArgs.commandOptions = commandOptions;
        const result = await this._client.invokeCapability('Aspire.Hosting/withCommand', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        const commandOptions = options?.commandOptions;
        return new ContainerRegistryResourcePromise(this._withCommandInternal(name, displayName, executeCommand, commandOptions));
    }
    /** @internal */
    async _withRelationshipInternal(resourceBuilder, type) {
        const rpcArgs = { builder: this._handle, resourceBuilder, type };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderRelationship', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ContainerRegistryResourcePromise(this._withRelationshipInternal(resourceBuilder, type));
    }
    /** @internal */
    async _withParentRelationshipInternal(parent) {
        const rpcArgs = { builder: this._handle, parent };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderParentRelationship', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ContainerRegistryResourcePromise(this._withParentRelationshipInternal(parent));
    }
    /** @internal */
    async _withChildRelationshipInternal(child) {
        const rpcArgs = { builder: this._handle, child };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderChildRelationship', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ContainerRegistryResourcePromise(this._withChildRelationshipInternal(child));
    }
    /** @internal */
    async _withIconNameInternal(iconName, iconVariant) {
        const rpcArgs = { builder: this._handle, iconName };
        if (iconVariant !== undefined)
            rpcArgs.iconVariant = iconVariant;
        const result = await this._client.invokeCapability('Aspire.Hosting/withIconName', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        const iconVariant = options?.iconVariant;
        return new ContainerRegistryResourcePromise(this._withIconNameInternal(iconName, iconVariant));
    }
    /** @internal */
    async _excludeFromMcpInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromMcp', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ContainerRegistryResourcePromise(this._excludeFromMcpInternal());
    }
    /** @internal */
    async _withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineStepContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, stepName, callback: callbackId };
        if (dependsOn !== undefined)
            rpcArgs.dependsOn = dependsOn;
        if (requiredBy !== undefined)
            rpcArgs.requiredBy = requiredBy;
        if (tags !== undefined)
            rpcArgs.tags = tags;
        if (description !== undefined)
            rpcArgs.description = description;
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineStepFactory', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        const dependsOn = options?.dependsOn;
        const requiredBy = options?.requiredBy;
        const tags = options?.tags;
        const description = options?.description;
        return new ContainerRegistryResourcePromise(this._withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description));
    }
    /** @internal */
    async _withPipelineConfigurationAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineConfigurationContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfigurationAsync', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ContainerRegistryResourcePromise(this._withPipelineConfigurationAsyncInternal(callback));
    }
    /** @internal */
    async _withPipelineConfigurationInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new PipelineConfigurationContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfiguration', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ContainerRegistryResourcePromise(this._withPipelineConfigurationInternal(callback));
    }
    /** Gets the resource name */
    async getResourceName() {
        const rpcArgs = { resource: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/getResourceName', rpcArgs);
    }
    /** @internal */
    async _onBeforeResourceStartedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new BeforeResourceStartedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onBeforeResourceStarted', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ContainerRegistryResourcePromise(this._onBeforeResourceStartedInternal(callback));
    }
    /** @internal */
    async _onResourceStoppedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceStoppedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceStopped', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ContainerRegistryResourcePromise(this._onResourceStoppedInternal(callback));
    }
    /** @internal */
    async _onInitializeResourceInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new InitializeResourceEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onInitializeResource', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ContainerRegistryResourcePromise(this._onInitializeResourceInternal(callback));
    }
    /** @internal */
    async _onResourceReadyInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceReadyEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceReady', rpcArgs);
        return new ContainerRegistryResource(result, this._client);
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ContainerRegistryResourcePromise(this._onResourceReadyInternal(callback));
    }
}
exports.ContainerRegistryResource = ContainerRegistryResource;
/**
 * Thenable wrapper for ContainerRegistryResource that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class ContainerRegistryResourcePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withContainerRegistry(registry)));
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withDockerfileBaseImage(options)));
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withRequiredCommand(command, options)));
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withUrlsCallback(callback)));
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withUrlsCallbackAsync(callback)));
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withUrl(url, options)));
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withUrlExpression(url, options)));
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withUrlForEndpoint(endpointName, callback)));
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.excludeFromManifest()));
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withExplicitStart()));
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withHealthCheck(key)));
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withCommand(name, displayName, executeCommand, options)));
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withRelationship(resourceBuilder, type)));
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withParentRelationship(parent)));
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withChildRelationship(child)));
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withIconName(iconName, options)));
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.excludeFromMcp()));
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withPipelineStepFactory(stepName, callback, options)));
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withPipelineConfigurationAsync(callback)));
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.withPipelineConfiguration(callback)));
    }
    /** Gets the resource name */
    getResourceName() {
        return this._promise.then(obj => obj.getResourceName());
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.onBeforeResourceStarted(callback)));
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.onResourceStopped(callback)));
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.onInitializeResource(callback)));
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ContainerRegistryResourcePromise(this._promise.then(obj => obj.onResourceReady(callback)));
    }
}
exports.ContainerRegistryResourcePromise = ContainerRegistryResourcePromise;
// ============================================================================
// ContainerResource
// ============================================================================
class ContainerResource extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _withContainerRegistryInternal(registry) {
        const rpcArgs = { builder: this._handle, registry };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerRegistry', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ContainerResourcePromise(this._withContainerRegistryInternal(registry));
    }
    /** @internal */
    async _withBindMountInternal(source, target, isReadOnly) {
        const rpcArgs = { builder: this._handle, source, target };
        if (isReadOnly !== undefined)
            rpcArgs.isReadOnly = isReadOnly;
        const result = await this._client.invokeCapability('Aspire.Hosting/withBindMount', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds a bind mount */
    withBindMount(source, target, options) {
        const isReadOnly = options?.isReadOnly;
        return new ContainerResourcePromise(this._withBindMountInternal(source, target, isReadOnly));
    }
    /** @internal */
    async _withEntrypointInternal(entrypoint) {
        const rpcArgs = { builder: this._handle, entrypoint };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEntrypoint', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets the container entrypoint */
    withEntrypoint(entrypoint) {
        return new ContainerResourcePromise(this._withEntrypointInternal(entrypoint));
    }
    /** @internal */
    async _withImageTagInternal(tag) {
        const rpcArgs = { builder: this._handle, tag };
        const result = await this._client.invokeCapability('Aspire.Hosting/withImageTag', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets the container image tag */
    withImageTag(tag) {
        return new ContainerResourcePromise(this._withImageTagInternal(tag));
    }
    /** @internal */
    async _withImageRegistryInternal(registry) {
        const rpcArgs = { builder: this._handle, registry };
        const result = await this._client.invokeCapability('Aspire.Hosting/withImageRegistry', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets the container image registry */
    withImageRegistry(registry) {
        return new ContainerResourcePromise(this._withImageRegistryInternal(registry));
    }
    /** @internal */
    async _withImageInternal(image, tag) {
        const rpcArgs = { builder: this._handle, image };
        if (tag !== undefined)
            rpcArgs.tag = tag;
        const result = await this._client.invokeCapability('Aspire.Hosting/withImage', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets the container image */
    withImage(image, options) {
        const tag = options?.tag;
        return new ContainerResourcePromise(this._withImageInternal(image, tag));
    }
    /** @internal */
    async _withImageSHA256Internal(sha256) {
        const rpcArgs = { builder: this._handle, sha256 };
        const result = await this._client.invokeCapability('Aspire.Hosting/withImageSHA256', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets the image SHA256 digest */
    withImageSHA256(sha256) {
        return new ContainerResourcePromise(this._withImageSHA256Internal(sha256));
    }
    /** @internal */
    async _withContainerRuntimeArgsInternal(args) {
        const rpcArgs = { builder: this._handle, args };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerRuntimeArgs', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds runtime arguments for the container */
    withContainerRuntimeArgs(args) {
        return new ContainerResourcePromise(this._withContainerRuntimeArgsInternal(args));
    }
    /** @internal */
    async _withLifetimeInternal(lifetime) {
        const rpcArgs = { builder: this._handle, lifetime };
        const result = await this._client.invokeCapability('Aspire.Hosting/withLifetime', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets the lifetime behavior of the container resource */
    withLifetime(lifetime) {
        return new ContainerResourcePromise(this._withLifetimeInternal(lifetime));
    }
    /** @internal */
    async _withImagePullPolicyInternal(pullPolicy) {
        const rpcArgs = { builder: this._handle, pullPolicy };
        const result = await this._client.invokeCapability('Aspire.Hosting/withImagePullPolicy', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets the container image pull policy */
    withImagePullPolicy(pullPolicy) {
        return new ContainerResourcePromise(this._withImagePullPolicyInternal(pullPolicy));
    }
    /** @internal */
    async _publishAsContainerInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/publishAsContainer', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Configures the resource to be published as a container */
    publishAsContainer() {
        return new ContainerResourcePromise(this._publishAsContainerInternal());
    }
    /** @internal */
    async _withDockerfileInternal(contextPath, dockerfilePath, stage) {
        const rpcArgs = { builder: this._handle, contextPath };
        if (dockerfilePath !== undefined)
            rpcArgs.dockerfilePath = dockerfilePath;
        if (stage !== undefined)
            rpcArgs.stage = stage;
        const result = await this._client.invokeCapability('Aspire.Hosting/withDockerfile', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Configures the resource to use a Dockerfile */
    withDockerfile(contextPath, options) {
        const dockerfilePath = options?.dockerfilePath;
        const stage = options?.stage;
        return new ContainerResourcePromise(this._withDockerfileInternal(contextPath, dockerfilePath, stage));
    }
    /** @internal */
    async _withContainerNameInternal(name) {
        const rpcArgs = { builder: this._handle, name };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerName', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets the container name */
    withContainerName(name) {
        return new ContainerResourcePromise(this._withContainerNameInternal(name));
    }
    /** @internal */
    async _withBuildArgInternal(name, value) {
        const rpcArgs = { builder: this._handle, name, value };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuildArg', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds a build argument from a string value or parameter resource */
    withBuildArg(name, value) {
        return new ContainerResourcePromise(this._withBuildArgInternal(name, value));
    }
    /** @internal */
    async _withBuildSecretInternal(name, value) {
        const rpcArgs = { builder: this._handle, name, value };
        const result = await this._client.invokeCapability('Aspire.Hosting/withParameterBuildSecret', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds a build secret from a parameter resource */
    withBuildSecret(name, value) {
        return new ContainerResourcePromise(this._withBuildSecretInternal(name, value));
    }
    /** @internal */
    async _withContainerCertificatePathsInternal(customCertificatesDestination, defaultCertificateBundlePaths, defaultCertificateDirectoryPaths) {
        const rpcArgs = { builder: this._handle };
        if (customCertificatesDestination !== undefined)
            rpcArgs.customCertificatesDestination = customCertificatesDestination;
        if (defaultCertificateBundlePaths !== undefined)
            rpcArgs.defaultCertificateBundlePaths = defaultCertificateBundlePaths;
        if (defaultCertificateDirectoryPaths !== undefined)
            rpcArgs.defaultCertificateDirectoryPaths = defaultCertificateDirectoryPaths;
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerCertificatePaths', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Overrides container certificate bundle and directory paths used for trust configuration */
    withContainerCertificatePaths(options) {
        const customCertificatesDestination = options?.customCertificatesDestination;
        const defaultCertificateBundlePaths = options?.defaultCertificateBundlePaths;
        const defaultCertificateDirectoryPaths = options?.defaultCertificateDirectoryPaths;
        return new ContainerResourcePromise(this._withContainerCertificatePathsInternal(customCertificatesDestination, defaultCertificateBundlePaths, defaultCertificateDirectoryPaths));
    }
    /** @internal */
    async _withEndpointProxySupportInternal(proxyEnabled) {
        const rpcArgs = { builder: this._handle, proxyEnabled };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEndpointProxySupport', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Configures endpoint proxy support */
    withEndpointProxySupport(proxyEnabled) {
        return new ContainerResourcePromise(this._withEndpointProxySupportInternal(proxyEnabled));
    }
    /** @internal */
    async _withDockerfileBaseImageInternal(buildImage, runtimeImage) {
        const rpcArgs = { builder: this._handle };
        if (buildImage !== undefined)
            rpcArgs.buildImage = buildImage;
        if (runtimeImage !== undefined)
            rpcArgs.runtimeImage = runtimeImage;
        const result = await this._client.invokeCapability('Aspire.Hosting/withDockerfileBaseImage', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        const buildImage = options?.buildImage;
        const runtimeImage = options?.runtimeImage;
        return new ContainerResourcePromise(this._withDockerfileBaseImageInternal(buildImage, runtimeImage));
    }
    /** @internal */
    async _withContainerNetworkAliasInternal(alias) {
        const rpcArgs = { builder: this._handle, alias };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerNetworkAlias', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds a network alias for the container */
    withContainerNetworkAlias(alias) {
        return new ContainerResourcePromise(this._withContainerNetworkAliasInternal(alias));
    }
    /** @internal */
    async _withMcpServerInternal(path, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withMcpServer', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        const path = options?.path;
        const endpointName = options?.endpointName;
        return new ContainerResourcePromise(this._withMcpServerInternal(path, endpointName));
    }
    /** @internal */
    async _withOtlpExporterInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporter', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new ContainerResourcePromise(this._withOtlpExporterInternal());
    }
    /** @internal */
    async _withOtlpExporterProtocolInternal(protocol) {
        const rpcArgs = { builder: this._handle, protocol };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporterProtocol', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new ContainerResourcePromise(this._withOtlpExporterProtocolInternal(protocol));
    }
    /** @internal */
    async _publishAsConnectionStringInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/publishAsConnectionString', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Publishes the resource as a connection string */
    publishAsConnectionString() {
        return new ContainerResourcePromise(this._publishAsConnectionStringInternal());
    }
    /** @internal */
    async _withRequiredCommandInternal(command, helpLink) {
        const rpcArgs = { builder: this._handle, command };
        if (helpLink !== undefined)
            rpcArgs.helpLink = helpLink;
        const result = await this._client.invokeCapability('Aspire.Hosting/withRequiredCommand', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        const helpLink = options?.helpLink;
        return new ContainerResourcePromise(this._withRequiredCommandInternal(command, helpLink));
    }
    /** @internal */
    async _withEnvironmentCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EnvironmentCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentCallback', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new ContainerResourcePromise(this._withEnvironmentCallbackInternal(callback));
    }
    /** @internal */
    async _withEnvironmentEndpointInternal(name, endpointReference) {
        const rpcArgs = { builder: this._handle, name, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentEndpoint', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new ContainerResourcePromise(this._withEnvironmentEndpointInternal(name, endpointReference));
    }
    /** @internal */
    async _withEnvironmentInternal(name, value) {
        const rpcArgs = { builder: this._handle, name, value };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironment', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new ContainerResourcePromise(this._withEnvironmentInternal(name, value));
    }
    /** @internal */
    async _withEnvironmentParameterInternal(name, parameter) {
        const rpcArgs = { builder: this._handle, name, parameter };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentParameter', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new ContainerResourcePromise(this._withEnvironmentParameterInternal(name, parameter));
    }
    /** @internal */
    async _withEnvironmentConnectionStringInternal(envVarName, resource) {
        const rpcArgs = { builder: this._handle, envVarName, resource };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentConnectionString', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new ContainerResourcePromise(this._withEnvironmentConnectionStringInternal(envVarName, resource));
    }
    /** @internal */
    async _withArgsInternal(args) {
        const rpcArgs = { builder: this._handle, args };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgs', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds arguments */
    withArgs(args) {
        return new ContainerResourcePromise(this._withArgsInternal(args));
    }
    /** @internal */
    async _withArgsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new CommandLineArgsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallback', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new ContainerResourcePromise(this._withArgsCallbackInternal(callback));
    }
    /** @internal */
    async _withArgsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new CommandLineArgsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallbackAsync', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new ContainerResourcePromise(this._withArgsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withReferenceEnvironmentInternal(options) {
        const rpcArgs = { builder: this._handle, options };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEnvironment', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new ContainerResourcePromise(this._withReferenceEnvironmentInternal(options));
    }
    /** @internal */
    async _withReferenceInternal(source, connectionName, optional, name) {
        const rpcArgs = { builder: this._handle, source };
        if (connectionName !== undefined)
            rpcArgs.connectionName = connectionName;
        if (optional !== undefined)
            rpcArgs.optional = optional;
        if (name !== undefined)
            rpcArgs.name = name;
        const result = await this._client.invokeCapability('Aspire.Hosting/withReference', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        const connectionName = options?.connectionName;
        const optional = options?.optional;
        const name = options?.name;
        return new ContainerResourcePromise(this._withReferenceInternal(source, connectionName, optional, name));
    }
    /** @internal */
    async _withReferenceUriInternal(name, uri) {
        const rpcArgs = { builder: this._handle, name, uri };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceUri', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new ContainerResourcePromise(this._withReferenceUriInternal(name, uri));
    }
    /** @internal */
    async _withReferenceExternalServiceInternal(externalService) {
        const rpcArgs = { builder: this._handle, externalService };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceExternalService', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new ContainerResourcePromise(this._withReferenceExternalServiceInternal(externalService));
    }
    /** @internal */
    async _withReferenceEndpointInternal(endpointReference) {
        const rpcArgs = { builder: this._handle, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEndpoint', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new ContainerResourcePromise(this._withReferenceEndpointInternal(endpointReference));
    }
    /** @internal */
    async _withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (scheme !== undefined)
            rpcArgs.scheme = scheme;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        if (isExternal !== undefined)
            rpcArgs.isExternal = isExternal;
        if (protocol !== undefined)
            rpcArgs.protocol = protocol;
        const result = await this._client.invokeCapability('Aspire.Hosting/withEndpoint', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const scheme = options?.scheme;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        const isExternal = options?.isExternal;
        const protocol = options?.protocol;
        return new ContainerResourcePromise(this._withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol));
    }
    /** @internal */
    async _withHttpEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpEndpoint', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new ContainerResourcePromise(this._withHttpEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withHttpsEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpsEndpoint', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new ContainerResourcePromise(this._withHttpsEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withExternalHttpEndpointsInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExternalHttpEndpoints', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new ContainerResourcePromise(this._withExternalHttpEndpointsInternal());
    }
    /** Gets an endpoint reference */
    async getEndpoint(name) {
        const rpcArgs = { builder: this._handle, name };
        return await this._client.invokeCapability('Aspire.Hosting/getEndpoint', rpcArgs);
    }
    /** @internal */
    async _asHttp2ServiceInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/asHttp2Service', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new ContainerResourcePromise(this._asHttp2ServiceInternal());
    }
    /** @internal */
    async _withUrlsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ResourceUrlsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallback', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ContainerResourcePromise(this._withUrlsCallbackInternal(callback));
    }
    /** @internal */
    async _withUrlsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceUrlsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallbackAsync', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ContainerResourcePromise(this._withUrlsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withUrlInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrl', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        const displayText = options?.displayText;
        return new ContainerResourcePromise(this._withUrlInternal(url, displayText));
    }
    /** @internal */
    async _withUrlExpressionInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlExpression', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        const displayText = options?.displayText;
        return new ContainerResourcePromise(this._withUrlExpressionInternal(url, displayText));
    }
    /** @internal */
    async _withUrlForEndpointInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const obj = (0, transport_js_1.wrapIfHandle)(objData);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpoint', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ContainerResourcePromise(this._withUrlForEndpointInternal(endpointName, callback));
    }
    /** @internal */
    async _withUrlForEndpointFactoryInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EndpointReference(argHandle, this._client);
            return await callback(arg);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpointFactory', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new ContainerResourcePromise(this._withUrlForEndpointFactoryInternal(endpointName, callback));
    }
    /** @internal */
    async _excludeFromManifestInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromManifest', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ContainerResourcePromise(this._excludeFromManifestInternal());
    }
    /** @internal */
    async _waitForInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResource', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new ContainerResourcePromise(this._waitForInternal(dependency));
    }
    /** @internal */
    async _waitForWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForWithBehavior', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new ContainerResourcePromise(this._waitForWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _waitForStartInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceStart', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new ContainerResourcePromise(this._waitForStartInternal(dependency));
    }
    /** @internal */
    async _waitForStartWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForStartWithBehavior', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new ContainerResourcePromise(this._waitForStartWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _withExplicitStartInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExplicitStart', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ContainerResourcePromise(this._withExplicitStartInternal());
    }
    /** @internal */
    async _waitForCompletionInternal(dependency, exitCode) {
        const rpcArgs = { builder: this._handle, dependency };
        if (exitCode !== undefined)
            rpcArgs.exitCode = exitCode;
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceCompletion', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        const exitCode = options?.exitCode;
        return new ContainerResourcePromise(this._waitForCompletionInternal(dependency, exitCode));
    }
    /** @internal */
    async _withHealthCheckInternal(key) {
        const rpcArgs = { builder: this._handle, key };
        const result = await this._client.invokeCapability('Aspire.Hosting/withHealthCheck', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ContainerResourcePromise(this._withHealthCheckInternal(key));
    }
    /** @internal */
    async _withHttpHealthCheckInternal(path, statusCode, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (statusCode !== undefined)
            rpcArgs.statusCode = statusCode;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpHealthCheck', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        const path = options?.path;
        const statusCode = options?.statusCode;
        const endpointName = options?.endpointName;
        return new ContainerResourcePromise(this._withHttpHealthCheckInternal(path, statusCode, endpointName));
    }
    /** @internal */
    async _withCommandInternal(name, displayName, executeCommand, commandOptions) {
        const executeCommandId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ExecuteCommandContext(argHandle, this._client);
            return await executeCommand(arg);
        });
        const rpcArgs = { builder: this._handle, name, displayName, executeCommand: executeCommandId };
        if (commandOptions !== undefined)
            rpcArgs.commandOptions = commandOptions;
        const result = await this._client.invokeCapability('Aspire.Hosting/withCommand', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        const commandOptions = options?.commandOptions;
        return new ContainerResourcePromise(this._withCommandInternal(name, displayName, executeCommand, commandOptions));
    }
    /** @internal */
    async _withDeveloperCertificateTrustInternal(trust) {
        const rpcArgs = { builder: this._handle, trust };
        const result = await this._client.invokeCapability('Aspire.Hosting/withDeveloperCertificateTrust', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new ContainerResourcePromise(this._withDeveloperCertificateTrustInternal(trust));
    }
    /** @internal */
    async _withCertificateTrustScopeInternal(scope) {
        const rpcArgs = { builder: this._handle, scope };
        const result = await this._client.invokeCapability('Aspire.Hosting/withCertificateTrustScope', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new ContainerResourcePromise(this._withCertificateTrustScopeInternal(scope));
    }
    /** @internal */
    async _withHttpsDeveloperCertificateInternal(password) {
        const rpcArgs = { builder: this._handle };
        if (password !== undefined)
            rpcArgs.password = password;
        const result = await this._client.invokeCapability('Aspire.Hosting/withParameterHttpsDeveloperCertificate', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        const password = options?.password;
        return new ContainerResourcePromise(this._withHttpsDeveloperCertificateInternal(password));
    }
    /** @internal */
    async _withoutHttpsCertificateInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withoutHttpsCertificate', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new ContainerResourcePromise(this._withoutHttpsCertificateInternal());
    }
    /** @internal */
    async _withRelationshipInternal(resourceBuilder, type) {
        const rpcArgs = { builder: this._handle, resourceBuilder, type };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderRelationship', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ContainerResourcePromise(this._withRelationshipInternal(resourceBuilder, type));
    }
    /** @internal */
    async _withParentRelationshipInternal(parent) {
        const rpcArgs = { builder: this._handle, parent };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderParentRelationship', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ContainerResourcePromise(this._withParentRelationshipInternal(parent));
    }
    /** @internal */
    async _withChildRelationshipInternal(child) {
        const rpcArgs = { builder: this._handle, child };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderChildRelationship', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ContainerResourcePromise(this._withChildRelationshipInternal(child));
    }
    /** @internal */
    async _withIconNameInternal(iconName, iconVariant) {
        const rpcArgs = { builder: this._handle, iconName };
        if (iconVariant !== undefined)
            rpcArgs.iconVariant = iconVariant;
        const result = await this._client.invokeCapability('Aspire.Hosting/withIconName', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        const iconVariant = options?.iconVariant;
        return new ContainerResourcePromise(this._withIconNameInternal(iconName, iconVariant));
    }
    /** @internal */
    async _withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName) {
        const rpcArgs = { builder: this._handle, probeType };
        if (path !== undefined)
            rpcArgs.path = path;
        if (initialDelaySeconds !== undefined)
            rpcArgs.initialDelaySeconds = initialDelaySeconds;
        if (periodSeconds !== undefined)
            rpcArgs.periodSeconds = periodSeconds;
        if (timeoutSeconds !== undefined)
            rpcArgs.timeoutSeconds = timeoutSeconds;
        if (failureThreshold !== undefined)
            rpcArgs.failureThreshold = failureThreshold;
        if (successThreshold !== undefined)
            rpcArgs.successThreshold = successThreshold;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpProbe', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        const path = options?.path;
        const initialDelaySeconds = options?.initialDelaySeconds;
        const periodSeconds = options?.periodSeconds;
        const timeoutSeconds = options?.timeoutSeconds;
        const failureThreshold = options?.failureThreshold;
        const successThreshold = options?.successThreshold;
        const endpointName = options?.endpointName;
        return new ContainerResourcePromise(this._withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName));
    }
    /** @internal */
    async _excludeFromMcpInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromMcp', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ContainerResourcePromise(this._excludeFromMcpInternal());
    }
    /** @internal */
    async _withRemoteImageNameInternal(remoteImageName) {
        const rpcArgs = { builder: this._handle, remoteImageName };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageName', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new ContainerResourcePromise(this._withRemoteImageNameInternal(remoteImageName));
    }
    /** @internal */
    async _withRemoteImageTagInternal(remoteImageTag) {
        const rpcArgs = { builder: this._handle, remoteImageTag };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageTag', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new ContainerResourcePromise(this._withRemoteImageTagInternal(remoteImageTag));
    }
    /** @internal */
    async _withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineStepContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, stepName, callback: callbackId };
        if (dependsOn !== undefined)
            rpcArgs.dependsOn = dependsOn;
        if (requiredBy !== undefined)
            rpcArgs.requiredBy = requiredBy;
        if (tags !== undefined)
            rpcArgs.tags = tags;
        if (description !== undefined)
            rpcArgs.description = description;
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineStepFactory', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        const dependsOn = options?.dependsOn;
        const requiredBy = options?.requiredBy;
        const tags = options?.tags;
        const description = options?.description;
        return new ContainerResourcePromise(this._withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description));
    }
    /** @internal */
    async _withPipelineConfigurationAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineConfigurationContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfigurationAsync', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ContainerResourcePromise(this._withPipelineConfigurationAsyncInternal(callback));
    }
    /** @internal */
    async _withPipelineConfigurationInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new PipelineConfigurationContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfiguration', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ContainerResourcePromise(this._withPipelineConfigurationInternal(callback));
    }
    /** @internal */
    async _withVolumeInternal(target, name, isReadOnly) {
        const rpcArgs = { resource: this._handle, target };
        if (name !== undefined)
            rpcArgs.name = name;
        if (isReadOnly !== undefined)
            rpcArgs.isReadOnly = isReadOnly;
        const result = await this._client.invokeCapability('Aspire.Hosting/withVolume', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Adds a volume */
    withVolume(target, options) {
        const name = options?.name;
        const isReadOnly = options?.isReadOnly;
        return new ContainerResourcePromise(this._withVolumeInternal(target, name, isReadOnly));
    }
    /** Gets the resource name */
    async getResourceName() {
        const rpcArgs = { resource: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/getResourceName', rpcArgs);
    }
    /** @internal */
    async _onBeforeResourceStartedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new BeforeResourceStartedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onBeforeResourceStarted', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ContainerResourcePromise(this._onBeforeResourceStartedInternal(callback));
    }
    /** @internal */
    async _onResourceStoppedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceStoppedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceStopped', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ContainerResourcePromise(this._onResourceStoppedInternal(callback));
    }
    /** @internal */
    async _onInitializeResourceInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new InitializeResourceEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onInitializeResource', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ContainerResourcePromise(this._onInitializeResourceInternal(callback));
    }
    /** @internal */
    async _onResourceEndpointsAllocatedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceEndpointsAllocatedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceEndpointsAllocated', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new ContainerResourcePromise(this._onResourceEndpointsAllocatedInternal(callback));
    }
    /** @internal */
    async _onResourceReadyInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceReadyEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceReady', rpcArgs);
        return new ContainerResource(result, this._client);
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ContainerResourcePromise(this._onResourceReadyInternal(callback));
    }
}
exports.ContainerResource = ContainerResource;
/**
 * Thenable wrapper for ContainerResource that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class ContainerResourcePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withContainerRegistry(registry)));
    }
    /** Adds a bind mount */
    withBindMount(source, target, options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withBindMount(source, target, options)));
    }
    /** Sets the container entrypoint */
    withEntrypoint(entrypoint) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withEntrypoint(entrypoint)));
    }
    /** Sets the container image tag */
    withImageTag(tag) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withImageTag(tag)));
    }
    /** Sets the container image registry */
    withImageRegistry(registry) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withImageRegistry(registry)));
    }
    /** Sets the container image */
    withImage(image, options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withImage(image, options)));
    }
    /** Sets the image SHA256 digest */
    withImageSHA256(sha256) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withImageSHA256(sha256)));
    }
    /** Adds runtime arguments for the container */
    withContainerRuntimeArgs(args) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withContainerRuntimeArgs(args)));
    }
    /** Sets the lifetime behavior of the container resource */
    withLifetime(lifetime) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withLifetime(lifetime)));
    }
    /** Sets the container image pull policy */
    withImagePullPolicy(pullPolicy) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withImagePullPolicy(pullPolicy)));
    }
    /** Configures the resource to be published as a container */
    publishAsContainer() {
        return new ContainerResourcePromise(this._promise.then(obj => obj.publishAsContainer()));
    }
    /** Configures the resource to use a Dockerfile */
    withDockerfile(contextPath, options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withDockerfile(contextPath, options)));
    }
    /** Sets the container name */
    withContainerName(name) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withContainerName(name)));
    }
    /** Adds a build argument from a string value or parameter resource */
    withBuildArg(name, value) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withBuildArg(name, value)));
    }
    /** Adds a build secret from a parameter resource */
    withBuildSecret(name, value) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withBuildSecret(name, value)));
    }
    /** Overrides container certificate bundle and directory paths used for trust configuration */
    withContainerCertificatePaths(options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withContainerCertificatePaths(options)));
    }
    /** Configures endpoint proxy support */
    withEndpointProxySupport(proxyEnabled) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withEndpointProxySupport(proxyEnabled)));
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withDockerfileBaseImage(options)));
    }
    /** Adds a network alias for the container */
    withContainerNetworkAlias(alias) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withContainerNetworkAlias(alias)));
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withMcpServer(options)));
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withOtlpExporter()));
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withOtlpExporterProtocol(protocol)));
    }
    /** Publishes the resource as a connection string */
    publishAsConnectionString() {
        return new ContainerResourcePromise(this._promise.then(obj => obj.publishAsConnectionString()));
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withRequiredCommand(command, options)));
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withEnvironmentCallback(callback)));
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withEnvironmentEndpoint(name, endpointReference)));
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withEnvironment(name, value)));
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withEnvironmentParameter(name, parameter)));
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withEnvironmentConnectionString(envVarName, resource)));
    }
    /** Adds arguments */
    withArgs(args) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withArgs(args)));
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withArgsCallback(callback)));
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withArgsCallbackAsync(callback)));
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withReferenceEnvironment(options)));
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withReference(source, options)));
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withReferenceUri(name, uri)));
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withReferenceExternalService(externalService)));
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withReferenceEndpoint(endpointReference)));
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withEndpoint(options)));
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withHttpEndpoint(options)));
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withHttpsEndpoint(options)));
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withExternalHttpEndpoints()));
    }
    /** Gets an endpoint reference */
    getEndpoint(name) {
        return this._promise.then(obj => obj.getEndpoint(name));
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new ContainerResourcePromise(this._promise.then(obj => obj.asHttp2Service()));
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withUrlsCallback(callback)));
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withUrlsCallbackAsync(callback)));
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withUrl(url, options)));
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withUrlExpression(url, options)));
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withUrlForEndpoint(endpointName, callback)));
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withUrlForEndpointFactory(endpointName, callback)));
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ContainerResourcePromise(this._promise.then(obj => obj.excludeFromManifest()));
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.waitFor(dependency)));
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.waitForWithBehavior(dependency, waitBehavior)));
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.waitForStart(dependency)));
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.waitForStartWithBehavior(dependency, waitBehavior)));
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withExplicitStart()));
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.waitForCompletion(dependency, options)));
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withHealthCheck(key)));
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withHttpHealthCheck(options)));
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withCommand(name, displayName, executeCommand, options)));
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withDeveloperCertificateTrust(trust)));
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withCertificateTrustScope(scope)));
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withHttpsDeveloperCertificate(options)));
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withoutHttpsCertificate()));
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withRelationship(resourceBuilder, type)));
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withParentRelationship(parent)));
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withChildRelationship(child)));
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withIconName(iconName, options)));
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withHttpProbe(probeType, options)));
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ContainerResourcePromise(this._promise.then(obj => obj.excludeFromMcp()));
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withRemoteImageName(remoteImageName)));
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withRemoteImageTag(remoteImageTag)));
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withPipelineStepFactory(stepName, callback, options)));
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withPipelineConfigurationAsync(callback)));
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withPipelineConfiguration(callback)));
    }
    /** Adds a volume */
    withVolume(target, options) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.withVolume(target, options)));
    }
    /** Gets the resource name */
    getResourceName() {
        return this._promise.then(obj => obj.getResourceName());
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.onBeforeResourceStarted(callback)));
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.onResourceStopped(callback)));
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.onInitializeResource(callback)));
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.onResourceEndpointsAllocated(callback)));
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ContainerResourcePromise(this._promise.then(obj => obj.onResourceReady(callback)));
    }
}
exports.ContainerResourcePromise = ContainerResourcePromise;
// ============================================================================
// CSharpAppResource
// ============================================================================
class CSharpAppResource extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _withContainerRegistryInternal(registry) {
        const rpcArgs = { builder: this._handle, registry };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerRegistry', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new CSharpAppResourcePromise(this._withContainerRegistryInternal(registry));
    }
    /** @internal */
    async _withDockerfileBaseImageInternal(buildImage, runtimeImage) {
        const rpcArgs = { builder: this._handle };
        if (buildImage !== undefined)
            rpcArgs.buildImage = buildImage;
        if (runtimeImage !== undefined)
            rpcArgs.runtimeImage = runtimeImage;
        const result = await this._client.invokeCapability('Aspire.Hosting/withDockerfileBaseImage', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        const buildImage = options?.buildImage;
        const runtimeImage = options?.runtimeImage;
        return new CSharpAppResourcePromise(this._withDockerfileBaseImageInternal(buildImage, runtimeImage));
    }
    /** @internal */
    async _withMcpServerInternal(path, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withMcpServer', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        const path = options?.path;
        const endpointName = options?.endpointName;
        return new CSharpAppResourcePromise(this._withMcpServerInternal(path, endpointName));
    }
    /** @internal */
    async _withOtlpExporterInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporter', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new CSharpAppResourcePromise(this._withOtlpExporterInternal());
    }
    /** @internal */
    async _withOtlpExporterProtocolInternal(protocol) {
        const rpcArgs = { builder: this._handle, protocol };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporterProtocol', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new CSharpAppResourcePromise(this._withOtlpExporterProtocolInternal(protocol));
    }
    /** @internal */
    async _withReplicasInternal(replicas) {
        const rpcArgs = { builder: this._handle, replicas };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReplicas', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Sets the number of replicas */
    withReplicas(replicas) {
        return new CSharpAppResourcePromise(this._withReplicasInternal(replicas));
    }
    /** @internal */
    async _disableForwardedHeadersInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/disableForwardedHeaders', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Disables forwarded headers for the project */
    disableForwardedHeaders() {
        return new CSharpAppResourcePromise(this._disableForwardedHeadersInternal());
    }
    /** @internal */
    async _publishAsDockerFileInternal(configure) {
        const configureId = configure ? (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ContainerResource(objHandle, this._client);
            await configure(obj);
        }) : undefined;
        const rpcArgs = { builder: this._handle };
        if (configure !== undefined)
            rpcArgs.configure = configureId;
        const result = await this._client.invokeCapability('Aspire.Hosting/publishProjectAsDockerFileWithConfigure', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Publishes a project as a Docker file with optional container configuration */
    publishAsDockerFile(options) {
        const configure = options?.configure;
        return new CSharpAppResourcePromise(this._publishAsDockerFileInternal(configure));
    }
    /** @internal */
    async _withRequiredCommandInternal(command, helpLink) {
        const rpcArgs = { builder: this._handle, command };
        if (helpLink !== undefined)
            rpcArgs.helpLink = helpLink;
        const result = await this._client.invokeCapability('Aspire.Hosting/withRequiredCommand', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        const helpLink = options?.helpLink;
        return new CSharpAppResourcePromise(this._withRequiredCommandInternal(command, helpLink));
    }
    /** @internal */
    async _withEnvironmentCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EnvironmentCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentCallback', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new CSharpAppResourcePromise(this._withEnvironmentCallbackInternal(callback));
    }
    /** @internal */
    async _withEnvironmentEndpointInternal(name, endpointReference) {
        const rpcArgs = { builder: this._handle, name, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentEndpoint', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new CSharpAppResourcePromise(this._withEnvironmentEndpointInternal(name, endpointReference));
    }
    /** @internal */
    async _withEnvironmentInternal(name, value) {
        const rpcArgs = { builder: this._handle, name, value };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironment', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new CSharpAppResourcePromise(this._withEnvironmentInternal(name, value));
    }
    /** @internal */
    async _withEnvironmentParameterInternal(name, parameter) {
        const rpcArgs = { builder: this._handle, name, parameter };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentParameter', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new CSharpAppResourcePromise(this._withEnvironmentParameterInternal(name, parameter));
    }
    /** @internal */
    async _withEnvironmentConnectionStringInternal(envVarName, resource) {
        const rpcArgs = { builder: this._handle, envVarName, resource };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentConnectionString', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new CSharpAppResourcePromise(this._withEnvironmentConnectionStringInternal(envVarName, resource));
    }
    /** @internal */
    async _withArgsInternal(args) {
        const rpcArgs = { builder: this._handle, args };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgs', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds arguments */
    withArgs(args) {
        return new CSharpAppResourcePromise(this._withArgsInternal(args));
    }
    /** @internal */
    async _withArgsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new CommandLineArgsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallback', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new CSharpAppResourcePromise(this._withArgsCallbackInternal(callback));
    }
    /** @internal */
    async _withArgsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new CommandLineArgsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallbackAsync', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new CSharpAppResourcePromise(this._withArgsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withReferenceEnvironmentInternal(options) {
        const rpcArgs = { builder: this._handle, options };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEnvironment', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new CSharpAppResourcePromise(this._withReferenceEnvironmentInternal(options));
    }
    /** @internal */
    async _withReferenceInternal(source, connectionName, optional, name) {
        const rpcArgs = { builder: this._handle, source };
        if (connectionName !== undefined)
            rpcArgs.connectionName = connectionName;
        if (optional !== undefined)
            rpcArgs.optional = optional;
        if (name !== undefined)
            rpcArgs.name = name;
        const result = await this._client.invokeCapability('Aspire.Hosting/withReference', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        const connectionName = options?.connectionName;
        const optional = options?.optional;
        const name = options?.name;
        return new CSharpAppResourcePromise(this._withReferenceInternal(source, connectionName, optional, name));
    }
    /** @internal */
    async _withReferenceUriInternal(name, uri) {
        const rpcArgs = { builder: this._handle, name, uri };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceUri', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new CSharpAppResourcePromise(this._withReferenceUriInternal(name, uri));
    }
    /** @internal */
    async _withReferenceExternalServiceInternal(externalService) {
        const rpcArgs = { builder: this._handle, externalService };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceExternalService', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new CSharpAppResourcePromise(this._withReferenceExternalServiceInternal(externalService));
    }
    /** @internal */
    async _withReferenceEndpointInternal(endpointReference) {
        const rpcArgs = { builder: this._handle, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEndpoint', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new CSharpAppResourcePromise(this._withReferenceEndpointInternal(endpointReference));
    }
    /** @internal */
    async _withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (scheme !== undefined)
            rpcArgs.scheme = scheme;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        if (isExternal !== undefined)
            rpcArgs.isExternal = isExternal;
        if (protocol !== undefined)
            rpcArgs.protocol = protocol;
        const result = await this._client.invokeCapability('Aspire.Hosting/withEndpoint', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const scheme = options?.scheme;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        const isExternal = options?.isExternal;
        const protocol = options?.protocol;
        return new CSharpAppResourcePromise(this._withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol));
    }
    /** @internal */
    async _withHttpEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpEndpoint', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new CSharpAppResourcePromise(this._withHttpEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withHttpsEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpsEndpoint', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new CSharpAppResourcePromise(this._withHttpsEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withExternalHttpEndpointsInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExternalHttpEndpoints', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new CSharpAppResourcePromise(this._withExternalHttpEndpointsInternal());
    }
    /** Gets an endpoint reference */
    async getEndpoint(name) {
        const rpcArgs = { builder: this._handle, name };
        return await this._client.invokeCapability('Aspire.Hosting/getEndpoint', rpcArgs);
    }
    /** @internal */
    async _asHttp2ServiceInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/asHttp2Service', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new CSharpAppResourcePromise(this._asHttp2ServiceInternal());
    }
    /** @internal */
    async _withUrlsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ResourceUrlsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallback', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new CSharpAppResourcePromise(this._withUrlsCallbackInternal(callback));
    }
    /** @internal */
    async _withUrlsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceUrlsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallbackAsync', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new CSharpAppResourcePromise(this._withUrlsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withUrlInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrl', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        const displayText = options?.displayText;
        return new CSharpAppResourcePromise(this._withUrlInternal(url, displayText));
    }
    /** @internal */
    async _withUrlExpressionInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlExpression', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        const displayText = options?.displayText;
        return new CSharpAppResourcePromise(this._withUrlExpressionInternal(url, displayText));
    }
    /** @internal */
    async _withUrlForEndpointInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const obj = (0, transport_js_1.wrapIfHandle)(objData);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpoint', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new CSharpAppResourcePromise(this._withUrlForEndpointInternal(endpointName, callback));
    }
    /** @internal */
    async _withUrlForEndpointFactoryInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EndpointReference(argHandle, this._client);
            return await callback(arg);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpointFactory', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new CSharpAppResourcePromise(this._withUrlForEndpointFactoryInternal(endpointName, callback));
    }
    /** @internal */
    async _publishWithContainerFilesInternal(source, destinationPath) {
        const rpcArgs = { builder: this._handle, source, destinationPath };
        const result = await this._client.invokeCapability('Aspire.Hosting/publishWithContainerFilesFromResource', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Configures the resource to copy container files from the specified source during publishing */
    publishWithContainerFiles(source, destinationPath) {
        return new CSharpAppResourcePromise(this._publishWithContainerFilesInternal(source, destinationPath));
    }
    /** @internal */
    async _excludeFromManifestInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromManifest', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new CSharpAppResourcePromise(this._excludeFromManifestInternal());
    }
    /** @internal */
    async _waitForInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResource', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new CSharpAppResourcePromise(this._waitForInternal(dependency));
    }
    /** @internal */
    async _waitForWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForWithBehavior', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new CSharpAppResourcePromise(this._waitForWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _waitForStartInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceStart', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new CSharpAppResourcePromise(this._waitForStartInternal(dependency));
    }
    /** @internal */
    async _waitForStartWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForStartWithBehavior', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new CSharpAppResourcePromise(this._waitForStartWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _withExplicitStartInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExplicitStart', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new CSharpAppResourcePromise(this._withExplicitStartInternal());
    }
    /** @internal */
    async _waitForCompletionInternal(dependency, exitCode) {
        const rpcArgs = { builder: this._handle, dependency };
        if (exitCode !== undefined)
            rpcArgs.exitCode = exitCode;
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceCompletion', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        const exitCode = options?.exitCode;
        return new CSharpAppResourcePromise(this._waitForCompletionInternal(dependency, exitCode));
    }
    /** @internal */
    async _withHealthCheckInternal(key) {
        const rpcArgs = { builder: this._handle, key };
        const result = await this._client.invokeCapability('Aspire.Hosting/withHealthCheck', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new CSharpAppResourcePromise(this._withHealthCheckInternal(key));
    }
    /** @internal */
    async _withHttpHealthCheckInternal(path, statusCode, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (statusCode !== undefined)
            rpcArgs.statusCode = statusCode;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpHealthCheck', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        const path = options?.path;
        const statusCode = options?.statusCode;
        const endpointName = options?.endpointName;
        return new CSharpAppResourcePromise(this._withHttpHealthCheckInternal(path, statusCode, endpointName));
    }
    /** @internal */
    async _withCommandInternal(name, displayName, executeCommand, commandOptions) {
        const executeCommandId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ExecuteCommandContext(argHandle, this._client);
            return await executeCommand(arg);
        });
        const rpcArgs = { builder: this._handle, name, displayName, executeCommand: executeCommandId };
        if (commandOptions !== undefined)
            rpcArgs.commandOptions = commandOptions;
        const result = await this._client.invokeCapability('Aspire.Hosting/withCommand', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        const commandOptions = options?.commandOptions;
        return new CSharpAppResourcePromise(this._withCommandInternal(name, displayName, executeCommand, commandOptions));
    }
    /** @internal */
    async _withDeveloperCertificateTrustInternal(trust) {
        const rpcArgs = { builder: this._handle, trust };
        const result = await this._client.invokeCapability('Aspire.Hosting/withDeveloperCertificateTrust', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new CSharpAppResourcePromise(this._withDeveloperCertificateTrustInternal(trust));
    }
    /** @internal */
    async _withCertificateTrustScopeInternal(scope) {
        const rpcArgs = { builder: this._handle, scope };
        const result = await this._client.invokeCapability('Aspire.Hosting/withCertificateTrustScope', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new CSharpAppResourcePromise(this._withCertificateTrustScopeInternal(scope));
    }
    /** @internal */
    async _withHttpsDeveloperCertificateInternal(password) {
        const rpcArgs = { builder: this._handle };
        if (password !== undefined)
            rpcArgs.password = password;
        const result = await this._client.invokeCapability('Aspire.Hosting/withParameterHttpsDeveloperCertificate', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        const password = options?.password;
        return new CSharpAppResourcePromise(this._withHttpsDeveloperCertificateInternal(password));
    }
    /** @internal */
    async _withoutHttpsCertificateInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withoutHttpsCertificate', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new CSharpAppResourcePromise(this._withoutHttpsCertificateInternal());
    }
    /** @internal */
    async _withRelationshipInternal(resourceBuilder, type) {
        const rpcArgs = { builder: this._handle, resourceBuilder, type };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderRelationship', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new CSharpAppResourcePromise(this._withRelationshipInternal(resourceBuilder, type));
    }
    /** @internal */
    async _withParentRelationshipInternal(parent) {
        const rpcArgs = { builder: this._handle, parent };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderParentRelationship', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new CSharpAppResourcePromise(this._withParentRelationshipInternal(parent));
    }
    /** @internal */
    async _withChildRelationshipInternal(child) {
        const rpcArgs = { builder: this._handle, child };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderChildRelationship', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new CSharpAppResourcePromise(this._withChildRelationshipInternal(child));
    }
    /** @internal */
    async _withIconNameInternal(iconName, iconVariant) {
        const rpcArgs = { builder: this._handle, iconName };
        if (iconVariant !== undefined)
            rpcArgs.iconVariant = iconVariant;
        const result = await this._client.invokeCapability('Aspire.Hosting/withIconName', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        const iconVariant = options?.iconVariant;
        return new CSharpAppResourcePromise(this._withIconNameInternal(iconName, iconVariant));
    }
    /** @internal */
    async _withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName) {
        const rpcArgs = { builder: this._handle, probeType };
        if (path !== undefined)
            rpcArgs.path = path;
        if (initialDelaySeconds !== undefined)
            rpcArgs.initialDelaySeconds = initialDelaySeconds;
        if (periodSeconds !== undefined)
            rpcArgs.periodSeconds = periodSeconds;
        if (timeoutSeconds !== undefined)
            rpcArgs.timeoutSeconds = timeoutSeconds;
        if (failureThreshold !== undefined)
            rpcArgs.failureThreshold = failureThreshold;
        if (successThreshold !== undefined)
            rpcArgs.successThreshold = successThreshold;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpProbe', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        const path = options?.path;
        const initialDelaySeconds = options?.initialDelaySeconds;
        const periodSeconds = options?.periodSeconds;
        const timeoutSeconds = options?.timeoutSeconds;
        const failureThreshold = options?.failureThreshold;
        const successThreshold = options?.successThreshold;
        const endpointName = options?.endpointName;
        return new CSharpAppResourcePromise(this._withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName));
    }
    /** @internal */
    async _excludeFromMcpInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromMcp', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new CSharpAppResourcePromise(this._excludeFromMcpInternal());
    }
    /** @internal */
    async _withRemoteImageNameInternal(remoteImageName) {
        const rpcArgs = { builder: this._handle, remoteImageName };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageName', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new CSharpAppResourcePromise(this._withRemoteImageNameInternal(remoteImageName));
    }
    /** @internal */
    async _withRemoteImageTagInternal(remoteImageTag) {
        const rpcArgs = { builder: this._handle, remoteImageTag };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageTag', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new CSharpAppResourcePromise(this._withRemoteImageTagInternal(remoteImageTag));
    }
    /** @internal */
    async _withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineStepContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, stepName, callback: callbackId };
        if (dependsOn !== undefined)
            rpcArgs.dependsOn = dependsOn;
        if (requiredBy !== undefined)
            rpcArgs.requiredBy = requiredBy;
        if (tags !== undefined)
            rpcArgs.tags = tags;
        if (description !== undefined)
            rpcArgs.description = description;
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineStepFactory', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        const dependsOn = options?.dependsOn;
        const requiredBy = options?.requiredBy;
        const tags = options?.tags;
        const description = options?.description;
        return new CSharpAppResourcePromise(this._withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description));
    }
    /** @internal */
    async _withPipelineConfigurationAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineConfigurationContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfigurationAsync', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new CSharpAppResourcePromise(this._withPipelineConfigurationAsyncInternal(callback));
    }
    /** @internal */
    async _withPipelineConfigurationInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new PipelineConfigurationContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfiguration', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new CSharpAppResourcePromise(this._withPipelineConfigurationInternal(callback));
    }
    /** Gets the resource name */
    async getResourceName() {
        const rpcArgs = { resource: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/getResourceName', rpcArgs);
    }
    /** @internal */
    async _onBeforeResourceStartedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new BeforeResourceStartedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onBeforeResourceStarted', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new CSharpAppResourcePromise(this._onBeforeResourceStartedInternal(callback));
    }
    /** @internal */
    async _onResourceStoppedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceStoppedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceStopped', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new CSharpAppResourcePromise(this._onResourceStoppedInternal(callback));
    }
    /** @internal */
    async _onInitializeResourceInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new InitializeResourceEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onInitializeResource', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new CSharpAppResourcePromise(this._onInitializeResourceInternal(callback));
    }
    /** @internal */
    async _onResourceEndpointsAllocatedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceEndpointsAllocatedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceEndpointsAllocated', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new CSharpAppResourcePromise(this._onResourceEndpointsAllocatedInternal(callback));
    }
    /** @internal */
    async _onResourceReadyInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceReadyEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceReady', rpcArgs);
        return new CSharpAppResource(result, this._client);
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new CSharpAppResourcePromise(this._onResourceReadyInternal(callback));
    }
}
exports.CSharpAppResource = CSharpAppResource;
/**
 * Thenable wrapper for CSharpAppResource that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class CSharpAppResourcePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withContainerRegistry(registry)));
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withDockerfileBaseImage(options)));
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withMcpServer(options)));
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withOtlpExporter()));
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withOtlpExporterProtocol(protocol)));
    }
    /** Sets the number of replicas */
    withReplicas(replicas) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withReplicas(replicas)));
    }
    /** Disables forwarded headers for the project */
    disableForwardedHeaders() {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.disableForwardedHeaders()));
    }
    /** Publishes a project as a Docker file with optional container configuration */
    publishAsDockerFile(options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.publishAsDockerFile(options)));
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withRequiredCommand(command, options)));
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withEnvironmentCallback(callback)));
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withEnvironmentEndpoint(name, endpointReference)));
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withEnvironment(name, value)));
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withEnvironmentParameter(name, parameter)));
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withEnvironmentConnectionString(envVarName, resource)));
    }
    /** Adds arguments */
    withArgs(args) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withArgs(args)));
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withArgsCallback(callback)));
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withArgsCallbackAsync(callback)));
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withReferenceEnvironment(options)));
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withReference(source, options)));
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withReferenceUri(name, uri)));
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withReferenceExternalService(externalService)));
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withReferenceEndpoint(endpointReference)));
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withEndpoint(options)));
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withHttpEndpoint(options)));
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withHttpsEndpoint(options)));
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withExternalHttpEndpoints()));
    }
    /** Gets an endpoint reference */
    getEndpoint(name) {
        return this._promise.then(obj => obj.getEndpoint(name));
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.asHttp2Service()));
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withUrlsCallback(callback)));
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withUrlsCallbackAsync(callback)));
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withUrl(url, options)));
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withUrlExpression(url, options)));
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withUrlForEndpoint(endpointName, callback)));
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withUrlForEndpointFactory(endpointName, callback)));
    }
    /** Configures the resource to copy container files from the specified source during publishing */
    publishWithContainerFiles(source, destinationPath) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.publishWithContainerFiles(source, destinationPath)));
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.excludeFromManifest()));
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.waitFor(dependency)));
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.waitForWithBehavior(dependency, waitBehavior)));
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.waitForStart(dependency)));
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.waitForStartWithBehavior(dependency, waitBehavior)));
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withExplicitStart()));
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.waitForCompletion(dependency, options)));
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withHealthCheck(key)));
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withHttpHealthCheck(options)));
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withCommand(name, displayName, executeCommand, options)));
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withDeveloperCertificateTrust(trust)));
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withCertificateTrustScope(scope)));
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withHttpsDeveloperCertificate(options)));
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withoutHttpsCertificate()));
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withRelationship(resourceBuilder, type)));
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withParentRelationship(parent)));
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withChildRelationship(child)));
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withIconName(iconName, options)));
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withHttpProbe(probeType, options)));
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.excludeFromMcp()));
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withRemoteImageName(remoteImageName)));
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withRemoteImageTag(remoteImageTag)));
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withPipelineStepFactory(stepName, callback, options)));
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withPipelineConfigurationAsync(callback)));
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.withPipelineConfiguration(callback)));
    }
    /** Gets the resource name */
    getResourceName() {
        return this._promise.then(obj => obj.getResourceName());
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.onBeforeResourceStarted(callback)));
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.onResourceStopped(callback)));
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.onInitializeResource(callback)));
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.onResourceEndpointsAllocated(callback)));
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new CSharpAppResourcePromise(this._promise.then(obj => obj.onResourceReady(callback)));
    }
}
exports.CSharpAppResourcePromise = CSharpAppResourcePromise;
// ============================================================================
// DotnetToolResource
// ============================================================================
class DotnetToolResource extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _withContainerRegistryInternal(registry) {
        const rpcArgs = { builder: this._handle, registry };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerRegistry', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new DotnetToolResourcePromise(this._withContainerRegistryInternal(registry));
    }
    /** @internal */
    async _withDockerfileBaseImageInternal(buildImage, runtimeImage) {
        const rpcArgs = { builder: this._handle };
        if (buildImage !== undefined)
            rpcArgs.buildImage = buildImage;
        if (runtimeImage !== undefined)
            rpcArgs.runtimeImage = runtimeImage;
        const result = await this._client.invokeCapability('Aspire.Hosting/withDockerfileBaseImage', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        const buildImage = options?.buildImage;
        const runtimeImage = options?.runtimeImage;
        return new DotnetToolResourcePromise(this._withDockerfileBaseImageInternal(buildImage, runtimeImage));
    }
    /** @internal */
    async _withToolPackageInternal(packageId) {
        const rpcArgs = { builder: this._handle, packageId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withToolPackage', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets the tool package ID */
    withToolPackage(packageId) {
        return new DotnetToolResourcePromise(this._withToolPackageInternal(packageId));
    }
    /** @internal */
    async _withToolVersionInternal(version) {
        const rpcArgs = { builder: this._handle, version };
        const result = await this._client.invokeCapability('Aspire.Hosting/withToolVersion', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets the tool version */
    withToolVersion(version) {
        return new DotnetToolResourcePromise(this._withToolVersionInternal(version));
    }
    /** @internal */
    async _withToolPrereleaseInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withToolPrerelease', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Allows prerelease tool versions */
    withToolPrerelease() {
        return new DotnetToolResourcePromise(this._withToolPrereleaseInternal());
    }
    /** @internal */
    async _withToolSourceInternal(source) {
        const rpcArgs = { builder: this._handle, source };
        const result = await this._client.invokeCapability('Aspire.Hosting/withToolSource', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds a NuGet source for the tool */
    withToolSource(source) {
        return new DotnetToolResourcePromise(this._withToolSourceInternal(source));
    }
    /** @internal */
    async _withToolIgnoreExistingFeedsInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withToolIgnoreExistingFeeds', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Ignores existing NuGet feeds */
    withToolIgnoreExistingFeeds() {
        return new DotnetToolResourcePromise(this._withToolIgnoreExistingFeedsInternal());
    }
    /** @internal */
    async _withToolIgnoreFailedSourcesInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withToolIgnoreFailedSources', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Ignores failed NuGet sources */
    withToolIgnoreFailedSources() {
        return new DotnetToolResourcePromise(this._withToolIgnoreFailedSourcesInternal());
    }
    /** @internal */
    async _publishAsDockerFileInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/publishAsDockerFile', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Publishes the executable as a Docker container */
    publishAsDockerFile() {
        return new DotnetToolResourcePromise(this._publishAsDockerFileInternal());
    }
    /** @internal */
    async _publishAsDockerFileWithConfigureInternal(configure) {
        const configureId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ContainerResource(objHandle, this._client);
            await configure(obj);
        });
        const rpcArgs = { builder: this._handle, configure: configureId };
        const result = await this._client.invokeCapability('Aspire.Hosting/publishAsDockerFileWithConfigure', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Publishes an executable as a Docker file with optional container configuration */
    publishAsDockerFileWithConfigure(configure) {
        return new DotnetToolResourcePromise(this._publishAsDockerFileWithConfigureInternal(configure));
    }
    /** @internal */
    async _withExecutableCommandInternal(command) {
        const rpcArgs = { builder: this._handle, command };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExecutableCommand', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets the executable command */
    withExecutableCommand(command) {
        return new DotnetToolResourcePromise(this._withExecutableCommandInternal(command));
    }
    /** @internal */
    async _withWorkingDirectoryInternal(workingDirectory) {
        const rpcArgs = { builder: this._handle, workingDirectory };
        const result = await this._client.invokeCapability('Aspire.Hosting/withWorkingDirectory', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets the executable working directory */
    withWorkingDirectory(workingDirectory) {
        return new DotnetToolResourcePromise(this._withWorkingDirectoryInternal(workingDirectory));
    }
    /** @internal */
    async _withMcpServerInternal(path, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withMcpServer', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        const path = options?.path;
        const endpointName = options?.endpointName;
        return new DotnetToolResourcePromise(this._withMcpServerInternal(path, endpointName));
    }
    /** @internal */
    async _withOtlpExporterInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporter', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new DotnetToolResourcePromise(this._withOtlpExporterInternal());
    }
    /** @internal */
    async _withOtlpExporterProtocolInternal(protocol) {
        const rpcArgs = { builder: this._handle, protocol };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporterProtocol', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new DotnetToolResourcePromise(this._withOtlpExporterProtocolInternal(protocol));
    }
    /** @internal */
    async _withRequiredCommandInternal(command, helpLink) {
        const rpcArgs = { builder: this._handle, command };
        if (helpLink !== undefined)
            rpcArgs.helpLink = helpLink;
        const result = await this._client.invokeCapability('Aspire.Hosting/withRequiredCommand', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        const helpLink = options?.helpLink;
        return new DotnetToolResourcePromise(this._withRequiredCommandInternal(command, helpLink));
    }
    /** @internal */
    async _withEnvironmentCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EnvironmentCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentCallback', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new DotnetToolResourcePromise(this._withEnvironmentCallbackInternal(callback));
    }
    /** @internal */
    async _withEnvironmentEndpointInternal(name, endpointReference) {
        const rpcArgs = { builder: this._handle, name, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentEndpoint', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new DotnetToolResourcePromise(this._withEnvironmentEndpointInternal(name, endpointReference));
    }
    /** @internal */
    async _withEnvironmentInternal(name, value) {
        const rpcArgs = { builder: this._handle, name, value };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironment', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new DotnetToolResourcePromise(this._withEnvironmentInternal(name, value));
    }
    /** @internal */
    async _withEnvironmentParameterInternal(name, parameter) {
        const rpcArgs = { builder: this._handle, name, parameter };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentParameter', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new DotnetToolResourcePromise(this._withEnvironmentParameterInternal(name, parameter));
    }
    /** @internal */
    async _withEnvironmentConnectionStringInternal(envVarName, resource) {
        const rpcArgs = { builder: this._handle, envVarName, resource };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentConnectionString', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new DotnetToolResourcePromise(this._withEnvironmentConnectionStringInternal(envVarName, resource));
    }
    /** @internal */
    async _withArgsInternal(args) {
        const rpcArgs = { builder: this._handle, args };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgs', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds arguments */
    withArgs(args) {
        return new DotnetToolResourcePromise(this._withArgsInternal(args));
    }
    /** @internal */
    async _withArgsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new CommandLineArgsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallback', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new DotnetToolResourcePromise(this._withArgsCallbackInternal(callback));
    }
    /** @internal */
    async _withArgsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new CommandLineArgsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallbackAsync', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new DotnetToolResourcePromise(this._withArgsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withReferenceEnvironmentInternal(options) {
        const rpcArgs = { builder: this._handle, options };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEnvironment', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new DotnetToolResourcePromise(this._withReferenceEnvironmentInternal(options));
    }
    /** @internal */
    async _withReferenceInternal(source, connectionName, optional, name) {
        const rpcArgs = { builder: this._handle, source };
        if (connectionName !== undefined)
            rpcArgs.connectionName = connectionName;
        if (optional !== undefined)
            rpcArgs.optional = optional;
        if (name !== undefined)
            rpcArgs.name = name;
        const result = await this._client.invokeCapability('Aspire.Hosting/withReference', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        const connectionName = options?.connectionName;
        const optional = options?.optional;
        const name = options?.name;
        return new DotnetToolResourcePromise(this._withReferenceInternal(source, connectionName, optional, name));
    }
    /** @internal */
    async _withReferenceUriInternal(name, uri) {
        const rpcArgs = { builder: this._handle, name, uri };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceUri', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new DotnetToolResourcePromise(this._withReferenceUriInternal(name, uri));
    }
    /** @internal */
    async _withReferenceExternalServiceInternal(externalService) {
        const rpcArgs = { builder: this._handle, externalService };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceExternalService', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new DotnetToolResourcePromise(this._withReferenceExternalServiceInternal(externalService));
    }
    /** @internal */
    async _withReferenceEndpointInternal(endpointReference) {
        const rpcArgs = { builder: this._handle, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEndpoint', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new DotnetToolResourcePromise(this._withReferenceEndpointInternal(endpointReference));
    }
    /** @internal */
    async _withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (scheme !== undefined)
            rpcArgs.scheme = scheme;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        if (isExternal !== undefined)
            rpcArgs.isExternal = isExternal;
        if (protocol !== undefined)
            rpcArgs.protocol = protocol;
        const result = await this._client.invokeCapability('Aspire.Hosting/withEndpoint', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const scheme = options?.scheme;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        const isExternal = options?.isExternal;
        const protocol = options?.protocol;
        return new DotnetToolResourcePromise(this._withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol));
    }
    /** @internal */
    async _withHttpEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpEndpoint', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new DotnetToolResourcePromise(this._withHttpEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withHttpsEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpsEndpoint', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new DotnetToolResourcePromise(this._withHttpsEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withExternalHttpEndpointsInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExternalHttpEndpoints', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new DotnetToolResourcePromise(this._withExternalHttpEndpointsInternal());
    }
    /** Gets an endpoint reference */
    async getEndpoint(name) {
        const rpcArgs = { builder: this._handle, name };
        return await this._client.invokeCapability('Aspire.Hosting/getEndpoint', rpcArgs);
    }
    /** @internal */
    async _asHttp2ServiceInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/asHttp2Service', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new DotnetToolResourcePromise(this._asHttp2ServiceInternal());
    }
    /** @internal */
    async _withUrlsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ResourceUrlsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallback', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new DotnetToolResourcePromise(this._withUrlsCallbackInternal(callback));
    }
    /** @internal */
    async _withUrlsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceUrlsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallbackAsync', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new DotnetToolResourcePromise(this._withUrlsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withUrlInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrl', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        const displayText = options?.displayText;
        return new DotnetToolResourcePromise(this._withUrlInternal(url, displayText));
    }
    /** @internal */
    async _withUrlExpressionInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlExpression', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        const displayText = options?.displayText;
        return new DotnetToolResourcePromise(this._withUrlExpressionInternal(url, displayText));
    }
    /** @internal */
    async _withUrlForEndpointInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const obj = (0, transport_js_1.wrapIfHandle)(objData);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpoint', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new DotnetToolResourcePromise(this._withUrlForEndpointInternal(endpointName, callback));
    }
    /** @internal */
    async _withUrlForEndpointFactoryInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EndpointReference(argHandle, this._client);
            return await callback(arg);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpointFactory', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new DotnetToolResourcePromise(this._withUrlForEndpointFactoryInternal(endpointName, callback));
    }
    /** @internal */
    async _excludeFromManifestInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromManifest', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new DotnetToolResourcePromise(this._excludeFromManifestInternal());
    }
    /** @internal */
    async _waitForInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResource', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new DotnetToolResourcePromise(this._waitForInternal(dependency));
    }
    /** @internal */
    async _waitForWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForWithBehavior', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new DotnetToolResourcePromise(this._waitForWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _waitForStartInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceStart', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new DotnetToolResourcePromise(this._waitForStartInternal(dependency));
    }
    /** @internal */
    async _waitForStartWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForStartWithBehavior', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new DotnetToolResourcePromise(this._waitForStartWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _withExplicitStartInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExplicitStart', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new DotnetToolResourcePromise(this._withExplicitStartInternal());
    }
    /** @internal */
    async _waitForCompletionInternal(dependency, exitCode) {
        const rpcArgs = { builder: this._handle, dependency };
        if (exitCode !== undefined)
            rpcArgs.exitCode = exitCode;
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceCompletion', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        const exitCode = options?.exitCode;
        return new DotnetToolResourcePromise(this._waitForCompletionInternal(dependency, exitCode));
    }
    /** @internal */
    async _withHealthCheckInternal(key) {
        const rpcArgs = { builder: this._handle, key };
        const result = await this._client.invokeCapability('Aspire.Hosting/withHealthCheck', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new DotnetToolResourcePromise(this._withHealthCheckInternal(key));
    }
    /** @internal */
    async _withHttpHealthCheckInternal(path, statusCode, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (statusCode !== undefined)
            rpcArgs.statusCode = statusCode;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpHealthCheck', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        const path = options?.path;
        const statusCode = options?.statusCode;
        const endpointName = options?.endpointName;
        return new DotnetToolResourcePromise(this._withHttpHealthCheckInternal(path, statusCode, endpointName));
    }
    /** @internal */
    async _withCommandInternal(name, displayName, executeCommand, commandOptions) {
        const executeCommandId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ExecuteCommandContext(argHandle, this._client);
            return await executeCommand(arg);
        });
        const rpcArgs = { builder: this._handle, name, displayName, executeCommand: executeCommandId };
        if (commandOptions !== undefined)
            rpcArgs.commandOptions = commandOptions;
        const result = await this._client.invokeCapability('Aspire.Hosting/withCommand', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        const commandOptions = options?.commandOptions;
        return new DotnetToolResourcePromise(this._withCommandInternal(name, displayName, executeCommand, commandOptions));
    }
    /** @internal */
    async _withDeveloperCertificateTrustInternal(trust) {
        const rpcArgs = { builder: this._handle, trust };
        const result = await this._client.invokeCapability('Aspire.Hosting/withDeveloperCertificateTrust', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new DotnetToolResourcePromise(this._withDeveloperCertificateTrustInternal(trust));
    }
    /** @internal */
    async _withCertificateTrustScopeInternal(scope) {
        const rpcArgs = { builder: this._handle, scope };
        const result = await this._client.invokeCapability('Aspire.Hosting/withCertificateTrustScope', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new DotnetToolResourcePromise(this._withCertificateTrustScopeInternal(scope));
    }
    /** @internal */
    async _withHttpsDeveloperCertificateInternal(password) {
        const rpcArgs = { builder: this._handle };
        if (password !== undefined)
            rpcArgs.password = password;
        const result = await this._client.invokeCapability('Aspire.Hosting/withParameterHttpsDeveloperCertificate', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        const password = options?.password;
        return new DotnetToolResourcePromise(this._withHttpsDeveloperCertificateInternal(password));
    }
    /** @internal */
    async _withoutHttpsCertificateInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withoutHttpsCertificate', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new DotnetToolResourcePromise(this._withoutHttpsCertificateInternal());
    }
    /** @internal */
    async _withRelationshipInternal(resourceBuilder, type) {
        const rpcArgs = { builder: this._handle, resourceBuilder, type };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderRelationship', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new DotnetToolResourcePromise(this._withRelationshipInternal(resourceBuilder, type));
    }
    /** @internal */
    async _withParentRelationshipInternal(parent) {
        const rpcArgs = { builder: this._handle, parent };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderParentRelationship', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new DotnetToolResourcePromise(this._withParentRelationshipInternal(parent));
    }
    /** @internal */
    async _withChildRelationshipInternal(child) {
        const rpcArgs = { builder: this._handle, child };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderChildRelationship', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new DotnetToolResourcePromise(this._withChildRelationshipInternal(child));
    }
    /** @internal */
    async _withIconNameInternal(iconName, iconVariant) {
        const rpcArgs = { builder: this._handle, iconName };
        if (iconVariant !== undefined)
            rpcArgs.iconVariant = iconVariant;
        const result = await this._client.invokeCapability('Aspire.Hosting/withIconName', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        const iconVariant = options?.iconVariant;
        return new DotnetToolResourcePromise(this._withIconNameInternal(iconName, iconVariant));
    }
    /** @internal */
    async _withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName) {
        const rpcArgs = { builder: this._handle, probeType };
        if (path !== undefined)
            rpcArgs.path = path;
        if (initialDelaySeconds !== undefined)
            rpcArgs.initialDelaySeconds = initialDelaySeconds;
        if (periodSeconds !== undefined)
            rpcArgs.periodSeconds = periodSeconds;
        if (timeoutSeconds !== undefined)
            rpcArgs.timeoutSeconds = timeoutSeconds;
        if (failureThreshold !== undefined)
            rpcArgs.failureThreshold = failureThreshold;
        if (successThreshold !== undefined)
            rpcArgs.successThreshold = successThreshold;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpProbe', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        const path = options?.path;
        const initialDelaySeconds = options?.initialDelaySeconds;
        const periodSeconds = options?.periodSeconds;
        const timeoutSeconds = options?.timeoutSeconds;
        const failureThreshold = options?.failureThreshold;
        const successThreshold = options?.successThreshold;
        const endpointName = options?.endpointName;
        return new DotnetToolResourcePromise(this._withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName));
    }
    /** @internal */
    async _excludeFromMcpInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromMcp', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new DotnetToolResourcePromise(this._excludeFromMcpInternal());
    }
    /** @internal */
    async _withRemoteImageNameInternal(remoteImageName) {
        const rpcArgs = { builder: this._handle, remoteImageName };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageName', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new DotnetToolResourcePromise(this._withRemoteImageNameInternal(remoteImageName));
    }
    /** @internal */
    async _withRemoteImageTagInternal(remoteImageTag) {
        const rpcArgs = { builder: this._handle, remoteImageTag };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageTag', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new DotnetToolResourcePromise(this._withRemoteImageTagInternal(remoteImageTag));
    }
    /** @internal */
    async _withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineStepContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, stepName, callback: callbackId };
        if (dependsOn !== undefined)
            rpcArgs.dependsOn = dependsOn;
        if (requiredBy !== undefined)
            rpcArgs.requiredBy = requiredBy;
        if (tags !== undefined)
            rpcArgs.tags = tags;
        if (description !== undefined)
            rpcArgs.description = description;
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineStepFactory', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        const dependsOn = options?.dependsOn;
        const requiredBy = options?.requiredBy;
        const tags = options?.tags;
        const description = options?.description;
        return new DotnetToolResourcePromise(this._withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description));
    }
    /** @internal */
    async _withPipelineConfigurationAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineConfigurationContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfigurationAsync', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new DotnetToolResourcePromise(this._withPipelineConfigurationAsyncInternal(callback));
    }
    /** @internal */
    async _withPipelineConfigurationInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new PipelineConfigurationContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfiguration', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new DotnetToolResourcePromise(this._withPipelineConfigurationInternal(callback));
    }
    /** Gets the resource name */
    async getResourceName() {
        const rpcArgs = { resource: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/getResourceName', rpcArgs);
    }
    /** @internal */
    async _onBeforeResourceStartedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new BeforeResourceStartedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onBeforeResourceStarted', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new DotnetToolResourcePromise(this._onBeforeResourceStartedInternal(callback));
    }
    /** @internal */
    async _onResourceStoppedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceStoppedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceStopped', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new DotnetToolResourcePromise(this._onResourceStoppedInternal(callback));
    }
    /** @internal */
    async _onInitializeResourceInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new InitializeResourceEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onInitializeResource', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new DotnetToolResourcePromise(this._onInitializeResourceInternal(callback));
    }
    /** @internal */
    async _onResourceEndpointsAllocatedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceEndpointsAllocatedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceEndpointsAllocated', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new DotnetToolResourcePromise(this._onResourceEndpointsAllocatedInternal(callback));
    }
    /** @internal */
    async _onResourceReadyInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceReadyEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceReady', rpcArgs);
        return new DotnetToolResource(result, this._client);
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new DotnetToolResourcePromise(this._onResourceReadyInternal(callback));
    }
}
exports.DotnetToolResource = DotnetToolResource;
/**
 * Thenable wrapper for DotnetToolResource that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class DotnetToolResourcePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withContainerRegistry(registry)));
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withDockerfileBaseImage(options)));
    }
    /** Sets the tool package ID */
    withToolPackage(packageId) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withToolPackage(packageId)));
    }
    /** Sets the tool version */
    withToolVersion(version) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withToolVersion(version)));
    }
    /** Allows prerelease tool versions */
    withToolPrerelease() {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withToolPrerelease()));
    }
    /** Adds a NuGet source for the tool */
    withToolSource(source) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withToolSource(source)));
    }
    /** Ignores existing NuGet feeds */
    withToolIgnoreExistingFeeds() {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withToolIgnoreExistingFeeds()));
    }
    /** Ignores failed NuGet sources */
    withToolIgnoreFailedSources() {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withToolIgnoreFailedSources()));
    }
    /** Publishes the executable as a Docker container */
    publishAsDockerFile() {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.publishAsDockerFile()));
    }
    /** Publishes an executable as a Docker file with optional container configuration */
    publishAsDockerFileWithConfigure(configure) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.publishAsDockerFileWithConfigure(configure)));
    }
    /** Sets the executable command */
    withExecutableCommand(command) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withExecutableCommand(command)));
    }
    /** Sets the executable working directory */
    withWorkingDirectory(workingDirectory) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withWorkingDirectory(workingDirectory)));
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withMcpServer(options)));
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withOtlpExporter()));
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withOtlpExporterProtocol(protocol)));
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withRequiredCommand(command, options)));
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withEnvironmentCallback(callback)));
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withEnvironmentEndpoint(name, endpointReference)));
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withEnvironment(name, value)));
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withEnvironmentParameter(name, parameter)));
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withEnvironmentConnectionString(envVarName, resource)));
    }
    /** Adds arguments */
    withArgs(args) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withArgs(args)));
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withArgsCallback(callback)));
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withArgsCallbackAsync(callback)));
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withReferenceEnvironment(options)));
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withReference(source, options)));
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withReferenceUri(name, uri)));
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withReferenceExternalService(externalService)));
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withReferenceEndpoint(endpointReference)));
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withEndpoint(options)));
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withHttpEndpoint(options)));
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withHttpsEndpoint(options)));
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withExternalHttpEndpoints()));
    }
    /** Gets an endpoint reference */
    getEndpoint(name) {
        return this._promise.then(obj => obj.getEndpoint(name));
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.asHttp2Service()));
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withUrlsCallback(callback)));
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withUrlsCallbackAsync(callback)));
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withUrl(url, options)));
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withUrlExpression(url, options)));
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withUrlForEndpoint(endpointName, callback)));
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withUrlForEndpointFactory(endpointName, callback)));
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.excludeFromManifest()));
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.waitFor(dependency)));
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.waitForWithBehavior(dependency, waitBehavior)));
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.waitForStart(dependency)));
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.waitForStartWithBehavior(dependency, waitBehavior)));
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withExplicitStart()));
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.waitForCompletion(dependency, options)));
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withHealthCheck(key)));
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withHttpHealthCheck(options)));
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withCommand(name, displayName, executeCommand, options)));
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withDeveloperCertificateTrust(trust)));
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withCertificateTrustScope(scope)));
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withHttpsDeveloperCertificate(options)));
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withoutHttpsCertificate()));
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withRelationship(resourceBuilder, type)));
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withParentRelationship(parent)));
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withChildRelationship(child)));
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withIconName(iconName, options)));
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withHttpProbe(probeType, options)));
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.excludeFromMcp()));
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withRemoteImageName(remoteImageName)));
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withRemoteImageTag(remoteImageTag)));
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withPipelineStepFactory(stepName, callback, options)));
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withPipelineConfigurationAsync(callback)));
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.withPipelineConfiguration(callback)));
    }
    /** Gets the resource name */
    getResourceName() {
        return this._promise.then(obj => obj.getResourceName());
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.onBeforeResourceStarted(callback)));
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.onResourceStopped(callback)));
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.onInitializeResource(callback)));
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.onResourceEndpointsAllocated(callback)));
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new DotnetToolResourcePromise(this._promise.then(obj => obj.onResourceReady(callback)));
    }
}
exports.DotnetToolResourcePromise = DotnetToolResourcePromise;
// ============================================================================
// ExecutableResource
// ============================================================================
class ExecutableResource extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _withContainerRegistryInternal(registry) {
        const rpcArgs = { builder: this._handle, registry };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerRegistry', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ExecutableResourcePromise(this._withContainerRegistryInternal(registry));
    }
    /** @internal */
    async _withDockerfileBaseImageInternal(buildImage, runtimeImage) {
        const rpcArgs = { builder: this._handle };
        if (buildImage !== undefined)
            rpcArgs.buildImage = buildImage;
        if (runtimeImage !== undefined)
            rpcArgs.runtimeImage = runtimeImage;
        const result = await this._client.invokeCapability('Aspire.Hosting/withDockerfileBaseImage', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        const buildImage = options?.buildImage;
        const runtimeImage = options?.runtimeImage;
        return new ExecutableResourcePromise(this._withDockerfileBaseImageInternal(buildImage, runtimeImage));
    }
    /** @internal */
    async _publishAsDockerFileInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/publishAsDockerFile', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Publishes the executable as a Docker container */
    publishAsDockerFile() {
        return new ExecutableResourcePromise(this._publishAsDockerFileInternal());
    }
    /** @internal */
    async _publishAsDockerFileWithConfigureInternal(configure) {
        const configureId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ContainerResource(objHandle, this._client);
            await configure(obj);
        });
        const rpcArgs = { builder: this._handle, configure: configureId };
        const result = await this._client.invokeCapability('Aspire.Hosting/publishAsDockerFileWithConfigure', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Publishes an executable as a Docker file with optional container configuration */
    publishAsDockerFileWithConfigure(configure) {
        return new ExecutableResourcePromise(this._publishAsDockerFileWithConfigureInternal(configure));
    }
    /** @internal */
    async _withExecutableCommandInternal(command) {
        const rpcArgs = { builder: this._handle, command };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExecutableCommand', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Sets the executable command */
    withExecutableCommand(command) {
        return new ExecutableResourcePromise(this._withExecutableCommandInternal(command));
    }
    /** @internal */
    async _withWorkingDirectoryInternal(workingDirectory) {
        const rpcArgs = { builder: this._handle, workingDirectory };
        const result = await this._client.invokeCapability('Aspire.Hosting/withWorkingDirectory', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Sets the executable working directory */
    withWorkingDirectory(workingDirectory) {
        return new ExecutableResourcePromise(this._withWorkingDirectoryInternal(workingDirectory));
    }
    /** @internal */
    async _withMcpServerInternal(path, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withMcpServer', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        const path = options?.path;
        const endpointName = options?.endpointName;
        return new ExecutableResourcePromise(this._withMcpServerInternal(path, endpointName));
    }
    /** @internal */
    async _withOtlpExporterInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporter', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new ExecutableResourcePromise(this._withOtlpExporterInternal());
    }
    /** @internal */
    async _withOtlpExporterProtocolInternal(protocol) {
        const rpcArgs = { builder: this._handle, protocol };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporterProtocol', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new ExecutableResourcePromise(this._withOtlpExporterProtocolInternal(protocol));
    }
    /** @internal */
    async _withRequiredCommandInternal(command, helpLink) {
        const rpcArgs = { builder: this._handle, command };
        if (helpLink !== undefined)
            rpcArgs.helpLink = helpLink;
        const result = await this._client.invokeCapability('Aspire.Hosting/withRequiredCommand', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        const helpLink = options?.helpLink;
        return new ExecutableResourcePromise(this._withRequiredCommandInternal(command, helpLink));
    }
    /** @internal */
    async _withEnvironmentCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EnvironmentCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentCallback', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new ExecutableResourcePromise(this._withEnvironmentCallbackInternal(callback));
    }
    /** @internal */
    async _withEnvironmentEndpointInternal(name, endpointReference) {
        const rpcArgs = { builder: this._handle, name, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentEndpoint', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new ExecutableResourcePromise(this._withEnvironmentEndpointInternal(name, endpointReference));
    }
    /** @internal */
    async _withEnvironmentInternal(name, value) {
        const rpcArgs = { builder: this._handle, name, value };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironment', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new ExecutableResourcePromise(this._withEnvironmentInternal(name, value));
    }
    /** @internal */
    async _withEnvironmentParameterInternal(name, parameter) {
        const rpcArgs = { builder: this._handle, name, parameter };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentParameter', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new ExecutableResourcePromise(this._withEnvironmentParameterInternal(name, parameter));
    }
    /** @internal */
    async _withEnvironmentConnectionStringInternal(envVarName, resource) {
        const rpcArgs = { builder: this._handle, envVarName, resource };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentConnectionString', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new ExecutableResourcePromise(this._withEnvironmentConnectionStringInternal(envVarName, resource));
    }
    /** @internal */
    async _withArgsInternal(args) {
        const rpcArgs = { builder: this._handle, args };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgs', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds arguments */
    withArgs(args) {
        return new ExecutableResourcePromise(this._withArgsInternal(args));
    }
    /** @internal */
    async _withArgsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new CommandLineArgsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallback', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new ExecutableResourcePromise(this._withArgsCallbackInternal(callback));
    }
    /** @internal */
    async _withArgsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new CommandLineArgsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallbackAsync', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new ExecutableResourcePromise(this._withArgsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withReferenceEnvironmentInternal(options) {
        const rpcArgs = { builder: this._handle, options };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEnvironment', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new ExecutableResourcePromise(this._withReferenceEnvironmentInternal(options));
    }
    /** @internal */
    async _withReferenceInternal(source, connectionName, optional, name) {
        const rpcArgs = { builder: this._handle, source };
        if (connectionName !== undefined)
            rpcArgs.connectionName = connectionName;
        if (optional !== undefined)
            rpcArgs.optional = optional;
        if (name !== undefined)
            rpcArgs.name = name;
        const result = await this._client.invokeCapability('Aspire.Hosting/withReference', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        const connectionName = options?.connectionName;
        const optional = options?.optional;
        const name = options?.name;
        return new ExecutableResourcePromise(this._withReferenceInternal(source, connectionName, optional, name));
    }
    /** @internal */
    async _withReferenceUriInternal(name, uri) {
        const rpcArgs = { builder: this._handle, name, uri };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceUri', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new ExecutableResourcePromise(this._withReferenceUriInternal(name, uri));
    }
    /** @internal */
    async _withReferenceExternalServiceInternal(externalService) {
        const rpcArgs = { builder: this._handle, externalService };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceExternalService', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new ExecutableResourcePromise(this._withReferenceExternalServiceInternal(externalService));
    }
    /** @internal */
    async _withReferenceEndpointInternal(endpointReference) {
        const rpcArgs = { builder: this._handle, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEndpoint', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new ExecutableResourcePromise(this._withReferenceEndpointInternal(endpointReference));
    }
    /** @internal */
    async _withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (scheme !== undefined)
            rpcArgs.scheme = scheme;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        if (isExternal !== undefined)
            rpcArgs.isExternal = isExternal;
        if (protocol !== undefined)
            rpcArgs.protocol = protocol;
        const result = await this._client.invokeCapability('Aspire.Hosting/withEndpoint', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const scheme = options?.scheme;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        const isExternal = options?.isExternal;
        const protocol = options?.protocol;
        return new ExecutableResourcePromise(this._withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol));
    }
    /** @internal */
    async _withHttpEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpEndpoint', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new ExecutableResourcePromise(this._withHttpEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withHttpsEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpsEndpoint', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new ExecutableResourcePromise(this._withHttpsEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withExternalHttpEndpointsInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExternalHttpEndpoints', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new ExecutableResourcePromise(this._withExternalHttpEndpointsInternal());
    }
    /** Gets an endpoint reference */
    async getEndpoint(name) {
        const rpcArgs = { builder: this._handle, name };
        return await this._client.invokeCapability('Aspire.Hosting/getEndpoint', rpcArgs);
    }
    /** @internal */
    async _asHttp2ServiceInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/asHttp2Service', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new ExecutableResourcePromise(this._asHttp2ServiceInternal());
    }
    /** @internal */
    async _withUrlsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ResourceUrlsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallback', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ExecutableResourcePromise(this._withUrlsCallbackInternal(callback));
    }
    /** @internal */
    async _withUrlsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceUrlsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallbackAsync', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ExecutableResourcePromise(this._withUrlsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withUrlInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrl', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        const displayText = options?.displayText;
        return new ExecutableResourcePromise(this._withUrlInternal(url, displayText));
    }
    /** @internal */
    async _withUrlExpressionInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlExpression', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        const displayText = options?.displayText;
        return new ExecutableResourcePromise(this._withUrlExpressionInternal(url, displayText));
    }
    /** @internal */
    async _withUrlForEndpointInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const obj = (0, transport_js_1.wrapIfHandle)(objData);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpoint', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ExecutableResourcePromise(this._withUrlForEndpointInternal(endpointName, callback));
    }
    /** @internal */
    async _withUrlForEndpointFactoryInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EndpointReference(argHandle, this._client);
            return await callback(arg);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpointFactory', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new ExecutableResourcePromise(this._withUrlForEndpointFactoryInternal(endpointName, callback));
    }
    /** @internal */
    async _excludeFromManifestInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromManifest', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ExecutableResourcePromise(this._excludeFromManifestInternal());
    }
    /** @internal */
    async _waitForInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResource', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new ExecutableResourcePromise(this._waitForInternal(dependency));
    }
    /** @internal */
    async _waitForWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForWithBehavior', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new ExecutableResourcePromise(this._waitForWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _waitForStartInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceStart', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new ExecutableResourcePromise(this._waitForStartInternal(dependency));
    }
    /** @internal */
    async _waitForStartWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForStartWithBehavior', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new ExecutableResourcePromise(this._waitForStartWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _withExplicitStartInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExplicitStart', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ExecutableResourcePromise(this._withExplicitStartInternal());
    }
    /** @internal */
    async _waitForCompletionInternal(dependency, exitCode) {
        const rpcArgs = { builder: this._handle, dependency };
        if (exitCode !== undefined)
            rpcArgs.exitCode = exitCode;
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceCompletion', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        const exitCode = options?.exitCode;
        return new ExecutableResourcePromise(this._waitForCompletionInternal(dependency, exitCode));
    }
    /** @internal */
    async _withHealthCheckInternal(key) {
        const rpcArgs = { builder: this._handle, key };
        const result = await this._client.invokeCapability('Aspire.Hosting/withHealthCheck', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ExecutableResourcePromise(this._withHealthCheckInternal(key));
    }
    /** @internal */
    async _withHttpHealthCheckInternal(path, statusCode, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (statusCode !== undefined)
            rpcArgs.statusCode = statusCode;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpHealthCheck', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        const path = options?.path;
        const statusCode = options?.statusCode;
        const endpointName = options?.endpointName;
        return new ExecutableResourcePromise(this._withHttpHealthCheckInternal(path, statusCode, endpointName));
    }
    /** @internal */
    async _withCommandInternal(name, displayName, executeCommand, commandOptions) {
        const executeCommandId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ExecuteCommandContext(argHandle, this._client);
            return await executeCommand(arg);
        });
        const rpcArgs = { builder: this._handle, name, displayName, executeCommand: executeCommandId };
        if (commandOptions !== undefined)
            rpcArgs.commandOptions = commandOptions;
        const result = await this._client.invokeCapability('Aspire.Hosting/withCommand', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        const commandOptions = options?.commandOptions;
        return new ExecutableResourcePromise(this._withCommandInternal(name, displayName, executeCommand, commandOptions));
    }
    /** @internal */
    async _withDeveloperCertificateTrustInternal(trust) {
        const rpcArgs = { builder: this._handle, trust };
        const result = await this._client.invokeCapability('Aspire.Hosting/withDeveloperCertificateTrust', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new ExecutableResourcePromise(this._withDeveloperCertificateTrustInternal(trust));
    }
    /** @internal */
    async _withCertificateTrustScopeInternal(scope) {
        const rpcArgs = { builder: this._handle, scope };
        const result = await this._client.invokeCapability('Aspire.Hosting/withCertificateTrustScope', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new ExecutableResourcePromise(this._withCertificateTrustScopeInternal(scope));
    }
    /** @internal */
    async _withHttpsDeveloperCertificateInternal(password) {
        const rpcArgs = { builder: this._handle };
        if (password !== undefined)
            rpcArgs.password = password;
        const result = await this._client.invokeCapability('Aspire.Hosting/withParameterHttpsDeveloperCertificate', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        const password = options?.password;
        return new ExecutableResourcePromise(this._withHttpsDeveloperCertificateInternal(password));
    }
    /** @internal */
    async _withoutHttpsCertificateInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withoutHttpsCertificate', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new ExecutableResourcePromise(this._withoutHttpsCertificateInternal());
    }
    /** @internal */
    async _withRelationshipInternal(resourceBuilder, type) {
        const rpcArgs = { builder: this._handle, resourceBuilder, type };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderRelationship', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ExecutableResourcePromise(this._withRelationshipInternal(resourceBuilder, type));
    }
    /** @internal */
    async _withParentRelationshipInternal(parent) {
        const rpcArgs = { builder: this._handle, parent };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderParentRelationship', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ExecutableResourcePromise(this._withParentRelationshipInternal(parent));
    }
    /** @internal */
    async _withChildRelationshipInternal(child) {
        const rpcArgs = { builder: this._handle, child };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderChildRelationship', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ExecutableResourcePromise(this._withChildRelationshipInternal(child));
    }
    /** @internal */
    async _withIconNameInternal(iconName, iconVariant) {
        const rpcArgs = { builder: this._handle, iconName };
        if (iconVariant !== undefined)
            rpcArgs.iconVariant = iconVariant;
        const result = await this._client.invokeCapability('Aspire.Hosting/withIconName', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        const iconVariant = options?.iconVariant;
        return new ExecutableResourcePromise(this._withIconNameInternal(iconName, iconVariant));
    }
    /** @internal */
    async _withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName) {
        const rpcArgs = { builder: this._handle, probeType };
        if (path !== undefined)
            rpcArgs.path = path;
        if (initialDelaySeconds !== undefined)
            rpcArgs.initialDelaySeconds = initialDelaySeconds;
        if (periodSeconds !== undefined)
            rpcArgs.periodSeconds = periodSeconds;
        if (timeoutSeconds !== undefined)
            rpcArgs.timeoutSeconds = timeoutSeconds;
        if (failureThreshold !== undefined)
            rpcArgs.failureThreshold = failureThreshold;
        if (successThreshold !== undefined)
            rpcArgs.successThreshold = successThreshold;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpProbe', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        const path = options?.path;
        const initialDelaySeconds = options?.initialDelaySeconds;
        const periodSeconds = options?.periodSeconds;
        const timeoutSeconds = options?.timeoutSeconds;
        const failureThreshold = options?.failureThreshold;
        const successThreshold = options?.successThreshold;
        const endpointName = options?.endpointName;
        return new ExecutableResourcePromise(this._withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName));
    }
    /** @internal */
    async _excludeFromMcpInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromMcp', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ExecutableResourcePromise(this._excludeFromMcpInternal());
    }
    /** @internal */
    async _withRemoteImageNameInternal(remoteImageName) {
        const rpcArgs = { builder: this._handle, remoteImageName };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageName', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new ExecutableResourcePromise(this._withRemoteImageNameInternal(remoteImageName));
    }
    /** @internal */
    async _withRemoteImageTagInternal(remoteImageTag) {
        const rpcArgs = { builder: this._handle, remoteImageTag };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageTag', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new ExecutableResourcePromise(this._withRemoteImageTagInternal(remoteImageTag));
    }
    /** @internal */
    async _withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineStepContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, stepName, callback: callbackId };
        if (dependsOn !== undefined)
            rpcArgs.dependsOn = dependsOn;
        if (requiredBy !== undefined)
            rpcArgs.requiredBy = requiredBy;
        if (tags !== undefined)
            rpcArgs.tags = tags;
        if (description !== undefined)
            rpcArgs.description = description;
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineStepFactory', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        const dependsOn = options?.dependsOn;
        const requiredBy = options?.requiredBy;
        const tags = options?.tags;
        const description = options?.description;
        return new ExecutableResourcePromise(this._withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description));
    }
    /** @internal */
    async _withPipelineConfigurationAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineConfigurationContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfigurationAsync', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ExecutableResourcePromise(this._withPipelineConfigurationAsyncInternal(callback));
    }
    /** @internal */
    async _withPipelineConfigurationInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new PipelineConfigurationContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfiguration', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ExecutableResourcePromise(this._withPipelineConfigurationInternal(callback));
    }
    /** Gets the resource name */
    async getResourceName() {
        const rpcArgs = { resource: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/getResourceName', rpcArgs);
    }
    /** @internal */
    async _onBeforeResourceStartedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new BeforeResourceStartedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onBeforeResourceStarted', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ExecutableResourcePromise(this._onBeforeResourceStartedInternal(callback));
    }
    /** @internal */
    async _onResourceStoppedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceStoppedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceStopped', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ExecutableResourcePromise(this._onResourceStoppedInternal(callback));
    }
    /** @internal */
    async _onInitializeResourceInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new InitializeResourceEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onInitializeResource', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ExecutableResourcePromise(this._onInitializeResourceInternal(callback));
    }
    /** @internal */
    async _onResourceEndpointsAllocatedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceEndpointsAllocatedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceEndpointsAllocated', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new ExecutableResourcePromise(this._onResourceEndpointsAllocatedInternal(callback));
    }
    /** @internal */
    async _onResourceReadyInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceReadyEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceReady', rpcArgs);
        return new ExecutableResource(result, this._client);
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ExecutableResourcePromise(this._onResourceReadyInternal(callback));
    }
}
exports.ExecutableResource = ExecutableResource;
/**
 * Thenable wrapper for ExecutableResource that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class ExecutableResourcePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withContainerRegistry(registry)));
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withDockerfileBaseImage(options)));
    }
    /** Publishes the executable as a Docker container */
    publishAsDockerFile() {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.publishAsDockerFile()));
    }
    /** Publishes an executable as a Docker file with optional container configuration */
    publishAsDockerFileWithConfigure(configure) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.publishAsDockerFileWithConfigure(configure)));
    }
    /** Sets the executable command */
    withExecutableCommand(command) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withExecutableCommand(command)));
    }
    /** Sets the executable working directory */
    withWorkingDirectory(workingDirectory) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withWorkingDirectory(workingDirectory)));
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withMcpServer(options)));
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withOtlpExporter()));
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withOtlpExporterProtocol(protocol)));
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withRequiredCommand(command, options)));
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withEnvironmentCallback(callback)));
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withEnvironmentEndpoint(name, endpointReference)));
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withEnvironment(name, value)));
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withEnvironmentParameter(name, parameter)));
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withEnvironmentConnectionString(envVarName, resource)));
    }
    /** Adds arguments */
    withArgs(args) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withArgs(args)));
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withArgsCallback(callback)));
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withArgsCallbackAsync(callback)));
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withReferenceEnvironment(options)));
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withReference(source, options)));
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withReferenceUri(name, uri)));
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withReferenceExternalService(externalService)));
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withReferenceEndpoint(endpointReference)));
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withEndpoint(options)));
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withHttpEndpoint(options)));
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withHttpsEndpoint(options)));
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withExternalHttpEndpoints()));
    }
    /** Gets an endpoint reference */
    getEndpoint(name) {
        return this._promise.then(obj => obj.getEndpoint(name));
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.asHttp2Service()));
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withUrlsCallback(callback)));
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withUrlsCallbackAsync(callback)));
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withUrl(url, options)));
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withUrlExpression(url, options)));
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withUrlForEndpoint(endpointName, callback)));
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withUrlForEndpointFactory(endpointName, callback)));
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.excludeFromManifest()));
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.waitFor(dependency)));
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.waitForWithBehavior(dependency, waitBehavior)));
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.waitForStart(dependency)));
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.waitForStartWithBehavior(dependency, waitBehavior)));
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withExplicitStart()));
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.waitForCompletion(dependency, options)));
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withHealthCheck(key)));
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withHttpHealthCheck(options)));
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withCommand(name, displayName, executeCommand, options)));
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withDeveloperCertificateTrust(trust)));
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withCertificateTrustScope(scope)));
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withHttpsDeveloperCertificate(options)));
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withoutHttpsCertificate()));
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withRelationship(resourceBuilder, type)));
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withParentRelationship(parent)));
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withChildRelationship(child)));
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withIconName(iconName, options)));
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withHttpProbe(probeType, options)));
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.excludeFromMcp()));
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withRemoteImageName(remoteImageName)));
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withRemoteImageTag(remoteImageTag)));
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withPipelineStepFactory(stepName, callback, options)));
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withPipelineConfigurationAsync(callback)));
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.withPipelineConfiguration(callback)));
    }
    /** Gets the resource name */
    getResourceName() {
        return this._promise.then(obj => obj.getResourceName());
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.onBeforeResourceStarted(callback)));
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.onResourceStopped(callback)));
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.onInitializeResource(callback)));
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.onResourceEndpointsAllocated(callback)));
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ExecutableResourcePromise(this._promise.then(obj => obj.onResourceReady(callback)));
    }
}
exports.ExecutableResourcePromise = ExecutableResourcePromise;
// ============================================================================
// ExternalServiceResource
// ============================================================================
class ExternalServiceResource extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _withContainerRegistryInternal(registry) {
        const rpcArgs = { builder: this._handle, registry };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerRegistry', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ExternalServiceResourcePromise(this._withContainerRegistryInternal(registry));
    }
    /** @internal */
    async _withDockerfileBaseImageInternal(buildImage, runtimeImage) {
        const rpcArgs = { builder: this._handle };
        if (buildImage !== undefined)
            rpcArgs.buildImage = buildImage;
        if (runtimeImage !== undefined)
            rpcArgs.runtimeImage = runtimeImage;
        const result = await this._client.invokeCapability('Aspire.Hosting/withDockerfileBaseImage', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        const buildImage = options?.buildImage;
        const runtimeImage = options?.runtimeImage;
        return new ExternalServiceResourcePromise(this._withDockerfileBaseImageInternal(buildImage, runtimeImage));
    }
    /** @internal */
    async _withExternalServiceHttpHealthCheckInternal(path, statusCode) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (statusCode !== undefined)
            rpcArgs.statusCode = statusCode;
        const result = await this._client.invokeCapability('Aspire.Hosting/withExternalServiceHttpHealthCheck', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Adds an HTTP health check to an external service */
    withExternalServiceHttpHealthCheck(options) {
        const path = options?.path;
        const statusCode = options?.statusCode;
        return new ExternalServiceResourcePromise(this._withExternalServiceHttpHealthCheckInternal(path, statusCode));
    }
    /** @internal */
    async _withRequiredCommandInternal(command, helpLink) {
        const rpcArgs = { builder: this._handle, command };
        if (helpLink !== undefined)
            rpcArgs.helpLink = helpLink;
        const result = await this._client.invokeCapability('Aspire.Hosting/withRequiredCommand', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        const helpLink = options?.helpLink;
        return new ExternalServiceResourcePromise(this._withRequiredCommandInternal(command, helpLink));
    }
    /** @internal */
    async _withUrlsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ResourceUrlsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallback', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ExternalServiceResourcePromise(this._withUrlsCallbackInternal(callback));
    }
    /** @internal */
    async _withUrlsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceUrlsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallbackAsync', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ExternalServiceResourcePromise(this._withUrlsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withUrlInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrl', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        const displayText = options?.displayText;
        return new ExternalServiceResourcePromise(this._withUrlInternal(url, displayText));
    }
    /** @internal */
    async _withUrlExpressionInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlExpression', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        const displayText = options?.displayText;
        return new ExternalServiceResourcePromise(this._withUrlExpressionInternal(url, displayText));
    }
    /** @internal */
    async _withUrlForEndpointInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const obj = (0, transport_js_1.wrapIfHandle)(objData);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpoint', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ExternalServiceResourcePromise(this._withUrlForEndpointInternal(endpointName, callback));
    }
    /** @internal */
    async _excludeFromManifestInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromManifest', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ExternalServiceResourcePromise(this._excludeFromManifestInternal());
    }
    /** @internal */
    async _withExplicitStartInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExplicitStart', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ExternalServiceResourcePromise(this._withExplicitStartInternal());
    }
    /** @internal */
    async _withHealthCheckInternal(key) {
        const rpcArgs = { builder: this._handle, key };
        const result = await this._client.invokeCapability('Aspire.Hosting/withHealthCheck', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ExternalServiceResourcePromise(this._withHealthCheckInternal(key));
    }
    /** @internal */
    async _withCommandInternal(name, displayName, executeCommand, commandOptions) {
        const executeCommandId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ExecuteCommandContext(argHandle, this._client);
            return await executeCommand(arg);
        });
        const rpcArgs = { builder: this._handle, name, displayName, executeCommand: executeCommandId };
        if (commandOptions !== undefined)
            rpcArgs.commandOptions = commandOptions;
        const result = await this._client.invokeCapability('Aspire.Hosting/withCommand', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        const commandOptions = options?.commandOptions;
        return new ExternalServiceResourcePromise(this._withCommandInternal(name, displayName, executeCommand, commandOptions));
    }
    /** @internal */
    async _withRelationshipInternal(resourceBuilder, type) {
        const rpcArgs = { builder: this._handle, resourceBuilder, type };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderRelationship', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ExternalServiceResourcePromise(this._withRelationshipInternal(resourceBuilder, type));
    }
    /** @internal */
    async _withParentRelationshipInternal(parent) {
        const rpcArgs = { builder: this._handle, parent };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderParentRelationship', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ExternalServiceResourcePromise(this._withParentRelationshipInternal(parent));
    }
    /** @internal */
    async _withChildRelationshipInternal(child) {
        const rpcArgs = { builder: this._handle, child };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderChildRelationship', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ExternalServiceResourcePromise(this._withChildRelationshipInternal(child));
    }
    /** @internal */
    async _withIconNameInternal(iconName, iconVariant) {
        const rpcArgs = { builder: this._handle, iconName };
        if (iconVariant !== undefined)
            rpcArgs.iconVariant = iconVariant;
        const result = await this._client.invokeCapability('Aspire.Hosting/withIconName', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        const iconVariant = options?.iconVariant;
        return new ExternalServiceResourcePromise(this._withIconNameInternal(iconName, iconVariant));
    }
    /** @internal */
    async _excludeFromMcpInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromMcp', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ExternalServiceResourcePromise(this._excludeFromMcpInternal());
    }
    /** @internal */
    async _withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineStepContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, stepName, callback: callbackId };
        if (dependsOn !== undefined)
            rpcArgs.dependsOn = dependsOn;
        if (requiredBy !== undefined)
            rpcArgs.requiredBy = requiredBy;
        if (tags !== undefined)
            rpcArgs.tags = tags;
        if (description !== undefined)
            rpcArgs.description = description;
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineStepFactory', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        const dependsOn = options?.dependsOn;
        const requiredBy = options?.requiredBy;
        const tags = options?.tags;
        const description = options?.description;
        return new ExternalServiceResourcePromise(this._withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description));
    }
    /** @internal */
    async _withPipelineConfigurationAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineConfigurationContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfigurationAsync', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ExternalServiceResourcePromise(this._withPipelineConfigurationAsyncInternal(callback));
    }
    /** @internal */
    async _withPipelineConfigurationInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new PipelineConfigurationContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfiguration', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ExternalServiceResourcePromise(this._withPipelineConfigurationInternal(callback));
    }
    /** Gets the resource name */
    async getResourceName() {
        const rpcArgs = { resource: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/getResourceName', rpcArgs);
    }
    /** @internal */
    async _onBeforeResourceStartedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new BeforeResourceStartedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onBeforeResourceStarted', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ExternalServiceResourcePromise(this._onBeforeResourceStartedInternal(callback));
    }
    /** @internal */
    async _onResourceStoppedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceStoppedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceStopped', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ExternalServiceResourcePromise(this._onResourceStoppedInternal(callback));
    }
    /** @internal */
    async _onInitializeResourceInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new InitializeResourceEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onInitializeResource', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ExternalServiceResourcePromise(this._onInitializeResourceInternal(callback));
    }
    /** @internal */
    async _onResourceReadyInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceReadyEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceReady', rpcArgs);
        return new ExternalServiceResource(result, this._client);
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ExternalServiceResourcePromise(this._onResourceReadyInternal(callback));
    }
}
exports.ExternalServiceResource = ExternalServiceResource;
/**
 * Thenable wrapper for ExternalServiceResource that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class ExternalServiceResourcePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withContainerRegistry(registry)));
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withDockerfileBaseImage(options)));
    }
    /** Adds an HTTP health check to an external service */
    withExternalServiceHttpHealthCheck(options) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withExternalServiceHttpHealthCheck(options)));
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withRequiredCommand(command, options)));
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withUrlsCallback(callback)));
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withUrlsCallbackAsync(callback)));
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withUrl(url, options)));
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withUrlExpression(url, options)));
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withUrlForEndpoint(endpointName, callback)));
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.excludeFromManifest()));
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withExplicitStart()));
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withHealthCheck(key)));
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withCommand(name, displayName, executeCommand, options)));
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withRelationship(resourceBuilder, type)));
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withParentRelationship(parent)));
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withChildRelationship(child)));
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withIconName(iconName, options)));
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.excludeFromMcp()));
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withPipelineStepFactory(stepName, callback, options)));
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withPipelineConfigurationAsync(callback)));
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.withPipelineConfiguration(callback)));
    }
    /** Gets the resource name */
    getResourceName() {
        return this._promise.then(obj => obj.getResourceName());
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.onBeforeResourceStarted(callback)));
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.onResourceStopped(callback)));
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.onInitializeResource(callback)));
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ExternalServiceResourcePromise(this._promise.then(obj => obj.onResourceReady(callback)));
    }
}
exports.ExternalServiceResourcePromise = ExternalServiceResourcePromise;
// ============================================================================
// JavaScriptAppResource
// ============================================================================
class JavaScriptAppResource extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** Gets the Command property */
    command = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.JavaScript/JavaScriptAppResource.command', { context: this._handle });
        },
    };
    /** Gets the WorkingDirectory property */
    workingDirectory = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.JavaScript/JavaScriptAppResource.workingDirectory', { context: this._handle });
        },
    };
    /** Gets the Name property */
    name = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.JavaScript/JavaScriptAppResource.name', { context: this._handle });
        },
    };
    /** @internal */
    async _withContainerRegistryInternal(registry) {
        const rpcArgs = { builder: this._handle, registry };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerRegistry', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new JavaScriptAppResourcePromise(this._withContainerRegistryInternal(registry));
    }
    /** @internal */
    async _withDockerfileBaseImageInternal(buildImage, runtimeImage) {
        const rpcArgs = { builder: this._handle };
        if (buildImage !== undefined)
            rpcArgs.buildImage = buildImage;
        if (runtimeImage !== undefined)
            rpcArgs.runtimeImage = runtimeImage;
        const result = await this._client.invokeCapability('Aspire.Hosting/withDockerfileBaseImage', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        const buildImage = options?.buildImage;
        const runtimeImage = options?.runtimeImage;
        return new JavaScriptAppResourcePromise(this._withDockerfileBaseImageInternal(buildImage, runtimeImage));
    }
    /** @internal */
    async _publishAsDockerFileInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/publishAsDockerFile', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Publishes the executable as a Docker container */
    publishAsDockerFile() {
        return new JavaScriptAppResourcePromise(this._publishAsDockerFileInternal());
    }
    /** @internal */
    async _publishAsDockerFileWithConfigureInternal(configure) {
        const configureId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ContainerResource(objHandle, this._client);
            await configure(obj);
        });
        const rpcArgs = { builder: this._handle, configure: configureId };
        const result = await this._client.invokeCapability('Aspire.Hosting/publishAsDockerFileWithConfigure', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Publishes an executable as a Docker file with optional container configuration */
    publishAsDockerFileWithConfigure(configure) {
        return new JavaScriptAppResourcePromise(this._publishAsDockerFileWithConfigureInternal(configure));
    }
    /** @internal */
    async _withExecutableCommandInternal(command) {
        const rpcArgs = { builder: this._handle, command };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExecutableCommand', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Sets the executable command */
    withExecutableCommand(command) {
        return new JavaScriptAppResourcePromise(this._withExecutableCommandInternal(command));
    }
    /** @internal */
    async _withWorkingDirectoryInternal(workingDirectory) {
        const rpcArgs = { builder: this._handle, workingDirectory };
        const result = await this._client.invokeCapability('Aspire.Hosting/withWorkingDirectory', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Sets the executable working directory */
    withWorkingDirectory(workingDirectory) {
        return new JavaScriptAppResourcePromise(this._withWorkingDirectoryInternal(workingDirectory));
    }
    /** @internal */
    async _withMcpServerInternal(path, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withMcpServer', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        const path = options?.path;
        const endpointName = options?.endpointName;
        return new JavaScriptAppResourcePromise(this._withMcpServerInternal(path, endpointName));
    }
    /** @internal */
    async _withOtlpExporterInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporter', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new JavaScriptAppResourcePromise(this._withOtlpExporterInternal());
    }
    /** @internal */
    async _withOtlpExporterProtocolInternal(protocol) {
        const rpcArgs = { builder: this._handle, protocol };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporterProtocol', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new JavaScriptAppResourcePromise(this._withOtlpExporterProtocolInternal(protocol));
    }
    /** @internal */
    async _withRequiredCommandInternal(command, helpLink) {
        const rpcArgs = { builder: this._handle, command };
        if (helpLink !== undefined)
            rpcArgs.helpLink = helpLink;
        const result = await this._client.invokeCapability('Aspire.Hosting/withRequiredCommand', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        const helpLink = options?.helpLink;
        return new JavaScriptAppResourcePromise(this._withRequiredCommandInternal(command, helpLink));
    }
    /** @internal */
    async _withEnvironmentCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EnvironmentCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentCallback', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new JavaScriptAppResourcePromise(this._withEnvironmentCallbackInternal(callback));
    }
    /** @internal */
    async _withEnvironmentEndpointInternal(name, endpointReference) {
        const rpcArgs = { builder: this._handle, name, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentEndpoint', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new JavaScriptAppResourcePromise(this._withEnvironmentEndpointInternal(name, endpointReference));
    }
    /** @internal */
    async _withEnvironmentInternal(name, value) {
        const rpcArgs = { builder: this._handle, name, value };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironment', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new JavaScriptAppResourcePromise(this._withEnvironmentInternal(name, value));
    }
    /** @internal */
    async _withEnvironmentParameterInternal(name, parameter) {
        const rpcArgs = { builder: this._handle, name, parameter };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentParameter', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new JavaScriptAppResourcePromise(this._withEnvironmentParameterInternal(name, parameter));
    }
    /** @internal */
    async _withEnvironmentConnectionStringInternal(envVarName, resource) {
        const rpcArgs = { builder: this._handle, envVarName, resource };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentConnectionString', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new JavaScriptAppResourcePromise(this._withEnvironmentConnectionStringInternal(envVarName, resource));
    }
    /** @internal */
    async _withArgsInternal(args) {
        const rpcArgs = { builder: this._handle, args };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgs', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds arguments */
    withArgs(args) {
        return new JavaScriptAppResourcePromise(this._withArgsInternal(args));
    }
    /** @internal */
    async _withArgsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new CommandLineArgsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallback', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new JavaScriptAppResourcePromise(this._withArgsCallbackInternal(callback));
    }
    /** @internal */
    async _withArgsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new CommandLineArgsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallbackAsync', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new JavaScriptAppResourcePromise(this._withArgsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withReferenceEnvironmentInternal(options) {
        const rpcArgs = { builder: this._handle, options };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEnvironment', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new JavaScriptAppResourcePromise(this._withReferenceEnvironmentInternal(options));
    }
    /** @internal */
    async _withReferenceInternal(source, connectionName, optional, name) {
        const rpcArgs = { builder: this._handle, source };
        if (connectionName !== undefined)
            rpcArgs.connectionName = connectionName;
        if (optional !== undefined)
            rpcArgs.optional = optional;
        if (name !== undefined)
            rpcArgs.name = name;
        const result = await this._client.invokeCapability('Aspire.Hosting/withReference', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        const connectionName = options?.connectionName;
        const optional = options?.optional;
        const name = options?.name;
        return new JavaScriptAppResourcePromise(this._withReferenceInternal(source, connectionName, optional, name));
    }
    /** @internal */
    async _withReferenceUriInternal(name, uri) {
        const rpcArgs = { builder: this._handle, name, uri };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceUri', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new JavaScriptAppResourcePromise(this._withReferenceUriInternal(name, uri));
    }
    /** @internal */
    async _withReferenceExternalServiceInternal(externalService) {
        const rpcArgs = { builder: this._handle, externalService };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceExternalService', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new JavaScriptAppResourcePromise(this._withReferenceExternalServiceInternal(externalService));
    }
    /** @internal */
    async _withReferenceEndpointInternal(endpointReference) {
        const rpcArgs = { builder: this._handle, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEndpoint', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new JavaScriptAppResourcePromise(this._withReferenceEndpointInternal(endpointReference));
    }
    /** @internal */
    async _withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (scheme !== undefined)
            rpcArgs.scheme = scheme;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        if (isExternal !== undefined)
            rpcArgs.isExternal = isExternal;
        if (protocol !== undefined)
            rpcArgs.protocol = protocol;
        const result = await this._client.invokeCapability('Aspire.Hosting/withEndpoint', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const scheme = options?.scheme;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        const isExternal = options?.isExternal;
        const protocol = options?.protocol;
        return new JavaScriptAppResourcePromise(this._withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol));
    }
    /** @internal */
    async _withHttpEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpEndpoint', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new JavaScriptAppResourcePromise(this._withHttpEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withHttpsEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpsEndpoint', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new JavaScriptAppResourcePromise(this._withHttpsEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withExternalHttpEndpointsInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExternalHttpEndpoints', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new JavaScriptAppResourcePromise(this._withExternalHttpEndpointsInternal());
    }
    /** Gets an endpoint reference */
    async getEndpoint(name) {
        const rpcArgs = { builder: this._handle, name };
        return await this._client.invokeCapability('Aspire.Hosting/getEndpoint', rpcArgs);
    }
    /** @internal */
    async _asHttp2ServiceInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/asHttp2Service', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new JavaScriptAppResourcePromise(this._asHttp2ServiceInternal());
    }
    /** @internal */
    async _withUrlsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ResourceUrlsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallback', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new JavaScriptAppResourcePromise(this._withUrlsCallbackInternal(callback));
    }
    /** @internal */
    async _withUrlsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceUrlsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallbackAsync', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new JavaScriptAppResourcePromise(this._withUrlsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withUrlInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrl', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        const displayText = options?.displayText;
        return new JavaScriptAppResourcePromise(this._withUrlInternal(url, displayText));
    }
    /** @internal */
    async _withUrlExpressionInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlExpression', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        const displayText = options?.displayText;
        return new JavaScriptAppResourcePromise(this._withUrlExpressionInternal(url, displayText));
    }
    /** @internal */
    async _withUrlForEndpointInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const obj = (0, transport_js_1.wrapIfHandle)(objData);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpoint', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new JavaScriptAppResourcePromise(this._withUrlForEndpointInternal(endpointName, callback));
    }
    /** @internal */
    async _withUrlForEndpointFactoryInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EndpointReference(argHandle, this._client);
            return await callback(arg);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpointFactory', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new JavaScriptAppResourcePromise(this._withUrlForEndpointFactoryInternal(endpointName, callback));
    }
    /** @internal */
    async _withContainerFilesSourceInternal(sourcePath) {
        const rpcArgs = { builder: this._handle, sourcePath };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerFilesSource', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Sets the source directory for container files */
    withContainerFilesSource(sourcePath) {
        return new JavaScriptAppResourcePromise(this._withContainerFilesSourceInternal(sourcePath));
    }
    /** @internal */
    async _clearContainerFilesSourcesInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/clearContainerFilesSources', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Clears all container file sources */
    clearContainerFilesSources() {
        return new JavaScriptAppResourcePromise(this._clearContainerFilesSourcesInternal());
    }
    /** @internal */
    async _excludeFromManifestInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromManifest', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new JavaScriptAppResourcePromise(this._excludeFromManifestInternal());
    }
    /** @internal */
    async _waitForInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResource', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new JavaScriptAppResourcePromise(this._waitForInternal(dependency));
    }
    /** @internal */
    async _waitForWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForWithBehavior', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new JavaScriptAppResourcePromise(this._waitForWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _waitForStartInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceStart', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new JavaScriptAppResourcePromise(this._waitForStartInternal(dependency));
    }
    /** @internal */
    async _waitForStartWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForStartWithBehavior', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new JavaScriptAppResourcePromise(this._waitForStartWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _withExplicitStartInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExplicitStart', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new JavaScriptAppResourcePromise(this._withExplicitStartInternal());
    }
    /** @internal */
    async _waitForCompletionInternal(dependency, exitCode) {
        const rpcArgs = { builder: this._handle, dependency };
        if (exitCode !== undefined)
            rpcArgs.exitCode = exitCode;
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceCompletion', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        const exitCode = options?.exitCode;
        return new JavaScriptAppResourcePromise(this._waitForCompletionInternal(dependency, exitCode));
    }
    /** @internal */
    async _withHealthCheckInternal(key) {
        const rpcArgs = { builder: this._handle, key };
        const result = await this._client.invokeCapability('Aspire.Hosting/withHealthCheck', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new JavaScriptAppResourcePromise(this._withHealthCheckInternal(key));
    }
    /** @internal */
    async _withHttpHealthCheckInternal(path, statusCode, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (statusCode !== undefined)
            rpcArgs.statusCode = statusCode;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpHealthCheck', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        const path = options?.path;
        const statusCode = options?.statusCode;
        const endpointName = options?.endpointName;
        return new JavaScriptAppResourcePromise(this._withHttpHealthCheckInternal(path, statusCode, endpointName));
    }
    /** @internal */
    async _withCommandInternal(name, displayName, executeCommand, commandOptions) {
        const executeCommandId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ExecuteCommandContext(argHandle, this._client);
            return await executeCommand(arg);
        });
        const rpcArgs = { builder: this._handle, name, displayName, executeCommand: executeCommandId };
        if (commandOptions !== undefined)
            rpcArgs.commandOptions = commandOptions;
        const result = await this._client.invokeCapability('Aspire.Hosting/withCommand', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        const commandOptions = options?.commandOptions;
        return new JavaScriptAppResourcePromise(this._withCommandInternal(name, displayName, executeCommand, commandOptions));
    }
    /** @internal */
    async _withDeveloperCertificateTrustInternal(trust) {
        const rpcArgs = { builder: this._handle, trust };
        const result = await this._client.invokeCapability('Aspire.Hosting/withDeveloperCertificateTrust', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new JavaScriptAppResourcePromise(this._withDeveloperCertificateTrustInternal(trust));
    }
    /** @internal */
    async _withCertificateTrustScopeInternal(scope) {
        const rpcArgs = { builder: this._handle, scope };
        const result = await this._client.invokeCapability('Aspire.Hosting/withCertificateTrustScope', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new JavaScriptAppResourcePromise(this._withCertificateTrustScopeInternal(scope));
    }
    /** @internal */
    async _withHttpsDeveloperCertificateInternal(password) {
        const rpcArgs = { builder: this._handle };
        if (password !== undefined)
            rpcArgs.password = password;
        const result = await this._client.invokeCapability('Aspire.Hosting/withParameterHttpsDeveloperCertificate', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        const password = options?.password;
        return new JavaScriptAppResourcePromise(this._withHttpsDeveloperCertificateInternal(password));
    }
    /** @internal */
    async _withoutHttpsCertificateInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withoutHttpsCertificate', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new JavaScriptAppResourcePromise(this._withoutHttpsCertificateInternal());
    }
    /** @internal */
    async _withRelationshipInternal(resourceBuilder, type) {
        const rpcArgs = { builder: this._handle, resourceBuilder, type };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderRelationship', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new JavaScriptAppResourcePromise(this._withRelationshipInternal(resourceBuilder, type));
    }
    /** @internal */
    async _withParentRelationshipInternal(parent) {
        const rpcArgs = { builder: this._handle, parent };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderParentRelationship', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new JavaScriptAppResourcePromise(this._withParentRelationshipInternal(parent));
    }
    /** @internal */
    async _withChildRelationshipInternal(child) {
        const rpcArgs = { builder: this._handle, child };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderChildRelationship', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new JavaScriptAppResourcePromise(this._withChildRelationshipInternal(child));
    }
    /** @internal */
    async _withIconNameInternal(iconName, iconVariant) {
        const rpcArgs = { builder: this._handle, iconName };
        if (iconVariant !== undefined)
            rpcArgs.iconVariant = iconVariant;
        const result = await this._client.invokeCapability('Aspire.Hosting/withIconName', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        const iconVariant = options?.iconVariant;
        return new JavaScriptAppResourcePromise(this._withIconNameInternal(iconName, iconVariant));
    }
    /** @internal */
    async _withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName) {
        const rpcArgs = { builder: this._handle, probeType };
        if (path !== undefined)
            rpcArgs.path = path;
        if (initialDelaySeconds !== undefined)
            rpcArgs.initialDelaySeconds = initialDelaySeconds;
        if (periodSeconds !== undefined)
            rpcArgs.periodSeconds = periodSeconds;
        if (timeoutSeconds !== undefined)
            rpcArgs.timeoutSeconds = timeoutSeconds;
        if (failureThreshold !== undefined)
            rpcArgs.failureThreshold = failureThreshold;
        if (successThreshold !== undefined)
            rpcArgs.successThreshold = successThreshold;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpProbe', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        const path = options?.path;
        const initialDelaySeconds = options?.initialDelaySeconds;
        const periodSeconds = options?.periodSeconds;
        const timeoutSeconds = options?.timeoutSeconds;
        const failureThreshold = options?.failureThreshold;
        const successThreshold = options?.successThreshold;
        const endpointName = options?.endpointName;
        return new JavaScriptAppResourcePromise(this._withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName));
    }
    /** @internal */
    async _excludeFromMcpInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromMcp', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new JavaScriptAppResourcePromise(this._excludeFromMcpInternal());
    }
    /** @internal */
    async _withRemoteImageNameInternal(remoteImageName) {
        const rpcArgs = { builder: this._handle, remoteImageName };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageName', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new JavaScriptAppResourcePromise(this._withRemoteImageNameInternal(remoteImageName));
    }
    /** @internal */
    async _withRemoteImageTagInternal(remoteImageTag) {
        const rpcArgs = { builder: this._handle, remoteImageTag };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageTag', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new JavaScriptAppResourcePromise(this._withRemoteImageTagInternal(remoteImageTag));
    }
    /** @internal */
    async _withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineStepContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, stepName, callback: callbackId };
        if (dependsOn !== undefined)
            rpcArgs.dependsOn = dependsOn;
        if (requiredBy !== undefined)
            rpcArgs.requiredBy = requiredBy;
        if (tags !== undefined)
            rpcArgs.tags = tags;
        if (description !== undefined)
            rpcArgs.description = description;
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineStepFactory', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        const dependsOn = options?.dependsOn;
        const requiredBy = options?.requiredBy;
        const tags = options?.tags;
        const description = options?.description;
        return new JavaScriptAppResourcePromise(this._withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description));
    }
    /** @internal */
    async _withPipelineConfigurationAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineConfigurationContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfigurationAsync', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new JavaScriptAppResourcePromise(this._withPipelineConfigurationAsyncInternal(callback));
    }
    /** @internal */
    async _withPipelineConfigurationInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new PipelineConfigurationContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfiguration', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new JavaScriptAppResourcePromise(this._withPipelineConfigurationInternal(callback));
    }
    /** Gets the resource name */
    async getResourceName() {
        const rpcArgs = { resource: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/getResourceName', rpcArgs);
    }
    /** @internal */
    async _onBeforeResourceStartedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new BeforeResourceStartedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onBeforeResourceStarted', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new JavaScriptAppResourcePromise(this._onBeforeResourceStartedInternal(callback));
    }
    /** @internal */
    async _onResourceStoppedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceStoppedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceStopped', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new JavaScriptAppResourcePromise(this._onResourceStoppedInternal(callback));
    }
    /** @internal */
    async _onInitializeResourceInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new InitializeResourceEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onInitializeResource', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new JavaScriptAppResourcePromise(this._onInitializeResourceInternal(callback));
    }
    /** @internal */
    async _onResourceEndpointsAllocatedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceEndpointsAllocatedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceEndpointsAllocated', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new JavaScriptAppResourcePromise(this._onResourceEndpointsAllocatedInternal(callback));
    }
    /** @internal */
    async _onResourceReadyInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceReadyEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceReady', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new JavaScriptAppResourcePromise(this._onResourceReadyInternal(callback));
    }
    /** @internal */
    async _withNpmInternal(install, installCommand, installArgs) {
        const rpcArgs = { resource: this._handle };
        if (install !== undefined)
            rpcArgs.install = install;
        if (installCommand !== undefined)
            rpcArgs.installCommand = installCommand;
        if (installArgs !== undefined)
            rpcArgs.installArgs = installArgs;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withNpm', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Configures npm as the package manager */
    withNpm(options) {
        const install = options?.install;
        const installCommand = options?.installCommand;
        const installArgs = options?.installArgs;
        return new JavaScriptAppResourcePromise(this._withNpmInternal(install, installCommand, installArgs));
    }
    /** @internal */
    async _withBunInternal(install, installArgs) {
        const rpcArgs = { resource: this._handle };
        if (install !== undefined)
            rpcArgs.install = install;
        if (installArgs !== undefined)
            rpcArgs.installArgs = installArgs;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withBun', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Configures Bun as the package manager */
    withBun(options) {
        const install = options?.install;
        const installArgs = options?.installArgs;
        return new JavaScriptAppResourcePromise(this._withBunInternal(install, installArgs));
    }
    /** @internal */
    async _withYarnInternal(install, installArgs) {
        const rpcArgs = { resource: this._handle };
        if (install !== undefined)
            rpcArgs.install = install;
        if (installArgs !== undefined)
            rpcArgs.installArgs = installArgs;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withYarn', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Configures yarn as the package manager */
    withYarn(options) {
        const install = options?.install;
        const installArgs = options?.installArgs;
        return new JavaScriptAppResourcePromise(this._withYarnInternal(install, installArgs));
    }
    /** @internal */
    async _withPnpmInternal(install, installArgs) {
        const rpcArgs = { resource: this._handle };
        if (install !== undefined)
            rpcArgs.install = install;
        if (installArgs !== undefined)
            rpcArgs.installArgs = installArgs;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withPnpm', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Configures pnpm as the package manager */
    withPnpm(options) {
        const install = options?.install;
        const installArgs = options?.installArgs;
        return new JavaScriptAppResourcePromise(this._withPnpmInternal(install, installArgs));
    }
    /** @internal */
    async _withBuildScriptInternal(scriptName, args) {
        const rpcArgs = { resource: this._handle, scriptName };
        if (args !== undefined)
            rpcArgs.args = args;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withBuildScript', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Specifies an npm script to run before starting the application */
    withBuildScript(scriptName, options) {
        const args = options?.args;
        return new JavaScriptAppResourcePromise(this._withBuildScriptInternal(scriptName, args));
    }
    /** @internal */
    async _withRunScriptInternal(scriptName, args) {
        const rpcArgs = { resource: this._handle, scriptName };
        if (args !== undefined)
            rpcArgs.args = args;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withRunScript', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Specifies an npm script to run during development */
    withRunScript(scriptName, options) {
        const args = options?.args;
        return new JavaScriptAppResourcePromise(this._withRunScriptInternal(scriptName, args));
    }
    /** @internal */
    async _withBrowserDebuggerInternal(browser) {
        const rpcArgs = { builder: this._handle };
        if (browser !== undefined)
            rpcArgs.browser = browser;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withBrowserDebugger', rpcArgs);
        return new JavaScriptAppResource(result, this._client);
    }
    /** Configures a browser debugger for the JavaScript application */
    withBrowserDebugger(options) {
        const browser = options?.browser;
        return new JavaScriptAppResourcePromise(this._withBrowserDebuggerInternal(browser));
    }
}
exports.JavaScriptAppResource = JavaScriptAppResource;
/**
 * Thenable wrapper for JavaScriptAppResource that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class JavaScriptAppResourcePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withContainerRegistry(registry)));
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withDockerfileBaseImage(options)));
    }
    /** Publishes the executable as a Docker container */
    publishAsDockerFile() {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.publishAsDockerFile()));
    }
    /** Publishes an executable as a Docker file with optional container configuration */
    publishAsDockerFileWithConfigure(configure) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.publishAsDockerFileWithConfigure(configure)));
    }
    /** Sets the executable command */
    withExecutableCommand(command) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withExecutableCommand(command)));
    }
    /** Sets the executable working directory */
    withWorkingDirectory(workingDirectory) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withWorkingDirectory(workingDirectory)));
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withMcpServer(options)));
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withOtlpExporter()));
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withOtlpExporterProtocol(protocol)));
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withRequiredCommand(command, options)));
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withEnvironmentCallback(callback)));
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withEnvironmentEndpoint(name, endpointReference)));
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withEnvironment(name, value)));
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withEnvironmentParameter(name, parameter)));
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withEnvironmentConnectionString(envVarName, resource)));
    }
    /** Adds arguments */
    withArgs(args) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withArgs(args)));
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withArgsCallback(callback)));
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withArgsCallbackAsync(callback)));
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withReferenceEnvironment(options)));
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withReference(source, options)));
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withReferenceUri(name, uri)));
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withReferenceExternalService(externalService)));
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withReferenceEndpoint(endpointReference)));
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withEndpoint(options)));
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withHttpEndpoint(options)));
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withHttpsEndpoint(options)));
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withExternalHttpEndpoints()));
    }
    /** Gets an endpoint reference */
    getEndpoint(name) {
        return this._promise.then(obj => obj.getEndpoint(name));
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.asHttp2Service()));
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withUrlsCallback(callback)));
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withUrlsCallbackAsync(callback)));
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withUrl(url, options)));
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withUrlExpression(url, options)));
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withUrlForEndpoint(endpointName, callback)));
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withUrlForEndpointFactory(endpointName, callback)));
    }
    /** Sets the source directory for container files */
    withContainerFilesSource(sourcePath) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withContainerFilesSource(sourcePath)));
    }
    /** Clears all container file sources */
    clearContainerFilesSources() {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.clearContainerFilesSources()));
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.excludeFromManifest()));
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.waitFor(dependency)));
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.waitForWithBehavior(dependency, waitBehavior)));
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.waitForStart(dependency)));
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.waitForStartWithBehavior(dependency, waitBehavior)));
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withExplicitStart()));
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.waitForCompletion(dependency, options)));
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withHealthCheck(key)));
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withHttpHealthCheck(options)));
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withCommand(name, displayName, executeCommand, options)));
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withDeveloperCertificateTrust(trust)));
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withCertificateTrustScope(scope)));
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withHttpsDeveloperCertificate(options)));
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withoutHttpsCertificate()));
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withRelationship(resourceBuilder, type)));
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withParentRelationship(parent)));
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withChildRelationship(child)));
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withIconName(iconName, options)));
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withHttpProbe(probeType, options)));
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.excludeFromMcp()));
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withRemoteImageName(remoteImageName)));
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withRemoteImageTag(remoteImageTag)));
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withPipelineStepFactory(stepName, callback, options)));
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withPipelineConfigurationAsync(callback)));
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withPipelineConfiguration(callback)));
    }
    /** Gets the resource name */
    getResourceName() {
        return this._promise.then(obj => obj.getResourceName());
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.onBeforeResourceStarted(callback)));
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.onResourceStopped(callback)));
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.onInitializeResource(callback)));
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.onResourceEndpointsAllocated(callback)));
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.onResourceReady(callback)));
    }
    /** Configures npm as the package manager */
    withNpm(options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withNpm(options)));
    }
    /** Configures Bun as the package manager */
    withBun(options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withBun(options)));
    }
    /** Configures yarn as the package manager */
    withYarn(options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withYarn(options)));
    }
    /** Configures pnpm as the package manager */
    withPnpm(options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withPnpm(options)));
    }
    /** Specifies an npm script to run before starting the application */
    withBuildScript(scriptName, options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withBuildScript(scriptName, options)));
    }
    /** Specifies an npm script to run during development */
    withRunScript(scriptName, options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withRunScript(scriptName, options)));
    }
    /** Configures a browser debugger for the JavaScript application */
    withBrowserDebugger(options) {
        return new JavaScriptAppResourcePromise(this._promise.then(obj => obj.withBrowserDebugger(options)));
    }
}
exports.JavaScriptAppResourcePromise = JavaScriptAppResourcePromise;
// ============================================================================
// NodeAppResource
// ============================================================================
class NodeAppResource extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** Gets the Command property */
    command = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.JavaScript/JavaScriptAppResource.command', { context: this._handle });
        },
    };
    /** Gets the WorkingDirectory property */
    workingDirectory = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.JavaScript/JavaScriptAppResource.workingDirectory', { context: this._handle });
        },
    };
    /** Gets the Name property */
    name = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.JavaScript/JavaScriptAppResource.name', { context: this._handle });
        },
    };
    /** @internal */
    async _withContainerRegistryInternal(registry) {
        const rpcArgs = { builder: this._handle, registry };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerRegistry', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new NodeAppResourcePromise(this._withContainerRegistryInternal(registry));
    }
    /** @internal */
    async _withDockerfileBaseImageInternal(buildImage, runtimeImage) {
        const rpcArgs = { builder: this._handle };
        if (buildImage !== undefined)
            rpcArgs.buildImage = buildImage;
        if (runtimeImage !== undefined)
            rpcArgs.runtimeImage = runtimeImage;
        const result = await this._client.invokeCapability('Aspire.Hosting/withDockerfileBaseImage', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        const buildImage = options?.buildImage;
        const runtimeImage = options?.runtimeImage;
        return new NodeAppResourcePromise(this._withDockerfileBaseImageInternal(buildImage, runtimeImage));
    }
    /** @internal */
    async _publishAsDockerFileInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/publishAsDockerFile', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Publishes the executable as a Docker container */
    publishAsDockerFile() {
        return new NodeAppResourcePromise(this._publishAsDockerFileInternal());
    }
    /** @internal */
    async _publishAsDockerFileWithConfigureInternal(configure) {
        const configureId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ContainerResource(objHandle, this._client);
            await configure(obj);
        });
        const rpcArgs = { builder: this._handle, configure: configureId };
        const result = await this._client.invokeCapability('Aspire.Hosting/publishAsDockerFileWithConfigure', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Publishes an executable as a Docker file with optional container configuration */
    publishAsDockerFileWithConfigure(configure) {
        return new NodeAppResourcePromise(this._publishAsDockerFileWithConfigureInternal(configure));
    }
    /** @internal */
    async _withExecutableCommandInternal(command) {
        const rpcArgs = { builder: this._handle, command };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExecutableCommand', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Sets the executable command */
    withExecutableCommand(command) {
        return new NodeAppResourcePromise(this._withExecutableCommandInternal(command));
    }
    /** @internal */
    async _withWorkingDirectoryInternal(workingDirectory) {
        const rpcArgs = { builder: this._handle, workingDirectory };
        const result = await this._client.invokeCapability('Aspire.Hosting/withWorkingDirectory', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Sets the executable working directory */
    withWorkingDirectory(workingDirectory) {
        return new NodeAppResourcePromise(this._withWorkingDirectoryInternal(workingDirectory));
    }
    /** @internal */
    async _withMcpServerInternal(path, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withMcpServer', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        const path = options?.path;
        const endpointName = options?.endpointName;
        return new NodeAppResourcePromise(this._withMcpServerInternal(path, endpointName));
    }
    /** @internal */
    async _withOtlpExporterInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporter', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new NodeAppResourcePromise(this._withOtlpExporterInternal());
    }
    /** @internal */
    async _withOtlpExporterProtocolInternal(protocol) {
        const rpcArgs = { builder: this._handle, protocol };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporterProtocol', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new NodeAppResourcePromise(this._withOtlpExporterProtocolInternal(protocol));
    }
    /** @internal */
    async _withRequiredCommandInternal(command, helpLink) {
        const rpcArgs = { builder: this._handle, command };
        if (helpLink !== undefined)
            rpcArgs.helpLink = helpLink;
        const result = await this._client.invokeCapability('Aspire.Hosting/withRequiredCommand', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        const helpLink = options?.helpLink;
        return new NodeAppResourcePromise(this._withRequiredCommandInternal(command, helpLink));
    }
    /** @internal */
    async _withEnvironmentCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EnvironmentCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentCallback', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new NodeAppResourcePromise(this._withEnvironmentCallbackInternal(callback));
    }
    /** @internal */
    async _withEnvironmentEndpointInternal(name, endpointReference) {
        const rpcArgs = { builder: this._handle, name, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentEndpoint', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new NodeAppResourcePromise(this._withEnvironmentEndpointInternal(name, endpointReference));
    }
    /** @internal */
    async _withEnvironmentInternal(name, value) {
        const rpcArgs = { builder: this._handle, name, value };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironment', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new NodeAppResourcePromise(this._withEnvironmentInternal(name, value));
    }
    /** @internal */
    async _withEnvironmentParameterInternal(name, parameter) {
        const rpcArgs = { builder: this._handle, name, parameter };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentParameter', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new NodeAppResourcePromise(this._withEnvironmentParameterInternal(name, parameter));
    }
    /** @internal */
    async _withEnvironmentConnectionStringInternal(envVarName, resource) {
        const rpcArgs = { builder: this._handle, envVarName, resource };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentConnectionString', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new NodeAppResourcePromise(this._withEnvironmentConnectionStringInternal(envVarName, resource));
    }
    /** @internal */
    async _withArgsInternal(args) {
        const rpcArgs = { builder: this._handle, args };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgs', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds arguments */
    withArgs(args) {
        return new NodeAppResourcePromise(this._withArgsInternal(args));
    }
    /** @internal */
    async _withArgsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new CommandLineArgsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallback', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new NodeAppResourcePromise(this._withArgsCallbackInternal(callback));
    }
    /** @internal */
    async _withArgsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new CommandLineArgsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallbackAsync', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new NodeAppResourcePromise(this._withArgsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withReferenceEnvironmentInternal(options) {
        const rpcArgs = { builder: this._handle, options };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEnvironment', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new NodeAppResourcePromise(this._withReferenceEnvironmentInternal(options));
    }
    /** @internal */
    async _withReferenceInternal(source, connectionName, optional, name) {
        const rpcArgs = { builder: this._handle, source };
        if (connectionName !== undefined)
            rpcArgs.connectionName = connectionName;
        if (optional !== undefined)
            rpcArgs.optional = optional;
        if (name !== undefined)
            rpcArgs.name = name;
        const result = await this._client.invokeCapability('Aspire.Hosting/withReference', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        const connectionName = options?.connectionName;
        const optional = options?.optional;
        const name = options?.name;
        return new NodeAppResourcePromise(this._withReferenceInternal(source, connectionName, optional, name));
    }
    /** @internal */
    async _withReferenceUriInternal(name, uri) {
        const rpcArgs = { builder: this._handle, name, uri };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceUri', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new NodeAppResourcePromise(this._withReferenceUriInternal(name, uri));
    }
    /** @internal */
    async _withReferenceExternalServiceInternal(externalService) {
        const rpcArgs = { builder: this._handle, externalService };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceExternalService', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new NodeAppResourcePromise(this._withReferenceExternalServiceInternal(externalService));
    }
    /** @internal */
    async _withReferenceEndpointInternal(endpointReference) {
        const rpcArgs = { builder: this._handle, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEndpoint', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new NodeAppResourcePromise(this._withReferenceEndpointInternal(endpointReference));
    }
    /** @internal */
    async _withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (scheme !== undefined)
            rpcArgs.scheme = scheme;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        if (isExternal !== undefined)
            rpcArgs.isExternal = isExternal;
        if (protocol !== undefined)
            rpcArgs.protocol = protocol;
        const result = await this._client.invokeCapability('Aspire.Hosting/withEndpoint', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const scheme = options?.scheme;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        const isExternal = options?.isExternal;
        const protocol = options?.protocol;
        return new NodeAppResourcePromise(this._withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol));
    }
    /** @internal */
    async _withHttpEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpEndpoint', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new NodeAppResourcePromise(this._withHttpEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withHttpsEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpsEndpoint', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new NodeAppResourcePromise(this._withHttpsEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withExternalHttpEndpointsInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExternalHttpEndpoints', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new NodeAppResourcePromise(this._withExternalHttpEndpointsInternal());
    }
    /** Gets an endpoint reference */
    async getEndpoint(name) {
        const rpcArgs = { builder: this._handle, name };
        return await this._client.invokeCapability('Aspire.Hosting/getEndpoint', rpcArgs);
    }
    /** @internal */
    async _asHttp2ServiceInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/asHttp2Service', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new NodeAppResourcePromise(this._asHttp2ServiceInternal());
    }
    /** @internal */
    async _withUrlsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ResourceUrlsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallback', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new NodeAppResourcePromise(this._withUrlsCallbackInternal(callback));
    }
    /** @internal */
    async _withUrlsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceUrlsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallbackAsync', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new NodeAppResourcePromise(this._withUrlsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withUrlInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrl', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        const displayText = options?.displayText;
        return new NodeAppResourcePromise(this._withUrlInternal(url, displayText));
    }
    /** @internal */
    async _withUrlExpressionInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlExpression', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        const displayText = options?.displayText;
        return new NodeAppResourcePromise(this._withUrlExpressionInternal(url, displayText));
    }
    /** @internal */
    async _withUrlForEndpointInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const obj = (0, transport_js_1.wrapIfHandle)(objData);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpoint', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new NodeAppResourcePromise(this._withUrlForEndpointInternal(endpointName, callback));
    }
    /** @internal */
    async _withUrlForEndpointFactoryInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EndpointReference(argHandle, this._client);
            return await callback(arg);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpointFactory', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new NodeAppResourcePromise(this._withUrlForEndpointFactoryInternal(endpointName, callback));
    }
    /** @internal */
    async _publishWithContainerFilesInternal(source, destinationPath) {
        const rpcArgs = { builder: this._handle, source, destinationPath };
        const result = await this._client.invokeCapability('Aspire.Hosting/publishWithContainerFilesFromResource', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Configures the resource to copy container files from the specified source during publishing */
    publishWithContainerFiles(source, destinationPath) {
        return new NodeAppResourcePromise(this._publishWithContainerFilesInternal(source, destinationPath));
    }
    /** @internal */
    async _withContainerFilesSourceInternal(sourcePath) {
        const rpcArgs = { builder: this._handle, sourcePath };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerFilesSource', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Sets the source directory for container files */
    withContainerFilesSource(sourcePath) {
        return new NodeAppResourcePromise(this._withContainerFilesSourceInternal(sourcePath));
    }
    /** @internal */
    async _clearContainerFilesSourcesInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/clearContainerFilesSources', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Clears all container file sources */
    clearContainerFilesSources() {
        return new NodeAppResourcePromise(this._clearContainerFilesSourcesInternal());
    }
    /** @internal */
    async _excludeFromManifestInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromManifest', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new NodeAppResourcePromise(this._excludeFromManifestInternal());
    }
    /** @internal */
    async _waitForInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResource', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new NodeAppResourcePromise(this._waitForInternal(dependency));
    }
    /** @internal */
    async _waitForWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForWithBehavior', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new NodeAppResourcePromise(this._waitForWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _waitForStartInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceStart', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new NodeAppResourcePromise(this._waitForStartInternal(dependency));
    }
    /** @internal */
    async _waitForStartWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForStartWithBehavior', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new NodeAppResourcePromise(this._waitForStartWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _withExplicitStartInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExplicitStart', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new NodeAppResourcePromise(this._withExplicitStartInternal());
    }
    /** @internal */
    async _waitForCompletionInternal(dependency, exitCode) {
        const rpcArgs = { builder: this._handle, dependency };
        if (exitCode !== undefined)
            rpcArgs.exitCode = exitCode;
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceCompletion', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        const exitCode = options?.exitCode;
        return new NodeAppResourcePromise(this._waitForCompletionInternal(dependency, exitCode));
    }
    /** @internal */
    async _withHealthCheckInternal(key) {
        const rpcArgs = { builder: this._handle, key };
        const result = await this._client.invokeCapability('Aspire.Hosting/withHealthCheck', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new NodeAppResourcePromise(this._withHealthCheckInternal(key));
    }
    /** @internal */
    async _withHttpHealthCheckInternal(path, statusCode, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (statusCode !== undefined)
            rpcArgs.statusCode = statusCode;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpHealthCheck', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        const path = options?.path;
        const statusCode = options?.statusCode;
        const endpointName = options?.endpointName;
        return new NodeAppResourcePromise(this._withHttpHealthCheckInternal(path, statusCode, endpointName));
    }
    /** @internal */
    async _withCommandInternal(name, displayName, executeCommand, commandOptions) {
        const executeCommandId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ExecuteCommandContext(argHandle, this._client);
            return await executeCommand(arg);
        });
        const rpcArgs = { builder: this._handle, name, displayName, executeCommand: executeCommandId };
        if (commandOptions !== undefined)
            rpcArgs.commandOptions = commandOptions;
        const result = await this._client.invokeCapability('Aspire.Hosting/withCommand', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        const commandOptions = options?.commandOptions;
        return new NodeAppResourcePromise(this._withCommandInternal(name, displayName, executeCommand, commandOptions));
    }
    /** @internal */
    async _withDeveloperCertificateTrustInternal(trust) {
        const rpcArgs = { builder: this._handle, trust };
        const result = await this._client.invokeCapability('Aspire.Hosting/withDeveloperCertificateTrust', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new NodeAppResourcePromise(this._withDeveloperCertificateTrustInternal(trust));
    }
    /** @internal */
    async _withCertificateTrustScopeInternal(scope) {
        const rpcArgs = { builder: this._handle, scope };
        const result = await this._client.invokeCapability('Aspire.Hosting/withCertificateTrustScope', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new NodeAppResourcePromise(this._withCertificateTrustScopeInternal(scope));
    }
    /** @internal */
    async _withHttpsDeveloperCertificateInternal(password) {
        const rpcArgs = { builder: this._handle };
        if (password !== undefined)
            rpcArgs.password = password;
        const result = await this._client.invokeCapability('Aspire.Hosting/withParameterHttpsDeveloperCertificate', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        const password = options?.password;
        return new NodeAppResourcePromise(this._withHttpsDeveloperCertificateInternal(password));
    }
    /** @internal */
    async _withoutHttpsCertificateInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withoutHttpsCertificate', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new NodeAppResourcePromise(this._withoutHttpsCertificateInternal());
    }
    /** @internal */
    async _withRelationshipInternal(resourceBuilder, type) {
        const rpcArgs = { builder: this._handle, resourceBuilder, type };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderRelationship', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new NodeAppResourcePromise(this._withRelationshipInternal(resourceBuilder, type));
    }
    /** @internal */
    async _withParentRelationshipInternal(parent) {
        const rpcArgs = { builder: this._handle, parent };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderParentRelationship', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new NodeAppResourcePromise(this._withParentRelationshipInternal(parent));
    }
    /** @internal */
    async _withChildRelationshipInternal(child) {
        const rpcArgs = { builder: this._handle, child };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderChildRelationship', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new NodeAppResourcePromise(this._withChildRelationshipInternal(child));
    }
    /** @internal */
    async _withIconNameInternal(iconName, iconVariant) {
        const rpcArgs = { builder: this._handle, iconName };
        if (iconVariant !== undefined)
            rpcArgs.iconVariant = iconVariant;
        const result = await this._client.invokeCapability('Aspire.Hosting/withIconName', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        const iconVariant = options?.iconVariant;
        return new NodeAppResourcePromise(this._withIconNameInternal(iconName, iconVariant));
    }
    /** @internal */
    async _withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName) {
        const rpcArgs = { builder: this._handle, probeType };
        if (path !== undefined)
            rpcArgs.path = path;
        if (initialDelaySeconds !== undefined)
            rpcArgs.initialDelaySeconds = initialDelaySeconds;
        if (periodSeconds !== undefined)
            rpcArgs.periodSeconds = periodSeconds;
        if (timeoutSeconds !== undefined)
            rpcArgs.timeoutSeconds = timeoutSeconds;
        if (failureThreshold !== undefined)
            rpcArgs.failureThreshold = failureThreshold;
        if (successThreshold !== undefined)
            rpcArgs.successThreshold = successThreshold;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpProbe', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        const path = options?.path;
        const initialDelaySeconds = options?.initialDelaySeconds;
        const periodSeconds = options?.periodSeconds;
        const timeoutSeconds = options?.timeoutSeconds;
        const failureThreshold = options?.failureThreshold;
        const successThreshold = options?.successThreshold;
        const endpointName = options?.endpointName;
        return new NodeAppResourcePromise(this._withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName));
    }
    /** @internal */
    async _excludeFromMcpInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromMcp', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new NodeAppResourcePromise(this._excludeFromMcpInternal());
    }
    /** @internal */
    async _withRemoteImageNameInternal(remoteImageName) {
        const rpcArgs = { builder: this._handle, remoteImageName };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageName', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new NodeAppResourcePromise(this._withRemoteImageNameInternal(remoteImageName));
    }
    /** @internal */
    async _withRemoteImageTagInternal(remoteImageTag) {
        const rpcArgs = { builder: this._handle, remoteImageTag };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageTag', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new NodeAppResourcePromise(this._withRemoteImageTagInternal(remoteImageTag));
    }
    /** @internal */
    async _withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineStepContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, stepName, callback: callbackId };
        if (dependsOn !== undefined)
            rpcArgs.dependsOn = dependsOn;
        if (requiredBy !== undefined)
            rpcArgs.requiredBy = requiredBy;
        if (tags !== undefined)
            rpcArgs.tags = tags;
        if (description !== undefined)
            rpcArgs.description = description;
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineStepFactory', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        const dependsOn = options?.dependsOn;
        const requiredBy = options?.requiredBy;
        const tags = options?.tags;
        const description = options?.description;
        return new NodeAppResourcePromise(this._withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description));
    }
    /** @internal */
    async _withPipelineConfigurationAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineConfigurationContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfigurationAsync', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new NodeAppResourcePromise(this._withPipelineConfigurationAsyncInternal(callback));
    }
    /** @internal */
    async _withPipelineConfigurationInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new PipelineConfigurationContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfiguration', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new NodeAppResourcePromise(this._withPipelineConfigurationInternal(callback));
    }
    /** Gets the resource name */
    async getResourceName() {
        const rpcArgs = { resource: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/getResourceName', rpcArgs);
    }
    /** @internal */
    async _onBeforeResourceStartedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new BeforeResourceStartedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onBeforeResourceStarted', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new NodeAppResourcePromise(this._onBeforeResourceStartedInternal(callback));
    }
    /** @internal */
    async _onResourceStoppedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceStoppedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceStopped', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new NodeAppResourcePromise(this._onResourceStoppedInternal(callback));
    }
    /** @internal */
    async _onInitializeResourceInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new InitializeResourceEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onInitializeResource', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new NodeAppResourcePromise(this._onInitializeResourceInternal(callback));
    }
    /** @internal */
    async _onResourceEndpointsAllocatedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceEndpointsAllocatedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceEndpointsAllocated', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new NodeAppResourcePromise(this._onResourceEndpointsAllocatedInternal(callback));
    }
    /** @internal */
    async _onResourceReadyInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceReadyEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceReady', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new NodeAppResourcePromise(this._onResourceReadyInternal(callback));
    }
    /** @internal */
    async _withNpmInternal(install, installCommand, installArgs) {
        const rpcArgs = { resource: this._handle };
        if (install !== undefined)
            rpcArgs.install = install;
        if (installCommand !== undefined)
            rpcArgs.installCommand = installCommand;
        if (installArgs !== undefined)
            rpcArgs.installArgs = installArgs;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withNpm', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Configures npm as the package manager */
    withNpm(options) {
        const install = options?.install;
        const installCommand = options?.installCommand;
        const installArgs = options?.installArgs;
        return new NodeAppResourcePromise(this._withNpmInternal(install, installCommand, installArgs));
    }
    /** @internal */
    async _withBunInternal(install, installArgs) {
        const rpcArgs = { resource: this._handle };
        if (install !== undefined)
            rpcArgs.install = install;
        if (installArgs !== undefined)
            rpcArgs.installArgs = installArgs;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withBun', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Configures Bun as the package manager */
    withBun(options) {
        const install = options?.install;
        const installArgs = options?.installArgs;
        return new NodeAppResourcePromise(this._withBunInternal(install, installArgs));
    }
    /** @internal */
    async _withYarnInternal(install, installArgs) {
        const rpcArgs = { resource: this._handle };
        if (install !== undefined)
            rpcArgs.install = install;
        if (installArgs !== undefined)
            rpcArgs.installArgs = installArgs;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withYarn', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Configures yarn as the package manager */
    withYarn(options) {
        const install = options?.install;
        const installArgs = options?.installArgs;
        return new NodeAppResourcePromise(this._withYarnInternal(install, installArgs));
    }
    /** @internal */
    async _withPnpmInternal(install, installArgs) {
        const rpcArgs = { resource: this._handle };
        if (install !== undefined)
            rpcArgs.install = install;
        if (installArgs !== undefined)
            rpcArgs.installArgs = installArgs;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withPnpm', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Configures pnpm as the package manager */
    withPnpm(options) {
        const install = options?.install;
        const installArgs = options?.installArgs;
        return new NodeAppResourcePromise(this._withPnpmInternal(install, installArgs));
    }
    /** @internal */
    async _withBuildScriptInternal(scriptName, args) {
        const rpcArgs = { resource: this._handle, scriptName };
        if (args !== undefined)
            rpcArgs.args = args;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withBuildScript', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Specifies an npm script to run before starting the application */
    withBuildScript(scriptName, options) {
        const args = options?.args;
        return new NodeAppResourcePromise(this._withBuildScriptInternal(scriptName, args));
    }
    /** @internal */
    async _withRunScriptInternal(scriptName, args) {
        const rpcArgs = { resource: this._handle, scriptName };
        if (args !== undefined)
            rpcArgs.args = args;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withRunScript', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Specifies an npm script to run during development */
    withRunScript(scriptName, options) {
        const args = options?.args;
        return new NodeAppResourcePromise(this._withRunScriptInternal(scriptName, args));
    }
    /** @internal */
    async _withBrowserDebuggerInternal(browser) {
        const rpcArgs = { builder: this._handle };
        if (browser !== undefined)
            rpcArgs.browser = browser;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withBrowserDebugger', rpcArgs);
        return new NodeAppResource(result, this._client);
    }
    /** Configures a browser debugger for the JavaScript application */
    withBrowserDebugger(options) {
        const browser = options?.browser;
        return new NodeAppResourcePromise(this._withBrowserDebuggerInternal(browser));
    }
}
exports.NodeAppResource = NodeAppResource;
/**
 * Thenable wrapper for NodeAppResource that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class NodeAppResourcePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withContainerRegistry(registry)));
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withDockerfileBaseImage(options)));
    }
    /** Publishes the executable as a Docker container */
    publishAsDockerFile() {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.publishAsDockerFile()));
    }
    /** Publishes an executable as a Docker file with optional container configuration */
    publishAsDockerFileWithConfigure(configure) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.publishAsDockerFileWithConfigure(configure)));
    }
    /** Sets the executable command */
    withExecutableCommand(command) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withExecutableCommand(command)));
    }
    /** Sets the executable working directory */
    withWorkingDirectory(workingDirectory) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withWorkingDirectory(workingDirectory)));
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withMcpServer(options)));
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withOtlpExporter()));
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withOtlpExporterProtocol(protocol)));
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withRequiredCommand(command, options)));
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withEnvironmentCallback(callback)));
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withEnvironmentEndpoint(name, endpointReference)));
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withEnvironment(name, value)));
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withEnvironmentParameter(name, parameter)));
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withEnvironmentConnectionString(envVarName, resource)));
    }
    /** Adds arguments */
    withArgs(args) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withArgs(args)));
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withArgsCallback(callback)));
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withArgsCallbackAsync(callback)));
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withReferenceEnvironment(options)));
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withReference(source, options)));
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withReferenceUri(name, uri)));
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withReferenceExternalService(externalService)));
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withReferenceEndpoint(endpointReference)));
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withEndpoint(options)));
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withHttpEndpoint(options)));
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withHttpsEndpoint(options)));
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withExternalHttpEndpoints()));
    }
    /** Gets an endpoint reference */
    getEndpoint(name) {
        return this._promise.then(obj => obj.getEndpoint(name));
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.asHttp2Service()));
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withUrlsCallback(callback)));
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withUrlsCallbackAsync(callback)));
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withUrl(url, options)));
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withUrlExpression(url, options)));
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withUrlForEndpoint(endpointName, callback)));
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withUrlForEndpointFactory(endpointName, callback)));
    }
    /** Configures the resource to copy container files from the specified source during publishing */
    publishWithContainerFiles(source, destinationPath) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.publishWithContainerFiles(source, destinationPath)));
    }
    /** Sets the source directory for container files */
    withContainerFilesSource(sourcePath) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withContainerFilesSource(sourcePath)));
    }
    /** Clears all container file sources */
    clearContainerFilesSources() {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.clearContainerFilesSources()));
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.excludeFromManifest()));
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.waitFor(dependency)));
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.waitForWithBehavior(dependency, waitBehavior)));
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.waitForStart(dependency)));
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.waitForStartWithBehavior(dependency, waitBehavior)));
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withExplicitStart()));
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.waitForCompletion(dependency, options)));
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withHealthCheck(key)));
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withHttpHealthCheck(options)));
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withCommand(name, displayName, executeCommand, options)));
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withDeveloperCertificateTrust(trust)));
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withCertificateTrustScope(scope)));
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withHttpsDeveloperCertificate(options)));
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withoutHttpsCertificate()));
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withRelationship(resourceBuilder, type)));
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withParentRelationship(parent)));
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withChildRelationship(child)));
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withIconName(iconName, options)));
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withHttpProbe(probeType, options)));
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.excludeFromMcp()));
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withRemoteImageName(remoteImageName)));
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withRemoteImageTag(remoteImageTag)));
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withPipelineStepFactory(stepName, callback, options)));
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withPipelineConfigurationAsync(callback)));
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withPipelineConfiguration(callback)));
    }
    /** Gets the resource name */
    getResourceName() {
        return this._promise.then(obj => obj.getResourceName());
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.onBeforeResourceStarted(callback)));
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.onResourceStopped(callback)));
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.onInitializeResource(callback)));
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.onResourceEndpointsAllocated(callback)));
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.onResourceReady(callback)));
    }
    /** Configures npm as the package manager */
    withNpm(options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withNpm(options)));
    }
    /** Configures Bun as the package manager */
    withBun(options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withBun(options)));
    }
    /** Configures yarn as the package manager */
    withYarn(options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withYarn(options)));
    }
    /** Configures pnpm as the package manager */
    withPnpm(options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withPnpm(options)));
    }
    /** Specifies an npm script to run before starting the application */
    withBuildScript(scriptName, options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withBuildScript(scriptName, options)));
    }
    /** Specifies an npm script to run during development */
    withRunScript(scriptName, options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withRunScript(scriptName, options)));
    }
    /** Configures a browser debugger for the JavaScript application */
    withBrowserDebugger(options) {
        return new NodeAppResourcePromise(this._promise.then(obj => obj.withBrowserDebugger(options)));
    }
}
exports.NodeAppResourcePromise = NodeAppResourcePromise;
// ============================================================================
// ParameterResource
// ============================================================================
class ParameterResource extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _withContainerRegistryInternal(registry) {
        const rpcArgs = { builder: this._handle, registry };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerRegistry', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ParameterResourcePromise(this._withContainerRegistryInternal(registry));
    }
    /** @internal */
    async _withDockerfileBaseImageInternal(buildImage, runtimeImage) {
        const rpcArgs = { builder: this._handle };
        if (buildImage !== undefined)
            rpcArgs.buildImage = buildImage;
        if (runtimeImage !== undefined)
            rpcArgs.runtimeImage = runtimeImage;
        const result = await this._client.invokeCapability('Aspire.Hosting/withDockerfileBaseImage', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        const buildImage = options?.buildImage;
        const runtimeImage = options?.runtimeImage;
        return new ParameterResourcePromise(this._withDockerfileBaseImageInternal(buildImage, runtimeImage));
    }
    /** @internal */
    async _withDescriptionInternal(description, enableMarkdown) {
        const rpcArgs = { builder: this._handle, description };
        if (enableMarkdown !== undefined)
            rpcArgs.enableMarkdown = enableMarkdown;
        const result = await this._client.invokeCapability('Aspire.Hosting/withDescription', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Sets a parameter description */
    withDescription(description, options) {
        const enableMarkdown = options?.enableMarkdown;
        return new ParameterResourcePromise(this._withDescriptionInternal(description, enableMarkdown));
    }
    /** @internal */
    async _withRequiredCommandInternal(command, helpLink) {
        const rpcArgs = { builder: this._handle, command };
        if (helpLink !== undefined)
            rpcArgs.helpLink = helpLink;
        const result = await this._client.invokeCapability('Aspire.Hosting/withRequiredCommand', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        const helpLink = options?.helpLink;
        return new ParameterResourcePromise(this._withRequiredCommandInternal(command, helpLink));
    }
    /** @internal */
    async _withUrlsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ResourceUrlsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallback', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ParameterResourcePromise(this._withUrlsCallbackInternal(callback));
    }
    /** @internal */
    async _withUrlsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceUrlsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallbackAsync', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ParameterResourcePromise(this._withUrlsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withUrlInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrl', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        const displayText = options?.displayText;
        return new ParameterResourcePromise(this._withUrlInternal(url, displayText));
    }
    /** @internal */
    async _withUrlExpressionInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlExpression', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        const displayText = options?.displayText;
        return new ParameterResourcePromise(this._withUrlExpressionInternal(url, displayText));
    }
    /** @internal */
    async _withUrlForEndpointInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const obj = (0, transport_js_1.wrapIfHandle)(objData);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpoint', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ParameterResourcePromise(this._withUrlForEndpointInternal(endpointName, callback));
    }
    /** @internal */
    async _excludeFromManifestInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromManifest', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ParameterResourcePromise(this._excludeFromManifestInternal());
    }
    /** @internal */
    async _withExplicitStartInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExplicitStart', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ParameterResourcePromise(this._withExplicitStartInternal());
    }
    /** @internal */
    async _withHealthCheckInternal(key) {
        const rpcArgs = { builder: this._handle, key };
        const result = await this._client.invokeCapability('Aspire.Hosting/withHealthCheck', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ParameterResourcePromise(this._withHealthCheckInternal(key));
    }
    /** @internal */
    async _withCommandInternal(name, displayName, executeCommand, commandOptions) {
        const executeCommandId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ExecuteCommandContext(argHandle, this._client);
            return await executeCommand(arg);
        });
        const rpcArgs = { builder: this._handle, name, displayName, executeCommand: executeCommandId };
        if (commandOptions !== undefined)
            rpcArgs.commandOptions = commandOptions;
        const result = await this._client.invokeCapability('Aspire.Hosting/withCommand', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        const commandOptions = options?.commandOptions;
        return new ParameterResourcePromise(this._withCommandInternal(name, displayName, executeCommand, commandOptions));
    }
    /** @internal */
    async _withRelationshipInternal(resourceBuilder, type) {
        const rpcArgs = { builder: this._handle, resourceBuilder, type };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderRelationship', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ParameterResourcePromise(this._withRelationshipInternal(resourceBuilder, type));
    }
    /** @internal */
    async _withParentRelationshipInternal(parent) {
        const rpcArgs = { builder: this._handle, parent };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderParentRelationship', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ParameterResourcePromise(this._withParentRelationshipInternal(parent));
    }
    /** @internal */
    async _withChildRelationshipInternal(child) {
        const rpcArgs = { builder: this._handle, child };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderChildRelationship', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ParameterResourcePromise(this._withChildRelationshipInternal(child));
    }
    /** @internal */
    async _withIconNameInternal(iconName, iconVariant) {
        const rpcArgs = { builder: this._handle, iconName };
        if (iconVariant !== undefined)
            rpcArgs.iconVariant = iconVariant;
        const result = await this._client.invokeCapability('Aspire.Hosting/withIconName', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        const iconVariant = options?.iconVariant;
        return new ParameterResourcePromise(this._withIconNameInternal(iconName, iconVariant));
    }
    /** @internal */
    async _excludeFromMcpInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromMcp', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ParameterResourcePromise(this._excludeFromMcpInternal());
    }
    /** @internal */
    async _withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineStepContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, stepName, callback: callbackId };
        if (dependsOn !== undefined)
            rpcArgs.dependsOn = dependsOn;
        if (requiredBy !== undefined)
            rpcArgs.requiredBy = requiredBy;
        if (tags !== undefined)
            rpcArgs.tags = tags;
        if (description !== undefined)
            rpcArgs.description = description;
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineStepFactory', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        const dependsOn = options?.dependsOn;
        const requiredBy = options?.requiredBy;
        const tags = options?.tags;
        const description = options?.description;
        return new ParameterResourcePromise(this._withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description));
    }
    /** @internal */
    async _withPipelineConfigurationAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineConfigurationContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfigurationAsync', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ParameterResourcePromise(this._withPipelineConfigurationAsyncInternal(callback));
    }
    /** @internal */
    async _withPipelineConfigurationInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new PipelineConfigurationContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfiguration', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ParameterResourcePromise(this._withPipelineConfigurationInternal(callback));
    }
    /** Gets the resource name */
    async getResourceName() {
        const rpcArgs = { resource: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/getResourceName', rpcArgs);
    }
    /** @internal */
    async _onBeforeResourceStartedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new BeforeResourceStartedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onBeforeResourceStarted', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ParameterResourcePromise(this._onBeforeResourceStartedInternal(callback));
    }
    /** @internal */
    async _onResourceStoppedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceStoppedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceStopped', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ParameterResourcePromise(this._onResourceStoppedInternal(callback));
    }
    /** @internal */
    async _onInitializeResourceInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new InitializeResourceEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onInitializeResource', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ParameterResourcePromise(this._onInitializeResourceInternal(callback));
    }
    /** @internal */
    async _onResourceReadyInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceReadyEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceReady', rpcArgs);
        return new ParameterResource(result, this._client);
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ParameterResourcePromise(this._onResourceReadyInternal(callback));
    }
}
exports.ParameterResource = ParameterResource;
/**
 * Thenable wrapper for ParameterResource that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class ParameterResourcePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withContainerRegistry(registry)));
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withDockerfileBaseImage(options)));
    }
    /** Sets a parameter description */
    withDescription(description, options) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withDescription(description, options)));
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withRequiredCommand(command, options)));
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withUrlsCallback(callback)));
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withUrlsCallbackAsync(callback)));
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withUrl(url, options)));
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withUrlExpression(url, options)));
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withUrlForEndpoint(endpointName, callback)));
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ParameterResourcePromise(this._promise.then(obj => obj.excludeFromManifest()));
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withExplicitStart()));
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withHealthCheck(key)));
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withCommand(name, displayName, executeCommand, options)));
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withRelationship(resourceBuilder, type)));
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withParentRelationship(parent)));
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withChildRelationship(child)));
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withIconName(iconName, options)));
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ParameterResourcePromise(this._promise.then(obj => obj.excludeFromMcp()));
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withPipelineStepFactory(stepName, callback, options)));
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withPipelineConfigurationAsync(callback)));
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.withPipelineConfiguration(callback)));
    }
    /** Gets the resource name */
    getResourceName() {
        return this._promise.then(obj => obj.getResourceName());
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.onBeforeResourceStarted(callback)));
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.onResourceStopped(callback)));
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.onInitializeResource(callback)));
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ParameterResourcePromise(this._promise.then(obj => obj.onResourceReady(callback)));
    }
}
exports.ParameterResourcePromise = ParameterResourcePromise;
// ============================================================================
// ProjectResource
// ============================================================================
class ProjectResource extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _withContainerRegistryInternal(registry) {
        const rpcArgs = { builder: this._handle, registry };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerRegistry', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ProjectResourcePromise(this._withContainerRegistryInternal(registry));
    }
    /** @internal */
    async _withDockerfileBaseImageInternal(buildImage, runtimeImage) {
        const rpcArgs = { builder: this._handle };
        if (buildImage !== undefined)
            rpcArgs.buildImage = buildImage;
        if (runtimeImage !== undefined)
            rpcArgs.runtimeImage = runtimeImage;
        const result = await this._client.invokeCapability('Aspire.Hosting/withDockerfileBaseImage', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        const buildImage = options?.buildImage;
        const runtimeImage = options?.runtimeImage;
        return new ProjectResourcePromise(this._withDockerfileBaseImageInternal(buildImage, runtimeImage));
    }
    /** @internal */
    async _withMcpServerInternal(path, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withMcpServer', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        const path = options?.path;
        const endpointName = options?.endpointName;
        return new ProjectResourcePromise(this._withMcpServerInternal(path, endpointName));
    }
    /** @internal */
    async _withOtlpExporterInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporter', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new ProjectResourcePromise(this._withOtlpExporterInternal());
    }
    /** @internal */
    async _withOtlpExporterProtocolInternal(protocol) {
        const rpcArgs = { builder: this._handle, protocol };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporterProtocol', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new ProjectResourcePromise(this._withOtlpExporterProtocolInternal(protocol));
    }
    /** @internal */
    async _withReplicasInternal(replicas) {
        const rpcArgs = { builder: this._handle, replicas };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReplicas', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Sets the number of replicas */
    withReplicas(replicas) {
        return new ProjectResourcePromise(this._withReplicasInternal(replicas));
    }
    /** @internal */
    async _disableForwardedHeadersInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/disableForwardedHeaders', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Disables forwarded headers for the project */
    disableForwardedHeaders() {
        return new ProjectResourcePromise(this._disableForwardedHeadersInternal());
    }
    /** @internal */
    async _publishAsDockerFileInternal(configure) {
        const configureId = configure ? (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ContainerResource(objHandle, this._client);
            await configure(obj);
        }) : undefined;
        const rpcArgs = { builder: this._handle };
        if (configure !== undefined)
            rpcArgs.configure = configureId;
        const result = await this._client.invokeCapability('Aspire.Hosting/publishProjectAsDockerFileWithConfigure', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Publishes a project as a Docker file with optional container configuration */
    publishAsDockerFile(options) {
        const configure = options?.configure;
        return new ProjectResourcePromise(this._publishAsDockerFileInternal(configure));
    }
    /** @internal */
    async _withRequiredCommandInternal(command, helpLink) {
        const rpcArgs = { builder: this._handle, command };
        if (helpLink !== undefined)
            rpcArgs.helpLink = helpLink;
        const result = await this._client.invokeCapability('Aspire.Hosting/withRequiredCommand', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        const helpLink = options?.helpLink;
        return new ProjectResourcePromise(this._withRequiredCommandInternal(command, helpLink));
    }
    /** @internal */
    async _withEnvironmentCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EnvironmentCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentCallback', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new ProjectResourcePromise(this._withEnvironmentCallbackInternal(callback));
    }
    /** @internal */
    async _withEnvironmentEndpointInternal(name, endpointReference) {
        const rpcArgs = { builder: this._handle, name, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentEndpoint', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new ProjectResourcePromise(this._withEnvironmentEndpointInternal(name, endpointReference));
    }
    /** @internal */
    async _withEnvironmentInternal(name, value) {
        const rpcArgs = { builder: this._handle, name, value };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironment', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new ProjectResourcePromise(this._withEnvironmentInternal(name, value));
    }
    /** @internal */
    async _withEnvironmentParameterInternal(name, parameter) {
        const rpcArgs = { builder: this._handle, name, parameter };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentParameter', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new ProjectResourcePromise(this._withEnvironmentParameterInternal(name, parameter));
    }
    /** @internal */
    async _withEnvironmentConnectionStringInternal(envVarName, resource) {
        const rpcArgs = { builder: this._handle, envVarName, resource };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentConnectionString', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new ProjectResourcePromise(this._withEnvironmentConnectionStringInternal(envVarName, resource));
    }
    /** @internal */
    async _withArgsInternal(args) {
        const rpcArgs = { builder: this._handle, args };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgs', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds arguments */
    withArgs(args) {
        return new ProjectResourcePromise(this._withArgsInternal(args));
    }
    /** @internal */
    async _withArgsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new CommandLineArgsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallback', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new ProjectResourcePromise(this._withArgsCallbackInternal(callback));
    }
    /** @internal */
    async _withArgsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new CommandLineArgsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallbackAsync', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new ProjectResourcePromise(this._withArgsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withReferenceEnvironmentInternal(options) {
        const rpcArgs = { builder: this._handle, options };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEnvironment', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new ProjectResourcePromise(this._withReferenceEnvironmentInternal(options));
    }
    /** @internal */
    async _withReferenceInternal(source, connectionName, optional, name) {
        const rpcArgs = { builder: this._handle, source };
        if (connectionName !== undefined)
            rpcArgs.connectionName = connectionName;
        if (optional !== undefined)
            rpcArgs.optional = optional;
        if (name !== undefined)
            rpcArgs.name = name;
        const result = await this._client.invokeCapability('Aspire.Hosting/withReference', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        const connectionName = options?.connectionName;
        const optional = options?.optional;
        const name = options?.name;
        return new ProjectResourcePromise(this._withReferenceInternal(source, connectionName, optional, name));
    }
    /** @internal */
    async _withReferenceUriInternal(name, uri) {
        const rpcArgs = { builder: this._handle, name, uri };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceUri', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new ProjectResourcePromise(this._withReferenceUriInternal(name, uri));
    }
    /** @internal */
    async _withReferenceExternalServiceInternal(externalService) {
        const rpcArgs = { builder: this._handle, externalService };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceExternalService', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new ProjectResourcePromise(this._withReferenceExternalServiceInternal(externalService));
    }
    /** @internal */
    async _withReferenceEndpointInternal(endpointReference) {
        const rpcArgs = { builder: this._handle, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEndpoint', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new ProjectResourcePromise(this._withReferenceEndpointInternal(endpointReference));
    }
    /** @internal */
    async _withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (scheme !== undefined)
            rpcArgs.scheme = scheme;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        if (isExternal !== undefined)
            rpcArgs.isExternal = isExternal;
        if (protocol !== undefined)
            rpcArgs.protocol = protocol;
        const result = await this._client.invokeCapability('Aspire.Hosting/withEndpoint', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const scheme = options?.scheme;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        const isExternal = options?.isExternal;
        const protocol = options?.protocol;
        return new ProjectResourcePromise(this._withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol));
    }
    /** @internal */
    async _withHttpEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpEndpoint', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new ProjectResourcePromise(this._withHttpEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withHttpsEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpsEndpoint', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new ProjectResourcePromise(this._withHttpsEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withExternalHttpEndpointsInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExternalHttpEndpoints', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new ProjectResourcePromise(this._withExternalHttpEndpointsInternal());
    }
    /** Gets an endpoint reference */
    async getEndpoint(name) {
        const rpcArgs = { builder: this._handle, name };
        return await this._client.invokeCapability('Aspire.Hosting/getEndpoint', rpcArgs);
    }
    /** @internal */
    async _asHttp2ServiceInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/asHttp2Service', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new ProjectResourcePromise(this._asHttp2ServiceInternal());
    }
    /** @internal */
    async _withUrlsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ResourceUrlsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallback', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ProjectResourcePromise(this._withUrlsCallbackInternal(callback));
    }
    /** @internal */
    async _withUrlsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceUrlsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallbackAsync', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ProjectResourcePromise(this._withUrlsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withUrlInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrl', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        const displayText = options?.displayText;
        return new ProjectResourcePromise(this._withUrlInternal(url, displayText));
    }
    /** @internal */
    async _withUrlExpressionInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlExpression', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        const displayText = options?.displayText;
        return new ProjectResourcePromise(this._withUrlExpressionInternal(url, displayText));
    }
    /** @internal */
    async _withUrlForEndpointInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const obj = (0, transport_js_1.wrapIfHandle)(objData);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpoint', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ProjectResourcePromise(this._withUrlForEndpointInternal(endpointName, callback));
    }
    /** @internal */
    async _withUrlForEndpointFactoryInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EndpointReference(argHandle, this._client);
            return await callback(arg);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpointFactory', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new ProjectResourcePromise(this._withUrlForEndpointFactoryInternal(endpointName, callback));
    }
    /** @internal */
    async _publishWithContainerFilesInternal(source, destinationPath) {
        const rpcArgs = { builder: this._handle, source, destinationPath };
        const result = await this._client.invokeCapability('Aspire.Hosting/publishWithContainerFilesFromResource', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Configures the resource to copy container files from the specified source during publishing */
    publishWithContainerFiles(source, destinationPath) {
        return new ProjectResourcePromise(this._publishWithContainerFilesInternal(source, destinationPath));
    }
    /** @internal */
    async _excludeFromManifestInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromManifest', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ProjectResourcePromise(this._excludeFromManifestInternal());
    }
    /** @internal */
    async _waitForInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResource', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new ProjectResourcePromise(this._waitForInternal(dependency));
    }
    /** @internal */
    async _waitForWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForWithBehavior', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new ProjectResourcePromise(this._waitForWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _waitForStartInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceStart', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new ProjectResourcePromise(this._waitForStartInternal(dependency));
    }
    /** @internal */
    async _waitForStartWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForStartWithBehavior', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new ProjectResourcePromise(this._waitForStartWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _withExplicitStartInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExplicitStart', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ProjectResourcePromise(this._withExplicitStartInternal());
    }
    /** @internal */
    async _waitForCompletionInternal(dependency, exitCode) {
        const rpcArgs = { builder: this._handle, dependency };
        if (exitCode !== undefined)
            rpcArgs.exitCode = exitCode;
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceCompletion', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        const exitCode = options?.exitCode;
        return new ProjectResourcePromise(this._waitForCompletionInternal(dependency, exitCode));
    }
    /** @internal */
    async _withHealthCheckInternal(key) {
        const rpcArgs = { builder: this._handle, key };
        const result = await this._client.invokeCapability('Aspire.Hosting/withHealthCheck', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ProjectResourcePromise(this._withHealthCheckInternal(key));
    }
    /** @internal */
    async _withHttpHealthCheckInternal(path, statusCode, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (statusCode !== undefined)
            rpcArgs.statusCode = statusCode;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpHealthCheck', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        const path = options?.path;
        const statusCode = options?.statusCode;
        const endpointName = options?.endpointName;
        return new ProjectResourcePromise(this._withHttpHealthCheckInternal(path, statusCode, endpointName));
    }
    /** @internal */
    async _withCommandInternal(name, displayName, executeCommand, commandOptions) {
        const executeCommandId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ExecuteCommandContext(argHandle, this._client);
            return await executeCommand(arg);
        });
        const rpcArgs = { builder: this._handle, name, displayName, executeCommand: executeCommandId };
        if (commandOptions !== undefined)
            rpcArgs.commandOptions = commandOptions;
        const result = await this._client.invokeCapability('Aspire.Hosting/withCommand', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        const commandOptions = options?.commandOptions;
        return new ProjectResourcePromise(this._withCommandInternal(name, displayName, executeCommand, commandOptions));
    }
    /** @internal */
    async _withDeveloperCertificateTrustInternal(trust) {
        const rpcArgs = { builder: this._handle, trust };
        const result = await this._client.invokeCapability('Aspire.Hosting/withDeveloperCertificateTrust', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new ProjectResourcePromise(this._withDeveloperCertificateTrustInternal(trust));
    }
    /** @internal */
    async _withCertificateTrustScopeInternal(scope) {
        const rpcArgs = { builder: this._handle, scope };
        const result = await this._client.invokeCapability('Aspire.Hosting/withCertificateTrustScope', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new ProjectResourcePromise(this._withCertificateTrustScopeInternal(scope));
    }
    /** @internal */
    async _withHttpsDeveloperCertificateInternal(password) {
        const rpcArgs = { builder: this._handle };
        if (password !== undefined)
            rpcArgs.password = password;
        const result = await this._client.invokeCapability('Aspire.Hosting/withParameterHttpsDeveloperCertificate', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        const password = options?.password;
        return new ProjectResourcePromise(this._withHttpsDeveloperCertificateInternal(password));
    }
    /** @internal */
    async _withoutHttpsCertificateInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withoutHttpsCertificate', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new ProjectResourcePromise(this._withoutHttpsCertificateInternal());
    }
    /** @internal */
    async _withRelationshipInternal(resourceBuilder, type) {
        const rpcArgs = { builder: this._handle, resourceBuilder, type };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderRelationship', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ProjectResourcePromise(this._withRelationshipInternal(resourceBuilder, type));
    }
    /** @internal */
    async _withParentRelationshipInternal(parent) {
        const rpcArgs = { builder: this._handle, parent };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderParentRelationship', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ProjectResourcePromise(this._withParentRelationshipInternal(parent));
    }
    /** @internal */
    async _withChildRelationshipInternal(child) {
        const rpcArgs = { builder: this._handle, child };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderChildRelationship', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ProjectResourcePromise(this._withChildRelationshipInternal(child));
    }
    /** @internal */
    async _withIconNameInternal(iconName, iconVariant) {
        const rpcArgs = { builder: this._handle, iconName };
        if (iconVariant !== undefined)
            rpcArgs.iconVariant = iconVariant;
        const result = await this._client.invokeCapability('Aspire.Hosting/withIconName', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        const iconVariant = options?.iconVariant;
        return new ProjectResourcePromise(this._withIconNameInternal(iconName, iconVariant));
    }
    /** @internal */
    async _withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName) {
        const rpcArgs = { builder: this._handle, probeType };
        if (path !== undefined)
            rpcArgs.path = path;
        if (initialDelaySeconds !== undefined)
            rpcArgs.initialDelaySeconds = initialDelaySeconds;
        if (periodSeconds !== undefined)
            rpcArgs.periodSeconds = periodSeconds;
        if (timeoutSeconds !== undefined)
            rpcArgs.timeoutSeconds = timeoutSeconds;
        if (failureThreshold !== undefined)
            rpcArgs.failureThreshold = failureThreshold;
        if (successThreshold !== undefined)
            rpcArgs.successThreshold = successThreshold;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpProbe', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        const path = options?.path;
        const initialDelaySeconds = options?.initialDelaySeconds;
        const periodSeconds = options?.periodSeconds;
        const timeoutSeconds = options?.timeoutSeconds;
        const failureThreshold = options?.failureThreshold;
        const successThreshold = options?.successThreshold;
        const endpointName = options?.endpointName;
        return new ProjectResourcePromise(this._withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName));
    }
    /** @internal */
    async _excludeFromMcpInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromMcp', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ProjectResourcePromise(this._excludeFromMcpInternal());
    }
    /** @internal */
    async _withRemoteImageNameInternal(remoteImageName) {
        const rpcArgs = { builder: this._handle, remoteImageName };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageName', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new ProjectResourcePromise(this._withRemoteImageNameInternal(remoteImageName));
    }
    /** @internal */
    async _withRemoteImageTagInternal(remoteImageTag) {
        const rpcArgs = { builder: this._handle, remoteImageTag };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageTag', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new ProjectResourcePromise(this._withRemoteImageTagInternal(remoteImageTag));
    }
    /** @internal */
    async _withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineStepContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, stepName, callback: callbackId };
        if (dependsOn !== undefined)
            rpcArgs.dependsOn = dependsOn;
        if (requiredBy !== undefined)
            rpcArgs.requiredBy = requiredBy;
        if (tags !== undefined)
            rpcArgs.tags = tags;
        if (description !== undefined)
            rpcArgs.description = description;
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineStepFactory', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        const dependsOn = options?.dependsOn;
        const requiredBy = options?.requiredBy;
        const tags = options?.tags;
        const description = options?.description;
        return new ProjectResourcePromise(this._withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description));
    }
    /** @internal */
    async _withPipelineConfigurationAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineConfigurationContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfigurationAsync', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ProjectResourcePromise(this._withPipelineConfigurationAsyncInternal(callback));
    }
    /** @internal */
    async _withPipelineConfigurationInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new PipelineConfigurationContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfiguration', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ProjectResourcePromise(this._withPipelineConfigurationInternal(callback));
    }
    /** Gets the resource name */
    async getResourceName() {
        const rpcArgs = { resource: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/getResourceName', rpcArgs);
    }
    /** @internal */
    async _onBeforeResourceStartedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new BeforeResourceStartedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onBeforeResourceStarted', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ProjectResourcePromise(this._onBeforeResourceStartedInternal(callback));
    }
    /** @internal */
    async _onResourceStoppedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceStoppedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceStopped', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ProjectResourcePromise(this._onResourceStoppedInternal(callback));
    }
    /** @internal */
    async _onInitializeResourceInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new InitializeResourceEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onInitializeResource', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ProjectResourcePromise(this._onInitializeResourceInternal(callback));
    }
    /** @internal */
    async _onResourceEndpointsAllocatedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceEndpointsAllocatedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceEndpointsAllocated', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new ProjectResourcePromise(this._onResourceEndpointsAllocatedInternal(callback));
    }
    /** @internal */
    async _onResourceReadyInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceReadyEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceReady', rpcArgs);
        return new ProjectResource(result, this._client);
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ProjectResourcePromise(this._onResourceReadyInternal(callback));
    }
}
exports.ProjectResource = ProjectResource;
/**
 * Thenable wrapper for ProjectResource that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class ProjectResourcePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withContainerRegistry(registry)));
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withDockerfileBaseImage(options)));
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withMcpServer(options)));
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withOtlpExporter()));
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withOtlpExporterProtocol(protocol)));
    }
    /** Sets the number of replicas */
    withReplicas(replicas) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withReplicas(replicas)));
    }
    /** Disables forwarded headers for the project */
    disableForwardedHeaders() {
        return new ProjectResourcePromise(this._promise.then(obj => obj.disableForwardedHeaders()));
    }
    /** Publishes a project as a Docker file with optional container configuration */
    publishAsDockerFile(options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.publishAsDockerFile(options)));
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withRequiredCommand(command, options)));
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withEnvironmentCallback(callback)));
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withEnvironmentEndpoint(name, endpointReference)));
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withEnvironment(name, value)));
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withEnvironmentParameter(name, parameter)));
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withEnvironmentConnectionString(envVarName, resource)));
    }
    /** Adds arguments */
    withArgs(args) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withArgs(args)));
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withArgsCallback(callback)));
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withArgsCallbackAsync(callback)));
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withReferenceEnvironment(options)));
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withReference(source, options)));
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withReferenceUri(name, uri)));
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withReferenceExternalService(externalService)));
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withReferenceEndpoint(endpointReference)));
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withEndpoint(options)));
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withHttpEndpoint(options)));
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withHttpsEndpoint(options)));
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withExternalHttpEndpoints()));
    }
    /** Gets an endpoint reference */
    getEndpoint(name) {
        return this._promise.then(obj => obj.getEndpoint(name));
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new ProjectResourcePromise(this._promise.then(obj => obj.asHttp2Service()));
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withUrlsCallback(callback)));
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withUrlsCallbackAsync(callback)));
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withUrl(url, options)));
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withUrlExpression(url, options)));
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withUrlForEndpoint(endpointName, callback)));
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withUrlForEndpointFactory(endpointName, callback)));
    }
    /** Configures the resource to copy container files from the specified source during publishing */
    publishWithContainerFiles(source, destinationPath) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.publishWithContainerFiles(source, destinationPath)));
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ProjectResourcePromise(this._promise.then(obj => obj.excludeFromManifest()));
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.waitFor(dependency)));
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.waitForWithBehavior(dependency, waitBehavior)));
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.waitForStart(dependency)));
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.waitForStartWithBehavior(dependency, waitBehavior)));
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withExplicitStart()));
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.waitForCompletion(dependency, options)));
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withHealthCheck(key)));
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withHttpHealthCheck(options)));
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withCommand(name, displayName, executeCommand, options)));
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withDeveloperCertificateTrust(trust)));
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withCertificateTrustScope(scope)));
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withHttpsDeveloperCertificate(options)));
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withoutHttpsCertificate()));
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withRelationship(resourceBuilder, type)));
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withParentRelationship(parent)));
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withChildRelationship(child)));
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withIconName(iconName, options)));
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withHttpProbe(probeType, options)));
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ProjectResourcePromise(this._promise.then(obj => obj.excludeFromMcp()));
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withRemoteImageName(remoteImageName)));
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withRemoteImageTag(remoteImageTag)));
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withPipelineStepFactory(stepName, callback, options)));
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withPipelineConfigurationAsync(callback)));
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.withPipelineConfiguration(callback)));
    }
    /** Gets the resource name */
    getResourceName() {
        return this._promise.then(obj => obj.getResourceName());
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.onBeforeResourceStarted(callback)));
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.onResourceStopped(callback)));
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.onInitializeResource(callback)));
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.onResourceEndpointsAllocated(callback)));
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ProjectResourcePromise(this._promise.then(obj => obj.onResourceReady(callback)));
    }
}
exports.ProjectResourcePromise = ProjectResourcePromise;
// ============================================================================
// ViteAppResource
// ============================================================================
class ViteAppResource extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** Gets the Command property */
    command = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.JavaScript/JavaScriptAppResource.command', { context: this._handle });
        },
    };
    /** Gets the WorkingDirectory property */
    workingDirectory = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.JavaScript/JavaScriptAppResource.workingDirectory', { context: this._handle });
        },
    };
    /** Gets the Name property */
    name = {
        get: async () => {
            return await this._client.invokeCapability('Aspire.Hosting.JavaScript/JavaScriptAppResource.name', { context: this._handle });
        },
    };
    /** @internal */
    async _withContainerRegistryInternal(registry) {
        const rpcArgs = { builder: this._handle, registry };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerRegistry', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ViteAppResourcePromise(this._withContainerRegistryInternal(registry));
    }
    /** @internal */
    async _withDockerfileBaseImageInternal(buildImage, runtimeImage) {
        const rpcArgs = { builder: this._handle };
        if (buildImage !== undefined)
            rpcArgs.buildImage = buildImage;
        if (runtimeImage !== undefined)
            rpcArgs.runtimeImage = runtimeImage;
        const result = await this._client.invokeCapability('Aspire.Hosting/withDockerfileBaseImage', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        const buildImage = options?.buildImage;
        const runtimeImage = options?.runtimeImage;
        return new ViteAppResourcePromise(this._withDockerfileBaseImageInternal(buildImage, runtimeImage));
    }
    /** @internal */
    async _publishAsDockerFileInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/publishAsDockerFile', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Publishes the executable as a Docker container */
    publishAsDockerFile() {
        return new ViteAppResourcePromise(this._publishAsDockerFileInternal());
    }
    /** @internal */
    async _publishAsDockerFileWithConfigureInternal(configure) {
        const configureId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ContainerResource(objHandle, this._client);
            await configure(obj);
        });
        const rpcArgs = { builder: this._handle, configure: configureId };
        const result = await this._client.invokeCapability('Aspire.Hosting/publishAsDockerFileWithConfigure', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Publishes an executable as a Docker file with optional container configuration */
    publishAsDockerFileWithConfigure(configure) {
        return new ViteAppResourcePromise(this._publishAsDockerFileWithConfigureInternal(configure));
    }
    /** @internal */
    async _withExecutableCommandInternal(command) {
        const rpcArgs = { builder: this._handle, command };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExecutableCommand', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Sets the executable command */
    withExecutableCommand(command) {
        return new ViteAppResourcePromise(this._withExecutableCommandInternal(command));
    }
    /** @internal */
    async _withWorkingDirectoryInternal(workingDirectory) {
        const rpcArgs = { builder: this._handle, workingDirectory };
        const result = await this._client.invokeCapability('Aspire.Hosting/withWorkingDirectory', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Sets the executable working directory */
    withWorkingDirectory(workingDirectory) {
        return new ViteAppResourcePromise(this._withWorkingDirectoryInternal(workingDirectory));
    }
    /** @internal */
    async _withMcpServerInternal(path, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withMcpServer', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        const path = options?.path;
        const endpointName = options?.endpointName;
        return new ViteAppResourcePromise(this._withMcpServerInternal(path, endpointName));
    }
    /** @internal */
    async _withOtlpExporterInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporter', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new ViteAppResourcePromise(this._withOtlpExporterInternal());
    }
    /** @internal */
    async _withOtlpExporterProtocolInternal(protocol) {
        const rpcArgs = { builder: this._handle, protocol };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporterProtocol', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new ViteAppResourcePromise(this._withOtlpExporterProtocolInternal(protocol));
    }
    /** @internal */
    async _withRequiredCommandInternal(command, helpLink) {
        const rpcArgs = { builder: this._handle, command };
        if (helpLink !== undefined)
            rpcArgs.helpLink = helpLink;
        const result = await this._client.invokeCapability('Aspire.Hosting/withRequiredCommand', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        const helpLink = options?.helpLink;
        return new ViteAppResourcePromise(this._withRequiredCommandInternal(command, helpLink));
    }
    /** @internal */
    async _withEnvironmentCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EnvironmentCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentCallback', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new ViteAppResourcePromise(this._withEnvironmentCallbackInternal(callback));
    }
    /** @internal */
    async _withEnvironmentEndpointInternal(name, endpointReference) {
        const rpcArgs = { builder: this._handle, name, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentEndpoint', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new ViteAppResourcePromise(this._withEnvironmentEndpointInternal(name, endpointReference));
    }
    /** @internal */
    async _withEnvironmentInternal(name, value) {
        const rpcArgs = { builder: this._handle, name, value };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironment', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new ViteAppResourcePromise(this._withEnvironmentInternal(name, value));
    }
    /** @internal */
    async _withEnvironmentParameterInternal(name, parameter) {
        const rpcArgs = { builder: this._handle, name, parameter };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentParameter', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new ViteAppResourcePromise(this._withEnvironmentParameterInternal(name, parameter));
    }
    /** @internal */
    async _withEnvironmentConnectionStringInternal(envVarName, resource) {
        const rpcArgs = { builder: this._handle, envVarName, resource };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentConnectionString', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new ViteAppResourcePromise(this._withEnvironmentConnectionStringInternal(envVarName, resource));
    }
    /** @internal */
    async _withArgsInternal(args) {
        const rpcArgs = { builder: this._handle, args };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgs', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds arguments */
    withArgs(args) {
        return new ViteAppResourcePromise(this._withArgsInternal(args));
    }
    /** @internal */
    async _withArgsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new CommandLineArgsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallback', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new ViteAppResourcePromise(this._withArgsCallbackInternal(callback));
    }
    /** @internal */
    async _withArgsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new CommandLineArgsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallbackAsync', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new ViteAppResourcePromise(this._withArgsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withReferenceEnvironmentInternal(options) {
        const rpcArgs = { builder: this._handle, options };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEnvironment', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new ViteAppResourcePromise(this._withReferenceEnvironmentInternal(options));
    }
    /** @internal */
    async _withReferenceInternal(source, connectionName, optional, name) {
        const rpcArgs = { builder: this._handle, source };
        if (connectionName !== undefined)
            rpcArgs.connectionName = connectionName;
        if (optional !== undefined)
            rpcArgs.optional = optional;
        if (name !== undefined)
            rpcArgs.name = name;
        const result = await this._client.invokeCapability('Aspire.Hosting/withReference', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        const connectionName = options?.connectionName;
        const optional = options?.optional;
        const name = options?.name;
        return new ViteAppResourcePromise(this._withReferenceInternal(source, connectionName, optional, name));
    }
    /** @internal */
    async _withReferenceUriInternal(name, uri) {
        const rpcArgs = { builder: this._handle, name, uri };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceUri', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new ViteAppResourcePromise(this._withReferenceUriInternal(name, uri));
    }
    /** @internal */
    async _withReferenceExternalServiceInternal(externalService) {
        const rpcArgs = { builder: this._handle, externalService };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceExternalService', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new ViteAppResourcePromise(this._withReferenceExternalServiceInternal(externalService));
    }
    /** @internal */
    async _withReferenceEndpointInternal(endpointReference) {
        const rpcArgs = { builder: this._handle, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEndpoint', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new ViteAppResourcePromise(this._withReferenceEndpointInternal(endpointReference));
    }
    /** @internal */
    async _withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (scheme !== undefined)
            rpcArgs.scheme = scheme;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        if (isExternal !== undefined)
            rpcArgs.isExternal = isExternal;
        if (protocol !== undefined)
            rpcArgs.protocol = protocol;
        const result = await this._client.invokeCapability('Aspire.Hosting/withEndpoint', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const scheme = options?.scheme;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        const isExternal = options?.isExternal;
        const protocol = options?.protocol;
        return new ViteAppResourcePromise(this._withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol));
    }
    /** @internal */
    async _withHttpEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpEndpoint', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new ViteAppResourcePromise(this._withHttpEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withHttpsEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpsEndpoint', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new ViteAppResourcePromise(this._withHttpsEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withExternalHttpEndpointsInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExternalHttpEndpoints', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new ViteAppResourcePromise(this._withExternalHttpEndpointsInternal());
    }
    /** Gets an endpoint reference */
    async getEndpoint(name) {
        const rpcArgs = { builder: this._handle, name };
        return await this._client.invokeCapability('Aspire.Hosting/getEndpoint', rpcArgs);
    }
    /** @internal */
    async _asHttp2ServiceInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/asHttp2Service', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new ViteAppResourcePromise(this._asHttp2ServiceInternal());
    }
    /** @internal */
    async _withUrlsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ResourceUrlsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallback', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ViteAppResourcePromise(this._withUrlsCallbackInternal(callback));
    }
    /** @internal */
    async _withUrlsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceUrlsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallbackAsync', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ViteAppResourcePromise(this._withUrlsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withUrlInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrl', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        const displayText = options?.displayText;
        return new ViteAppResourcePromise(this._withUrlInternal(url, displayText));
    }
    /** @internal */
    async _withUrlExpressionInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlExpression', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        const displayText = options?.displayText;
        return new ViteAppResourcePromise(this._withUrlExpressionInternal(url, displayText));
    }
    /** @internal */
    async _withUrlForEndpointInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const obj = (0, transport_js_1.wrapIfHandle)(objData);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpoint', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ViteAppResourcePromise(this._withUrlForEndpointInternal(endpointName, callback));
    }
    /** @internal */
    async _withUrlForEndpointFactoryInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EndpointReference(argHandle, this._client);
            return await callback(arg);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpointFactory', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new ViteAppResourcePromise(this._withUrlForEndpointFactoryInternal(endpointName, callback));
    }
    /** @internal */
    async _withContainerFilesSourceInternal(sourcePath) {
        const rpcArgs = { builder: this._handle, sourcePath };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerFilesSource', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Sets the source directory for container files */
    withContainerFilesSource(sourcePath) {
        return new ViteAppResourcePromise(this._withContainerFilesSourceInternal(sourcePath));
    }
    /** @internal */
    async _clearContainerFilesSourcesInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/clearContainerFilesSources', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Clears all container file sources */
    clearContainerFilesSources() {
        return new ViteAppResourcePromise(this._clearContainerFilesSourcesInternal());
    }
    /** @internal */
    async _excludeFromManifestInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromManifest', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ViteAppResourcePromise(this._excludeFromManifestInternal());
    }
    /** @internal */
    async _waitForInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResource', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new ViteAppResourcePromise(this._waitForInternal(dependency));
    }
    /** @internal */
    async _waitForWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForWithBehavior', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new ViteAppResourcePromise(this._waitForWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _waitForStartInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceStart', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new ViteAppResourcePromise(this._waitForStartInternal(dependency));
    }
    /** @internal */
    async _waitForStartWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForStartWithBehavior', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new ViteAppResourcePromise(this._waitForStartWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _withExplicitStartInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExplicitStart', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ViteAppResourcePromise(this._withExplicitStartInternal());
    }
    /** @internal */
    async _waitForCompletionInternal(dependency, exitCode) {
        const rpcArgs = { builder: this._handle, dependency };
        if (exitCode !== undefined)
            rpcArgs.exitCode = exitCode;
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceCompletion', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        const exitCode = options?.exitCode;
        return new ViteAppResourcePromise(this._waitForCompletionInternal(dependency, exitCode));
    }
    /** @internal */
    async _withHealthCheckInternal(key) {
        const rpcArgs = { builder: this._handle, key };
        const result = await this._client.invokeCapability('Aspire.Hosting/withHealthCheck', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ViteAppResourcePromise(this._withHealthCheckInternal(key));
    }
    /** @internal */
    async _withHttpHealthCheckInternal(path, statusCode, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (statusCode !== undefined)
            rpcArgs.statusCode = statusCode;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpHealthCheck', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        const path = options?.path;
        const statusCode = options?.statusCode;
        const endpointName = options?.endpointName;
        return new ViteAppResourcePromise(this._withHttpHealthCheckInternal(path, statusCode, endpointName));
    }
    /** @internal */
    async _withCommandInternal(name, displayName, executeCommand, commandOptions) {
        const executeCommandId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ExecuteCommandContext(argHandle, this._client);
            return await executeCommand(arg);
        });
        const rpcArgs = { builder: this._handle, name, displayName, executeCommand: executeCommandId };
        if (commandOptions !== undefined)
            rpcArgs.commandOptions = commandOptions;
        const result = await this._client.invokeCapability('Aspire.Hosting/withCommand', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        const commandOptions = options?.commandOptions;
        return new ViteAppResourcePromise(this._withCommandInternal(name, displayName, executeCommand, commandOptions));
    }
    /** @internal */
    async _withDeveloperCertificateTrustInternal(trust) {
        const rpcArgs = { builder: this._handle, trust };
        const result = await this._client.invokeCapability('Aspire.Hosting/withDeveloperCertificateTrust', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new ViteAppResourcePromise(this._withDeveloperCertificateTrustInternal(trust));
    }
    /** @internal */
    async _withCertificateTrustScopeInternal(scope) {
        const rpcArgs = { builder: this._handle, scope };
        const result = await this._client.invokeCapability('Aspire.Hosting/withCertificateTrustScope', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new ViteAppResourcePromise(this._withCertificateTrustScopeInternal(scope));
    }
    /** @internal */
    async _withHttpsDeveloperCertificateInternal(password) {
        const rpcArgs = { builder: this._handle };
        if (password !== undefined)
            rpcArgs.password = password;
        const result = await this._client.invokeCapability('Aspire.Hosting/withParameterHttpsDeveloperCertificate', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        const password = options?.password;
        return new ViteAppResourcePromise(this._withHttpsDeveloperCertificateInternal(password));
    }
    /** @internal */
    async _withoutHttpsCertificateInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withoutHttpsCertificate', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new ViteAppResourcePromise(this._withoutHttpsCertificateInternal());
    }
    /** @internal */
    async _withRelationshipInternal(resourceBuilder, type) {
        const rpcArgs = { builder: this._handle, resourceBuilder, type };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderRelationship', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ViteAppResourcePromise(this._withRelationshipInternal(resourceBuilder, type));
    }
    /** @internal */
    async _withParentRelationshipInternal(parent) {
        const rpcArgs = { builder: this._handle, parent };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderParentRelationship', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ViteAppResourcePromise(this._withParentRelationshipInternal(parent));
    }
    /** @internal */
    async _withChildRelationshipInternal(child) {
        const rpcArgs = { builder: this._handle, child };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderChildRelationship', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ViteAppResourcePromise(this._withChildRelationshipInternal(child));
    }
    /** @internal */
    async _withIconNameInternal(iconName, iconVariant) {
        const rpcArgs = { builder: this._handle, iconName };
        if (iconVariant !== undefined)
            rpcArgs.iconVariant = iconVariant;
        const result = await this._client.invokeCapability('Aspire.Hosting/withIconName', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        const iconVariant = options?.iconVariant;
        return new ViteAppResourcePromise(this._withIconNameInternal(iconName, iconVariant));
    }
    /** @internal */
    async _withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName) {
        const rpcArgs = { builder: this._handle, probeType };
        if (path !== undefined)
            rpcArgs.path = path;
        if (initialDelaySeconds !== undefined)
            rpcArgs.initialDelaySeconds = initialDelaySeconds;
        if (periodSeconds !== undefined)
            rpcArgs.periodSeconds = periodSeconds;
        if (timeoutSeconds !== undefined)
            rpcArgs.timeoutSeconds = timeoutSeconds;
        if (failureThreshold !== undefined)
            rpcArgs.failureThreshold = failureThreshold;
        if (successThreshold !== undefined)
            rpcArgs.successThreshold = successThreshold;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpProbe', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        const path = options?.path;
        const initialDelaySeconds = options?.initialDelaySeconds;
        const periodSeconds = options?.periodSeconds;
        const timeoutSeconds = options?.timeoutSeconds;
        const failureThreshold = options?.failureThreshold;
        const successThreshold = options?.successThreshold;
        const endpointName = options?.endpointName;
        return new ViteAppResourcePromise(this._withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName));
    }
    /** @internal */
    async _excludeFromMcpInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromMcp', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ViteAppResourcePromise(this._excludeFromMcpInternal());
    }
    /** @internal */
    async _withRemoteImageNameInternal(remoteImageName) {
        const rpcArgs = { builder: this._handle, remoteImageName };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageName', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new ViteAppResourcePromise(this._withRemoteImageNameInternal(remoteImageName));
    }
    /** @internal */
    async _withRemoteImageTagInternal(remoteImageTag) {
        const rpcArgs = { builder: this._handle, remoteImageTag };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageTag', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new ViteAppResourcePromise(this._withRemoteImageTagInternal(remoteImageTag));
    }
    /** @internal */
    async _withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineStepContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, stepName, callback: callbackId };
        if (dependsOn !== undefined)
            rpcArgs.dependsOn = dependsOn;
        if (requiredBy !== undefined)
            rpcArgs.requiredBy = requiredBy;
        if (tags !== undefined)
            rpcArgs.tags = tags;
        if (description !== undefined)
            rpcArgs.description = description;
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineStepFactory', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        const dependsOn = options?.dependsOn;
        const requiredBy = options?.requiredBy;
        const tags = options?.tags;
        const description = options?.description;
        return new ViteAppResourcePromise(this._withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description));
    }
    /** @internal */
    async _withPipelineConfigurationAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineConfigurationContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfigurationAsync', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ViteAppResourcePromise(this._withPipelineConfigurationAsyncInternal(callback));
    }
    /** @internal */
    async _withPipelineConfigurationInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new PipelineConfigurationContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfiguration', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ViteAppResourcePromise(this._withPipelineConfigurationInternal(callback));
    }
    /** Gets the resource name */
    async getResourceName() {
        const rpcArgs = { resource: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/getResourceName', rpcArgs);
    }
    /** @internal */
    async _onBeforeResourceStartedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new BeforeResourceStartedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onBeforeResourceStarted', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ViteAppResourcePromise(this._onBeforeResourceStartedInternal(callback));
    }
    /** @internal */
    async _onResourceStoppedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceStoppedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceStopped', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ViteAppResourcePromise(this._onResourceStoppedInternal(callback));
    }
    /** @internal */
    async _onInitializeResourceInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new InitializeResourceEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onInitializeResource', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ViteAppResourcePromise(this._onInitializeResourceInternal(callback));
    }
    /** @internal */
    async _onResourceEndpointsAllocatedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceEndpointsAllocatedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceEndpointsAllocated', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new ViteAppResourcePromise(this._onResourceEndpointsAllocatedInternal(callback));
    }
    /** @internal */
    async _onResourceReadyInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceReadyEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceReady', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ViteAppResourcePromise(this._onResourceReadyInternal(callback));
    }
    /** @internal */
    async _withViteConfigInternal(configPath) {
        const rpcArgs = { builder: this._handle, configPath };
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withViteConfig', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Configures a custom Vite configuration file */
    withViteConfig(configPath) {
        return new ViteAppResourcePromise(this._withViteConfigInternal(configPath));
    }
    /** @internal */
    async _withNpmInternal(install, installCommand, installArgs) {
        const rpcArgs = { resource: this._handle };
        if (install !== undefined)
            rpcArgs.install = install;
        if (installCommand !== undefined)
            rpcArgs.installCommand = installCommand;
        if (installArgs !== undefined)
            rpcArgs.installArgs = installArgs;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withNpm', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Configures npm as the package manager */
    withNpm(options) {
        const install = options?.install;
        const installCommand = options?.installCommand;
        const installArgs = options?.installArgs;
        return new ViteAppResourcePromise(this._withNpmInternal(install, installCommand, installArgs));
    }
    /** @internal */
    async _withBunInternal(install, installArgs) {
        const rpcArgs = { resource: this._handle };
        if (install !== undefined)
            rpcArgs.install = install;
        if (installArgs !== undefined)
            rpcArgs.installArgs = installArgs;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withBun', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Configures Bun as the package manager */
    withBun(options) {
        const install = options?.install;
        const installArgs = options?.installArgs;
        return new ViteAppResourcePromise(this._withBunInternal(install, installArgs));
    }
    /** @internal */
    async _withYarnInternal(install, installArgs) {
        const rpcArgs = { resource: this._handle };
        if (install !== undefined)
            rpcArgs.install = install;
        if (installArgs !== undefined)
            rpcArgs.installArgs = installArgs;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withYarn', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Configures yarn as the package manager */
    withYarn(options) {
        const install = options?.install;
        const installArgs = options?.installArgs;
        return new ViteAppResourcePromise(this._withYarnInternal(install, installArgs));
    }
    /** @internal */
    async _withPnpmInternal(install, installArgs) {
        const rpcArgs = { resource: this._handle };
        if (install !== undefined)
            rpcArgs.install = install;
        if (installArgs !== undefined)
            rpcArgs.installArgs = installArgs;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withPnpm', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Configures pnpm as the package manager */
    withPnpm(options) {
        const install = options?.install;
        const installArgs = options?.installArgs;
        return new ViteAppResourcePromise(this._withPnpmInternal(install, installArgs));
    }
    /** @internal */
    async _withBuildScriptInternal(scriptName, args) {
        const rpcArgs = { resource: this._handle, scriptName };
        if (args !== undefined)
            rpcArgs.args = args;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withBuildScript', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Specifies an npm script to run before starting the application */
    withBuildScript(scriptName, options) {
        const args = options?.args;
        return new ViteAppResourcePromise(this._withBuildScriptInternal(scriptName, args));
    }
    /** @internal */
    async _withRunScriptInternal(scriptName, args) {
        const rpcArgs = { resource: this._handle, scriptName };
        if (args !== undefined)
            rpcArgs.args = args;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withRunScript', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Specifies an npm script to run during development */
    withRunScript(scriptName, options) {
        const args = options?.args;
        return new ViteAppResourcePromise(this._withRunScriptInternal(scriptName, args));
    }
    /** @internal */
    async _withBrowserDebuggerInternal(browser) {
        const rpcArgs = { builder: this._handle };
        if (browser !== undefined)
            rpcArgs.browser = browser;
        const result = await this._client.invokeCapability('Aspire.Hosting.JavaScript/withBrowserDebugger', rpcArgs);
        return new ViteAppResource(result, this._client);
    }
    /** Configures a browser debugger for the JavaScript application */
    withBrowserDebugger(options) {
        const browser = options?.browser;
        return new ViteAppResourcePromise(this._withBrowserDebuggerInternal(browser));
    }
}
exports.ViteAppResource = ViteAppResource;
/**
 * Thenable wrapper for ViteAppResource that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class ViteAppResourcePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withContainerRegistry(registry)));
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withDockerfileBaseImage(options)));
    }
    /** Publishes the executable as a Docker container */
    publishAsDockerFile() {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.publishAsDockerFile()));
    }
    /** Publishes an executable as a Docker file with optional container configuration */
    publishAsDockerFileWithConfigure(configure) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.publishAsDockerFileWithConfigure(configure)));
    }
    /** Sets the executable command */
    withExecutableCommand(command) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withExecutableCommand(command)));
    }
    /** Sets the executable working directory */
    withWorkingDirectory(workingDirectory) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withWorkingDirectory(workingDirectory)));
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withMcpServer(options)));
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withOtlpExporter()));
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withOtlpExporterProtocol(protocol)));
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withRequiredCommand(command, options)));
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withEnvironmentCallback(callback)));
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withEnvironmentEndpoint(name, endpointReference)));
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withEnvironment(name, value)));
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withEnvironmentParameter(name, parameter)));
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withEnvironmentConnectionString(envVarName, resource)));
    }
    /** Adds arguments */
    withArgs(args) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withArgs(args)));
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withArgsCallback(callback)));
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withArgsCallbackAsync(callback)));
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withReferenceEnvironment(options)));
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withReference(source, options)));
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withReferenceUri(name, uri)));
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withReferenceExternalService(externalService)));
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withReferenceEndpoint(endpointReference)));
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withEndpoint(options)));
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withHttpEndpoint(options)));
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withHttpsEndpoint(options)));
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withExternalHttpEndpoints()));
    }
    /** Gets an endpoint reference */
    getEndpoint(name) {
        return this._promise.then(obj => obj.getEndpoint(name));
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.asHttp2Service()));
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withUrlsCallback(callback)));
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withUrlsCallbackAsync(callback)));
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withUrl(url, options)));
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withUrlExpression(url, options)));
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withUrlForEndpoint(endpointName, callback)));
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withUrlForEndpointFactory(endpointName, callback)));
    }
    /** Sets the source directory for container files */
    withContainerFilesSource(sourcePath) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withContainerFilesSource(sourcePath)));
    }
    /** Clears all container file sources */
    clearContainerFilesSources() {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.clearContainerFilesSources()));
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.excludeFromManifest()));
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.waitFor(dependency)));
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.waitForWithBehavior(dependency, waitBehavior)));
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.waitForStart(dependency)));
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.waitForStartWithBehavior(dependency, waitBehavior)));
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withExplicitStart()));
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.waitForCompletion(dependency, options)));
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withHealthCheck(key)));
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withHttpHealthCheck(options)));
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withCommand(name, displayName, executeCommand, options)));
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withDeveloperCertificateTrust(trust)));
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withCertificateTrustScope(scope)));
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withHttpsDeveloperCertificate(options)));
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withoutHttpsCertificate()));
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withRelationship(resourceBuilder, type)));
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withParentRelationship(parent)));
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withChildRelationship(child)));
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withIconName(iconName, options)));
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withHttpProbe(probeType, options)));
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.excludeFromMcp()));
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withRemoteImageName(remoteImageName)));
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withRemoteImageTag(remoteImageTag)));
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withPipelineStepFactory(stepName, callback, options)));
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withPipelineConfigurationAsync(callback)));
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withPipelineConfiguration(callback)));
    }
    /** Gets the resource name */
    getResourceName() {
        return this._promise.then(obj => obj.getResourceName());
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.onBeforeResourceStarted(callback)));
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.onResourceStopped(callback)));
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.onInitializeResource(callback)));
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.onResourceEndpointsAllocated(callback)));
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.onResourceReady(callback)));
    }
    /** Configures a custom Vite configuration file */
    withViteConfig(configPath) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withViteConfig(configPath)));
    }
    /** Configures npm as the package manager */
    withNpm(options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withNpm(options)));
    }
    /** Configures Bun as the package manager */
    withBun(options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withBun(options)));
    }
    /** Configures yarn as the package manager */
    withYarn(options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withYarn(options)));
    }
    /** Configures pnpm as the package manager */
    withPnpm(options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withPnpm(options)));
    }
    /** Specifies an npm script to run before starting the application */
    withBuildScript(scriptName, options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withBuildScript(scriptName, options)));
    }
    /** Specifies an npm script to run during development */
    withRunScript(scriptName, options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withRunScript(scriptName, options)));
    }
    /** Configures a browser debugger for the JavaScript application */
    withBrowserDebugger(options) {
        return new ViteAppResourcePromise(this._promise.then(obj => obj.withBrowserDebugger(options)));
    }
}
exports.ViteAppResourcePromise = ViteAppResourcePromise;
// ============================================================================
// ComputeResource
// ============================================================================
class ComputeResource extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _withRemoteImageNameInternal(remoteImageName) {
        const rpcArgs = { builder: this._handle, remoteImageName };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageName', rpcArgs);
        return new ComputeResource(result, this._client);
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new ComputeResourcePromise(this._withRemoteImageNameInternal(remoteImageName));
    }
    /** @internal */
    async _withRemoteImageTagInternal(remoteImageTag) {
        const rpcArgs = { builder: this._handle, remoteImageTag };
        const result = await this._client.invokeCapability('Aspire.Hosting/withRemoteImageTag', rpcArgs);
        return new ComputeResource(result, this._client);
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new ComputeResourcePromise(this._withRemoteImageTagInternal(remoteImageTag));
    }
}
exports.ComputeResource = ComputeResource;
/**
 * Thenable wrapper for ComputeResource that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class ComputeResourcePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Sets the remote image name for publishing */
    withRemoteImageName(remoteImageName) {
        return new ComputeResourcePromise(this._promise.then(obj => obj.withRemoteImageName(remoteImageName)));
    }
    /** Sets the remote image tag for publishing */
    withRemoteImageTag(remoteImageTag) {
        return new ComputeResourcePromise(this._promise.then(obj => obj.withRemoteImageTag(remoteImageTag)));
    }
}
exports.ComputeResourcePromise = ComputeResourcePromise;
// ============================================================================
// ContainerFilesDestinationResource
// ============================================================================
class ContainerFilesDestinationResource extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _publishWithContainerFilesInternal(source, destinationPath) {
        const rpcArgs = { builder: this._handle, source, destinationPath };
        const result = await this._client.invokeCapability('Aspire.Hosting/publishWithContainerFilesFromResource', rpcArgs);
        return new ContainerFilesDestinationResource(result, this._client);
    }
    /** Configures the resource to copy container files from the specified source during publishing */
    publishWithContainerFiles(source, destinationPath) {
        return new ContainerFilesDestinationResourcePromise(this._publishWithContainerFilesInternal(source, destinationPath));
    }
}
exports.ContainerFilesDestinationResource = ContainerFilesDestinationResource;
/**
 * Thenable wrapper for ContainerFilesDestinationResource that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class ContainerFilesDestinationResourcePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Configures the resource to copy container files from the specified source during publishing */
    publishWithContainerFiles(source, destinationPath) {
        return new ContainerFilesDestinationResourcePromise(this._promise.then(obj => obj.publishWithContainerFiles(source, destinationPath)));
    }
}
exports.ContainerFilesDestinationResourcePromise = ContainerFilesDestinationResourcePromise;
// ============================================================================
// Resource
// ============================================================================
class Resource extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _withContainerRegistryInternal(registry) {
        const rpcArgs = { builder: this._handle, registry };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerRegistry', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ResourcePromise(this._withContainerRegistryInternal(registry));
    }
    /** @internal */
    async _withDockerfileBaseImageInternal(buildImage, runtimeImage) {
        const rpcArgs = { builder: this._handle };
        if (buildImage !== undefined)
            rpcArgs.buildImage = buildImage;
        if (runtimeImage !== undefined)
            rpcArgs.runtimeImage = runtimeImage;
        const result = await this._client.invokeCapability('Aspire.Hosting/withDockerfileBaseImage', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        const buildImage = options?.buildImage;
        const runtimeImage = options?.runtimeImage;
        return new ResourcePromise(this._withDockerfileBaseImageInternal(buildImage, runtimeImage));
    }
    /** @internal */
    async _withRequiredCommandInternal(command, helpLink) {
        const rpcArgs = { builder: this._handle, command };
        if (helpLink !== undefined)
            rpcArgs.helpLink = helpLink;
        const result = await this._client.invokeCapability('Aspire.Hosting/withRequiredCommand', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        const helpLink = options?.helpLink;
        return new ResourcePromise(this._withRequiredCommandInternal(command, helpLink));
    }
    /** @internal */
    async _withUrlsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new ResourceUrlsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallback', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ResourcePromise(this._withUrlsCallbackInternal(callback));
    }
    /** @internal */
    async _withUrlsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceUrlsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlsCallbackAsync', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ResourcePromise(this._withUrlsCallbackAsyncInternal(callback));
    }
    /** @internal */
    async _withUrlInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrl', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        const displayText = options?.displayText;
        return new ResourcePromise(this._withUrlInternal(url, displayText));
    }
    /** @internal */
    async _withUrlExpressionInternal(url, displayText) {
        const rpcArgs = { builder: this._handle, url };
        if (displayText !== undefined)
            rpcArgs.displayText = displayText;
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlExpression', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        const displayText = options?.displayText;
        return new ResourcePromise(this._withUrlExpressionInternal(url, displayText));
    }
    /** @internal */
    async _withUrlForEndpointInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const obj = (0, transport_js_1.wrapIfHandle)(objData);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpoint', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ResourcePromise(this._withUrlForEndpointInternal(endpointName, callback));
    }
    /** @internal */
    async _excludeFromManifestInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromManifest', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ResourcePromise(this._excludeFromManifestInternal());
    }
    /** @internal */
    async _withExplicitStartInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExplicitStart', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ResourcePromise(this._withExplicitStartInternal());
    }
    /** @internal */
    async _withHealthCheckInternal(key) {
        const rpcArgs = { builder: this._handle, key };
        const result = await this._client.invokeCapability('Aspire.Hosting/withHealthCheck', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ResourcePromise(this._withHealthCheckInternal(key));
    }
    /** @internal */
    async _withCommandInternal(name, displayName, executeCommand, commandOptions) {
        const executeCommandId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ExecuteCommandContext(argHandle, this._client);
            return await executeCommand(arg);
        });
        const rpcArgs = { builder: this._handle, name, displayName, executeCommand: executeCommandId };
        if (commandOptions !== undefined)
            rpcArgs.commandOptions = commandOptions;
        const result = await this._client.invokeCapability('Aspire.Hosting/withCommand', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        const commandOptions = options?.commandOptions;
        return new ResourcePromise(this._withCommandInternal(name, displayName, executeCommand, commandOptions));
    }
    /** @internal */
    async _withRelationshipInternal(resourceBuilder, type) {
        const rpcArgs = { builder: this._handle, resourceBuilder, type };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderRelationship', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ResourcePromise(this._withRelationshipInternal(resourceBuilder, type));
    }
    /** @internal */
    async _withParentRelationshipInternal(parent) {
        const rpcArgs = { builder: this._handle, parent };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderParentRelationship', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ResourcePromise(this._withParentRelationshipInternal(parent));
    }
    /** @internal */
    async _withChildRelationshipInternal(child) {
        const rpcArgs = { builder: this._handle, child };
        const result = await this._client.invokeCapability('Aspire.Hosting/withBuilderChildRelationship', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ResourcePromise(this._withChildRelationshipInternal(child));
    }
    /** @internal */
    async _withIconNameInternal(iconName, iconVariant) {
        const rpcArgs = { builder: this._handle, iconName };
        if (iconVariant !== undefined)
            rpcArgs.iconVariant = iconVariant;
        const result = await this._client.invokeCapability('Aspire.Hosting/withIconName', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        const iconVariant = options?.iconVariant;
        return new ResourcePromise(this._withIconNameInternal(iconName, iconVariant));
    }
    /** @internal */
    async _excludeFromMcpInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/excludeFromMcp', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ResourcePromise(this._excludeFromMcpInternal());
    }
    /** @internal */
    async _withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineStepContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, stepName, callback: callbackId };
        if (dependsOn !== undefined)
            rpcArgs.dependsOn = dependsOn;
        if (requiredBy !== undefined)
            rpcArgs.requiredBy = requiredBy;
        if (tags !== undefined)
            rpcArgs.tags = tags;
        if (description !== undefined)
            rpcArgs.description = description;
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineStepFactory', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        const dependsOn = options?.dependsOn;
        const requiredBy = options?.requiredBy;
        const tags = options?.tags;
        const description = options?.description;
        return new ResourcePromise(this._withPipelineStepFactoryInternal(stepName, callback, dependsOn, requiredBy, tags, description));
    }
    /** @internal */
    async _withPipelineConfigurationAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new PipelineConfigurationContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfigurationAsync', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ResourcePromise(this._withPipelineConfigurationAsyncInternal(callback));
    }
    /** @internal */
    async _withPipelineConfigurationInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new PipelineConfigurationContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withPipelineConfiguration', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ResourcePromise(this._withPipelineConfigurationInternal(callback));
    }
    /** Gets the resource name */
    async getResourceName() {
        const rpcArgs = { resource: this._handle };
        return await this._client.invokeCapability('Aspire.Hosting/getResourceName', rpcArgs);
    }
    /** @internal */
    async _onBeforeResourceStartedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new BeforeResourceStartedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onBeforeResourceStarted', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ResourcePromise(this._onBeforeResourceStartedInternal(callback));
    }
    /** @internal */
    async _onResourceStoppedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceStoppedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceStopped', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ResourcePromise(this._onResourceStoppedInternal(callback));
    }
    /** @internal */
    async _onInitializeResourceInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new InitializeResourceEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onInitializeResource', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ResourcePromise(this._onInitializeResourceInternal(callback));
    }
    /** @internal */
    async _onResourceReadyInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceReadyEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceReady', rpcArgs);
        return new Resource(result, this._client);
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ResourcePromise(this._onResourceReadyInternal(callback));
    }
}
exports.Resource = Resource;
/**
 * Thenable wrapper for Resource that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class ResourcePromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Configures a resource to use a container registry */
    withContainerRegistry(registry) {
        return new ResourcePromise(this._promise.then(obj => obj.withContainerRegistry(registry)));
    }
    /** Sets the base image for a Dockerfile build */
    withDockerfileBaseImage(options) {
        return new ResourcePromise(this._promise.then(obj => obj.withDockerfileBaseImage(options)));
    }
    /** Adds a required command dependency */
    withRequiredCommand(command, options) {
        return new ResourcePromise(this._promise.then(obj => obj.withRequiredCommand(command, options)));
    }
    /** Customizes displayed URLs via callback */
    withUrlsCallback(callback) {
        return new ResourcePromise(this._promise.then(obj => obj.withUrlsCallback(callback)));
    }
    /** Customizes displayed URLs via async callback */
    withUrlsCallbackAsync(callback) {
        return new ResourcePromise(this._promise.then(obj => obj.withUrlsCallbackAsync(callback)));
    }
    /** Adds or modifies displayed URLs */
    withUrl(url, options) {
        return new ResourcePromise(this._promise.then(obj => obj.withUrl(url, options)));
    }
    /** Adds a URL using a reference expression */
    withUrlExpression(url, options) {
        return new ResourcePromise(this._promise.then(obj => obj.withUrlExpression(url, options)));
    }
    /** Customizes the URL for a specific endpoint via callback */
    withUrlForEndpoint(endpointName, callback) {
        return new ResourcePromise(this._promise.then(obj => obj.withUrlForEndpoint(endpointName, callback)));
    }
    /** Excludes the resource from the deployment manifest */
    excludeFromManifest() {
        return new ResourcePromise(this._promise.then(obj => obj.excludeFromManifest()));
    }
    /** Prevents resource from starting automatically */
    withExplicitStart() {
        return new ResourcePromise(this._promise.then(obj => obj.withExplicitStart()));
    }
    /** Adds a health check by key */
    withHealthCheck(key) {
        return new ResourcePromise(this._promise.then(obj => obj.withHealthCheck(key)));
    }
    /** Adds a resource command */
    withCommand(name, displayName, executeCommand, options) {
        return new ResourcePromise(this._promise.then(obj => obj.withCommand(name, displayName, executeCommand, options)));
    }
    /** Adds a relationship to another resource */
    withRelationship(resourceBuilder, type) {
        return new ResourcePromise(this._promise.then(obj => obj.withRelationship(resourceBuilder, type)));
    }
    /** Sets the parent relationship */
    withParentRelationship(parent) {
        return new ResourcePromise(this._promise.then(obj => obj.withParentRelationship(parent)));
    }
    /** Sets a child relationship */
    withChildRelationship(child) {
        return new ResourcePromise(this._promise.then(obj => obj.withChildRelationship(child)));
    }
    /** Sets the icon for the resource */
    withIconName(iconName, options) {
        return new ResourcePromise(this._promise.then(obj => obj.withIconName(iconName, options)));
    }
    /** Excludes the resource from MCP server exposure */
    excludeFromMcp() {
        return new ResourcePromise(this._promise.then(obj => obj.excludeFromMcp()));
    }
    /** Adds a pipeline step to the resource */
    withPipelineStepFactory(stepName, callback, options) {
        return new ResourcePromise(this._promise.then(obj => obj.withPipelineStepFactory(stepName, callback, options)));
    }
    /** Configures pipeline step dependencies via an async callback */
    withPipelineConfigurationAsync(callback) {
        return new ResourcePromise(this._promise.then(obj => obj.withPipelineConfigurationAsync(callback)));
    }
    /** Configures pipeline step dependencies via a callback */
    withPipelineConfiguration(callback) {
        return new ResourcePromise(this._promise.then(obj => obj.withPipelineConfiguration(callback)));
    }
    /** Gets the resource name */
    getResourceName() {
        return this._promise.then(obj => obj.getResourceName());
    }
    /** Subscribes to the BeforeResourceStarted event */
    onBeforeResourceStarted(callback) {
        return new ResourcePromise(this._promise.then(obj => obj.onBeforeResourceStarted(callback)));
    }
    /** Subscribes to the ResourceStopped event */
    onResourceStopped(callback) {
        return new ResourcePromise(this._promise.then(obj => obj.onResourceStopped(callback)));
    }
    /** Subscribes to the InitializeResource event */
    onInitializeResource(callback) {
        return new ResourcePromise(this._promise.then(obj => obj.onInitializeResource(callback)));
    }
    /** Subscribes to the ResourceReady event */
    onResourceReady(callback) {
        return new ResourcePromise(this._promise.then(obj => obj.onResourceReady(callback)));
    }
}
exports.ResourcePromise = ResourcePromise;
// ============================================================================
// ResourceWithArgs
// ============================================================================
class ResourceWithArgs extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _withArgsInternal(args) {
        const rpcArgs = { builder: this._handle, args };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgs', rpcArgs);
        return new ResourceWithArgs(result, this._client);
    }
    /** Adds arguments */
    withArgs(args) {
        return new ResourceWithArgsPromise(this._withArgsInternal(args));
    }
    /** @internal */
    async _withArgsCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (objData) => {
            const objHandle = (0, transport_js_1.wrapIfHandle)(objData);
            const obj = new CommandLineArgsCallbackContext(objHandle, this._client);
            await callback(obj);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallback', rpcArgs);
        return new ResourceWithArgs(result, this._client);
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new ResourceWithArgsPromise(this._withArgsCallbackInternal(callback));
    }
    /** @internal */
    async _withArgsCallbackAsyncInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new CommandLineArgsCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withArgsCallbackAsync', rpcArgs);
        return new ResourceWithArgs(result, this._client);
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new ResourceWithArgsPromise(this._withArgsCallbackAsyncInternal(callback));
    }
}
exports.ResourceWithArgs = ResourceWithArgs;
/**
 * Thenable wrapper for ResourceWithArgs that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class ResourceWithArgsPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Adds arguments */
    withArgs(args) {
        return new ResourceWithArgsPromise(this._promise.then(obj => obj.withArgs(args)));
    }
    /** Sets command-line arguments via callback */
    withArgsCallback(callback) {
        return new ResourceWithArgsPromise(this._promise.then(obj => obj.withArgsCallback(callback)));
    }
    /** Sets command-line arguments via async callback */
    withArgsCallbackAsync(callback) {
        return new ResourceWithArgsPromise(this._promise.then(obj => obj.withArgsCallbackAsync(callback)));
    }
}
exports.ResourceWithArgsPromise = ResourceWithArgsPromise;
// ============================================================================
// ResourceWithConnectionString
// ============================================================================
class ResourceWithConnectionString extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _withConnectionPropertyInternal(name, value) {
        const rpcArgs = { builder: this._handle, name, value };
        const result = await this._client.invokeCapability('Aspire.Hosting/withConnectionProperty', rpcArgs);
        return new ResourceWithConnectionString(result, this._client);
    }
    /** Adds a connection property with a string or reference expression value */
    withConnectionProperty(name, value) {
        return new ResourceWithConnectionStringPromise(this._withConnectionPropertyInternal(name, value));
    }
    /** @internal */
    async _withConnectionPropertyValueInternal(name, value) {
        const rpcArgs = { builder: this._handle, name, value };
        const result = await this._client.invokeCapability('Aspire.Hosting/withConnectionPropertyValue', rpcArgs);
        return new ResourceWithConnectionString(result, this._client);
    }
    /** Adds a connection property with a string value */
    withConnectionPropertyValue(name, value) {
        return new ResourceWithConnectionStringPromise(this._withConnectionPropertyValueInternal(name, value));
    }
    /** Gets a connection property by key */
    async getConnectionProperty(key) {
        const rpcArgs = { resource: this._handle, key };
        return await this._client.invokeCapability('Aspire.Hosting/getConnectionProperty', rpcArgs);
    }
    /** @internal */
    async _onConnectionStringAvailableInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ConnectionStringAvailableEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onConnectionStringAvailable', rpcArgs);
        return new ResourceWithConnectionString(result, this._client);
    }
    /** Subscribes to the ConnectionStringAvailable event */
    onConnectionStringAvailable(callback) {
        return new ResourceWithConnectionStringPromise(this._onConnectionStringAvailableInternal(callback));
    }
}
exports.ResourceWithConnectionString = ResourceWithConnectionString;
/**
 * Thenable wrapper for ResourceWithConnectionString that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class ResourceWithConnectionStringPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Adds a connection property with a string or reference expression value */
    withConnectionProperty(name, value) {
        return new ResourceWithConnectionStringPromise(this._promise.then(obj => obj.withConnectionProperty(name, value)));
    }
    /** Adds a connection property with a string value */
    withConnectionPropertyValue(name, value) {
        return new ResourceWithConnectionStringPromise(this._promise.then(obj => obj.withConnectionPropertyValue(name, value)));
    }
    /** Gets a connection property by key */
    getConnectionProperty(key) {
        return this._promise.then(obj => obj.getConnectionProperty(key));
    }
    /** Subscribes to the ConnectionStringAvailable event */
    onConnectionStringAvailable(callback) {
        return new ResourceWithConnectionStringPromise(this._promise.then(obj => obj.onConnectionStringAvailable(callback)));
    }
}
exports.ResourceWithConnectionStringPromise = ResourceWithConnectionStringPromise;
// ============================================================================
// ResourceWithContainerFiles
// ============================================================================
class ResourceWithContainerFiles extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _withContainerFilesSourceInternal(sourcePath) {
        const rpcArgs = { builder: this._handle, sourcePath };
        const result = await this._client.invokeCapability('Aspire.Hosting/withContainerFilesSource', rpcArgs);
        return new ResourceWithContainerFiles(result, this._client);
    }
    /** Sets the source directory for container files */
    withContainerFilesSource(sourcePath) {
        return new ResourceWithContainerFilesPromise(this._withContainerFilesSourceInternal(sourcePath));
    }
    /** @internal */
    async _clearContainerFilesSourcesInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/clearContainerFilesSources', rpcArgs);
        return new ResourceWithContainerFiles(result, this._client);
    }
    /** Clears all container file sources */
    clearContainerFilesSources() {
        return new ResourceWithContainerFilesPromise(this._clearContainerFilesSourcesInternal());
    }
}
exports.ResourceWithContainerFiles = ResourceWithContainerFiles;
/**
 * Thenable wrapper for ResourceWithContainerFiles that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class ResourceWithContainerFilesPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Sets the source directory for container files */
    withContainerFilesSource(sourcePath) {
        return new ResourceWithContainerFilesPromise(this._promise.then(obj => obj.withContainerFilesSource(sourcePath)));
    }
    /** Clears all container file sources */
    clearContainerFilesSources() {
        return new ResourceWithContainerFilesPromise(this._promise.then(obj => obj.clearContainerFilesSources()));
    }
}
exports.ResourceWithContainerFilesPromise = ResourceWithContainerFilesPromise;
// ============================================================================
// ResourceWithEndpoints
// ============================================================================
class ResourceWithEndpoints extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _withMcpServerInternal(path, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withMcpServer', rpcArgs);
        return new ResourceWithEndpoints(result, this._client);
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        const path = options?.path;
        const endpointName = options?.endpointName;
        return new ResourceWithEndpointsPromise(this._withMcpServerInternal(path, endpointName));
    }
    /** @internal */
    async _withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (scheme !== undefined)
            rpcArgs.scheme = scheme;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        if (isExternal !== undefined)
            rpcArgs.isExternal = isExternal;
        if (protocol !== undefined)
            rpcArgs.protocol = protocol;
        const result = await this._client.invokeCapability('Aspire.Hosting/withEndpoint', rpcArgs);
        return new ResourceWithEndpoints(result, this._client);
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const scheme = options?.scheme;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        const isExternal = options?.isExternal;
        const protocol = options?.protocol;
        return new ResourceWithEndpointsPromise(this._withEndpointInternal(port, targetPort, scheme, name, env, isProxied, isExternal, protocol));
    }
    /** @internal */
    async _withHttpEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpEndpoint', rpcArgs);
        return new ResourceWithEndpoints(result, this._client);
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new ResourceWithEndpointsPromise(this._withHttpEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withHttpsEndpointInternal(port, targetPort, name, env, isProxied) {
        const rpcArgs = { builder: this._handle };
        if (port !== undefined)
            rpcArgs.port = port;
        if (targetPort !== undefined)
            rpcArgs.targetPort = targetPort;
        if (name !== undefined)
            rpcArgs.name = name;
        if (env !== undefined)
            rpcArgs.env = env;
        if (isProxied !== undefined)
            rpcArgs.isProxied = isProxied;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpsEndpoint', rpcArgs);
        return new ResourceWithEndpoints(result, this._client);
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        const port = options?.port;
        const targetPort = options?.targetPort;
        const name = options?.name;
        const env = options?.env;
        const isProxied = options?.isProxied;
        return new ResourceWithEndpointsPromise(this._withHttpsEndpointInternal(port, targetPort, name, env, isProxied));
    }
    /** @internal */
    async _withExternalHttpEndpointsInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withExternalHttpEndpoints', rpcArgs);
        return new ResourceWithEndpoints(result, this._client);
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new ResourceWithEndpointsPromise(this._withExternalHttpEndpointsInternal());
    }
    /** Gets an endpoint reference */
    async getEndpoint(name) {
        const rpcArgs = { builder: this._handle, name };
        return await this._client.invokeCapability('Aspire.Hosting/getEndpoint', rpcArgs);
    }
    /** @internal */
    async _asHttp2ServiceInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/asHttp2Service', rpcArgs);
        return new ResourceWithEndpoints(result, this._client);
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new ResourceWithEndpointsPromise(this._asHttp2ServiceInternal());
    }
    /** @internal */
    async _withUrlForEndpointFactoryInternal(endpointName, callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EndpointReference(argHandle, this._client);
            return await callback(arg);
        });
        const rpcArgs = { builder: this._handle, endpointName, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withUrlForEndpointFactory', rpcArgs);
        return new ResourceWithEndpoints(result, this._client);
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new ResourceWithEndpointsPromise(this._withUrlForEndpointFactoryInternal(endpointName, callback));
    }
    /** @internal */
    async _withHttpHealthCheckInternal(path, statusCode, endpointName) {
        const rpcArgs = { builder: this._handle };
        if (path !== undefined)
            rpcArgs.path = path;
        if (statusCode !== undefined)
            rpcArgs.statusCode = statusCode;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpHealthCheck', rpcArgs);
        return new ResourceWithEndpoints(result, this._client);
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        const path = options?.path;
        const statusCode = options?.statusCode;
        const endpointName = options?.endpointName;
        return new ResourceWithEndpointsPromise(this._withHttpHealthCheckInternal(path, statusCode, endpointName));
    }
    /** @internal */
    async _withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName) {
        const rpcArgs = { builder: this._handle, probeType };
        if (path !== undefined)
            rpcArgs.path = path;
        if (initialDelaySeconds !== undefined)
            rpcArgs.initialDelaySeconds = initialDelaySeconds;
        if (periodSeconds !== undefined)
            rpcArgs.periodSeconds = periodSeconds;
        if (timeoutSeconds !== undefined)
            rpcArgs.timeoutSeconds = timeoutSeconds;
        if (failureThreshold !== undefined)
            rpcArgs.failureThreshold = failureThreshold;
        if (successThreshold !== undefined)
            rpcArgs.successThreshold = successThreshold;
        if (endpointName !== undefined)
            rpcArgs.endpointName = endpointName;
        const result = await this._client.invokeCapability('Aspire.Hosting/withHttpProbe', rpcArgs);
        return new ResourceWithEndpoints(result, this._client);
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        const path = options?.path;
        const initialDelaySeconds = options?.initialDelaySeconds;
        const periodSeconds = options?.periodSeconds;
        const timeoutSeconds = options?.timeoutSeconds;
        const failureThreshold = options?.failureThreshold;
        const successThreshold = options?.successThreshold;
        const endpointName = options?.endpointName;
        return new ResourceWithEndpointsPromise(this._withHttpProbeInternal(probeType, path, initialDelaySeconds, periodSeconds, timeoutSeconds, failureThreshold, successThreshold, endpointName));
    }
    /** @internal */
    async _onResourceEndpointsAllocatedInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new ResourceEndpointsAllocatedEvent(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/onResourceEndpointsAllocated', rpcArgs);
        return new ResourceWithEndpoints(result, this._client);
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new ResourceWithEndpointsPromise(this._onResourceEndpointsAllocatedInternal(callback));
    }
}
exports.ResourceWithEndpoints = ResourceWithEndpoints;
/**
 * Thenable wrapper for ResourceWithEndpoints that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class ResourceWithEndpointsPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Configures an MCP server endpoint on the resource */
    withMcpServer(options) {
        return new ResourceWithEndpointsPromise(this._promise.then(obj => obj.withMcpServer(options)));
    }
    /** Adds a network endpoint */
    withEndpoint(options) {
        return new ResourceWithEndpointsPromise(this._promise.then(obj => obj.withEndpoint(options)));
    }
    /** Adds an HTTP endpoint */
    withHttpEndpoint(options) {
        return new ResourceWithEndpointsPromise(this._promise.then(obj => obj.withHttpEndpoint(options)));
    }
    /** Adds an HTTPS endpoint */
    withHttpsEndpoint(options) {
        return new ResourceWithEndpointsPromise(this._promise.then(obj => obj.withHttpsEndpoint(options)));
    }
    /** Makes HTTP endpoints externally accessible */
    withExternalHttpEndpoints() {
        return new ResourceWithEndpointsPromise(this._promise.then(obj => obj.withExternalHttpEndpoints()));
    }
    /** Gets an endpoint reference */
    getEndpoint(name) {
        return this._promise.then(obj => obj.getEndpoint(name));
    }
    /** Configures resource for HTTP/2 */
    asHttp2Service() {
        return new ResourceWithEndpointsPromise(this._promise.then(obj => obj.asHttp2Service()));
    }
    /** Adds a URL for a specific endpoint via factory callback */
    withUrlForEndpointFactory(endpointName, callback) {
        return new ResourceWithEndpointsPromise(this._promise.then(obj => obj.withUrlForEndpointFactory(endpointName, callback)));
    }
    /** Adds an HTTP health check */
    withHttpHealthCheck(options) {
        return new ResourceWithEndpointsPromise(this._promise.then(obj => obj.withHttpHealthCheck(options)));
    }
    /** Adds an HTTP health probe to the resource */
    withHttpProbe(probeType, options) {
        return new ResourceWithEndpointsPromise(this._promise.then(obj => obj.withHttpProbe(probeType, options)));
    }
    /** Subscribes to the ResourceEndpointsAllocated event */
    onResourceEndpointsAllocated(callback) {
        return new ResourceWithEndpointsPromise(this._promise.then(obj => obj.onResourceEndpointsAllocated(callback)));
    }
}
exports.ResourceWithEndpointsPromise = ResourceWithEndpointsPromise;
// ============================================================================
// ResourceWithEnvironment
// ============================================================================
class ResourceWithEnvironment extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _withOtlpExporterInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporter', rpcArgs);
        return new ResourceWithEnvironment(result, this._client);
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new ResourceWithEnvironmentPromise(this._withOtlpExporterInternal());
    }
    /** @internal */
    async _withOtlpExporterProtocolInternal(protocol) {
        const rpcArgs = { builder: this._handle, protocol };
        const result = await this._client.invokeCapability('Aspire.Hosting/withOtlpExporterProtocol', rpcArgs);
        return new ResourceWithEnvironment(result, this._client);
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new ResourceWithEnvironmentPromise(this._withOtlpExporterProtocolInternal(protocol));
    }
    /** @internal */
    async _withEnvironmentCallbackInternal(callback) {
        const callbackId = (0, transport_js_1.registerCallback)(async (argData) => {
            const argHandle = (0, transport_js_1.wrapIfHandle)(argData);
            const arg = new EnvironmentCallbackContext(argHandle, this._client);
            await callback(arg);
        });
        const rpcArgs = { builder: this._handle, callback: callbackId };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentCallback', rpcArgs);
        return new ResourceWithEnvironment(result, this._client);
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new ResourceWithEnvironmentPromise(this._withEnvironmentCallbackInternal(callback));
    }
    /** @internal */
    async _withEnvironmentEndpointInternal(name, endpointReference) {
        const rpcArgs = { builder: this._handle, name, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentEndpoint', rpcArgs);
        return new ResourceWithEnvironment(result, this._client);
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new ResourceWithEnvironmentPromise(this._withEnvironmentEndpointInternal(name, endpointReference));
    }
    /** @internal */
    async _withEnvironmentInternal(name, value) {
        const rpcArgs = { builder: this._handle, name, value };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironment', rpcArgs);
        return new ResourceWithEnvironment(result, this._client);
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new ResourceWithEnvironmentPromise(this._withEnvironmentInternal(name, value));
    }
    /** @internal */
    async _withEnvironmentParameterInternal(name, parameter) {
        const rpcArgs = { builder: this._handle, name, parameter };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentParameter', rpcArgs);
        return new ResourceWithEnvironment(result, this._client);
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new ResourceWithEnvironmentPromise(this._withEnvironmentParameterInternal(name, parameter));
    }
    /** @internal */
    async _withEnvironmentConnectionStringInternal(envVarName, resource) {
        const rpcArgs = { builder: this._handle, envVarName, resource };
        const result = await this._client.invokeCapability('Aspire.Hosting/withEnvironmentConnectionString', rpcArgs);
        return new ResourceWithEnvironment(result, this._client);
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new ResourceWithEnvironmentPromise(this._withEnvironmentConnectionStringInternal(envVarName, resource));
    }
    /** @internal */
    async _withReferenceEnvironmentInternal(options) {
        const rpcArgs = { builder: this._handle, options };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEnvironment', rpcArgs);
        return new ResourceWithEnvironment(result, this._client);
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new ResourceWithEnvironmentPromise(this._withReferenceEnvironmentInternal(options));
    }
    /** @internal */
    async _withReferenceInternal(source, connectionName, optional, name) {
        const rpcArgs = { builder: this._handle, source };
        if (connectionName !== undefined)
            rpcArgs.connectionName = connectionName;
        if (optional !== undefined)
            rpcArgs.optional = optional;
        if (name !== undefined)
            rpcArgs.name = name;
        const result = await this._client.invokeCapability('Aspire.Hosting/withReference', rpcArgs);
        return new ResourceWithEnvironment(result, this._client);
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        const connectionName = options?.connectionName;
        const optional = options?.optional;
        const name = options?.name;
        return new ResourceWithEnvironmentPromise(this._withReferenceInternal(source, connectionName, optional, name));
    }
    /** @internal */
    async _withReferenceUriInternal(name, uri) {
        const rpcArgs = { builder: this._handle, name, uri };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceUri', rpcArgs);
        return new ResourceWithEnvironment(result, this._client);
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new ResourceWithEnvironmentPromise(this._withReferenceUriInternal(name, uri));
    }
    /** @internal */
    async _withReferenceExternalServiceInternal(externalService) {
        const rpcArgs = { builder: this._handle, externalService };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceExternalService', rpcArgs);
        return new ResourceWithEnvironment(result, this._client);
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new ResourceWithEnvironmentPromise(this._withReferenceExternalServiceInternal(externalService));
    }
    /** @internal */
    async _withReferenceEndpointInternal(endpointReference) {
        const rpcArgs = { builder: this._handle, endpointReference };
        const result = await this._client.invokeCapability('Aspire.Hosting/withReferenceEndpoint', rpcArgs);
        return new ResourceWithEnvironment(result, this._client);
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new ResourceWithEnvironmentPromise(this._withReferenceEndpointInternal(endpointReference));
    }
    /** @internal */
    async _withDeveloperCertificateTrustInternal(trust) {
        const rpcArgs = { builder: this._handle, trust };
        const result = await this._client.invokeCapability('Aspire.Hosting/withDeveloperCertificateTrust', rpcArgs);
        return new ResourceWithEnvironment(result, this._client);
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new ResourceWithEnvironmentPromise(this._withDeveloperCertificateTrustInternal(trust));
    }
    /** @internal */
    async _withCertificateTrustScopeInternal(scope) {
        const rpcArgs = { builder: this._handle, scope };
        const result = await this._client.invokeCapability('Aspire.Hosting/withCertificateTrustScope', rpcArgs);
        return new ResourceWithEnvironment(result, this._client);
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new ResourceWithEnvironmentPromise(this._withCertificateTrustScopeInternal(scope));
    }
    /** @internal */
    async _withHttpsDeveloperCertificateInternal(password) {
        const rpcArgs = { builder: this._handle };
        if (password !== undefined)
            rpcArgs.password = password;
        const result = await this._client.invokeCapability('Aspire.Hosting/withParameterHttpsDeveloperCertificate', rpcArgs);
        return new ResourceWithEnvironment(result, this._client);
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        const password = options?.password;
        return new ResourceWithEnvironmentPromise(this._withHttpsDeveloperCertificateInternal(password));
    }
    /** @internal */
    async _withoutHttpsCertificateInternal() {
        const rpcArgs = { builder: this._handle };
        const result = await this._client.invokeCapability('Aspire.Hosting/withoutHttpsCertificate', rpcArgs);
        return new ResourceWithEnvironment(result, this._client);
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new ResourceWithEnvironmentPromise(this._withoutHttpsCertificateInternal());
    }
}
exports.ResourceWithEnvironment = ResourceWithEnvironment;
/**
 * Thenable wrapper for ResourceWithEnvironment that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class ResourceWithEnvironmentPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Configures OTLP telemetry export */
    withOtlpExporter() {
        return new ResourceWithEnvironmentPromise(this._promise.then(obj => obj.withOtlpExporter()));
    }
    /** Configures OTLP telemetry export with specific protocol */
    withOtlpExporterProtocol(protocol) {
        return new ResourceWithEnvironmentPromise(this._promise.then(obj => obj.withOtlpExporterProtocol(protocol)));
    }
    /** Sets environment variables via callback */
    withEnvironmentCallback(callback) {
        return new ResourceWithEnvironmentPromise(this._promise.then(obj => obj.withEnvironmentCallback(callback)));
    }
    /** Sets an environment variable from an endpoint reference */
    withEnvironmentEndpoint(name, endpointReference) {
        return new ResourceWithEnvironmentPromise(this._promise.then(obj => obj.withEnvironmentEndpoint(name, endpointReference)));
    }
    /** Sets an environment variable on the resource */
    withEnvironment(name, value) {
        return new ResourceWithEnvironmentPromise(this._promise.then(obj => obj.withEnvironment(name, value)));
    }
    /** Sets an environment variable from a parameter resource */
    withEnvironmentParameter(name, parameter) {
        return new ResourceWithEnvironmentPromise(this._promise.then(obj => obj.withEnvironmentParameter(name, parameter)));
    }
    /** Sets an environment variable from a connection string resource */
    withEnvironmentConnectionString(envVarName, resource) {
        return new ResourceWithEnvironmentPromise(this._promise.then(obj => obj.withEnvironmentConnectionString(envVarName, resource)));
    }
    /** Configures which reference values are injected into environment variables */
    withReferenceEnvironment(options) {
        return new ResourceWithEnvironmentPromise(this._promise.then(obj => obj.withReferenceEnvironment(options)));
    }
    /** Adds a reference to another resource */
    withReference(source, options) {
        return new ResourceWithEnvironmentPromise(this._promise.then(obj => obj.withReference(source, options)));
    }
    /** Adds a reference to a URI */
    withReferenceUri(name, uri) {
        return new ResourceWithEnvironmentPromise(this._promise.then(obj => obj.withReferenceUri(name, uri)));
    }
    /** Adds a reference to an external service */
    withReferenceExternalService(externalService) {
        return new ResourceWithEnvironmentPromise(this._promise.then(obj => obj.withReferenceExternalService(externalService)));
    }
    /** Adds a reference to an endpoint */
    withReferenceEndpoint(endpointReference) {
        return new ResourceWithEnvironmentPromise(this._promise.then(obj => obj.withReferenceEndpoint(endpointReference)));
    }
    /** Configures developer certificate trust */
    withDeveloperCertificateTrust(trust) {
        return new ResourceWithEnvironmentPromise(this._promise.then(obj => obj.withDeveloperCertificateTrust(trust)));
    }
    /** Sets the certificate trust scope */
    withCertificateTrustScope(scope) {
        return new ResourceWithEnvironmentPromise(this._promise.then(obj => obj.withCertificateTrustScope(scope)));
    }
    /** Configures HTTPS with a developer certificate */
    withHttpsDeveloperCertificate(options) {
        return new ResourceWithEnvironmentPromise(this._promise.then(obj => obj.withHttpsDeveloperCertificate(options)));
    }
    /** Removes HTTPS certificate configuration */
    withoutHttpsCertificate() {
        return new ResourceWithEnvironmentPromise(this._promise.then(obj => obj.withoutHttpsCertificate()));
    }
}
exports.ResourceWithEnvironmentPromise = ResourceWithEnvironmentPromise;
// ============================================================================
// ResourceWithWaitSupport
// ============================================================================
class ResourceWithWaitSupport extends base_js_1.ResourceBuilderBase {
    constructor(handle, client) {
        super(handle, client);
    }
    /** @internal */
    async _waitForInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResource', rpcArgs);
        return new ResourceWithWaitSupport(result, this._client);
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new ResourceWithWaitSupportPromise(this._waitForInternal(dependency));
    }
    /** @internal */
    async _waitForWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForWithBehavior', rpcArgs);
        return new ResourceWithWaitSupport(result, this._client);
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new ResourceWithWaitSupportPromise(this._waitForWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _waitForStartInternal(dependency) {
        const rpcArgs = { builder: this._handle, dependency };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceStart', rpcArgs);
        return new ResourceWithWaitSupport(result, this._client);
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new ResourceWithWaitSupportPromise(this._waitForStartInternal(dependency));
    }
    /** @internal */
    async _waitForStartWithBehaviorInternal(dependency, waitBehavior) {
        const rpcArgs = { builder: this._handle, dependency, waitBehavior };
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForStartWithBehavior', rpcArgs);
        return new ResourceWithWaitSupport(result, this._client);
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new ResourceWithWaitSupportPromise(this._waitForStartWithBehaviorInternal(dependency, waitBehavior));
    }
    /** @internal */
    async _waitForCompletionInternal(dependency, exitCode) {
        const rpcArgs = { builder: this._handle, dependency };
        if (exitCode !== undefined)
            rpcArgs.exitCode = exitCode;
        const result = await this._client.invokeCapability('Aspire.Hosting/waitForResourceCompletion', rpcArgs);
        return new ResourceWithWaitSupport(result, this._client);
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        const exitCode = options?.exitCode;
        return new ResourceWithWaitSupportPromise(this._waitForCompletionInternal(dependency, exitCode));
    }
}
exports.ResourceWithWaitSupport = ResourceWithWaitSupport;
/**
 * Thenable wrapper for ResourceWithWaitSupport that enables fluent chaining.
 * @example
 * await builder.addSomething().withX().withY();
 */
class ResourceWithWaitSupportPromise {
    _promise;
    constructor(_promise) {
        this._promise = _promise;
    }
    then(onfulfilled, onrejected) {
        return this._promise.then(onfulfilled, onrejected);
    }
    /** Waits for another resource to be ready */
    waitFor(dependency) {
        return new ResourceWithWaitSupportPromise(this._promise.then(obj => obj.waitFor(dependency)));
    }
    /** Waits for another resource with specific behavior */
    waitForWithBehavior(dependency, waitBehavior) {
        return new ResourceWithWaitSupportPromise(this._promise.then(obj => obj.waitForWithBehavior(dependency, waitBehavior)));
    }
    /** Waits for another resource to start */
    waitForStart(dependency) {
        return new ResourceWithWaitSupportPromise(this._promise.then(obj => obj.waitForStart(dependency)));
    }
    /** Waits for another resource to start with specific behavior */
    waitForStartWithBehavior(dependency, waitBehavior) {
        return new ResourceWithWaitSupportPromise(this._promise.then(obj => obj.waitForStartWithBehavior(dependency, waitBehavior)));
    }
    /** Waits for resource completion */
    waitForCompletion(dependency, options) {
        return new ResourceWithWaitSupportPromise(this._promise.then(obj => obj.waitForCompletion(dependency, options)));
    }
}
exports.ResourceWithWaitSupportPromise = ResourceWithWaitSupportPromise;
// ============================================================================
// Connection Helper
// ============================================================================
/**
 * Creates and connects to the Aspire AppHost.
 * Reads connection info from environment variables set by `aspire run`.
 */
async function connect() {
    const socketPath = process.env.REMOTE_APP_HOST_SOCKET_PATH;
    if (!socketPath) {
        throw new Error('REMOTE_APP_HOST_SOCKET_PATH environment variable not set. ' +
            'Run this application using `aspire run`.');
    }
    const client = new transport_js_1.AspireClient(socketPath);
    await client.connect();
    // Exit the process if the server connection is lost
    client.onDisconnect(() => {
        console.error('Connection to AppHost lost. Exiting...');
        process.exit(1);
    });
    return client;
}
/**
 * Creates a new distributed application builder.
 * This is the entry point for building Aspire applications.
 *
 * @param options - Optional configuration options for the builder
 * @returns A DistributedApplicationBuilder instance
 *
 * @example
 * const builder = await createBuilder();
 * builder.addRedis("cache");
 * builder.addContainer("api", "mcr.microsoft.com/dotnet/samples:aspnetapp");
 * const app = await builder.build();
 * await app.run();
 */
async function createBuilder(options) {
    const client = await connect();
    // Default args, projectDirectory, and appHostFilePath if not provided
    // ASPIRE_APPHOST_FILEPATH is set by the CLI for consistent socket hash computation
    const effectiveOptions = {
        ...options,
        args: options?.args ?? process.argv.slice(2),
        projectDirectory: options?.projectDirectory ?? process.env.ASPIRE_PROJECT_DIRECTORY ?? process.cwd(),
        appHostFilePath: options?.appHostFilePath ?? process.env.ASPIRE_APPHOST_FILEPATH
    };
    const handle = await client.invokeCapability('Aspire.Hosting/createBuilderWithOptions', { options: effectiveOptions });
    return new DistributedApplicationBuilder(handle, client);
}
// Re-export commonly used types
var transport_js_2 = require("./transport.js");
Object.defineProperty(exports, "Handle", { enumerable: true, get: function () { return transport_js_2.Handle; } });
Object.defineProperty(exports, "AppHostUsageError", { enumerable: true, get: function () { return transport_js_2.AppHostUsageError; } });
Object.defineProperty(exports, "CancellationToken", { enumerable: true, get: function () { return transport_js_2.CancellationToken; } });
Object.defineProperty(exports, "CapabilityError", { enumerable: true, get: function () { return transport_js_2.CapabilityError; } });
Object.defineProperty(exports, "registerCallback", { enumerable: true, get: function () { return transport_js_2.registerCallback; } });
var base_js_2 = require("./base.js");
Object.defineProperty(exports, "refExpr", { enumerable: true, get: function () { return base_js_2.refExpr; } });
Object.defineProperty(exports, "ReferenceExpression", { enumerable: true, get: function () { return base_js_2.ReferenceExpression; } });
// ============================================================================
// Global Error Handling
// ============================================================================
/**
 * Set up global error handlers to ensure the process exits properly on errors.
 * Node.js doesn't exit on unhandled rejections by default, so we need to handle them.
 */
process.on('unhandledRejection', (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    if (reason instanceof transport_js_1.AppHostUsageError) {
        console.error(`\n❌ AppHost Error: ${error.message}`);
    }
    else if (reason instanceof transport_js_1.CapabilityError) {
        console.error(`\n❌ Capability Error: ${error.message}`);
        console.error(`   Code: ${reason.code}`);
        if (reason.capability) {
            console.error(`   Capability: ${reason.capability}`);
        }
    }
    else {
        console.error(`\n❌ Unhandled Error: ${error.message}`);
        if (error.stack) {
            console.error(error.stack);
        }
    }
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    if (error instanceof transport_js_1.AppHostUsageError) {
        console.error(`\n❌ AppHost Error: ${error.message}`);
    }
    else {
        console.error(`\n❌ Uncaught Exception: ${error.message}`);
    }
    if (!(error instanceof transport_js_1.AppHostUsageError) && error.stack) {
        console.error(error.stack);
    }
    process.exit(1);
});
// ============================================================================
// Handle Wrapper Registrations
// ============================================================================
// Register wrapper factories for typed handle wrapping in callbacks
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.AfterResourcesCreatedEvent', (handle, client) => new AfterResourcesCreatedEvent(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.BeforeResourceStartedEvent', (handle, client) => new BeforeResourceStartedEvent(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.BeforeStartEvent', (handle, client) => new BeforeStartEvent(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.CommandLineArgsCallbackContext', (handle, client) => new CommandLineArgsCallbackContext(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.ConnectionStringAvailableEvent', (handle, client) => new ConnectionStringAvailableEvent(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.DistributedApplication', (handle, client) => new DistributedApplication(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.DistributedApplicationExecutionContext', (handle, client) => new DistributedApplicationExecutionContext(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.DistributedApplicationModel', (handle, client) => new DistributedApplicationModel(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.EndpointReference', (handle, client) => new EndpointReference(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.EndpointReferenceExpression', (handle, client) => new EndpointReferenceExpression(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.EnvironmentCallbackContext', (handle, client) => new EnvironmentCallbackContext(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.ExecuteCommandContext', (handle, client) => new ExecuteCommandContext(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.InitializeResourceEvent', (handle, client) => new InitializeResourceEvent(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.Pipelines.PipelineConfigurationContext', (handle, client) => new PipelineConfigurationContext(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.Pipelines.PipelineContext', (handle, client) => new PipelineContext(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.Pipelines.PipelineStep', (handle, client) => new PipelineStep(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.Pipelines.PipelineStepContext', (handle, client) => new PipelineStepContext(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.Pipelines.PipelineStepFactoryContext', (handle, client) => new PipelineStepFactoryContext(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.Pipelines.PipelineSummary', (handle, client) => new PipelineSummary(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ProjectResourceOptions', (handle, client) => new ProjectResourceOptions(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.ReferenceExpressionBuilder', (handle, client) => new ReferenceExpressionBuilder(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.ResourceEndpointsAllocatedEvent', (handle, client) => new ResourceEndpointsAllocatedEvent(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.ResourceLoggerService', (handle, client) => new ResourceLoggerService(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.ResourceNotificationService', (handle, client) => new ResourceNotificationService(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.ResourceReadyEvent', (handle, client) => new ResourceReadyEvent(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.ResourceStoppedEvent', (handle, client) => new ResourceStoppedEvent(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.ResourceUrlsCallbackContext', (handle, client) => new ResourceUrlsCallbackContext(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.UpdateCommandStateContext', (handle, client) => new UpdateCommandStateContext(handle, client));
(0, transport_js_1.registerHandleWrapper)('Microsoft.Extensions.Configuration.Abstractions/Microsoft.Extensions.Configuration.IConfiguration', (handle, client) => new Configuration(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.IDistributedApplicationBuilder', (handle, client) => new DistributedApplicationBuilder(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.Eventing.IDistributedApplicationEventing', (handle, client) => new DistributedApplicationEventing(handle, client));
(0, transport_js_1.registerHandleWrapper)('Microsoft.Extensions.Hosting.Abstractions/Microsoft.Extensions.Hosting.IHostEnvironment', (handle, client) => new HostEnvironment(handle, client));
(0, transport_js_1.registerHandleWrapper)('Microsoft.Extensions.Logging.Abstractions/Microsoft.Extensions.Logging.ILogger', (handle, client) => new Logger(handle, client));
(0, transport_js_1.registerHandleWrapper)('Microsoft.Extensions.Logging.Abstractions/Microsoft.Extensions.Logging.ILoggerFactory', (handle, client) => new LoggerFactory(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.Pipelines.IReportingStep', (handle, client) => new ReportingStep(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.Pipelines.IReportingTask', (handle, client) => new ReportingTask(handle, client));
(0, transport_js_1.registerHandleWrapper)('System.ComponentModel/System.IServiceProvider', (handle, client) => new ServiceProvider(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.IUserSecretsManager', (handle, client) => new UserSecretsManager(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ConnectionStringResource', (handle, client) => new ConnectionStringResource(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.ContainerRegistryResource', (handle, client) => new ContainerRegistryResource(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.ContainerResource', (handle, client) => new ContainerResource(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.CSharpAppResource', (handle, client) => new CSharpAppResource(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.DotnetToolResource', (handle, client) => new DotnetToolResource(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.ExecutableResource', (handle, client) => new ExecutableResource(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ExternalServiceResource', (handle, client) => new ExternalServiceResource(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting.JavaScript/Aspire.Hosting.JavaScript.JavaScriptAppResource', (handle, client) => new JavaScriptAppResource(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting.JavaScript/Aspire.Hosting.JavaScript.NodeAppResource', (handle, client) => new NodeAppResource(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.ParameterResource', (handle, client) => new ParameterResource(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.ProjectResource', (handle, client) => new ProjectResource(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting.JavaScript/Aspire.Hosting.JavaScript.ViteAppResource', (handle, client) => new ViteAppResource(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.IComputeResource', (handle, client) => new ComputeResource(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.IContainerFilesDestinationResource', (handle, client) => new ContainerFilesDestinationResource(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.IResource', (handle, client) => new Resource(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.IResourceWithArgs', (handle, client) => new ResourceWithArgs(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.IResourceWithConnectionString', (handle, client) => new ResourceWithConnectionString(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.IResourceWithContainerFiles', (handle, client) => new ResourceWithContainerFiles(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.IResourceWithEndpoints', (handle, client) => new ResourceWithEndpoints(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.IResourceWithEnvironment', (handle, client) => new ResourceWithEnvironment(handle, client));
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.IResourceWithWaitSupport', (handle, client) => new ResourceWithWaitSupport(handle, client));
