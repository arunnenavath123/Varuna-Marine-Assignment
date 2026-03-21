import { Router } from 'express';
import { computeCBUseCase } from '../../../infrastructure/server/container';

export const complianceRouter = Router();

complianceRouter.post('/:routeId/:year/compute', async (req, res, next) => {
  try {
    const { routeId, year } = req.params;
    const result = await computeCBUseCase.execute(routeId, Number(year));
    res.json(result);
  } catch (error) {
    next(error);
  }
});
