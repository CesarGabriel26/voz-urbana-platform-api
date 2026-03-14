import { Request, Response } from "express";
import { db } from "../../database/db";

export class StatsController {
  async getDashboardStats(req: Request, res: Response) {
    try {
      // 1. General Indicators
      const generalStats = await db.query(`
        SELECT 
          (SELECT COUNT(*) FROM voz_complaints WHERE status = 'pending') as open_complaints,
          (SELECT COUNT(*) FROM voz_complaints WHERE status = 'resolved') as resolved_complaints,
          (SELECT COUNT(*) FROM voz_petitions WHERE status = 'active') as active_petitions,
          (SELECT COUNT(*) FROM voz_users) as total_users,
          (SELECT COUNT(*) FROM voz_complaint_votes) as total_votes,
          (SELECT COUNT(*) FROM voz_petition_signatures) as total_signatures
      `);

      // 2. Response Time Metrics (Average days to resolve)
      const responseTime = await db.query(`
        SELECT 
          AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 86400)::numeric(10,1) as avg_resolution_days
        FROM voz_complaints 
        WHERE status = 'resolved' AND resolved_at IS NOT NULL
      `);

      // 3. Category Distribution
      const categoryDistribution = await db.query(`
        SELECT cat.name, COUNT(c.id) as count
        FROM voz_categories cat
        LEFT JOIN voz_complaints c ON c.category = cat.id
        GROUP BY cat.id, cat.name
        ORDER BY count DESC
      `);

      // 4. Neighborhood Distribution
      // Note: neighborhoods are stored in petitions, but for complaints we might need to derive or it might be in address
      // Assuming petitions have neighborhood, let's check complaints too. 
      // In complaint.repository.ts, I saw address, lat, lng. 
      // Let's use petitions for neighborhood stats as they have a specific column.
      const neighborhoodDistribution = await db.query(`
        SELECT neighborhood, COUNT(*) as count
        FROM (
          SELECT neighborhood FROM voz_petitions WHERE neighborhood IS NOT NULL AND neighborhood != ''
        ) as combined_locations
        GROUP BY neighborhood
        ORDER BY count DESC
        LIMIT 10
      `);

      // 5. Temporal Evolution (Complaints per month - last 6 months)
      const temporalEvolution = await db.query(`
        SELECT 
          TO_CHAR(created_at, 'YYYY-MM') as month,
          COUNT(*) as count
        FROM voz_complaints
        WHERE created_at > NOW() - INTERVAL '6 months'
        GROUP BY month
        ORDER BY month ASC
      `);

      // 6. Most confirmed problems (Top votes)
      const topComplaints = await db.query(`
        SELECT c.id, c.title, COUNT(v.user_id) as votes
        FROM voz_complaints c
        LEFT JOIN voz_complaint_votes v ON v.complaint_id = c.id
        GROUP BY c.id, c.title
        ORDER BY votes DESC
        LIMIT 5
      `);

      // 7. City Health Score Calculation
      // score = (resolution_rate * 0.4) + (participation * 0.2) + (problem_density * -0.2) + (response_speed * 0.2)
      
      const counts = generalStats.rows[0];
      const resolutionRate = counts.resolved_complaints > 0 
        ? (Number(counts.resolved_complaints) / (Number(counts.open_complaints) + Number(counts.resolved_complaints))) * 100 
        : 0;
      
      const participation = Math.min(100, (Number(counts.total_votes) + Number(counts.total_signatures)) / Math.max(1, Number(counts.total_users)) * 10);
      
      const problemDensity = Math.min(100, (Number(counts.open_complaints) / 100) * 100); // Normalize based on expected volume
      
      const avgDays = Number(responseTime.rows[0].avg_resolution_days || 0);
      const responseSpeed = Math.max(0, 100 - (avgDays * 10)); // 10 days = 0 score, 0 days = 100 score

      const healthScore = Math.round(
        (resolutionRate * 0.4) + 
        (participation * 0.2) + 
        (problem_density_to_score(Number(counts.open_complaints)) * -0.2) + 
        (responseSpeed * 0.2)
      );

      // Final Assembly
      const stats = {
        indicators: {
          openComplaints: Number(counts.open_complaints),
          resolvedComplaints: Number(counts.resolved_complaints),
          activePetitions: Number(counts.active_petitions),
          resolutionRate: parseFloat(resolutionRate.toFixed(1)),
          avgResolutionTime: parseFloat(avgDays.toFixed(1)),
          totalConfirmations: Number(counts.total_votes) + Number(counts.total_signatures)
        },
        healthScore: Math.min(100, Math.max(0, healthScore || 0)),
        distributions: {
          categories: categoryDistribution.rows.map(r => ({ name: r.name, value: Number(r.count) })),
          neighborhoods: neighborhoodDistribution.rows.map(r => ({ name: r.neighborhood, value: Number(r.count) }))
        },
        evolution: [
          {
            name: "Reclamações",
            series: temporalEvolution.rows.map(r => ({ name: r.month, value: Number(r.count) }))
          }
        ],
        topProblems: topComplaints.rows.map(r => ({ id: r.id, title: r.title, votes: Number(r.votes) })),
        participation: {
          activeUsers: Number(counts.total_users),
          engagements: Number(counts.total_votes) + Number(counts.total_signatures),
          avgEngagementsPerUser: parseFloat(( (Number(counts.total_votes) + Number(counts.total_signatures)) / Math.max(1, Number(counts.total_users)) ).toFixed(1))
        }
      };

      res.json(stats);
    } catch (error: any) {
      console.error("Stats Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

function problem_density_to_score(openCount: number): number {
  // Simple normalization: 0-20 (healthy), 20-50 (warning), 50+ (critical)
  return Math.min(100, openCount * 2);
}
