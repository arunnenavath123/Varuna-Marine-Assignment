import { Router } from 'express';
import { bankSurplusUseCase, applyBankedUseCase, bankRepository } from '../../../infrastructure/server/container';

export const bankingRouter = Router();

bankingRouter.get('/records', async (req, res, next) => {
  try {
    const { shipId, year } = req.query;
    if (!shipId || !year) return res.status(400).json({ error: 'shipId and year required' });
    const records = await bankRepository.findEntries(String(shipId), Number(year));
    res.json(records);
  } catch (error) {
    next(error);
  }
});

bankingRouter.post('/bank', async (req, res, next) => {
  try {
    const { shipId, year, amount } = req.body;
    if (!shipId || !year || !amount) return res.status(400).json({ error: 'Missing parameters' });
    const result = await bankSurplusUseCase.execute(String(shipId), Number(year), Number(amount));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

bankingRouter.post('/apply', async (req, res, next) => {
  try {
    const { shipId, year, amount } = req.body;
    if (!shipId || !year || !amount) return res.status(400).json({ error: 'Missing parameters' });
    const result = await applyBankedUseCase.execute(String(shipId), Number(year), Number(amount));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

