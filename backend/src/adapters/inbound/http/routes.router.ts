import { Router } from 'express';
import { routeRepository } from '../../../infrastructure/server/container';
import { setBaselineUseCase, getComparisonUseCase } from '../../../infrastructure/server/container';

export const routesRouter = Router();

routesRouter.get('/', async (req, res, next) => {
  try {
    const routes = await routeRepository.findAll();
    res.json(routes);
  } catch (error) {
    next(error);
  }
});

routesRouter.post('/:id/baseline', async (req, res, next) => {
  try {
    await setBaselineUseCase.execute(req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

routesRouter.get('/comparison', async (req, res, next) => {
  try {
    const result = await getComparisonUseCase.execute();
    res.json(result);
  } catch (error) {
    next(error);
  }
});
