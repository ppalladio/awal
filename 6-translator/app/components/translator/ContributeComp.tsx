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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
interface ContributeCompProps {
    userId: string;
    isLangZgh?: boolean;
    isLangBer?: boolean;
    isCentral?: boolean;
    isTif?: boolean;
    isTac?: boolean;
    isOther?: boolean;
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
    isOther,
    src,
    tgt,
    src_text,
    tgt_text,
}) => {
    const [sourceText, setSourceText] = useState('');
    const [sourceLanguage, setSourceLanguage] = useState('ca');
    const [targetLanguage, setTargetLanguage] = useState('zgh');
    const [leftRadioValue, setLeftRadioValue] = useState('central');
    const [rightRadioValue, setRightRadioValue] = useState('central');

    const contributeLanguages: { [key: string]: string } = {
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

    const renderRadioGroup = (side: 'left' | 'right') => {
        const languagesToRender =
            (side === 'left' && ['zgh', 'ber'].includes(sourceLanguage)) ||
            (side === 'right' && ['zgh', 'ber'].includes(targetLanguage));

        if (languagesToRender) {
            const radioGroupValue =
                side === 'left' ? leftRadioValue : rightRadioValue;

            return (
                <RadioGroup
                    defaultValue={radioGroupValue}
                    className="grid-cols-4 mt-3 justify-start"
                >
                    {['central', 'tarifit', 'tachelhit', 'other'].map(
                        (value) => (
                            <div
                                className="flex items-center space-x-2"
                                key={value}
                            >
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
                                <Label htmlFor={`${value}-${side}`}>
                                    {value}
                                </Label>
                            </div>
                        ),
                    )}
                </RadioGroup>
            );
        } else {
            return null;
        }
    };
    const renderLanguageOptions = useCallback(
        (isSourceLanguage: boolean) => {
            const availableLanguages = isSourceLanguage
                ? Object.keys(languageRelations)
                : languageRelations[sourceLanguage] || [];

            return availableLanguages.map((key) => (
                <DropdownMenuRadioItem key={key} value={key}>
                    {contributeLanguages[key]}
                </DropdownMenuRadioItem>
            ));
        },
        [sourceLanguage],
    );
    const getLanguageCode = (languageStateValue: string) => {
        switch (languageStateValue) {
            case 'en':
                return 'en';
            case 'ca':
                return 'ca';
            case 'zgh':
                return 'zgh';
            case 'ber':
                return 'ber';
            case 'es':
                return 'es';
            case 'fr':
                return 'fr';
            case 'ary':
                return 'ary';
            default:
                return 'unknown';
        }
    };

    const handleGenerate = async () => {
        const srcLanguageCode = getLanguageCode(sourceLanguage);
        console.log(srcLanguageCode);
        const config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: `http://api.collectivat.cat/translate/random/${srcLanguageCode}`,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = await axios.request(config);
            console.log(response.data.sentence);
            setSourceText(response.data.sentence);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="text-translator">
            <div className="flex flex-row justify-center items-baseline px-10 py-20 bg-slate-100">
                <div className="w-1/2">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="mb-5" asChild>
                            <Button variant="outline">
                                {contributeLanguages[sourceLanguage]}
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
                                {renderLanguageOptions(true)}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <TextArea
                        value={sourceText}
                        className="border border-gray-300 rounded-md shadow"
                        placeholder="Type something to translate..."
                        id="message"
                    />
                    {renderRadioGroup('left')}
                    <Button onClick={handleGenerate}>gen</Button>
                </div>

                <div className="w-1/2 ">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="mb-5" asChild>
                            <Button variant="outline">
                                {contributeLanguages[targetLanguage]}
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
                                {renderLanguageOptions(false)}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <TextArea
                        id="message"
                        className="border border-gray-300 rounded-md shadow"
                        placeholder="Type something to translate..."
                    />
                    {renderRadioGroup('right')}
                </div>
            </div>
        </div>
    );
};

export default ContributeComp;
