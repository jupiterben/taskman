import { NodeManager } from './base';

export class WorkerAdmin extends NodeManager {
    constructor() {
        super('worker');
    }
}