import knex from "knex";
import { environment } from "../environment/index.js";

export class DatabaseConnection {
  static _knex = null;

  constructor() { }

  init() {
    return knex({
      client: "pg",
      connection: environment.PG_URI,
      searchPath: ["public"],
    });
  }

  static shutdown() {
    return new Promise((res, rej) => {
      if (this._knex) {
        this._knex.destroy();
        res();
      } else {
        rej("Database was not initialized");
      }
    });
  }

  static get knex() {
    if (!this._knex) {
      this._knex = new DatabaseConnection().init();
    }
    return this._knex;
  }
}
