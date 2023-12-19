'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

const formSchema = z
    .object({
        username: z.string(),
        email: z.string().email(),
        password: z.string(),
        confirmPassword: z.string(),
        isPrivacy: z.boolean(),
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
        const { username, email, password, isPrivacy } = data;
        if (!data.isPrivacy) {
            toast.error(
                'Si us plau, llegeixi i accepti els termes de contribuci&#243; per continuar',
            );
            return;
        }
        try {
            // Attempt to register the user
            const registrationResponse = await axios.post(`/api/register`, {
                username,
                email,
                password,
                isPrivacy,
            });

            if (registrationResponse.status === 200) {
                toast.success('Registration Successful');
            } else {
                toast.error('Please try again later');
            }

            const loginAttempt = await axios.post(`/api/signIn`, {
                email,
                password,
            });

            // Redirect to signIn page
            if (loginAttempt.status === 200) {
                signIn();
            }
            router.push('/', { scroll: false });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // console.error(error.data);
                const errorData = error.response.data;
                console.log(error);
                if (error.response.status === 409) {
                    if (errorData && typeof errorData === 'object') {
                        if (errorData.email) {
                            toast.error('Correu electr&#242;nic ja en ús');
                        } else if (errorData.username) {
                            toast.error('Nom d&apos;usuari ja agafat');
                        } else {
                            toast.error(
                                'Nom d&apos;usuari o correu electr&#242;nic ja en ús',
                            );
                        }
                    } else {
                        toast.error(
                            'Si us plau, torneu-ho a intentar més tard.',
                        );
                    }
                } else {
                    // Handle other types of errors
                    const errorMessage =
                        errorData?.message ||
                        'Ha ocorregut un error inesperat.';
                    toast.error(errorMessage);
                }
            } else {
                toast.error('Si us plau, torneu-ho a intentar més tard.');
            }
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 h-[100vh] flex flex-col justify-center items-center"
            >
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>usuari</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="usuari" />
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
                            <FormLabel>contrasenya</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="password"
                                    placeholder="contrasenya"
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
                            <FormLabel>confirmar contrasenya</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="password"
                                    placeholder="confirmar contrasenya"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isPrivacy"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="capitalize">
                                    Accepta
                                    <Link href={'/privacy'} scroll={false}>
                                        els termes de contribuci&#243;
                                    </Link>
                                    abans de finalitzar el .
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                <Button type="submit">Registre</Button>
            </form>
        </Form>
    );
}
