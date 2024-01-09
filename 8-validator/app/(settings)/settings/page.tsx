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
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import axios from 'axios';
import Heading from '@/components/ui/Heading';
import { Checkbox } from '@/components/ui/checkbox';
import { MessagesProps, getDictionary } from '@/i18n';
import useLocaleStore from '@/app/hooks/languageStore';

import { Separator } from '@/components/ui/separator';
import { SelectButton } from './components/SelectButton';
import Loader from '@/components/Loader';

const formSchema = z
    .object({
        name: z.string(),
        surname: z.string(),
        username: z.string().min(1),
        email: z.string().email(),
        age: z.number().nullable(),
        gender: z.string().nullable(),
        score: z.number(),
        isVerified: z.boolean().optional(),
        languages: z
            .object({
                en: z.boolean().default(false),
                fr: z.boolean().default(false),
                ca: z.boolean().default(false),
                es: z.boolean().default(false),
                ary: z.boolean().default(false),
            })
            .partial(),
        central: z.object({
            isChecked: z.boolean().default(false),
            oral: z.number().optional(),
            written_tif: z.number().optional(),
            written_lat: z.number().optional(),
        }),
        tachelhit: z.object({
            isChecked: z.boolean().default(false),
            oral: z.number().optional(),
            written_tif: z.number().optional(),
            written_lat: z.number().optional(),
        }),
        tarifit: z.object({
            isChecked: z.boolean().default(false),
            oral: z.number().optional(),
            written_tif: z.number().optional(),
            written_lat: z.number().optional(),
        }),
        isSubscribed: z.boolean().default(false).optional(),
    })
    .partial();

type SettingFormValues = z.infer<typeof formSchema>;

