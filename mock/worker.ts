import { Request, Response } from 'express';
import { randomBytes } from 'crypto'

const mockWorkers: API.WorkerStatus[] =
    [
        { workerId: randomBytes(16).toString("hex"), desc: "", status: "Idle", createdAt: Date.now(), updateAt: Date.now() },
        { workerId: randomBytes(16).toString("hex"), desc: "", status: "Idle", createdAt: Date.now(), updateAt: Date.now() },
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