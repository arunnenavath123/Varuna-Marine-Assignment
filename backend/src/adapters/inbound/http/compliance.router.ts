import { Router } from 'express';
import { computeCBUseCase, getAdjustedCBUseCase, complianceRepository, routeRepository } from '../../../infrastructure/server/container';

export const complianceRouter = Router();

complianceRouter.get('/cb', async (req, res, next) => {
  try {
    const { shipId, year } = req.query;
    if (!year) return res.status(400).json({ error: 'year required' });
    
    if (shipId) {
      const result = await computeCBUseCase.execute(String(shipId), Number(year));
      return res.json(result);
    }
    
    const routes = await routeRepository.findAll();
    const routesForYear = routes.filter(r => r.year === Number(year));
    
    const existingCbs = await complianceRepository.findAll();
    
    const results = await Promise.all(routesForYear.map(async (route) => {
      const found = existingCbs.find(c => c.routeId === route.routeId && c.year === route.year);
      if (found) return found;
      // Dynamically compute missing compliance balances to populate the UI correctly
      return await computeCBUseCase.execute(route.routeId, route.year);
    }));

    res.json(results);
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

