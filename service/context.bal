import ballerina/graphql;
import ballerina/http;
import ballerina/jwt;
import ballerina/log;
import ballerina/lang.value;

// Populate the GraphQL context with jwt header from the HTTP request
isolated function contextInit(http:RequestContext reqCtx, http:Request request) returns graphql:Context|error {
    graphql:Context context = new;
    string| error authorization = request.getHeader(JWT_HEADER);
    if authorization is error {
        // If the header is not present, we return with empty context to fallback to the default user
        return context;
    }
    context.set(JWT_HEADER, authorization);
    return context;
}

# Retrieve the user id from the GraphQL context.
# + context - GraphQL request context
# + return - User id if the x-jwt-assertion is available in the context. Otherwise, fallback to the default user.
isolated function getUserId(graphql:Context context) returns string {
    value:Cloneable|isolated object {}|error jwtAssertion = context.get(JWT_HEADER);
    if jwtAssertion is string {
        [jwt:Header, jwt:Payload]|error [_, payload] = jwt:decode(jwtAssertion);
        if payload.sub is string {
            return <string>payload.sub;
        }
    }
    log:printWarn("Cannot retrieve jwtAssertion from graphql context. Using default user for the request.");
    return DEFAULT_USER_ID;
}
