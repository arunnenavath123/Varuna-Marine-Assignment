import { dbPool } from '../../infrastructure/db/client';
import { PostgresRouteRepository } from '../../adapters/outbound/postgres/PostgresRouteRepository';
import { PostgresComplianceRepository } from '../../adapters/outbound/postgres/PostgresComplianceRepository';
import { PostgresBankRepository } from '../../adapters/outbound/postgres/PostgresBankRepository';
import { PostgresPoolRepository } from '../../adapters/outbound/postgres/PostgresPoolRepository';
import { ComputeCBUseCase } from '../../core/application/ComputeCBUseCase';
import { SetBaselineUseCase } from '../../core/application/SetBaselineUseCase';
import { GetComparisonUseCase } from '../../core/application/GetComparisonUseCase';
import { BankSurplusUseCase } from '../../core/application/BankSurplusUseCase';
import { ApplyBankedUseCase } from '../../core/application/ApplyBankedUseCase';
import { CreatePoolUseCase } from '../../core/application/CreatePoolUseCase';
import { GetAdjustedCBUseCase } from '../../core/application/GetAdjustedCBUseCase';

const routeRepo = new PostgresRouteRepository(dbPool);
const complianceRepo = new PostgresComplianceRepository(dbPool);
const bankRepo = new PostgresBankRepository(dbPool);
const poolRepo = new PostgresPoolRepository(dbPool);

export const setBaselineUseCase = new SetBaselineUseCase(routeRepo);
export const getComparisonUseCase = new GetComparisonUseCase(routeRepo);
export const computeCBUseCase = new ComputeCBUseCase(routeRepo, complianceRepo);
export const bankSurplusUseCase = new BankSurplusUseCase(bankRepo, routeRepo);
export const applyBankedUseCase = new ApplyBankedUseCase(bankRepo, routeRepo);
export const createPoolUseCase = new CreatePoolUseCase(poolRepo);
export const getAdjustedCBUseCase = new GetAdjustedCBUseCase(bankRepo, routeRepo);
export const routeRepository = routeRepo;
export const complianceRepository = complianceRepo;
export const bankRepository = bankRepo;
export const poolRepository = poolRepo;
