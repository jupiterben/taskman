import { Request, Response } from 'express';
import { randomBytes } from 'crypto'
import type { API } from '@/api_types';

const mockWorkers: API.WorkerStatus[] =
    [
        {
            workerId: randomBytes(16).toString("hex"),
            desc: "", status: "Idle",
            createdAt: Date.now(),
            updateAt: Date.now(),
            machineName: "10.10.11.1",
            machineIP: "10.10.11.1",
        },
        {
            workerId: randomBytes(16).toString("hex"),
            desc: "", status: "Idle",
            createdAt: Date.now(),
            updateAt: Date.now(),
            machineName: "10.10.11.1",
            machineIP: "10.10.11.1",
        },
    ];

function getWorkerList(req: Request, res: Response, u: string) {
    mockWorkers.forEach(w => {
        w.status = "Running";
        w.updateAt = Date.now();
        w.desc = randomBytes(16).toString("ascii");
    });

    const result = {
        data: mockWorkers
    };
    return res.json(result);
}

export default {
    'GET /api/worker': getWorkerList,
};