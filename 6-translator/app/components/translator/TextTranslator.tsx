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
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

const TextTranslator = () => {
    const { data: session } = useSession();
    const user = session?.user;
    console.log(user);
    const [source, setSource] = useState('');
    const [target, setTarget] = useState('');
    const [sourceLanguage, setSourceLanguage] = useState('isCatala');
    const [targetLanguage, setTargetLanguage] = useState('isZgh');
    const [isLoading, setIsLoading] = useState(false);
    const translationRequestIdRef = useRef<number | null>(null);
    const translateLanguages = {
        isCatala: 'Catala',
        isZgh: 'ⵜⴰⵎⴰⵣⵉⵖⵜ',
        isLat: 'Tamaziɣt',
    };

    const renderLanguageOptions = (currentSelection: string) => {
        return Object.entries(translateLanguages).map(([key, name]) => {
            if (key !== currentSelection) {
                return (
                    <DropdownMenuRadioItem key={key} value={key}>
                        {name}
                    </DropdownMenuRadioItem>
                );
            }
            return null;
        });
    };
    const getLanguageCode = (languageStateValue: string) => {
        switch (languageStateValue) {
            case 'isCatala':
                return 'ca';
            case 'isZgh':
                return 'zgh';
            case 'isLat':
                return 'lat';
            default:
                return 'unknown';
        }
    };
    const getLanguageName = (languageStateValue: string) => {
        switch (languageStateValue) {
            case 'isCatala':
                return 'Catala';
            case 'isZgh':
                return 'ⵜⴰⵎⴰⵣⵉⵖⵜ';
            case 'isLat':
                return 'Tamaziɣt';
            default:
                return 'Language';
        }
    };

    const handleTranslate = useCallback(async () => {
        if (!source || sourceLanguage === targetLanguage) {
            setTarget('');
            setIsLoading(false); // Set isLoading to false
            return;
        }
        const srcLanguageCode = getLanguageCode(sourceLanguage);
        const tgtLanguageCode = getLanguageCode(targetLanguage);

        // TODO hide credentials
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

        const currentTranslationRequestId = Date.now(); // Generate a unique identifier for this translation request

        // Update the ref with the currentTranslationRequestId
        translationRequestIdRef.current = currentTranslationRequestId;

        try {
            setIsLoading(true); // Set loading state to true
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await axios.request(config);
            console.log(currentTranslationRequestId);
            console.log(translationRequestIdRef.current);
            // Check if this is the latest translation request by comparing with the ref
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
        setSource(inputValue); // Update the source state as the user types
        if (!inputValue) {
            setTarget('');
        }
    };
    useEffect(() => {
        handleTranslate(); // Call handleTranslate when source or sourceLanguage changes
    }, [source, sourceLanguage]);
    return (
        <div className="text-translator">
            <div className="flex flex-row justify-center items-baseline px-10 py-20 bg-slate-100">
                <div className="w-1/2">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="mb-5" asChild>
                            <Button variant="outline">
                                {getLanguageName(sourceLanguage)}{' '}
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
                    {/* <Button
                        
                    >
                        Translate
                    </Button> */}
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
                                {getLanguageName(targetLanguage)}
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
                    {/* //TODO add loader and keep the previous translation until the next res comes in */}
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
