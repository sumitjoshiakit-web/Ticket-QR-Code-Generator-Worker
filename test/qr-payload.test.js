import test from "node:test"; import assert from "node:assert/strict"; import { buildQrPayload,hashQrPayload,serializeQrPayload } from "../src/domain/qr-payload.js";
const ticket={ticketNumber:"TKT-000123",holderName:"Example Holder",eventName:"Example Event",quantity:2,status:"active"};
test("builds versioned payload with intended fields",()=>{const p=buildQrPayload(ticket);assert.deepEqual(p,{v:"v1",ticketNumber:"TKT-000123",holderName:"Example Holder",eventName:"Example Event",quantity:2,status:"active"});assert.equal("id" in p,false)});
test("serializes payload deterministically",()=>assert.equal(serializeQrPayload(buildQrPayload(ticket)),JSON.stringify({v:"v1",ticketNumber:"TKT-000123",holderName:"Example Holder",eventName:"Example Event",quantity:2,status:"active"})));
test("produces a 64-character SHA-256 hash",()=>assert.match(hashQrPayload(buildQrPayload(ticket)),/^[a-f0-9]{64}$/));
test("same payload produces same hash",()=>assert.equal(hashQrPayload(buildQrPayload(ticket)),hashQrPayload(buildQrPayload({...ticket}))));
test("changing ticket data changes the hash",()=>assert.notEqual(hashQrPayload(buildQrPayload(ticket)),hashQrPayload(buildQrPayload({...ticket,quantity:3}))));
