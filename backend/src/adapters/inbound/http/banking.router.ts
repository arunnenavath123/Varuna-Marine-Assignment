import { Router } from 'express';
import { bankSurplusUseCase, applyBankedUseCase, bankRepository } from '../../../infrastructure/server/container';

export const bankingRouter = Router();

bankingRouter.get('/:routeId/:year/balance', async (req, res, next) => {
  try {
    const { routeId, year } = req.params;
    const balance = await bankRepository.getBalance(routeId, Number(year));
    res.json({ routeId, year: Number(year), balance });
  } catch (error) {
    next(error);
  }
});

bankingRouter.post('/:routeId/:year/bank', async (req, res, next) => {
  try {
    const { routeId, year } = req.params;
    const { amount } = req.body;
    const result = await bankSurplusUseCase.execute(routeId, Number(year), Number(amount));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

bankingRouter.post('/:routeId/:year/apply', async (req, res, next) => {
  try {
    const { routeId, year } = req.params;
    const { amount } = req.body;
    const result = await applyBankedUseCase.execute(routeId, Number(year), Number(amount));
    res.json(result);
  } catch (error) {
    next(error);
  }
});
