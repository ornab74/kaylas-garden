"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AspireDict = exports.AspireList = exports.ResourceBuilderBase = exports.ReferenceExpression = exports.wrapIfHandle = exports.isAtsError = exports.isMarshalledHandle = exports.AtsErrorCodes = exports.unregisterCancellation = exports.registerCancellation = exports.unregisterCallback = exports.registerCallback = exports.CancellationToken = exports.CapabilityError = exports.AspireClient = exports.Handle = void 0;
exports.refExpr = refExpr;
// base.ts - Core Aspire types: base classes, ReferenceExpression
const transport_js_1 = require("./transport.js");
// Re-export transport types for convenience
var transport_js_2 = require("./transport.js");
Object.defineProperty(exports, "Handle", { enumerable: true, get: function () { return transport_js_2.Handle; } });
Object.defineProperty(exports, "AspireClient", { enumerable: true, get: function () { return transport_js_2.AspireClient; } });
Object.defineProperty(exports, "CapabilityError", { enumerable: true, get: function () { return transport_js_2.CapabilityError; } });
Object.defineProperty(exports, "CancellationToken", { enumerable: true, get: function () { return transport_js_2.CancellationToken; } });
Object.defineProperty(exports, "registerCallback", { enumerable: true, get: function () { return transport_js_2.registerCallback; } });
Object.defineProperty(exports, "unregisterCallback", { enumerable: true, get: function () { return transport_js_2.unregisterCallback; } });
Object.defineProperty(exports, "registerCancellation", { enumerable: true, get: function () { return transport_js_2.registerCancellation; } });
Object.defineProperty(exports, "unregisterCancellation", { enumerable: true, get: function () { return transport_js_2.unregisterCancellation; } });
var transport_js_3 = require("./transport.js");
Object.defineProperty(exports, "AtsErrorCodes", { enumerable: true, get: function () { return transport_js_3.AtsErrorCodes; } });
Object.defineProperty(exports, "isMarshalledHandle", { enumerable: true, get: function () { return transport_js_3.isMarshalledHandle; } });
Object.defineProperty(exports, "isAtsError", { enumerable: true, get: function () { return transport_js_3.isAtsError; } });
Object.defineProperty(exports, "wrapIfHandle", { enumerable: true, get: function () { return transport_js_3.wrapIfHandle; } });
// ============================================================================
// Reference Expression
// ============================================================================
/**
 * Represents a reference expression that can be passed to capabilities.
 *
 * Reference expressions are serialized in the protocol as:
 * ```json
 * {
 *   "$expr": {
 *     "format": "redis://{0}:{1}",
 *     "valueProviders": [
 *       { "$handle": "Aspire.Hosting.ApplicationModel/EndpointReference:1" },
 *       { "$handle": "Aspire.Hosting.ApplicationModel/EndpointReference:2" }
 *     ]
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * const redis = await builder.addRedis("cache");
 * const endpoint = await redis.getEndpoint("tcp");
 *
 * // Create a reference expression
 * const expr = refExpr`redis://${endpoint}:6379`;
 *
 * // Use it in an environment variable
 * await api.withEnvironment("REDIS_URL", expr);
 * ```
 */
