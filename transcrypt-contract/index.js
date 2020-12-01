/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const Transcrypt = require('./lib/transcrypt');
const Degree = require('./lib/degree')

module.exports.Transcrypt = Transcrypt;
module.exports.Degree = Degree;
module.exports.contracts = [ Transcrypt, Degree ];
