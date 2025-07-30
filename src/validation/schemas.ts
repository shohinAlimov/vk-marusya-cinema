import { z } from 'zod';

const emailSchema = z.string().email('Некорректный email');
const passwordSchema = z.string().min(6, 'Минимум 6 символов');
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  name: z.string()
    .min(1, 'Обязательное поле')
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя слишком длинное'),
  surname: z.string()
    .min(1, 'Обязательное поле')
    .min(2, 'Фамилия должна содержать минимум 2 символа')
    .max(50, 'Фамилия слишком длинная'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Обязательное поле'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;