class ReferenceExpression {
    // Expression mode fields
    _format;
    _valueProviders;
    // Conditional mode fields
    _condition;
    _whenTrue;
    _whenFalse;
    _matchValue;
    // Handle mode fields (when wrapping a server-returned handle)
    _handle;
    _client;
    constructor(handleOrFormatOrCondition, clientOrValueProvidersOrMatchValue, whenTrueOrWhenFalse, whenFalse) {
        if (typeof handleOrFormatOrCondition === 'string') {
            this._format = handleOrFormatOrCondition;
            this._valueProviders = clientOrValueProvidersOrMatchValue;
        }
        else if (handleOrFormatOrCondition instanceof transport_js_1.Handle) {
            this._handle = handleOrFormatOrCondition;
            this._client = clientOrValueProvidersOrMatchValue;
        }
        else {
            this._condition = handleOrFormatOrCondition;
            this._matchValue = clientOrValueProvidersOrMatchValue ?? 'True';
            this._whenTrue = whenTrueOrWhenFalse;
            this._whenFalse = whenFalse;
        }
    }
    /**
     * Gets whether this reference expression is conditional.
     */
    get isConditional() {
        return this._condition !== undefined;
    }
    /**
     * Creates a reference expression from a tagged template literal.
     *
     * @param strings - The template literal string parts
     * @param values - The interpolated values (handles to value providers)
     * @returns A ReferenceExpression instance
     */
    static create(strings, ...values) {
        // Build the format string with {0}, {1}, etc. placeholders
        let format = '';
        for (let i = 0; i < strings.length; i++) {
            format += strings[i];
            if (i < values.length) {
                format += `{${i}}`;
            }
        }
        // Extract handles from values
        const valueProviders = values.map(extractHandleForExpr);
        return new ReferenceExpression(format, valueProviders);
    }
    /**
     * Creates a conditional reference expression from its constituent parts.
     *
     * @param condition - A value provider whose result is compared to matchValue
     * @param whenTrue - The expression to use when the condition matches
     * @param whenFalse - The expression to use when the condition does not match
     * @param matchValue - The value to compare the condition against (defaults to "True")
     * @returns A ReferenceExpression instance in conditional mode
     */
    static createConditional(condition, matchValue, whenTrue, whenFalse) {
        return new ReferenceExpression(condition, matchValue, whenTrue, whenFalse);
    }
    /**
     * Serializes the reference expression for JSON-RPC transport.
     * In expression mode, uses the $expr format with format + valueProviders.
     * In conditional mode, uses the $expr format with condition + whenTrue + whenFalse.
     * In handle mode, delegates to the handle's serialization.
     */
    toJSON() {
        if (this._handle) {
            return this._handle.toJSON();
        }
        if (this.isConditional) {
            return {
                $expr: {
                    condition: extractHandleForExpr(this._condition),
                    whenTrue: this._whenTrue.toJSON(),
                    whenFalse: this._whenFalse.toJSON(),
                    matchValue: this._matchValue
                }
            };
        }
        return {
            $expr: {
                format: this._format,
                valueProviders: this._valueProviders && this._valueProviders.length > 0 ? this._valueProviders : undefined
            }
        };
    }
    /**
     * Resolves the expression to its string value on the server.
     * Only available on server-returned ReferenceExpression instances (handle mode).
     *
     * @param cancellationToken - Optional AbortSignal or CancellationToken for cancellation support
     * @returns The resolved string value, or null if the expression resolves to null
     */
    async getValue(cancellationToken) {
        if (!this._handle || !this._client) {
            throw new Error('getValue is only available on server-returned ReferenceExpression instances');
        }
        const cancellationTokenId = (0, transport_js_1.registerCancellation)(this._client, cancellationToken);
        try {
            const rpcArgs = { context: this._handle };
            if (cancellationTokenId !== undefined)
                rpcArgs.cancellationToken = cancellationTokenId;
            return await this._client.invokeCapability('Aspire.Hosting.ApplicationModel/getValue', rpcArgs);
        }
        finally {
            (0, transport_js_1.unregisterCancellation)(cancellationTokenId);
        }
    }
    /**
     * String representation for debugging.
     */
    toString() {
        if (this._handle) {
            return `ReferenceExpression(handle)`;
        }
        if (this.isConditional) {
            return `ReferenceExpression(conditional)`;
        }
        return `ReferenceExpression(${this._format})`;
    }
}
exports.ReferenceExpression = ReferenceExpression;
(0, transport_js_1.registerHandleWrapper)('Aspire.Hosting/Aspire.Hosting.ApplicationModel.ReferenceExpression', (handle, client) => new ReferenceExpression(handle, client));
/**
 * Extracts a value for use in reference expressions.
 * Supports handles (objects) and string literals.
 * @internal
 */
function extractHandleForExpr(value) {
    if (value === null || value === undefined) {
        throw new Error('Cannot use null or undefined in reference expression');
    }
    // String literals - include directly in the expression
    if (typeof value === 'string') {
        return value;
    }
    // Number literals - convert to string
    if (typeof value === 'number') {
        return String(value);
    }
    // Handle objects - get their JSON representation
    if (value instanceof transport_js_1.Handle) {
        return value.toJSON();
    }
    // Objects with marshalled expression/handle payloads
    if (typeof value === 'object' && value !== null && ('$handle' in value || '$expr' in value)) {
        return value;
    }
    // Objects with toJSON that returns a marshalled expression or handle
    if (typeof value === 'object' && value !== null && 'toJSON' in value && typeof value.toJSON === 'function') {
        const json = value.toJSON();
        if (json && typeof json === 'object' && ('$handle' in json || '$expr' in json)) {
            return json;
        }
    }
    throw new Error(`Cannot use value of type ${typeof value} in reference expression. ` +
        `Expected a Handle, string, or number.`);
}
/**
 * Tagged template function for creating reference expressions.
 *
 * Use this to create dynamic expressions that reference endpoints, parameters, and other
 * value providers. The expression is evaluated at runtime by Aspire.
 *
 * @example
 * ```typescript
 * const redis = await builder.addRedis("cache");
 * const endpoint = await redis.getEndpoint("tcp");
 *
 * // Create a reference expression using the tagged template
 * const expr = refExpr`redis://${endpoint}:6379`;
 *
 * // Use it in an environment variable
 * await api.withEnvironment("REDIS_URL", expr);
 * ```
 */
