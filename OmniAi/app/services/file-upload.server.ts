import { env } from '~/config/env.server';
import winston from 'winston';
import crypto from 'crypto';
import { createHash } from 'crypto';
import { lookup } from 'mime-types';
import { Readable } from 'stream';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

interface FileValidationConfig {
  maxSize: number;
  allowedTypes: string[];
  maxWidth?: number;
  maxHeight?: number;
}

const VALIDATION_CONFIGS: Record<string, FileValidationConfig> = {
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxWidth: 4096,
    maxHeight: 4096,
  },
  document: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  csv: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['text/csv', 'application/csv'],
  },
};

export class FileUploadService {
  private static instance: FileUploadService;

  private constructor() {}

  static getInstance(): FileUploadService {
    if (!FileUploadService.instance) {
      FileUploadService.instance = new FileUploadService();
    }
    return FileUploadService.instance;
  }

  private async validateFileType(file: File, config: FileValidationConfig): Promise<boolean> {
    const mimeType = lookup(file.name) || file.type;
    return config.allowedTypes.includes(mimeType);
  }

  private async validateFileSize(file: File, config: FileValidationConfig): Promise<boolean> {
    return file.size <= config.maxSize;
  }

  private async validateImageDimensions(
    file: File,
    config: FileValidationConfig
  ): Promise<boolean> {
    if (!file.type.startsWith('image/') || !config.maxWidth || !config.maxHeight) {
      return true;
    }

    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(
          img.width <= (config.maxWidth || Infinity) &&
          img.height <= (config.maxHeight || Infinity)
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };

      img.src = url;
    });
  }

  private async scanForMalware(file: File): Promise<boolean> {
    // This is a placeholder for malware scanning
    // In production, you would integrate with a proper malware scanning service
    return true;
  }

  private generateSecureFilename(originalName: string): string {
    const ext = originalName.split('.').pop();
    const hash = crypto.randomBytes(16).toString('hex');
    return `${hash}.${ext}`;
  }

  private async calculateChecksum(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const hash = createHash('sha256');
        hash.update(Buffer.from(reader.result as ArrayBuffer));
        resolve(hash.digest('hex'));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  async validateAndProcessFile(
    file: File,
    type: keyof typeof VALIDATION_CONFIGS
  ): Promise<{
    isValid: boolean;
    errors: string[];
    processedFile?: {
      name: string;
      checksum: string;
      size: number;
      type: string;
    };
  }> {
    const config = VALIDATION_CONFIGS[type];
    const errors: string[] = [];

    try {
      // Basic validations
      if (!await this.validateFileType(file, config)) {
        errors.push(`Invalid file type. Allowed types: ${config.allowedTypes.join(', ')}`);
      }

      if (!await this.validateFileSize(file, config)) {
        errors.push(`File too large. Maximum size: ${config.maxSize / 1024 / 1024}MB`);
      }

      // Image-specific validations
      if (file.type.startsWith('image/')) {
        if (!await this.validateImageDimensions(file, config)) {
          errors.push(`Image dimensions exceed maximum allowed (${config.maxWidth}x${config.maxHeight})`);
        }
      }

      // Security checks
      if (!await this.scanForMalware(file)) {
        errors.push('File failed security scan');
      }

      if (errors.length > 0) {
        return { isValid: false, errors };
      }

      // Process file
      const secureName = this.generateSecureFilename(file.name);
      const checksum = await this.calculateChecksum(file);

      logger.info('File processed successfully', {
        originalName: file.name,
        secureName,
        type: file.type,
        size: file.size,
      });

      return {
        isValid: true,
        errors: [],
        processedFile: {
          name: secureName,
          checksum,
          size: file.size,
          type: file.type,
        },
      };
    } catch (error) {
      logger.error('File validation error:', error);
      return {
        isValid: false,
        errors: ['File processing failed'],
      };
    }
  }

  async uploadFile(
    file: File,
    type: keyof typeof VALIDATION_CONFIGS,
    metadata: Record<string, unknown> = {}
  ): Promise<{
    success: boolean;
    error?: string;
    url?: string;
  }> {
    try {
      const validation = await this.validateAndProcessFile(file, type);
      
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', '),
        };
      }

      // Here you would implement the actual file upload to your storage service
      // This is a placeholder that logs the attempt
      logger.info('File upload attempt', {
        file: validation.processedFile,
        metadata,
      });

      // Return a mock URL for demonstration
      return {
        success: true,
        url: `https://storage.example.com/${validation.processedFile?.name}`,
      };
    } catch (error) {
      logger.error('File upload error:', error);
      return {
        success: false,
        error: 'Failed to upload file',
      };
    }
  }
} 