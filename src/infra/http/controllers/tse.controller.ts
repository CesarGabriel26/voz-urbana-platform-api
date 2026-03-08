import { Request, Response } from "express";
import https from "https";
import http from "http";

// Base dos Dados proxies BigQuery - requires an API token for production use.
// For public/anonymous use, we call the BigQuery public API via REST.
const BDD_QUERY_URL = "https://api.basedosdados.org/api/v1/query/";

async function fetchVoterCount(ibgeCode: string): Promise<number | null> {
  console.log(ibgeCode);
  const query = `
    SELECT SUM(quantidade_eleitores) as total 
    FROM \`basedosdados.br_tse_eleitorado.perfil_municipio_zona\` 
    WHERE id_municipio = '${ibgeCode}' 
    AND ano = 2024
  `;

  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ query });
    const url = new URL(BDD_QUERY_URL);

    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          const total = parsed?.data?.[0]?.total ?? null;
          resolve(total !== null ? Number(total) : null);
        } catch {
          resolve(null);
        }
      });
    });

    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

export class TseController {
  async getEleitoresByIbge(req: Request, res: Response) {
    const { ibgeCode } = req.params as { ibgeCode: string };

    if (!ibgeCode || ibgeCode.length < 6) {
      return res.status(400).json({ message: "Código IBGE inválido. Informe o código de 6 ou 7 dígitos do município." });
    }

    try {
      const total = await fetchVoterCount(ibgeCode);
      console.log(total);

      if (total === null) {
        return res.status(404).json({
          message: "Dados de eleitores não encontrados para o município informado.",
          ibgeCode
        });
      }

      return res.status(200).json({
        ibgeCode,
        totalEleitores: total,
        ano: 2024,
        fonte: "TSE via Base dos Dados"
      });
    } catch (error: any) {
      console.error("[TSE] Erro ao buscar dados:", error.message);
      return res.status(502).json({ message: "Erro ao consultar dados do TSE.", error: error.message });
    }
  }
}