function refExpr(strings, ...values) {
    return ReferenceExpression.create(strings, ...values);
}
// ============================================================================
// ResourceBuilderBase
// ============================================================================
/**
 * Base class for resource builders (e.g., RedisBuilder, ContainerBuilder).
 * Provides handle management and JSON serialization.
 */
class ResourceBuilderBase {
    _handle;
    _client;
    constructor(_handle, _client) {
        this._handle = _handle;
        this._client = _client;
    }
    toJSON() { return this._handle.toJSON(); }
}
exports.ResourceBuilderBase = ResourceBuilderBase;
// ============================================================================
// AspireList<T> - Mutable List Wrapper
// ============================================================================
/**
 * Wrapper for a mutable .NET List<T>.
 * Provides array-like methods that invoke capabilities on the underlying collection.
 *
 * @example
 * ```typescript
 * const items = await resource.getItems(); // Returns AspireList<ItemBuilder>
 * const count = await items.count();
 * const first = await items.get(0);
 * await items.add(newItem);
 * ```
 */
class AspireList {
    _handleOrContext;
    _client;
    _typeId;
    _getterCapabilityId;
    _resolvedHandle;
    _resolvePromise;
    constructor(_handleOrContext, _client, _typeId, _getterCapabilityId) {
        this._handleOrContext = _handleOrContext;
        this._client = _client;
        this._typeId = _typeId;
        this._getterCapabilityId = _getterCapabilityId;
        // If no getter capability, the handle is already the list handle
        if (!_getterCapabilityId) {
            this._resolvedHandle = _handleOrContext;
        }
    }
    /**
     * Ensures we have the actual list handle by calling the getter if needed.
     */
    async _ensureHandle() {
        if (this._resolvedHandle) {
            return this._resolvedHandle;
        }
        if (this._resolvePromise) {
            return this._resolvePromise;
        }
        // Call the getter capability to get the actual list handle
        this._resolvePromise = (async () => {
            const result = await this._client.invokeCapability(this._getterCapabilityId, {
                context: this._handleOrContext
            });
            this._resolvedHandle = result;
            return this._resolvedHandle;
        })();
        return this._resolvePromise;
    }
    /**
     * Gets the number of elements in the list.
     */
    async count() {
        const handle = await this._ensureHandle();
        return await this._client.invokeCapability('Aspire.Hosting/List.length', {
            list: handle
        });
    }
    /**
     * Gets the element at the specified index.
     */
    async get(index) {
        const handle = await this._ensureHandle();
        return await this._client.invokeCapability('Aspire.Hosting/List.get', {
            list: handle,
            index
        });
    }
    /**
     * Adds an element to the end of the list.
     */
    async add(item) {
        const handle = await this._ensureHandle();
        await this._client.invokeCapability('Aspire.Hosting/List.add', {
            list: handle,
            item
        });
    }
    /**
     * Removes the element at the specified index.
     */
    async removeAt(index) {
        const handle = await this._ensureHandle();
        await this._client.invokeCapability('Aspire.Hosting/List.removeAt', {
            list: handle,
            index
        });
    }
    /**
     * Clears all elements from the list.
     */
    async clear() {
        const handle = await this._ensureHandle();
        await this._client.invokeCapability('Aspire.Hosting/List.clear', {
            list: handle
        });
    }
    /**
     * Converts the list to an array (creates a copy).
     */
    async toArray() {
        const handle = await this._ensureHandle();
        return await this._client.invokeCapability('Aspire.Hosting/List.toArray', {
            list: handle
        });
    }
    async toTransportValue() {
        const handle = await this._ensureHandle();
        return handle.toJSON();
    }
    toJSON() {
        if (!this._resolvedHandle) {
            throw new Error('AspireList must be resolved before it can be serialized directly. ' +
                'Pass it to generated SDK methods instead of calling JSON.stringify directly.');
        }
        return this._resolvedHandle.toJSON();
    }
}
exports.AspireList = AspireList;
// ============================================================================
// AspireDict<K, V> - Mutable Dictionary Wrapper
// ============================================================================
/**
 * Wrapper for a mutable .NET Dictionary<K, V>.
 * Provides object-like methods that invoke capabilities on the underlying collection.
 *
 * @example
 * ```typescript
 * const config = await resource.getConfig(); // Returns AspireDict<string, string>
 * const value = await config.get("key");
 * await config.set("key", "value");
 * const hasKey = await config.containsKey("key");
 * ```
 */
