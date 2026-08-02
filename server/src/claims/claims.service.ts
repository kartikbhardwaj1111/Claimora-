import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Claim, ClaimDocument } from '../schemas/claim.schema';
import { CreateClaimDto } from './dto/create-claim.dto';
import { ReviewClaimDto } from './dto/review-claim.dto';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectModel(Claim.name) private claimModel: Model<ClaimDocument>,
  ) {}

  private generateClaimId(): string {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `CLM-${randomNum}`;
  }

  async create(createClaimDto: CreateClaimDto, file?: Express.Multer.File): Promise<Claim> {
    const claimId = this.generateClaimId();
    const documentUrl = file ? `/uploads/${file.filename}` : '/uploads/sample-receipt.pdf';
    const documentOriginalName = file ? file.originalname : 'sample-receipt.pdf';

    const newClaim = new this.claimModel({
      claimId,
      patientName: createClaimDto.patientName,
      patientEmail: createClaimDto.patientEmail.toLowerCase(),
      claimAmount: Number(createClaimDto.claimAmount),
      description: createClaimDto.description,
      documentUrl,
      documentOriginalName,
      status: 'Pending',
      submissionDate: new Date(),
    });

    return newClaim.save();
  }

  async findAll(query: { status?: string; search?: string; minAmount?: any; maxAmount?: any }): Promise<Claim[]> {
    const filter: any = {};

    if (query.status && query.status !== 'All') {
      filter.status = query.status;
    }

    if (query.search && typeof query.search === 'string' && query.search.trim() !== '') {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { patientName: searchRegex },
        { patientEmail: searchRegex },
        { claimId: searchRegex },
      ];
    }

    const min = (query.minAmount !== undefined && query.minAmount !== null && query.minAmount !== '') 
      ? Number(query.minAmount) 
      : NaN;
    const max = (query.maxAmount !== undefined && query.maxAmount !== null && query.maxAmount !== '') 
      ? Number(query.maxAmount) 
      : NaN;

    if (!isNaN(min) || !isNaN(max)) {
      filter.claimAmount = {};
      if (!isNaN(min)) filter.claimAmount.$gte = min;
      if (!isNaN(max)) filter.claimAmount.$lte = max;
    }

    return this.claimModel.find(filter).sort({ submissionDate: -1 }).exec();
  }

  async findByPatientEmail(email: string): Promise<Claim[]> {
    return this.claimModel.find({ patientEmail: email.toLowerCase() }).sort({ submissionDate: -1 }).exec();
  }

  async findOne(id: string): Promise<Claim> {
    const claim = await this.claimModel.findById(id).exec();
    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }
    return claim;
  }

  async review(id: string, reviewDto: ReviewClaimDto): Promise<Claim> {
    const claim = await this.claimModel.findById(id).exec();
    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }

    if (reviewDto.status === 'Approved') {
      const approvedAmt = reviewDto.approvedAmount !== undefined ? Number(reviewDto.approvedAmount) : claim.claimAmount;
      if (approvedAmt > claim.claimAmount) {
        throw new BadRequestException('Approved amount cannot exceed requested claim amount');
      }
      claim.approvedAmount = approvedAmt;
    } else if (reviewDto.status === 'Rejected') {
      claim.approvedAmount = 0;
    }

    claim.status = reviewDto.status;
    claim.insurerComments = reviewDto.insurerComments || '';
    claim.reviewedAt = new Date();

    return claim.save();
  }
}
