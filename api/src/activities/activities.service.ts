import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ActivitiesService {

  constructor(private prisma: PrismaService) {}

  async createActivity(data:any){
    return this.prisma.activity.create({
      data
    })
  }

  async getLeadActivities(leadId:string){
    return this.prisma.activity.findMany({
      where:{ leadId },
      include:{
        user:{
          select:{
            id:true,
            name:true,
            email:true
          }
        }
      },
      orderBy:{
        createdAt:"desc"
      }
    })
  }

}