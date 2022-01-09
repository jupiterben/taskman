import { Request, Response } from 'express';
import { randomBytes } from 'crypto'
import type { API } from '@/api_types';

const mockWorkers: API.WorkerStatus[] =
    [
        {
            workerId: randomBytes(16).toString("hex"),
            desc: "", status: "Idle",
            createdAt: new Date(),
            updateAt: new Date(),
            machine: "10.10.11.1",
        },
        {
            workerId: randomBytes(16).toString("hex"),
            desc: "", status: "Idle",
            createdAt: new Date(),
            updateAt: new Date(),
            machine: "10.10.11.1",
        },
    ];

function getWorkerList(req: Request, res: Response, u: string) {
    mockWorkers.forEach(w => {
        w.status = "Running";
        w.updateAt = new Date();
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