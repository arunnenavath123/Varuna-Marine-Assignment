import { Router } from 'express';
import { createPoolUseCase, getAdjustedCBUseCase, poolRepository } from '../../../infrastructure/server/container';

export const poolsRouter = Router();

poolsRouter.post('/', async (req, res, next) => {
  try {
    const { year, members } = req.body;
    const pool = await createPoolUseCase.execute(Number(year), members);
    res.json(pool);
  } catch (error) {
    next(error);
  }
});

poolsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const pool = await getAdjustedCBUseCase.execute(id);
    res.json(pool);
  } catch (error) {
    next(error);
  }
});

poolsRouter.get('/', async (req, res, next) => {
  try {
    const pools = await poolRepository.findAll();
    res.json(pools);
  } catch (error) {
    next(error);
  }
});
