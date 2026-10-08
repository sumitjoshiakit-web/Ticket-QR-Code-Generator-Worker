export class InMemoryGenerationRepository {
  #records = new Map();
  #ticketIndex = new Map();

  async findById(id) {
    return this.#records.get(id) ?? null;
  }

  async findByTicketNumber(ticketNumber) {
    const id = this.#ticketIndex.get(ticketNumber);
    return id ? this.#records.get(id) ?? null : null;
  }

  async create(record) {
    if (this.#records.has(record.id)) {
      throw new Error("Generation record already exists.");
    }
    if (this.#ticketIndex.has(record.ticketNumber)) {
      throw new Error("A generation record already exists for this ticket.");
    }
    this.#records.set(record.id, record);
    this.#ticketIndex.set(record.ticketNumber, record.id);
    return record;
  }

  async count() {
    return this.#records.size;
  }
}
