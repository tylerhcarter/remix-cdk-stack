#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {RemixStack} from '../lib/remix-stack';
import {CdnStack} from "../lib/cdn-stack";

const app = new cdk.App();
const remixStack = new RemixStack(app, 'RemixStack', {});

const cdnStack = new CdnStack(app, 'CdnStack', {
    originUrl: remixStack.url
})
