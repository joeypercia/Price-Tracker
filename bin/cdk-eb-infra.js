#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("@aws-cdk/core");
const cdk_eb_infra_stack_1 = require("../lib/cdk-eb-infra-stack");
const app = new cdk.App();
new cdk_eb_infra_stack_1.CdkEbInfraStack(app, 'CdkEbInfraStack', {
/* If you don't specify 'env', this stack will be environment-agnostic.
 * Account/Region-dependent features and context lookups will not work,
 * but a single synthesized template can be deployed anywhere. */
/* Uncomment the next line to specialize this stack for the AWS Account
 * and Region that are implied by the current CLI configuration. */
// env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
/* Uncomment the next line if you know exactly what Account and Region you
 * want to deploy the stack to. */
// env: { account: '123456789012', region: 'us-east-1' },
/* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWViLWluZnJhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLWViLWluZnJhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVDQUFxQztBQUNyQyxxQ0FBcUM7QUFDckMsa0VBQTREO0FBRTVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksb0NBQWUsQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLEVBQUU7QUFDMUM7O2lFQUVpRTtBQUVqRTttRUFDbUU7QUFDbkUsNkZBQTZGO0FBRTdGO2tDQUNrQztBQUNsQyx5REFBeUQ7QUFFekQsOEZBQThGO0NBQy9GLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCAnc291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENka0ViSW5mcmFTdGFjayB9IGZyb20gJy4uL2xpYi9jZGstZWItaW5mcmEtc3RhY2snO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IENka0ViSW5mcmFTdGFjayhhcHAsICdDZGtFYkluZnJhU3RhY2snLCB7XG4gIC8qIElmIHlvdSBkb24ndCBzcGVjaWZ5ICdlbnYnLCB0aGlzIHN0YWNrIHdpbGwgYmUgZW52aXJvbm1lbnQtYWdub3N0aWMuXG4gICAqIEFjY291bnQvUmVnaW9uLWRlcGVuZGVudCBmZWF0dXJlcyBhbmQgY29udGV4dCBsb29rdXBzIHdpbGwgbm90IHdvcmssXG4gICAqIGJ1dCBhIHNpbmdsZSBzeW50aGVzaXplZCB0ZW1wbGF0ZSBjYW4gYmUgZGVwbG95ZWQgYW55d2hlcmUuICovXG5cbiAgLyogVW5jb21tZW50IHRoZSBuZXh0IGxpbmUgdG8gc3BlY2lhbGl6ZSB0aGlzIHN0YWNrIGZvciB0aGUgQVdTIEFjY291bnRcbiAgICogYW5kIFJlZ2lvbiB0aGF0IGFyZSBpbXBsaWVkIGJ5IHRoZSBjdXJyZW50IENMSSBjb25maWd1cmF0aW9uLiAqL1xuICAvLyBlbnY6IHsgYWNjb3VudDogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfQUNDT1VOVCwgcmVnaW9uOiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9SRUdJT04gfSxcblxuICAvKiBVbmNvbW1lbnQgdGhlIG5leHQgbGluZSBpZiB5b3Uga25vdyBleGFjdGx5IHdoYXQgQWNjb3VudCBhbmQgUmVnaW9uIHlvdVxuICAgKiB3YW50IHRvIGRlcGxveSB0aGUgc3RhY2sgdG8uICovXG4gIC8vIGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAndXMtZWFzdC0xJyB9LFxuXG4gIC8qIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9sYXRlc3QvZ3VpZGUvZW52aXJvbm1lbnRzLmh0bWwgKi9cbn0pO1xuIl19