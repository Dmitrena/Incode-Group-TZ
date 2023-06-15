import { IsNumber } from 'class-validator';

export class ChangeBossDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  bossId: number;
}
