'use client'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
interface TranslateLanguages {
    isCatala: string;
    isZgh: string;
    isBer: string;
};
interface ContributeCompProps {
    userId: string;
    isLangZgh?: boolean;
    isLangBer?: boolean;
    isCentral?: boolean;
    isTif?: boolean;
    isTac?: boolean;
    src?: string;
    tgt?: string;
    src_text?: string;
    tgt_text?: string;
}

const ContributeComp: React.FC<ContributeCompProps> = ({
    userId,
    isLangZgh,
    isLangBer,
    isCentral,
    isTif,
    isTac,
    src,
    tgt,
    src_text,
    tgt_text,
}) => {
    const [source, setSource] = useState('');
    const [target, setTarget] = useState('');
    const [sourceLanguage, setSourceLanguage] = useState('isCatala');
    const [targetLanguage, setTargetLanguage] = useState('isZgh');
    const [isLoading, setIsLoading] = useState(false);
    const [leftRadioValue, setLeftRadioValue] = useState('central');
    const [rightRadioValue, setRightRadioValue] = useState('central');

    const translationRequestIdRef = useRef<number | null>(null);

	const translateLanguages: { [key: string]: string } = {
		isCatala: 'Catala',
		isZgh: 'ⵜⴰⵎⴰⵣⵉⵖⵜ',
		isBer: 'Tamaziɣt',
	};

    const renderRadioGroup = (side: 'left' | 'right') => {
        const languagesToRender =
            (side === 'left' &&
                ['isZgh', 'isBer'].includes(sourceLanguage)) ||
            (side === 'right' &&
                ['isZgh', 'isBer'].includes(targetLanguage));

        if (languagesToRender) {
            const radioGroupValue = side === 'left' ? leftRadioValue : rightRadioValue;

            return (
                <RadioGroup
                    defaultValue={radioGroupValue}
                    className="grid-cols-4 mt-3 justify-start"
                >
                    {['central', 'tarifit', 'tachelhit', 'other'].map((value) => (
                        <div className="flex items-center space-x-2" key={value}>
                            <RadioGroupItem
                                value={value}
                                id={`${value}-${side}`}
                                onChange={() => {
                                    if (side === 'left') {
                                        setLeftRadioValue(value);
                                    } else {
                                        setRightRadioValue(value);
                                    }
                                }}
                            />
                            <Label htmlFor={`${value}-${side}`}>{value}</Label>
                        </div>
                    ))}
                </RadioGroup>
            );
        } else {
            return null;
        }
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
            case 'isBer':
                return 'ber';
            default:
                return 'unknown';
        }
    };

    const handleTranslate = useCallback(async () => {
        if (!source || sourceLanguage === targetLanguage) {
            setTarget('');
            setIsLoading(false);
            return;
        }
        const srcLanguageCode = getLanguageCode(sourceLanguage);
        const tgtLanguageCode = getLanguageCode(targetLanguage);

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
                    {renderRadioGroup('left')}
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
                    {renderRadioGroup('right')}
                </div>
            </div>
        </div>
    );
};

export default ContributeComp;
