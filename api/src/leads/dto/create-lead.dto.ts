export class CreateLeadDto {
  fullName: string
  phone: string
  email?: string
  budgetMin: number
  budgetMax: number
  propertyType: string
  status?: string
  source: string
  notes?: string
  projectId: string
  assignedAgentId: string
  nextFollowup?: string
}