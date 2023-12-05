'use client';

import Heading from '@/components/ui/Heading';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { AmazicConfig, OtherLanguagesConfig } from '../SettingsConfig';
import Central from './components/Amazic/Central';
import Tachelhit from './components/Amazic/Tachelhit';
import Tarifit from './components/Amazic/Tarifit';
import OtherLanguages from './components/OtherLang/OtherLanguages';
import Consent from './components/Consent';
import { useSession } from 'next-auth/react';

const formSchema = z
    .object({
        name: z.string().min(1),
        surname: z.string().min(1),
        username: z.string().min(1),
        email: z.string().email(),
        age: z.number(),
        gender: z.string(),
        score: z.number(),
        // password: z.string().min(1),
        // confirmPassword: z.string().min(1),
        isVerified: z.boolean().optional(),
        languages: z.array(z.number()),
        central: AmazicConfig.AmazicFormSchema,
        tachelhit: AmazicConfig.AmazicFormSchema,
        tarifit: AmazicConfig.AmazicFormSchema,
        isPrivacy: z
            .boolean({
                required_error: 'Please read the terms and check the box',
            })
            .default(false),
        isSubscribed: z.boolean().default(false),
    })
    .partial();


type SettingFormValues = z.infer<typeof formSchema>;
const SettingPage = () => {
    const { data: session } = useSession();
    // > Type Assertions
    const userId = (session?.user as any)?.id;
    const [fetchedData, setFetchedData] = useState(null);

    const [amazicData, setAmazicData] =
        useState<AmazicConfig.AmazicLanguageProps>(
            AmazicConfig.initialAmazicState,
        );
    const [otherLangData, setOtherLangData] =
        useState<OtherLanguagesConfig.OtherLanguagesGroup>({
            otherLanguages: {
                english: false,
                french: false,
                catala: false,
                arabic: false,
                spanish: false,
            },
        });
    const router = useRouter();
    const form = useForm<SettingFormValues>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
    });
    const updateAmazicData = (
        data: AmazicConfig.AmazicProps,
        category: keyof AmazicConfig.AmazicLanguageProps,
    ) => {
        setAmazicData((prev) => ({
            ...prev,
            [category]: data,
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/settings');
                console.log(response);
                if (response.status !== 200) {
                    throw new Error(
                        response.data.message || 'An error occurred',
                    );
                }
                setFetchedData(response.data);
                form.reset({
                    name: response.data.name,
                    surname: response.data.surname,
                    username: response.data.username,
                    email: response.data.email,
                    age: response.data.age,
                    gender: response.data.gender,
                    score: response.data.score,
                });
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error);
                    toast.error(
                        error.response?.data?.message ||
                            'Something went wrong.',
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [form]);

    // console.log(fetchedData?.central);
    const sendCentralData = (data: AmazicConfig.AmazicProps) =>
        updateAmazicData(data, 'central');
    const sendTachelhitData = (data: AmazicConfig.AmazicProps) =>
        updateAmazicData(data, 'tachelhit');
    const sendTarifitData = (data: AmazicConfig.AmazicProps) =>
        updateAmazicData(data, 'tarifit');
    const sendOtherLangData = (
        data: OtherLanguagesConfig.OtherLanguagesGroup,
    ) => {
        setOtherLangData(data);
    };
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (updateData: SettingFormValues) => {
        try {
            const response = await axios.patch(`/api/settings`, updateData);
            if (response.status !== 200) {
                throw new Error(response.data.message || 'An error occurred');
            }
            toast.success('Settings updated successfully');
            router.push(`/`);
            router.refresh();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(error);
                toast.error(
                    error.response?.data?.message || 'Something went wrong.',
                );
            } else {
                // Handle non-Axios errors
                console.error('An unexpected error occurred:', error);
                toast.error('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: SettingFormValues) => {
        if (!data.isPrivacy) {
            toast.error(
                'Please read and agree to contribution terms to continue',
            );
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
            ...amazicData,
            ...terms,
            otherLanguages: otherLangData.otherLanguages,
        };
        await handleUpdate(combinedData);
    };

    return (
        <div className="pd-[2em] block">
            <Heading
                title="Settings"
                titleClassName="flex flex-row items-center my-5 justify-center"
            />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full px-4"
                >
                    <div className="grid grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            {...field}
                                            placeholder="name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="surname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Surname</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            {...field}
                                            placeholder="Surname"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>username</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            {...field}
                                            placeholder="name"
                                        />
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
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            {...field}
                                            placeholder="Email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isVerified"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verified</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            {...field}
                                            placeholder="isverified"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Age</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            {...field}
                                            placeholder="20"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            {...field}
                                            placeholder="Gender"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Separator />
                    {/* //> amazic */}
                    <div className="grid grid-cols-3 gap-8">
                        <Central
                            fetchData={fetchedData?.central}
                            sendData={sendCentralData}
                        />
                        <div>
                            <strong>
                                {'central' +
                                    amazicData.central.isChecked +
                                    ' : ' +
                                    amazicData.central.oral +
                                    amazicData.central.written_lat +
                                    amazicData.central.written_tif}
                            </strong>
                        </div>

                        <Tachelhit sendData={sendTachelhitData} />
                        <Tarifit sendData={sendTarifitData} />
                        <div>
                            The user data sent from Child component:
                            <br />
                            <div>
                                <strong>
                                    {amazicData.tachelhit.isChecked +
                                        ' : ' +
                                        amazicData.tachelhit.oral +
                                        amazicData.tachelhit.written_lat +
                                        amazicData.tachelhit.written_tif}
                                </strong>
                            </div>
                            <br />
                            <div>
                                <strong>
                                    {amazicData.tarifit.isChecked +
                                        ' : ' +
                                        amazicData.tarifit.oral +
                                        amazicData.tarifit.written_lat +
                                        amazicData.tarifit.written_tif}
                                </strong>
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <OtherLanguages sendData={sendOtherLangData} />
                        <br />
                        <div>
                            <strong>Other Languages Selected:</strong>
                            {otherLangData &&
                            otherLangData.otherLanguages &&
                            otherLangData.otherLanguages.english
                                ? 'English is selected'
                                : ''}
                        </div>
                    </div>
                    <Separator />
                    <Consent />
                    <Button className="ml-auto" type="submit">
                        Save Changes
                    </Button>
                    <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
                </form>
            </Form>
        </div>
    );
};

export default SettingPage;
