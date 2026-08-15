// Simple generator+test for venmo.com password rule
// Generates 500 passwords and asserts they comply with venmo's stated rule:
// · Minimum 8 characters, maximum 20
// · Must include upper and lower case letters
// · Must include a number and one of these: (~!@#$%^&*()+=)

'use strict';

const assert = require('assert');

const MIN = 8;
const MAX = 20;
const SPECIALS = "~!@#$%^&*()+=";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const ALLOWED = LOWER + UPPER + DIGITS + SPECIALS;
const SAMPLES = 500;
const MAX_CONSECUTIVE = 3; // as per the rule in the JSON

function randInt(n) {
    return Math.floor(Math.random() * n);
}

function pick(str) {
    return str[randInt(str.length)];
}

function generatePasswordSimple(length) {
    const chars = [];
    // ensure at least one of each required
    chars.push(pick(LOWER));
    chars.push(pick(UPPER));
    chars.push(pick(DIGITS));
    chars.push(pick(SPECIALS));
    while (chars.length < length) chars.push(pick(ALLOWED));
    // shuffle
    for (let i = chars.length - 1; i > 0; --i) {
        const j = randInt(i + 1);
        const tmp = chars[i]; chars[i] = chars[j]; chars[j] = tmp;
    }
    return chars.join('');
}

function checkMaxConsecutive(s) {
    let run = 1;
    for (let i = 1; i < s.length; ++i) {
        if (s[i] === s[i-1]) {
            run++;
            if (run > MAX_CONSECUTIVE) return false;
        } else run = 1;
    }
    return true;
}

function generatePassword() {
    // Choose a length between MIN and MAX
    const length = MIN + randInt(MAX - MIN + 1);

    // Use simple generator that ensures required classes; retry on run violation
    for (let attempt = 0; attempt < 50; ++attempt) {
        const p = generatePasswordSimple(length);
        if (checkMaxConsecutive(p)) return p;
    }
    // Last resort: return a deterministic compliant password
    const fallback = 'aA0' + SPECIALS[0] + 'bB1' + SPECIALS[1];
    return fallback.substr(0, Math.max(MIN, Math.min(MAX, fallback.length)));
}

function validate(password) {
    if (password.length < MIN || password.length > MAX) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    const specialRegex = new RegExp('[' + SPECIALS.replace(/[[\\\]\\^$.|?*+()]/g, '\\$&') + ']');
    if (!specialRegex.test(password)) return false;
    if (!checkMaxConsecutive(password)) return false;
    return true;
}

console.log(`Generating ${SAMPLES} sample passwords for venmo.com rules...`);
let failures = 0;
for (let i = 0; i < SAMPLES; ++i) {
    const p = generatePassword();
    if (!validate(p)) {
        console.error(`Sample ${i} failed validation: ${p}`);
        failures++;
    }
}

if (failures === 0) {
    console.log(`All ${SAMPLES} generated passwords passed validation.`);
    process.exit(0);
} else {
    console.error(`${failures}/${SAMPLES} samples failed validation.`);
    process.exit(2);
}
