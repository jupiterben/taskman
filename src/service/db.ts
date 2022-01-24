import * as sqlite3 from 'better-sqlite3';
import job from 'mock/job';

export class DBLogger {
    private db: sqlite3.Database;
    constructor(dbPath: string) {
        this.db = new sqlite3(dbPath);
    }
}

