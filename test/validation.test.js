import test from "node:test"; import assert from "node:assert/strict"; import { validateTicket } from "../src/domain/validation.js";
const validTicket={ticketNumber:" tkt-000123 ",holderName:"  Example Holder  ",eventName:" Example Event ",quantity:2,status:"ACTIVE"};
test("normalizes a valid ticket",()=>{const r=validateTicket(validTicket);assert.equal(r.ticketNumber,"TKT-000123");assert.equal(r.holderName,"Example Holder");assert.equal(r.eventName,"Example Event");assert.equal(r.status,"active")});
test("rejects missing required fields",()=>{assert.throws(()=>validateTicket({}),e=>{assert.equal(e.code,"INVALID_INPUT");assert.deepEqual(Object.keys(e.fields).sort(),["eventName","holderName","quantity","status","ticketNumber"]);return true})});
test("rejects non-positive or non-integer quantity",()=>{for(const quantity of [0,-1,1.5,"2"]) assert.throws(()=>validateTicket({...validTicket,quantity}),/invalid/i)});
test("rejects unknown status",()=>{assert.throws(()=>validateTicket({...validTicket,status:"pending"}),/invalid/i)});
test("enforces field length limits",()=>{assert.throws(()=>validateTicket({...validTicket,holderName:"x".repeat(161)}),/invalid/i)});
test("keeps user text as text",()=>{const r=validateTicket({...validTicket,holderName:"<script>alert(1)</script>"});assert.equal(r.holderName,"<script>alert(1)</script>")});
