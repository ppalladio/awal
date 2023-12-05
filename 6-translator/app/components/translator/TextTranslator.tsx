'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import TextArea from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

const TextTranslator = () => {
    const [source, setSource] = useState('');
    const [target, setTarget] = useState('');
    const [sourceLanguage, setSourceLanguage] = useState('en');
    const [targetLanguage, setTargetLanguage] = useState('zgh');
    const [isLoading, setIsLoading] = useState(false);

    const translationRequestIdRef = useRef<number | null>(null);

    const translateLanguages: { [key: string]: string } = {
        en: 'English',
        zgh: 'ⵜⴰⵎⴰⵣⵉⵖⵜ',
        ber: 'Tamaziɣt',
        es: 'Español',
        ca: 'Català',
        fr: 'Français',
        ary: 'Dàrija',
    };

    // Define language relations
    const languageRelations: { [key: string]: string[] } = {
        en: ['ber', 'zgh', 'es'],
        zgh: ['en', 'ber', 'es', 'ca', 'fr', 'ary'],
        ber: ['en', 'zgh', 'es', 'ca', 'fr', 'ary'],
        es: ['en', 'zgh', 'ber'],
        ca: ['zgh', 'ber'],
        fr: ['en', 'zgh', 'ber'],
        ary: ['zgh', 'ber'],
    };

    const renderLanguageOptions = (currentSelection: string) => {
        const availableLanguages = languageRelations[currentSelection] || [];

        // Check if translations are available for the selected language
        if (availableLanguages.length === 0) {
            // If translations are not available, set the right-side dropdown to the first available language
            const firstAvailableLanguage = Object.keys(languageRelations).find(
                (key) => languageRelations[key].length > 0,
            );
            if (firstAvailableLanguage) {
                setTargetLanguage(firstAvailableLanguage);
            }
        }

        return availableLanguages.map((key) => (
            <DropdownMenuRadioItem key={key} value={key}>
                {translateLanguages[key]}
            </DropdownMenuRadioItem>
        ));
    };

    const handleTranslate = useCallback(async () => {
        if (!source || sourceLanguage === targetLanguage) {
            setTarget('');
            setIsLoading(false);
            return;
        }
        const srcLanguageCode = sourceLanguage;
        const tgtLanguageCode = targetLanguage;

        const data = JSON.stringify({
            src: srcLanguageCode,
            tgt: tgtLanguageCode,
            text: source,
            token: 'E1Ws_mmFHO6WgqFUYtsOZR9_B4Yhvdli_e-M5R9-Roo',
        });
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://api.collectivat.cat/translate/',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        const currentTranslationRequestId = Date.now();

        translationRequestIdRef.current = currentTranslationRequestId;

        try {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await axios.request(config);

            if (
                currentTranslationRequestId === translationRequestIdRef.current
            ) {
                setTarget(response.data.translation);
                setIsLoading(false);
            }
        } catch (error) {
            console.log('Error:', error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }, [source, sourceLanguage, targetLanguage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setSource(inputValue);
        if (!inputValue) {
            setTarget('');
        }
    };
    // reverse of translation - source check
    // Initialize the source and target languages
    useEffect(() => {
        // Check if translations are available for the selected source language
        if (!languageRelations[sourceLanguage].includes(targetLanguage)) {
            // If translations are not available, set the target language to the first available language
            const firstAvailableLanguage = Object.keys(languageRelations).find(
                (key) =>
                    key !== sourceLanguage && languageRelations[key].length > 0,
            );
            if (firstAvailableLanguage) {
                setTargetLanguage(firstAvailableLanguage);
            }
        }
    }, [sourceLanguage, targetLanguage]);

    // Handle translation when source, sourceLanguage, or targetLanguage changes
    useEffect(() => {
        handleTranslate();
    }, [source, sourceLanguage, targetLanguage]);

    return (
        <div className="text-translator">
            <div className="flex flex-row justify-center items-baseline px-10 py-20 bg-slate-100">
                <div className="w-1/2">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="mb-5" asChild>
                            <Button variant="outline">
                                {translateLanguages[sourceLanguage]}
                                <ChevronDown className="pl-2 " />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>
                                Select Language
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                                value={sourceLanguage}
                                onValueChange={setSourceLanguage}
                            >
                                {renderLanguageOptions(targetLanguage)}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <TextArea
                        value={source}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md shadow"
                        placeholder="Type something to translate..."
                        id="message"
                    />
                </div>
                <span className={`self-center mx-10 mt-2 relative`}>
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                            <FaSpinner className="animate-spin text-gray-500" />
                        </div>
                    )}
                </span>

                <div className="w-1/2 ">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="mb-5" asChild>
                            <Button variant="outline">
                                {translateLanguages[targetLanguage]}
                                <ChevronDown className="pl-2 " />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>
                                Select Language
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                                value={targetLanguage}
                                onValueChange={setTargetLanguage}
                            >
                                {renderLanguageOptions(sourceLanguage)}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <TextArea
                        id="message"
                        value={
                            isLoading
                                ? 'Translating, This might take a while'
                                : target
                        }
                        className="border border-gray-300 rounded-md shadow"
                        placeholder="Translation will appear here..."
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
};

export default TextTranslator;
