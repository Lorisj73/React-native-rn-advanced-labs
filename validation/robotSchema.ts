import { z } from 'zod';

const CURRENT_YEAR = new Date().getFullYear();

export const robotSchema = z.object({
  name: z.string().min(2, 'Min 2 caractères'),
  label: z.string().min(3, 'Min 3 caractères'),
  year: z.coerce.number().int('Entier requis').gte(1950, 'Min 1950').lte(CURRENT_YEAR, `Max ${CURRENT_YEAR}`),
  type: z.enum(['industrial', 'service', 'medical', 'educational', 'other']),
});

export type RobotFormValues = z.infer<typeof robotSchema>;