class AspireDict {
    _handleOrContext;
    _client;
    _typeId;
    _getterCapabilityId;
    _resolvedHandle;
    _resolvePromise;
    constructor(_handleOrContext, _client, _typeId, _getterCapabilityId) {
        this._handleOrContext = _handleOrContext;
        this._client = _client;
        this._typeId = _typeId;
        this._getterCapabilityId = _getterCapabilityId;
        // If no getter capability, the handle is already the dictionary handle
        if (!_getterCapabilityId) {
            this._resolvedHandle = _handleOrContext;
        }
    }
    /**
     * Ensures we have the actual dictionary handle by calling the getter if needed.
     */
    async _ensureHandle() {
        if (this._resolvedHandle) {
            return this._resolvedHandle;
        }
        if (this._resolvePromise) {
            return this._resolvePromise;
        }
        // Call the getter capability to get the actual dictionary handle
        this._resolvePromise = (async () => {
            const result = await this._client.invokeCapability(this._getterCapabilityId, {
                context: this._handleOrContext
            });
            this._resolvedHandle = result;
            return this._resolvedHandle;
        })();
        return this._resolvePromise;
    }
    /**
     * Gets the number of key-value pairs in the dictionary.
     */
    async count() {
        const handle = await this._ensureHandle();
        return await this._client.invokeCapability('Aspire.Hosting/Dict.count', {
            dict: handle
        });
    }
    /**
     * Gets the value associated with the specified key.
     * @throws If the key is not found.
     */
    async get(key) {
        const handle = await this._ensureHandle();
        return await this._client.invokeCapability('Aspire.Hosting/Dict.get', {
            dict: handle,
            key
        });
    }
    /**
     * Sets the value for the specified key.
     */
    async set(key, value) {
        const handle = await this._ensureHandle();
        await this._client.invokeCapability('Aspire.Hosting/Dict.set', {
            dict: handle,
            key,
            value
        });
    }
    /**
     * Determines whether the dictionary contains the specified key.
     */
    async containsKey(key) {
        const handle = await this._ensureHandle();
        return await this._client.invokeCapability('Aspire.Hosting/Dict.has', {
            dict: handle,
            key
        });
    }
    /**
     * Removes the value with the specified key.
     * @returns True if the element was removed; false if the key was not found.
     */
    async remove(key) {
        const handle = await this._ensureHandle();
        return await this._client.invokeCapability('Aspire.Hosting/Dict.remove', {
            dict: handle,
            key
        });
    }
    /**
     * Clears all key-value pairs from the dictionary.
     */
    async clear() {
        const handle = await this._ensureHandle();
        await this._client.invokeCapability('Aspire.Hosting/Dict.clear', {
            dict: handle
        });
    }
    /**
     * Gets all keys in the dictionary.
     */
    async keys() {
        const handle = await this._ensureHandle();
        return await this._client.invokeCapability('Aspire.Hosting/Dict.keys', {
            dict: handle
        });
    }
    /**
     * Gets all values in the dictionary.
     */
    async values() {
        const handle = await this._ensureHandle();
        return await this._client.invokeCapability('Aspire.Hosting/Dict.values', {
            dict: handle
        });
    }
    /**
     * Converts the dictionary to a plain object (creates a copy).
     * Only works when K is string.
     */
    async toObject() {
        const handle = await this._ensureHandle();
        return await this._client.invokeCapability('Aspire.Hosting/Dict.toObject', {
            dict: handle
        });
    }
    async toTransportValue() {
        const handle = await this._ensureHandle();
        return handle.toJSON();
    }
    toJSON() {
        if (!this._resolvedHandle) {
            throw new Error('AspireDict must be resolved before it can be serialized directly. ' +
                'Pass it to generated SDK methods instead of calling JSON.stringify directly.');
        }
        return this._resolvedHandle.toJSON();
    }
}
exports.AspireDict = AspireDict;
