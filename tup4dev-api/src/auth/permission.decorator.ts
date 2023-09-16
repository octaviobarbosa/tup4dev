import { SetMetadata } from '@nestjs/common';
import type { CustomDecorator } from '@nestjs/common';

export const Permissions = (
  ...permissions: string[]
): CustomDecorator<string> => SetMetadata('permissions', permissions);
