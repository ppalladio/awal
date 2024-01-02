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
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AmazicConfig } from '../SettingsConfig';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import axios from 'axios';
import Heading from '@/components/ui/Heading';
import { Checkbox } from '@/components/ui/checkbox';
import { MessagesProps, getDictionary } from '@/i18n';
import useLocaleStore from '@/app/hooks/languageStore';

const formSchema = z
    .object({
        name: z.string().optional(),
        surname: z.string().optional(),
        username: z.string().min(1),
        email: z.string().email(),
        // age: z.preprocess((val) => {
        //     if (val === '') return null;
        //     return Number.isNaN(Number(val)) ? null : Number(val);
        // }, z.number().nullable().optional()),
        gender: z.string().optional(),
        score: z.number(),
        isVerified: z.boolean().optional(),
        languages: z.array(z.number()),
        central: AmazicConfig.AmazicFormSchema,
        tachelhit: AmazicConfig.AmazicFormSchema,
        tarifit: AmazicConfig.AmazicFormSchema,
        isPrivacy: z.boolean().default(true),
        isSubscribed: z.boolean().default(false).optional(),
    })
    .partial();

type SettingFormValues = z.infer<typeof formSchema>;

export function SettingsPage() {
    const { locale } = useLocaleStore();

    const { data: session, update: sessionUpdate, status } = useSession();
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const userId = session?.user?.id;
    const [d, setD] = useState<MessagesProps>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            surname: '',
            email: '',
            username: '',
            // isPrivacy: true,
            // isSubscribed: false,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/settings');
                const userData = response.data;
                console.log(userData);
                form.reset({
                    name: userData.name,
                    surname: userData.surname,
                    email: userData.email,
                    username: userData.username,
                    isPrivacy: userData.isPrivacy,
                    isSubscribed: userData.isSubscribed,
                    // score: userData.score,
                });
                console.log(userData);
            } catch (error) {
                console.error('error fetching data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [form]);
    console.log(userId);
console.log(form.formState.errors)
    const handleUpdate = async (updateData: SettingFormValues) => {
        console.log(updateData);
        const toastId = toast.loading(`${d?.toasters.loading_updating}`, {
            position: 'bottom-center',
        });

        try {
            const res = await axios.patch(`/api/settings`, updateData);
            if (res.status !== 200) {
                throw new Error(
                    res.data.message || `${d?.toasters.alert_general}`,
                );
            }
            toast.success(`${d?.toasters.success_update}`, {
                position: 'bottom-center',
                id: toastId,
            });

            sessionUpdate({ user: updateData });
            router.push('/', { scroll: false });
            router.refresh();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(error);
                toast.error(
                    error.response?.data?.message ||
                        `${d?.toasters.alert_general}`,
                    { position: 'bottom-center' },
                );
            } else {
                // Handle non-Axios errors
                toast.error("S'ha produït un error inesperat.", {
                    position: 'bottom-center',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: SettingFormValues) => {
        console.log('submit', data);
        if (!data.isPrivacy) {
            toast.error(`${d?.toasters.alert_privacy_check}`, {
                position: 'bottom-center',
            });
            return;
        }
        setLoading(true);
        const terms = {
            isPrivacy: form.getValues('isPrivacy'),
            isSubscribed: form.getValues('isSubscribed'),
        };
        const combinedData = {
            userId,
            ...data,
            // ...amazicData,
            ...terms,
            // otherLanguages: otherLangData.otherLanguages,
        };

        console.log(combinedData);
        await handleUpdate(combinedData);
    };
    // if (loading) {
    //     return <Loader />;
    // }
    return (
        <div className="pd-[2em] block h-screen">
            <Heading
                title={`${d?.nav.settings}`}
                titleClassName="flex flex-row items-center my-5 justify-center"
            />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=" space-y-8 w-full px-4"
                >
                    <div className="grid grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{d?.user.name}</FormLabel>
                                    <FormControl>
                                        <Input
                                            // disabled={loading}
                                            {...field}
                                            placeholder={d?.user.name}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-white" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="surname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{d?.user.surname}</FormLabel>
                                    <FormControl>
                                        <Input
                                            // disabled={loading}
                                            {...field}
                                            placeholder={d?.user.surname}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-white" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{d?.user.username}</FormLabel>
                                    <FormControl>
                                        <Input
                                            // disabled={loading}
                                            {...field}
                                            placeholder={d?.user.username}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-white" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{d?.user.email}</FormLabel>
                                    <FormControl>
                                        <Input
                                            // disabled={loading}
                                            {...field}
                                            placeholder={d?.user.email}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-white" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="isPrivacy"
                        render={({ field }) => (
                            <FormItem className="flex items-center">
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                                <FormLabel className="ml-2">
                                    {
                                        d?.text_with_link.accept_terms
                                            .text_before_link
                                    }

                                    <Link
                                        href={'/privacy'}
                                        scroll={false}
                                        target={'_blank'}
                                        className="underline"
                                    >
                                        {
                                            d?.text_with_link.accept_terms
                                                .link_text
                                        }
                                    </Link>
                                </FormLabel>
                            </FormItem>
                        )}
                    />
					  <FormField
                        control={form.control}
                        name="isSubscribed"
                        render={({ field }) => (
                            <FormItem className="flex items-center">
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                                <FormLabel className="ml-2">
                                    {
                                        d?.text_with_link.accept_terms
                                            .text_before_link
                                    }

                                    <Link
                                        href={'/privacy'}
                                        scroll={false}
                                        target={'_blank'}
                                        className="underline"
                                    >
                                        {
                                            d?.text_with_link.accept_terms
                                                .link_text
                                        }
                                    </Link>
                                </FormLabel>
                            </FormItem>
                        )}
                    />

                    <Button type="submit">{d?.texts.save_settings}</Button>
                </form>
            </Form>
        </div>
    );
}
export default SettingsPage;
