import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { routesRouter } from '../../adapters/inbound/http/routes.router';
import { complianceRouter } from '../../adapters/inbound/http/compliance.router';
import { bankingRouter } from '../../adapters/inbound/http/banking.router';
import { poolsRouter } from '../../adapters/inbound/http/pools.router';
import { NotFoundError, ValidationError } from '../../shared/errors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/routes', routesRouter);
app.use('/compliance', complianceRouter);
app.use('/banking', bankingRouter);
app.use('/pools', poolsRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`FuelEU API listening on port ${port}`);
});

export default app;
