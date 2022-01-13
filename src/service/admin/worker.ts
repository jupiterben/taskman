import { NodeType } from '../../api_types';
import { NodeManager } from './base';

export class WorkerAdmin extends NodeManager {
    constructor() {
        super(NodeType.Worker);
    }
}