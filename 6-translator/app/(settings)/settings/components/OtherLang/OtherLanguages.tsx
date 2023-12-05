import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import {
    OtherLanguagesConfig,
} from '@/app/(settings)/SettingsConfig';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const languages = [
    { label: 'English', value: 'english' },
    { label: 'Spanish', value: 'spanish' },
    { label: 'Catala', value: 'catala' },
    { label: 'Arabic', value: 'arabic' },
    { label: 'French', value: 'french' },
] as const;
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
const OtherLanguages = ({
    sendData,
}: {
    sendData: (data: OtherLanguagesConfig.OtherLanguagesGroup) => void;
}) => {
    const [selectedLanguages, setSelectedLanguages] =
        useState<OtherLanguagesConfig.OtherLanguagesProps>({
            english: false,
            spanish: false,
            catala: false,
            arabic: false,
            french: false,
        });
    const form = useForm<OtherLanguagesConfig.OtherLanguagesProps>({
        resolver: zodResolver(OtherLanguagesConfig.OtherLangFormSchema),
    });
	const debouncedSendData = useMemo(
        () => debounce((data) => sendData(data), 500),
        [sendData],
    );
    const handleLanguageSelect = (selectedValue: string) => {
        // Convert the selected value (label) to the corresponding key
        const languageKey = languages.find(
            (lang) => lang.label === selectedValue,
        )?.value as keyof OtherLanguagesConfig.OtherLanguagesProps | undefined;

        if (languageKey) {
            setSelectedLanguages((prev) => ({
                ...prev,
                [languageKey]: !prev[languageKey],
            }));
        }
    };

    const handleLanguageDelete = (languageKey: keyof OtherLanguagesConfig.OtherLanguagesProps) => {
        setSelectedLanguages((prevLanguages) => ({
            ...prevLanguages,
            [languageKey]: false,
        }));
    };

	useEffect(() => {
		debouncedSendData({ otherLanguages: selectedLanguages });
	}, [selectedLanguages, debouncedSendData]);
    return (
        <div>
            <div className="mb-4">
                {Object.entries(selectedLanguages)
                    .filter(([_, value]) => value)
                    .map(([key]) => (
                        <div
                            key={key}
                            className="inline-flex items-center m-1 p-2 bg-gray-200 rounded"
                        >
                            {key}
                            <button
                                type="button"
                                onClick={() =>
                                    handleLanguageDelete(
                                        key as keyof OtherLanguagesConfig.OtherLanguagesProps,
                                    )
                                }
                                className="ml-2 text-red-500"
                            >
                                X
                            </button>
                        </div>
                    ))}
            </div>
            <Form {...form}>
                <FormItem className="flex flex-col">
                    <FormLabel>Choose Languages</FormLabel>
                    <select
                        onChange={(e) => handleLanguageSelect(e.target.value)}
                    >
                        <option value="">Select a language</option>
                        {languages.map((lang) => (
                            <option key={lang.value} value={lang.label}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </FormItem>
            </Form>
        </div>
    );
};

export default OtherLanguages;
