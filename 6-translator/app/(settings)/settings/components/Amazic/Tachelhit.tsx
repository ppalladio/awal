import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AmazicConfig } from '@/app/(settings)/SettingsConfig';
import { SelectButton } from '../SelectButton';
import { Input } from '@/components/ui/input';

//unchecked status
const LanguageSchema = z.object({
    isChecked: z.literal(false),
});

//checked status
const checkedLanguageSchema = z
    .object({
        isChecked: z.literal(true),
        oral: z
            .number({ required_error: 'Please enter a number from 1 to 5' })
            .min(1)
            .max(5),
        written_tif: z
            .number({ required_error: 'Please enter a number from 1 to 5' })
            .min(1)
            .max(5),
        written_lat: z
            .number({ required_error: 'Please enter a number from 1 to 5' })
            .min(1)
            .max(5),
    })
    .required({ oral: true, written_tif: true, written_lat: true });

// set isChecked as condition

const FormSchema = z.discriminatedUnion('isChecked', [
    checkedLanguageSchema,
    LanguageSchema,
]);
type LanguageFormSchema = z.infer<typeof FormSchema>;
const debounce = <T extends (...args: any[]) => void>(
    fn: T,
    delay: number,
): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;

    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

const Tachelhit = ({
    sendData,
    fetchData,
}: {
    sendData: (data: AmazicConfig.AmazicProps) => void;
    fetchData: AmazicConfig.AmazicProps[];
}) => {
    const initialFormState: AmazicConfig.AmazicProps = {
        isChecked: false,
        oral: 1, 
        written_lat: 1, 
        written_tif: 1, 
    };

    const [formState, setFormState] =
        useState<AmazicConfig.AmazicProps>(initialFormState);

    const form = useForm<LanguageFormSchema>({
        resolver: zodResolver(FormSchema),
    });
    // console.log(fetchData)
    useEffect(() => {
        if (fetchData && fetchData.length > 0) {
            const { oral, written_lat, written_tif, isChecked } = fetchData[0];
            form.setValue('oral', oral ?? 0);
            form.setValue('written_lat', written_lat ?? 0);
            form.setValue('written_tif', written_tif ?? 0);
            form.setValue('isChecked', isChecked ?? false);
            console.log('Form values after reset:', form.getValues());
        }
    }, [fetchData, form]);

    const debouncedSendData = useMemo(
        () => debounce((data) => sendData(data), 500),
        [sendData],
    );

    useEffect(() => {
        debouncedSendData(formState);
    }, [formState, debouncedSendData]);

    const handleButtonChange = (
        field: keyof AmazicConfig.AmazicProps,
        value: number,
    ) => {
        setFormState((prevState) => ({
            ...(prevState as AmazicConfig.AmazicProps), // Type assertion
            [field]: value,
        }));
    };

    const handleChecked = () => {
        setFormState((prevState) => ({
            ...(prevState as AmazicConfig.AmazicProps), // Type assertion
            isChecked: !prevState.isChecked,
        }));
    };

    const isCheckedBox = form.watch('isChecked');
    // console.log('Conditional Rendering - isChecked:', isCheckedBox);
    // if (isCheckedBox) {
    //     console.log('Render form fields for checked state');
    // } else {
    //     console.log('Render form fields for unchecked state');
    // }
    // console.log(formState);
    return (
        <div>
            <Form {...form}>
                <form>
                    <div>
                        {/* //> isChecked */}
                        <FormField
                            name="isChecked"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="flex justify-start items-center">
                                    <FormLabel> Tachelhit</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="checkbox"
                                            checked={field.value}
                                            className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0 rounded-full"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleChecked();
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* //> only showing if the dialect is checked */}
                    {isCheckedBox && (
                        <div className="flex flex-col gap-2 p-2 ">
                            <FormField
                                control={form.control}
                                name="oral"
                                render={(field) => (
                                    <FormItem>
                                        <FormLabel> oral</FormLabel>

                                        <FormControl>
                                            <SelectButton
                                                currentValue={formState.oral}
                                                name="oral"
                                                onChange={handleButtonChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="written_lat"
                                render={() => (
                                    <FormItem>
                                        <FormLabel> written_lat</FormLabel>
                                        <FormControl>
                                            <SelectButton
                                                currentValue={
                                                    formState.written_lat
                                                }
                                                name="written_lat"
                                                onChange={handleButtonChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="written_tif"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>written_tif</FormLabel>
                                        <FormControl>
                                            <SelectButton
                                                currentValue={
                                                    formState.written_tif
                                                }
                                                name="written_tif"
                                                onChange={handleButtonChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}
                    {/* <pre>{JSON.stringify(form.watch(), null, 2)}</pre> */}
                </form>
            </Form>
        </div>
    );
};

export default Tachelhit;
