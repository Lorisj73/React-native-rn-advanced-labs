import { z } from 'zod';

/**
 * Schéma Zod centralisé pour la version React Hook Form.
 * Règles:
 * - email: format email valide
 * - password: min 8 + au moins 1 lettre et 1 chiffre
 * - confirmPassword: identique à password
 * - displayName: 2..30 caractères
 * - termsAccepted: true obligatoire
 */
export const formSchema = z
  .object({
    email: z.string().email('Email invalide'),
    password: z
      .string()
      .min(8, 'Min 8 caractères')
      .regex(/(?=.*[A-Za-z])(?=.*\d)/, 'Lettre + chiffre requis'),
    confirmPassword: z.string(),
    displayName: z.string().min(2, 'Min 2 caractères').max(30, 'Max 30 caractères'),
    termsAccepted: z.boolean().refine((v) => v === true, 'Vous devez accepter les CGU'),
  })
  .refine((data) => data.confirmPassword === data.password, {
    path: ['confirmPassword'],
    message: 'Les mots de passe ne correspondent pas',
  });

export type FormValues = z.infer<typeof formSchema>;