import { supabase } from '../supabaseClient';
import type { ReliabilityScore, RiskAssessment, LeaderPerformance } from '../../shared/types';

class AIService {
  constructor() {
    console.log('AI Service initialized with business logic scoring');
  }

  /**
   * Calculate entrepreneur reliability score
   */
  async calculateReliabilityScore(userId: string): Promise<ReliabilityScore> {
    try {
      // Fetch user data for scoring
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Fetch milestone data
      const { data: milestones, error: milestoneError } = await supabase
        .from('opportunity_milestones')
        .select('*')
        .in('opportunity_id', 
          supabase
            .from('opportunities')
            .select('id')
            .eq('entrepreneur_id', userId)
        );

      if (milestoneError) throw milestoneError;

      // Fetch agreement data
      const { data: agreements, error: agreementError } = await supabase
        .from('agreements')
        .select('*')
        .eq('entrepreneur_id', userId);

      if (agreementError) throw agreementError;

      // Calculate scores using business logic
      const milestoneScore = this.calculateMilestoneScore(milestones || []);
      const communicationScore = await this.calculateCommunicationScore(userId);
      const agreementScore = this.calculateAgreementScore(agreements || []);
      const timeScore = this.calculateTimeScore(milestones || []);

      // Calculate overall score (weighted average)
      const overallScore = (
        milestoneScore * 0.3 +
        communicationScore * 0.2 +
        agreementScore * 0.3 +
        timeScore * 0.2
      );

      // Update user's reliability score in database
      await supabase
        .from('users')
        .update({ reliability_score: overallScore })
        .eq('id', userId);

      return {
        overall_score: Math.round(overallScore * 100) / 100,
        milestone_score: Math.round(milestoneScore * 100) / 100,
        communication_score: Math.round(communicationScore * 100) / 100,
        agreement_score: Math.round(agreementScore * 100) / 100,
        time_score: Math.round(timeScore * 100) / 100,
        factors: {
          'milestone_completion_rate': milestoneScore,
          'communication_responsiveness': communicationScore,
          'agreement_compliance': agreementScore,
          'time_management': timeScore
        }
      };
    } catch (error) {
      console.error('Error calculating reliability score:', error);
      throw new Error('Failed to calculate reliability score');
    }
  }

  /**
   * Assess investment opportunity risk
   */
  async assessOpportunityRisk(opportunityId: string): Promise<RiskAssessment> {
    try {
      // Fetch opportunity data
      const { data: opportunity, error: oppError } = await supabase
        .from('opportunities')
        .select('*, users!inner(*)')
        .eq('id', opportunityId)
        .single();

      if (oppError) throw oppError;

      // Fetch entrepreneur data
      const { data: entrepreneur, error: entError } = await supabase
        .from('users')
        .select('*')
        .eq('id', opportunity.entrepreneur_id)
        .single();

      if (entError) throw entError;

      // Calculate risk factors
      const financialRisk = this.calculateFinancialRisk(opportunity);
      const marketRisk = this.calculateMarketRisk(opportunity);
      const teamRisk = this.calculateTeamRisk(opportunity);
      const entrepreneurRisk = 100 - entrepreneur.reliability_score;

      // Calculate overall risk
      const overallRisk = (
        financialRisk * 0.3 +
        marketRisk * 0.3 +
        teamRisk * 0.2 +
        entrepreneurRisk * 0.2
      );

      // Generate recommendations
      const recommendations = this.generateRiskRecommendations({
        financialRisk,
        marketRisk,
        teamRisk,
        entrepreneurRisk
      });

      // Update opportunity with risk score
      await supabase
        .from('opportunities')
        .update({ 
          risk_score: overallRisk,
          ai_insights: {
            risk_assessment: {
              overall_risk: overallRisk,
              financial_risk: financialRisk,
              market_risk: marketRisk,
              team_risk: teamRisk,
              entrepreneur_risk: entrepreneurRisk,
              recommendations
            }
          }
        })
        .eq('id', opportunityId);

      return {
        overall_risk: Math.round(overallRisk * 100) / 100,
        financial_risk: Math.round(financialRisk * 100) / 100,
        market_risk: Math.round(marketRisk * 100) / 100,
        team_risk: Math.round(teamRisk * 100) / 100,
        entrepreneur_risk: Math.round(entrepreneurRisk * 100) / 100,
        recommendations
      };
    } catch (error) {
      console.error('Error assessing opportunity risk:', error);
      throw new Error('Failed to assess opportunity risk');
    }
  }

