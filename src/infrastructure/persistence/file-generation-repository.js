import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export class FileGenerationRepository {
  constructor(filePath = "./data/generations.json") { this.filePath = filePath; }
  async #read() {
    try { return JSON.parse(await readFile(this.filePath, "utf8")); }
    catch (error) { if (error.code === "ENOENT") return []; throw error; }
  }
  async #write(records) {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(records, null, 2), "utf8");
  }
  async findById(id) { return (await this.#read()).find(record => record.id === id) ?? null; }
  async findByTicketNumber(ticketNumber) { return (await this.#read()).find(record => record.ticketNumber === ticketNumber) ?? null; }
  async create(record) {
    const records = await this.#read();
    if (records.some(item => item.id === record.id || item.ticketNumber === record.ticketNumber)) throw new Error("A generation record already exists for this ticket.");
    records.push(record); await this.#write(records); return record;
  }
  async count() { return (await this.#read()).length; }
}
