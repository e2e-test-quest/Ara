import { AuditType } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from "class-validator";
import { AuditReference } from "../criteria";

export class CreateAuditPage {
  /**
   * Include the page ID in order to update an existing page.
   */
  @IsNumber()
  @IsOptional()
  id?: number;

  /**
   * @example "Page de contact"
   */
  @IsString()
  name: string;

  /**
   * @example "https://example.com/contact"
   */
  @IsString()
  url: string;
}

export class CreateAuditDto {
  /**
   * @example "FULL"
   */
  @IsString()
  @IsIn(Object.values(AuditType))
  auditType: AuditType;

  /**
   * @example "My procedure"
   */
  @IsString()
  procedureName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAuditPage)
  pages: CreateAuditPage[];

  /**
   * @example "John Auditor"
   */
  @IsString()
  auditorName: string;

  /**
   * @example "RAAM, RGAA, RAWEB"
   */
  @IsString()
  @IsIn(Object.values(AuditReference))
  auditReference: string;

  /**
   * @example "john@audit.com"
   */
  @IsEmail()
  @IsOptional()
  auditorEmail?: string;
}
