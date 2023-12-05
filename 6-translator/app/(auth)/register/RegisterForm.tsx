'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

const formSchema = z
    .object({
        username: z.string(),
        email: z.string().email(),
        password: z
            .string()
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/,
                {
                    message:
                        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                },
            ),
        confirmPassword: z
            .string()
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/,
                {
                    message:
                        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                },
            ),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type RegisterFormValues = z.infer<typeof formSchema>;
export default function RegisterForm() {
    const router = useRouter();
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(formSchema),
    });
    const onSubmit = async (data: RegisterFormValues) => {
        const { username, email, password } = data;

        try {
            // Attempt to register the user
            const registrationResponse = await axios.post(`/api/register`, {
                username,
                email,
                password,
            });

            if (registrationResponse.status === 200) {
                toast.success('Registration Successful');
            } else {
                toast.error(
                    'Error: Unexpected response from server during registration',
                );
            }

            const loginAttempt = await axios.post(`/api/signIn`, {
                email,
                password,
            });

            // Redirect to signIn page
            if (loginAttempt.status === 200) {
                signIn();
            }
            router.push('/');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // console.error(error.data);
                const errorData = error.response.data;
				console.log(error)
                if (error.response.status === 409) {
                    if (errorData && typeof errorData === 'object') {
                        if (errorData.email) {
                            toast.error('Email already in use');
                        } else if (errorData.username) {
                            toast.error('Username already taken');
                        } else {
                            toast.error('Username or Email already in use');
                        }
                    } else {
                        toast.error('Email or Username Already in use');
                    }
                } else {
                    // Handle other types of errors
                    const errorMessage =
                        errorData?.message || 'An unexpected error occurred';
                    toast.error(errorMessage);
                }
            } else {
                console.error('An unexpected error occurred', error);
                toast.error('An unexpected error occurred');
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Username" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>email</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="email" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>password</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="password"
                                    placeholder="password"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="password"
                                    placeholder="Confirm Password"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Register</Button>
            </form>
        </Form>
    );
}
