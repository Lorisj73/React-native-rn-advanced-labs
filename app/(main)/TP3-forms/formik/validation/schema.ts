import * as Yup from 'yup';

/**
 * Schéma Yup centralisé.
 * Règles:
 * - email: format valide
 * - password: min 8, au moins 1 lettre et 1 chiffre
 * - confirmPassword: égal à password
 * - displayName: 2..30 caractères
 * - termsAccepted: doit être true
 */
export const formSchema = Yup.object({
  email: Yup.string()
    .email("Email invalide")
    .required("Email requis"),
  password: Yup.string()
    .min(8, "Min 8 caractères")
    .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Lettre + chiffre requis")
    .required("Mot de passe requis"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "Les mots de passe ne correspondent pas")
    .required("Confirmation requise"),
  displayName: Yup.string()
    .min(2, "Min 2 caractères")
    .max(30, "Max 30 caractères")
    .required("Nom affiché requis"),
  termsAccepted: Yup.boolean()
    .oneOf([true], "Vous devez accepter les CGU"),
});

export type FormValues = Yup.InferType<typeof formSchema>;