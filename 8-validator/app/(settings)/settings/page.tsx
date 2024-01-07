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
import Central from './components/Amazic/Central';
import { isEqual } from 'lodash';
import { Separator } from '@/components/ui/separator';

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
	const [centralDataState, setCentralDataState] = useState(AmazicConfig.initialAmazicState.central);

    useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setD(m);
        };
        fetchDictionary();
    }, [locale]);
    console.log(session);
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
    console.log(fetchedData);
    const centralData = {
        isChecked: fetchedData?.central.isChecked ?? false,
        oral: fetchedData?.central.oral ?? 1,
        written_lat: fetchedData?.central.written_lat ?? 1,
        written_tif: fetchedData?.central.written_tif ?? 1,
    };
    const handleCentralData = (dataFromCentral: AmazicConfig.AmazicProps) => {
        console.log('Data received from Central:', dataFromCentral);
		// setCentralDataState(dataFromCentral); // Update the state with the latest data from Central
		const l = !isEqual(dataFromCentral, centralDataState)
		console.log(l)
		if (!isEqual(dataFromCentral, centralDataState)) {
            setCentralDataState(dataFromCentral);
        }
    };
    console.log(userId);
    console.log(form.formState);
    const handleUpdate = async (updateData: SettingFormValues) => {
        const { score, ...dataWithoutScore } = updateData;

        console.log(updateData);
        const toastId = toast.loading(`${d?.toasters.loading_updating}`);

        try {
            const res = await axios.patch(`/api/settings`, dataWithoutScore);
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
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(error);
                toast.error(
                    error.response?.data?.message ||
                        `${d?.toasters.alert_general}`
                    
                );
            } else {
                // Handle non-Axios errors
                toast.error("S'ha produït un error inesperat.", {
                    
                });
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
			centralData,
            // ...amazicData,
            isSubscribed: form.getValues('isSubscribed'),
            // otherLanguages: otherLangData.otherLanguages,
        };
        console.log(combinedData);
        await handleUpdate(combinedData);
    };
    // if (loading) {
    //     return <Loader />;
    // }
	const handleChecked = () => {
        const newChecked = !form.getValues(`${central}.isChecked`);
        form.setValue('central.isChecked', newChecked, { shouldValidate: true });

        setFormState((prevState) => ({
            ...prevState,
            isChecked: newChecked,
            oral: prevState?.oral ?? 1,
            written_tif: prevState?.written_tif ?? 1,
            written_lat: prevState?.written_lat ?? 1,
        }));
    };

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
					<Separator/>
					<div className='grid grid-cols-3'>
						<div className='flex flex-row'>
						<FormField
                            name="central.isChecked"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="flex justify-start items-center">
                                    <FormLabel> Central</FormLabel>
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            checked={form.watch('central.isChecked')}
                                            // className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0 rounded-full"
                                            onChange={handleChecked}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
							<FormField
                            name="central.oral"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="flex justify-start items-center">
                                    <FormLabel> Central</FormLabel>
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            // checked={form.watch('isChecked')}
                                            // className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0 rounded-full"
                                            // onChange={handleChecked}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
						
						</div>
					</div>
                    {/* <Central
                        dataTo={handleCentralData}
                        dataFrom={centralData}
                    /> */}
                    <Button type="submit">{d?.texts.save_settings}</Button>
                </form>
                <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
            </Form>
        </div>
    );
}
export default SettingsPage;
