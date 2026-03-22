import { Router } from 'express';
import { computeCBUseCase, getAdjustedCBUseCase, complianceRepository } from '../../../infrastructure/server/container';

export const complianceRouter = Router();

complianceRouter.get('/cb', async (req, res, next) => {
  try {
    const { shipId, year } = req.query;
    if (!year) return res.status(400).json({ error: 'year required' });
    
    if (shipId) {
      const result = await computeCBUseCase.execute(String(shipId), Number(year));
      return res.json(result);
    }
    
    const all = await complianceRepository.findAll();
    const filtered = all.filter(c => c.year === Number(year));
    res.json(filtered);
  } catch (error) {
    next(error);
  }
});

complianceRouter.get('/adjusted-cb', async (req, res, next) => {
  try {
    const { shipId, year } = req.query;
    if (!year) return res.status(400).json({ error: 'year required' });
    const result = await getAdjustedCBUseCase.execute(Number(year), shipId ? String(shipId) : undefined);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