export function SettingsPage() {
    const { locale } = useLocaleStore();
    const { data: session, update: sessionUpdate, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [fetchedData, setFetchedData] =
        useState<AmazicConfig.AmazicLanguageProps | null>(null);
    const router = useRouter();
    const userId = session?.user?.id;
    const [d, setD] = useState<MessagesProps>();
    const appStatus = process.env.NODE_ENV;

    const [formState, setFormState] =
        useState<AmazicConfig.AmazicProps | null>();
    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);
    if (appStatus === 'development') {
        console.log(session);
    }
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            surname: '',
            email: '',
            username: '',
            isSubscribed: false,
            central: {
                isChecked: false,
                oral: 1,
                written_lat: 1,
                written_tif: 1,
            },
            tachelhit: {
                isChecked: false,
                oral: 1,
                written_lat: 1,
                written_tif: 1,
            },
            tarifit: {
                isChecked: false,
                oral: 1,
                written_lat: 1,
                written_tif: 1,
            },
            languages: {
                en: false,
                fr: false,
                ca: false,
                es: false,
                ary: false,
            },
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/settings');
                const userData = response.data;
                console.log(userData);
                const defaultData = {
                    central: {
                        isChecked: false,
                        oral: 1,
                        written_lat: 1,
                        written_tif: 1,
                    },
                    tachelhit: {
                        isChecked: false,
                        oral: 1,
                        written_lat: 1,
                        written_tif: 1,
                    },
                    tarifit: {
                        isChecked: false,
                        oral: 1,
                        written_lat: 1,
                        written_tif: 1,
                    },
                    languages: {
                        en: false,
                        fr: false,
                        ca: false,
                        es: false,
                        ary: false,
                    },
                };

                const mergedData = {
                    ...userData,
                    central: userData.central || defaultData.central,
                    tachelhit: userData.tachelhit || defaultData.tachelhit,
                    tarifit: userData.tarifit || defaultData.tarifit,
                    languages: userData.languages || defaultData.languages,
                };
                setFetchedData(mergedData);

                form.reset({
                    name: userData.name || '',
                    surname: userData.surname || '',
                    email: userData.email,
                    username: userData.username,
                    age: userData.age,
                    gender: userData.gender || '',
                    isSubscribed: userData.isSubscribed || false,
                    central: {
                        isChecked: userData.central?.isChecked || false,
                        oral: userData.central?.oral || 0,
                        written_lat: userData.central?.written_lat || 0,
                        written_tif: userData.central?.written_tif || 0,
                    },
                    tachelhit: {
                        isChecked: userData.tachelhit?.isChecked || false,
                        oral: userData.tachelhit?.oral || 0,
                        written_lat: userData.tachelhit?.written_lat || 0,
                        written_tif: userData.tachelhit?.written_tif || 0,
                    },
                    tarifit: {
                        isChecked: userData.tarifit?.isChecked || false,
                        oral: userData.tarifit?.oral || 0,
                        written_lat: userData.tarifit?.written_lat || 0,
                        written_tif: userData.tarifit?.written_tif || 0,
                    },
                    // score: userData.score,
                });
                console.log(userData);
                setLoading(false);
            } catch (error) {
                console.error('error fetching data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [form]);

    const handleUpdate = async (updateData: SettingFormValues) => {
        const { score, ...dataWithoutScore } = updateData;
        const newData = {
            ...updateData,
            central: {
                isChecked: form.getValues('central.isChecked'),
                oral: form.getValues('central.oral') || 0,
                written_lat: form.getValues('central.written_lat') || 0,
                written_tif: form.getValues('central.written_tif') || 0,
            },
            tachelhit: {
                isChecked: form.getValues('tachelhit.isChecked'),
                oral: form.getValues('tachelhit.oral') || 0,
                written_lat: form.getValues('tachelhit.written_lat') || 0,
                written_tif: form.getValues('tachelhit.written_tif') || 0,
            },
            tarifit: {
                isChecked: form.getValues('tarifit.isChecked'),
                oral: form.getValues('tarifit.oral') || 0,
                written_lat: form.getValues('tarifit.written_lat') || 0,
                written_tif: form.getValues('tarifit.written_tif') || 0,
            },
        };
        console.log(updateData);
        console.log(newData);

        const toastId = toast.loading(`${d?.toasters.loading_updating}`);

        try {
            setLoading(true);
            const res = await axios.patch(`/api/settings`, newData);
            if (res.status !== 200) {
                throw new Error(
                    res.data.message || `${d?.toasters.alert_general}`,
                );
            }
            toast.success(`${d?.toasters.success_update}`, {
                id: toastId,
            });
            console.log(updateData);
            sessionUpdate({ user: { ...session?.user, ...dataWithoutScore } });

            // router.push('/', { scroll: false });
            router.refresh();
            setLoading(false);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(error);
                toast.error(
                    error.response?.data?.message ||
                        `${d?.toasters.alert_general}`,
                );
            } else {
                // Handle non-Axios errors
                toast.error("S'ha produït un error inesperat.", {});
            }
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: SettingFormValues) => {
        console.log('submit', data);
        setLoading(true);
        const combinedData = {
            userId,
            ...data,
            isSubscribed: form.getValues('isSubscribed'),
        };
        console.log(combinedData);
        await handleUpdate(combinedData);
    };
    const handleCentralChecked = () => {
        const newChecked = !form.getValues('central.isChecked');
        form.setValue(`central.isChecked`, newChecked, {
            shouldValidate: true,
        });

        setFormState((prevState) => ({
            ...prevState,
            isChecked: newChecked,
            oral: prevState?.oral ?? 1,
            written_tif: prevState?.written_tif ?? 1,
            written_lat: prevState?.written_lat ?? 1,
        }));
    };
    const handleTachelhitChecked = () => {
        const newChecked = !form.getValues('tachelhit.isChecked');
        form.setValue(`tachelhit.isChecked`, newChecked, {
            shouldValidate: true,
        });

        setFormState((prevState) => ({
            ...prevState,
            isChecked: newChecked,
            oral: prevState?.oral ?? 1,
            written_tif: prevState?.written_tif ?? 1,
            written_lat: prevState?.written_lat ?? 1,
        }));
    };
    const handleTarifitChecked = () => {
        const newChecked = !form.getValues('tarifit.isChecked');
        form.setValue(`tarifit.isChecked`, newChecked, {
            shouldValidate: true,
        });

        setFormState((prevState) => ({
            ...prevState,
            isChecked: newChecked,
            oral: prevState?.oral ?? 1,
            written_tif: prevState?.written_tif ?? 1,
            written_lat: prevState?.written_lat ?? 1,
        }));
    };
    const handleButtonChange = useCallback(
        (field: string, value: number) => {
            form.setValue(field as keyof SettingFormValues, value, {
                shouldValidate: true,
            });
            setFormState((prevState) => ({
                ...prevState,
                [field]: value,
                isChecked: prevState?.isChecked ?? false,
                oral: prevState?.oral ?? 1,
                written_tif: prevState?.written_tif ?? 1,
                written_lat: prevState?.written_lat ?? 1,
            }));
        },
        [form],
    );
    const isCentralCheckedBox = form.watch('central.isChecked');
    const isTachelhitCheckedBox = form.watch('tachelhit.isChecked');
    const isTarifitCheckedBox = form.watch('tarifit.isChecked');
    if (loading) {
        return <Loader />;
    }

    console.log(fetchedData);
    console.log(userId);
    console.log(form.formState);
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
                        name="isSubscribed"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center">
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                                <FormLabel className="ml-2">
                                    {d?.texts.subscribe}
                                </FormLabel>
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <div className="grid grid-cols-3">
                        {/*// > central */}
                        <div className="flex flex-col">
                            <FormField
                                name="central.isChecked"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex justify-start items-center">
                                        <FormLabel>
                                            {' '}
                                            {d?.variation.central}
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="checkbox"
                                                checked={form.watch(
                                                    'central.isChecked',
                                                )}
                                                className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0 rounded-full"
                                                onChange={handleCentralChecked}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {isCentralCheckedBox && (
                                <div className="flex flex-col gap-2 p-2 ">
                                    <FormField
                                        control={form.control}
                                        name="central.oral"
                                        render={(field) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {d?.setting.oral}{' '}
                                                </FormLabel>

                                                <FormControl>
                                                    <SelectButton
                                                        currentValue={
                                                            form.watch(
                                                                'central.oral',
                                                            ) || 0
                                                        }
                                                        name="central.oral"
                                                        onChange={
                                                            handleButtonChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="central.written_lat"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>
                                                    {d?.setting.written_lat}
                                                </FormLabel>
                                                <FormControl>
                                                    <SelectButton
                                                        currentValue={
                                                            form.watch(
                                                                'central.written_lat',
                                                            ) || 0
                                                        }
                                                        name="central.written_lat"
                                                        onChange={
                                                            handleButtonChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="central.written_tif"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>
                                                    {d?.setting.written_tif}{' '}
                                                </FormLabel>
                                                <FormControl>
                                                    <SelectButton
                                                        currentValue={
                                                            form.watch(
                                                                'central.written_tif',
                                                            ) || 0
                                                        }
                                                        name="central.written_tif"
                                                        onChange={
                                                            handleButtonChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                        {/*//> tachelhit central */}
                        <div className="flex flex-col">
                            <FormField
                                name="tachelhit.isChecked"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex justify-start items-center">
                                        <FormLabel>
                                            {' '}
                                            {d?.variation.tachlit}
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="checkbox"
                                                checked={form.watch(
                                                    'tachelhit.isChecked',
                                                )}
                                                className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0 rounded-full"
                                                onChange={
                                                    handleTachelhitChecked
                                                }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {isTachelhitCheckedBox && (
                                <div className="flex flex-col gap-2 p-2 ">
                                    <FormField
                                        control={form.control}
                                        name="tachelhit.oral"
                                        render={(field) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {' '}
                                                    {d?.setting.oral}{' '}
                                                </FormLabel>

                                                <FormControl>
                                                    <SelectButton
                                                        currentValue={
                                                            form.watch(
                                                                'tachelhit.oral',
                                                            ) || 0
                                                        }
                                                        name="tachelhit.oral"
                                                        onChange={
                                                            handleButtonChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="tachelhit.written_lat"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>
                                                    {' '}
                                                    {
                                                        d?.setting.written_lat
                                                    }{' '}
                                                </FormLabel>
                                                <FormControl>
                                                    <SelectButton
                                                        currentValue={
                                                            form.watch(
                                                                'tachelhit.written_lat',
                                                            ) || 0
                                                        }
                                                        name="tachelhit.written_lat"
                                                        onChange={
                                                            handleButtonChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="tachelhit.written_tif"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>
                                                    {d?.setting.written_tif}{' '}
                                                </FormLabel>
                                                <FormControl>
                                                    <SelectButton
                                                        currentValue={
                                                            form.watch(
                                                                'tachelhit.written_tif',
                                                            ) || 0
                                                        }
                                                        name="tachelhit.written_tif"
                                                        onChange={
                                                            handleButtonChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                        {/*// > tarifit */}
                        <div className="flex flex-col">
                            <FormField
                                name="tarifit.isChecked"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex justify-start items-center">
                                        <FormLabel>
                                            {' '}
                                            {d?.variation.tif}
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="checkbox"
                                                checked={form.watch(
                                                    'tarifit.isChecked',
                                                )}
                                                className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0 rounded-full"
                                                onChange={handleTarifitChecked}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {isTarifitCheckedBox && (
                                <div className="flex flex-col gap-2 p-2 ">
                                    <FormField
                                        control={form.control}
                                        name="tarifit.oral"
                                        render={(field) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {' '}
                                                    {d?.setting.oral}{' '}
                                                </FormLabel>

                                                <FormControl>
                                                    <SelectButton
                                                        currentValue={
                                                            form.watch(
                                                                'tarifit.oral',
                                                            ) || 0
                                                        }
                                                        name="tarifit.oral"
                                                        onChange={
                                                            handleButtonChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="tarifit.written_lat"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>
                                                    {d?.setting.written_lat}
                                                </FormLabel>
                                                <FormControl>
                                                    <SelectButton
                                                        currentValue={
                                                            form.watch(
                                                                'tarifit.written_lat',
                                                            ) || 0
                                                        }
                                                        name="tarifit.written_lat"
                                                        onChange={
                                                            handleButtonChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="tarifit.written_tif"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>
                                                    {d?.setting.written_tif}
                                                </FormLabel>
                                                <FormControl>
                                                    <SelectButton
                                                        currentValue={
                                                            form.watch(
                                                                'tarifit.written_tif',
                                                            ) || 0
                                                        }
                                                        name="tarifit.written_tif"
                                                        onChange={
                                                            handleButtonChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <Button type="submit">{d?.texts.save_settings}</Button>
                </form>
                {process.env.NODE_ENV === 'development' && (
                    <pre className="flex flex-row justify-center items-center w-screen">
                        {JSON.stringify(form.watch(), null, 2)}
                    </pre>
                )}
            </Form>
        </div>
    );
}
export default SettingsPage;
