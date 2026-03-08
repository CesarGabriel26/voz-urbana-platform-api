import { Router } from "express";
import { TseController } from "../infra/http/controllers/tse.controller";

export const tseRoutes = Router();
const controller = new TseController();

/**
 * GET /tse/eleitores/:ibgeCode
 * Retorna o total de eleitores de um município pelo código IBGE.
 * Fonte: TSE via Base dos Dados (BigQuery público)
 * 
 * Exemplo: GET /tse/eleitores/3550308  (São Paulo/SP)
 */
tseRoutes.get("/eleitores/:ibgeCode", controller.getEleitoresByIbge);