  /**
   * Calculate pool leader performance
   */
  async calculateLeaderPerformance(
    poolId: string, 
    userId: string, 
    role: string
  ): Promise<LeaderPerformance> {
    try {
      // Fetch leader performance data
      const { data: performance, error: perfError } = await supabase
        .from('pool_leader_performance')
        .select('*')
        .eq('pool_id', poolId)
        .eq('user_id', userId)
        .eq('role', role)
        .single();

      if (perfError) throw perfError;

      // Calculate scores
      const meetingsScore = Math.min(performance.meetings_called * 10, 100);
      const announcementsScore = Math.min(performance.announcements_made * 15, 100);
      const investmentScore = performance.investment_success_rate;
      const satisfactionScore = performance.member_satisfaction_score * 100;

      // Calculate overall score
      const overallScore = (
        meetingsScore * 0.25 +
        announcementsScore * 0.25 +
        investmentScore * 0.3 +
        satisfactionScore * 0.2
      );

      // Update performance record
      await supabase
        .from('pool_leader_performance')
        .update({ 
          overall_score: overallScore,
          last_evaluation_date: new Date().toISOString()
        })
        .eq('id', performance.id);

      return {
        overall_score: Math.round(overallScore * 100) / 100,
        meetings_score: Math.round(meetingsScore * 100) / 100,
        announcements_score: Math.round(announcementsScore * 100) / 100,
        investment_score: Math.round(investmentScore * 100) / 100,
        satisfaction_score: Math.round(satisfactionScore * 100) / 100,
        duties_performed: {
          'meetings_called': performance.meetings_called,
          'announcements_made': performance.announcements_made,
          'investment_decisions': performance.investment_success_rate,
          'member_satisfaction': performance.member_satisfaction_score
        }
      };
    } catch (error) {
      console.error('Error calculating leader performance:', error);
      throw new Error('Failed to calculate leader performance');
    }
  }

  // Helper methods for score calculations
  private calculateMilestoneScore(milestones: any[]): number {
    if (milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.status === 'completed').length;
    return (completed / milestones.length) * 100;
  }

  private async calculateCommunicationScore(userId: string): Promise<number> {
    try {
      // Fetch communication logs or calculate based on response times
      // For now, return a default score
      return 75.0;
    } catch (error) {
      console.error('Error calculating communication score:', error);
      return 50.0; // Default score
    }
  }

  private calculateAgreementScore(agreements: any[]): number {
    if (agreements.length === 0) return 0;
    const active = agreements.filter(a => a.status === 'active').length;
    return (active / agreements.length) * 100;
  }

  private calculateTimeScore(milestones: any[]): number {
    if (milestones.length === 0) return 0;
    const onTime = milestones.filter(m => 
      m.completed_date && 
      new Date(m.completed_date) <= new Date(m.due_date)
    ).length;
    return (onTime / milestones.length) * 100;
  }

  private calculateFinancialRisk(opportunity: any): number {
    // Calculate financial risk based on opportunity data
    const factors = [
      opportunity.funding_target > 1000000 ? 70 : 40,
      opportunity.expected_roi > 50 ? 60 : 30,
      opportunity.investment_term_months > 24 ? 50 : 30
    ];
    return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
  }

  private calculateMarketRisk(opportunity: any): number {
    // Calculate market risk based on industry and location
    const industryRisk = this.getIndustryRisk(opportunity.industry);
    const locationRisk = this.getLocationRisk(opportunity.location);
    return (industryRisk + locationRisk) / 2;
  }

  private calculateTeamRisk(opportunity: any): number {
    // Calculate team risk based on team size and experience
    if (!opportunity.team_size) return 50;
    return opportunity.team_size < 3 ? 70 : 30;
  }

  private getIndustryRisk(industry?: string): number {
    const riskMap: Record<string, number> = {
      'technology': 60,
      'healthcare': 40,
      'finance': 50,
      'manufacturing': 45,
      'retail': 55,
      'agriculture': 35
    };
    return riskMap[industry?.toLowerCase() || ''] || 50;
  }

  private getLocationRisk(location?: string): number {
    // Calculate risk based on location (country, region, etc.)
    return 40; // Default moderate risk
  }

  private generateRiskRecommendations(risks: any): string[] {
    const recommendations = [];
    
    if (risks.financialRisk > 60) {
      recommendations.push('Consider reducing funding target or extending timeline');
    }
    if (risks.marketRisk > 50) {
      recommendations.push('Conduct thorough market analysis before proceeding');
    }
    if (risks.teamRisk > 60) {
      recommendations.push('Strengthen team composition and experience');
    }
    if (risks.entrepreneurRisk > 70) {
      recommendations.push('Request additional due diligence on entrepreneur');
    }

    return recommendations.length > 0 ? recommendations : ['Risk level acceptable'];
  }
}

export const aiService = new AIService();
export default aiService; 